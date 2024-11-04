<template>
  <div class="chat-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Search Bar -->
      <div class="search-bar">
        <input type="text" placeholder="Search" />
      </div>

      <!-- Chat List -->
      <div v-if="userChats.length" class="chat-list">
        <h3>Last chats</h3>
        <ul>
          <li
            v-for="chat in userChats"
            :key="chat.id"
            :class="{ active: chat.id === chatId }"
            @click="selectChat(chat.id)"
            class="chat-item"
          >
            <img
              :src="`${getChatPartnerProfileImage(chat)}`"
              alt="Chat Profile"
              class="chat-pic"
            />
            <div class="chat-info">
              <p class="chat-name">{{ getChatPartnerName(chat) }}</p>
              <p class="chat-preview">{{ chat.lastMessage }}</p>
            </div>
            <span class="chat-time">{{ formatDate(chat.lastMessageTimeStamp) || " " }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Main Chat Area -->
    <section class="chat-area">
      <!-- Messages -->
      <div class="messages">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="{
            'message message-outgoing ': message.senderId === currentUserId,
            'message message-incoming ': message.senderId !== currentUserId,
          }"
        >
          <p class="message-text">{{ message.text }}</p>
          <small class="message-time">{{
            formatDate(message.timestamp)
          }}</small>
        </div>
      </div>

      <!-- Message Input -->
      <footer class="message-input">
        <input
          type="text"
          placeholder="Write your message..."
          v-model="newMessage"
        />
        <button @click="sendMessage" class="send-button">
          <img src="path-to-send-icon.svg" alt="Send" />
        </button>
      </footer>
    </section>
  </div>
</template>

<script>
import { db } from "../firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export default {
  props: ["id"],
  data() {
    return {
      currentUser: {
        username: "Loading...",
        profile_image: "",
      },
      messages: [],
      newMessage: "",
      chatId: null,
      currentUserId: "pvXAaR3AemPHAycewSDP", // Replace with actual user ID from auth
      selectedUserId: this.id,
      userChats: [], // Stores all chats for the current user
      unsubscribeMessagesListener: null,
    };
  },
  created() {
    this.fetchUserChats().then(() => {
    this.listenForChatUpdates(); // Start listening for updates after data retrieval
    }).catch((error) => {
        console.error("Error initializing chat data:", error);
    });
  },
  methods: {
    listenForChatUpdates() {
  const chatsRef = collection(db, "chat");
  const q = query(chatsRef, where("users", "array-contains", this.currentUserId));

  onSnapshot(q, async (snapshot) => {
    const updatedChats = await Promise.all(
      snapshot.docs.map(async (chatDoc) => {
        const chatData = { id: chatDoc.id, ...chatDoc.data() };

        // Initialize userInfo for real-time updates
        const userInfo = {};
            for (const userId of chatData.users) {
              const userDocRef = doc(db, "user", userId); // Correct usage of `doc()` with db and collection name
              const userDocSnapshot = await getDoc(userDocRef);

              if (userDocSnapshot.exists()) {
                const { username, profile_image } = userDocSnapshot.data(); // Destructure only the fields we need
                userInfo[userId] = { username, profile_image };
              }
            }

        // Return the chat data including userInfo
        return {
          id: chatDoc.id,
          lastMessage: chatData.lastMessage || "",
          lastMessageTimeStamp: chatData.lastMessageTimeStamp || null,
          users: chatData.users || [],
          userInfo,
        };
      })
    );

    // Update the `userChats` data with the latest real-time updates
    this.userChats = updatedChats;
    console.log("Updated User Chats with Real-Time Data:", this.userChats);
  });
},

    async fetchUserChats() {
      try {
        // Step 1: Fetch all chats where the current user is a participant
        const chatsRef = collection(db, "chat"); // Use `collection` for chats
        const q = query(
          chatsRef,
          where("users", "array-contains", this.currentUserId)
        );
        const querySnapshot = await getDocs(q); // Fetch documents matching the query

        // Step 2: For each chat, populate userInfo with display names and profile pictures
        const chatsWithUserInfo = await Promise.all(
          querySnapshot.docs.map(async (chatDoc) => {
            const chatData = { id: chatDoc.id, ...chatDoc.data() };

            // Step 3: Retrieve only displayName and profilePic for each user in the chat
            const userInfo = {};
            for (const userId of chatData.users) {
              const userDocRef = doc(db, "user", userId); // Correct usage of `doc()` with db and collection name
              const userDocSnapshot = await getDoc(userDocRef);

              if (userDocSnapshot.exists()) {
                const { username, profile_image } = userDocSnapshot.data(); // Destructure only the fields we need
                userInfo[userId] = { username, profile_image };
              }
            }

            chatData.userInfo = userInfo; // Add userInfo to chat data
            return chatData;
          })
        );

        // Update userChats with populated userInfo
        this.userChats = chatsWithUserInfo;

        // Step 4: Open existing chat or create a new one with the selected user
        await this.openOrCreateChatWithSelectedUser();
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    },

    async openOrCreateChatWithSelectedUser() {
      try {
        // Check for an existing chat
        const existingChat = this.userChats.find((chat) =>
          chat.users.includes(this.selectedUserId)
        );

        if (existingChat) {
          this.selectChat(existingChat.id);
        } else {
          await this.createNewChatWithSelectedUser();
        }
      } catch (error) {
        console.error("Error opening or creating chat:", error);
      }
    },

    async createNewChatWithSelectedUser() {
  try {
    // Fetch current user info and selected user info
    const currentUserDocRef = doc(db, "user", this.currentUserId);
    const selectedUserDocRef = doc(db, "user", this.selectedUserId);

    const currentUserSnapshot = await getDoc(currentUserDocRef);
    const selectedUserSnapshot = await getDoc(selectedUserDocRef);

    if (!currentUserSnapshot.exists() || !selectedUserSnapshot.exists()) {
      throw new Error("User profile data missing for one of the users.");
    }

    const {
      username: currentDisplayName,
      profile_image: currentProfilePic,
    } = currentUserSnapshot.data();
    const {
      username: selectedDisplayName,
      profile_image: selectedProfilePic,
    } = selectedUserSnapshot.data();

    // Create userInfo object with only the required fields
    const userInfo = {
      [this.currentUserId]: {
        username: currentDisplayName,
        profile_image: currentProfilePic,
      },
      [this.selectedUserId]: {
        username: selectedDisplayName,
        profile_image: selectedProfilePic,
      },
    };

    // Create a new chat document with user IDs and userInfo
    const newChatDoc = await addDoc(collection(db, "chat"), {
      users: [this.currentUserId, this.selectedUserId],
      userInfo,
      createdAt: serverTimestamp(),
    });

    // Add new chat to userChats and select it
    const newChat = {
      id: newChatDoc.id,
      users: [this.currentUserId, this.selectedUserId],
      userInfo,
      lastMessage: "",
      lastMessageTime: null,
    };
    this.userChats.push(newChat);
    this.selectChat(newChatDoc.id);
  } catch (error) {
    console.error("Error creating new chat:", error);
  }
},

    listenForMessages() {
      // Clean up previous listener if it exists
      if (this.unsubscribeMessagesListener) {
        this.unsubscribeMessagesListener(); // Unsubscribe from previous listener
      }

      // Set up a new listener for the current chat's messages
      const messagesRef = collection(db, "chat", this.chatId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      this.unsubscribeMessagesListener = onSnapshot(q, (querySnapshot) => {
        this.messages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
    },

    async loadMessages() {
      if (!this.chatId) return;

      const messagesRef = collection(db, "chat", this.chatId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      // Set up real-time listener for messages
      onSnapshot(q, (querySnapshot) => {
        this.messages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
    },

    async sendMessage() {
      if (!this.newMessage.trim()) return;

      try {
        const messagesRef = collection(db, "chat", this.chatId, "messages");
        await addDoc(messagesRef, {
          text: this.newMessage,
          senderId: this.currentUserId,
          timestamp: serverTimestamp(),
        });
        // Reference to the chat document (parent document of messages collection)
        const chatDocRef = doc(db, "chat", this.chatId);

        // Update the chat document with the latest message details
        await updateDoc(chatDocRef, {
          lastMessage: this.newMessage, // Store the latest message text
          lastMessageTimeStamp: serverTimestamp(), // Store the timestamp of the latest message
        });

        this.newMessage = "";
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },

    selectChat(chatId) {
      this.chatId = chatId;
      //   this.loadMessages(); // Load messages for the selected chat
      this.listenForMessages();
    },

    getChatPartnerProfileImage(chat) {
  // Check if `chat`, `chat.users`, and `chat.userInfo` are defined
  if (!chat || !chat.users || !Array.isArray(chat.users) || !chat.userInfo) {
    console.warn("Chat data is missing or improperly formatted:", chat);
    return "/path-to-default-profile-pic.jpg"; // Return a default image if data is missing
  }

  // Find the partner ID
  const partnerId = chat.users.find((userId) => userId !== this.currentUserId);
  
  // Return the partner's profile picture, or default if missing
  return chat.userInfo[partnerId]?.profile_image || "/path-to-default-profile-pic.jpg";
},

getChatPartnerName(chat) {
  // Check if `chat`, `chat.users`, and `chat.userInfo` are defined
  if (!chat || !chat.users || !Array.isArray(chat.users) || !chat.userInfo) {
    console.warn("Chat data is missing or improperly formatted:", chat);
    return "Unknown User"; // Return a default name if data is missing
  }

  // Find the partner ID
  const partnerId = chat.users.find((userId) => userId !== this.currentUserId);
  
  // Return the partner's display name, or default if missing
  return chat.userInfo[partnerId]?.username || "Unknown User";
},

    formatDate(timestamp) {
      return timestamp?.toDate().toLocaleTimeString() || "";
    },
  },

};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 93vh;
}

/* Sidebar styling */
.sidebar {
  width: 25%;
  background-color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.search-bar input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.chat-list h3 {
  font-size: 1.1rem;
  margin: 1rem 0 0.5rem;
}

ul, ol {
  padding: 0;
  margin: 0;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.5rem;
  cursor: pointer;
}

.chat-pic {
  width: 15%;
  height: auto;
  border-radius: 50%;
  margin-right: 0.3rem;
}
.chat-info {
  flex-grow: 1;
}
.chat-name {
  font-weight: bold;
  margin: 0;
}
.chat-preview {
  font-size: 0.9rem;
  color: #888;
}
.chat-time {
  font-size: 0.8rem;
  color: #aaa;
}
.active{
    background-color: rgba(0, 0, 0, 0.1);
}
/* Main chat area styling */
.chat-area {
  width: 75%;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.messages {
  flex-grow: 1;
  padding: 1rem;
  background-color: #f2f5f9;
  overflow-y: auto;
}

.message {
  max-width: 70%;
  width: fit-content;
  margin: 0.5rem 0;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 1rem;
}
.message-incoming {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  text-align: left;
}
.message-outgoing {
  background-color: #22a1f3;
  color: #fff;
  margin-left: auto;
  text-align: right;
}
.message-time {
  display: block;
  font-size: 0.75rem;
  color: #888;
  margin-top: 0.25rem;
}

.message-input {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #ddd;
}
.message-input input {
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-right: 0.5rem;
}
.send-button {
  background-color: #22a1f3;
  color: white;
  padding: 0.75rem;
  border: none;
  cursor: pointer;
}
.send-button img {
  width: 20px;
  height: 20px;
}
</style>
