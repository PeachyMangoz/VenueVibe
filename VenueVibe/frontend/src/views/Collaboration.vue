<script setup>
import { db } from "../firebase.js";
import { getDocs, collection, query, where } from "firebase/firestore";

import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";

defineElement(lottie.loadAnimation);
</script>

<template>
  <main>
    <div v-if="loading">
      <!-- Display a loading message or spinner while data is being retrieved -->
      <p>Loading users...</p>
    </div>
    <!-- <div v-for="user in users"> -->
    <div class="container-fluid px-0 mx-0" v-else-if="users">
      <div
        class="row d-md-flex banner mx-0"
        :style="{ background: `url(${currentSlide.profile_highlight})` }"
      >
        <div class="content active col-lg-6 col-md-12">
          <ul id="links">
            <li>
              <a target="_blank" :href="`${currentSlide.instagram_link}`"
                ><fa :icon="['fab', 'instagram']"></fa
              ></a>
            </li>
            <li>
              <a target="_blank" :href="`${currentSlide.website_link}`"
                ><fa :icon="['fas', 'globe']"></fa
              ></a>
            </li>
            <li>
              <a target="_blank" :href="`${currentSlide.portforlio_link}`"
                ><fa :icon="['fas', 'hashtag']"></fa
              ></a>
            </li>
          </ul>
          <h4>
            <span>{{ currentSlide.profile_type }}</span
            ><span>{{ currentSlide.interests }}</span>
          </h4>
          <h1 class="business-name">{{ currentSlide.business_name }}</h1>
          <p>{{ currentSlide.bio }}</p>

          <div class="buttons">
            <a href="#" class="btn btn-outline-secondary">
              <lord-icon
                src="https://cdn.lordicon.com/qnpnzlkk.json"
                trigger="hover"
                colors="primary:#e4e4e4"
                style="width: 18px; height: 18px"
              >
              </lord-icon>
              Connect & Chat
            </a>
            <a href="#" class="btn btn-outline-secondary">
              <lord-icon
                src="https://cdn.lordicon.com/jkzgajyr.json"
                trigger="hover"
                colors="primary:#e4e4e4"
                style="width: 18px; height: 18px"
              >
              </lord-icon>
              Bookmark
            </a>
          </div>
        </div>
        <div class="carousel-buttons">
          <!-- Navigation buttons -->
          <button @click="prevUser" class="carousel-control prev"><</button>
          <button @click="nextUser" class="carousel-control next">></button>
        </div>
        <!-- Thumbnails -->
        <div class="carousel-box col-lg-6">
          <div
            v-for="(user, index) in rotatedUsers"
            :key="user.id"
            class="carousel"
            :class="{
              active: index === currentIndex,
              'slide-left': slideDirection === 'left',
              'slide-right': slideDirection === 'right',
            }"
            @click="goToSlide(index)"
          >
            <div class="carousel-item">
              <img :src="user.profile_image" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- </div> -->
  </main>
</template>

<script>
export default {
  data() {
    return {
      users: [], // Array to hold users and their business profiles
      currentIndex: 0, // Tracks the current user being displayed
      loading: true, // Loading state to display while data is being fetched
      error: null, // Error message in case something goes wrong
      isSliding: false,
      slideDirection: "",
    };
  },
  computed: {
    currentSlide() {
      // Dynamically get the user data at currentIndex
      return this.users[this.currentIndex] || {};
    },
    // Dynamically reorder the users based on the current index for thumbnails
    rotatedUsers() {
      if (!this.users.length) return [];

      // Rotate the users array so that the currentIndex appears first
      return [
        ...this.users.slice(this.currentIndex),
        ...this.users.slice(0, this.currentIndex),
      ];
    },
  },
  methods: {
    async fetchUsers() {
      try {
        // Fetch users from the 'user' collection
        const userListing = await getDocs(collection(db, "user"));

        // For each user, add to users array and fetch their business profiles
        for (const user of userListing.docs) {
          const userData = { ...user.data(), id: user.id };
          this.users.push(userData);

          // Fetch and merge the business profile for each user
          await this.retrieveProfile(user.id);
          console.log(this.users); // For debugging purposes
        }
      } catch (err) {
        console.error("Error fetching users:", err); // Log error
        this.error = "Failed to load user data."; // Set user-friendly error message
      } finally {
        this.loading = false; // Stop loading once all operations are complete
      }
    },

    // Fetch the business profile and portfolio items for each user
    async retrieveProfile(userId) {
      try {
        // Query the 'business_profiles' collection where 'user_id' matches the userId
        const q = query(
          collection(db, "business_profiles"),
          where("user_id", "==", userId)
        );
        const profileDocs = await getDocs(q);

        // Find the corresponding user in the users array
        const user = this.users.find((u) => u.id === userId);
        if (user && profileDocs.docs.length > 0) {
          // Assuming one business profile per user, take the first profile
          const profileData = profileDocs.docs[0].data();

          // Retrieve portfolio items nested within the business profile
          const portfolio = await this.retrieveNestedPortfolio(
            profileDocs.docs[0].id
          );

          // Add portfolio items to the business profile
          profileData.portfolio_items = portfolio;

          // Merge the business profile data (with portfolio) into the user object
          Object.assign(user, profileData);
        }
      } catch (error) {
        console.error(
          `Error fetching business profile for user ${userId}:`,
          error
        );
      }
    },

    // Fetch the portfolio items for a given business profile
    async retrieveNestedPortfolio(businessProfileId) {
      try {
        const portfolioQuery = collection(
          db,
          "business_profiles",
          businessProfileId,
          "portfolio_items"
        );
        const portfolioDocs = await getDocs(portfolioQuery);

        // Return the array of portfolio items with IDs
        return portfolioDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      } catch (error) {
        console.error(
          `Error fetching portfolio items for business profile ${businessProfileId}:`,
          error
        );
        return []; // Return an empty array on error
      }
    },

    // Navigate to the next user
    nextUser() {
      this.slideDirection = "left"; // Set direction to left for next
      this.triggerSlideAnimation(); // Trigger animation before changing the index
      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % this.users.length;
        this.resetSlideAnimation();
      }, 300); // Delay to allow the animation to complete (matches CSS transition time)
    },

    // Navigate to the previous user
    prevUser() {
      this.slideDirection = "right"; // Set direction to right for prev
      if (this.users.length > 0) {
        this.triggerSlideAnimation(); // Trigger animation before changing the index
        setTimeout(() => {
          this.currentIndex =
            (this.currentIndex - 1 + this.users.length) % this.users.length;
          this.resetSlideAnimation();
        }, 300); // Delay to allow the animation to complete (matches CSS transition time)
      }
    },
    goToSlide(index) {
      if (index !== this.currentIndex) {
        this.slideDirection = index > this.currentIndex ? "left" : "right";
        this.triggerSlideAnimation();
        setTimeout(() => {
          // Reorder the array so the clicked user is at the front
          
          const usersAfterClicked = this.users.slice(index);
          // Extract the part of the array from the beginning to the clicked user
          const usersBeforeClicked = this.users.slice(0, index);
          // Reorder the array: clicked user and following users, then previous users
          this.users = [...usersAfterClicked, ...usersBeforeClicked];
          // Set `currentIndex` to 0 as the clicked user is now at the front
          this.currentIndex = 0;
          this.resetSlideAnimation();
        }, 300); // Delay to allow animation before changing the index
      }
    },
    triggerSlideAnimation() {
      this.isSliding = true;
    },
    resetSlideAnimation() {
      this.isSliding = false;
      this.slideDirection = "";
    },
  },

  mounted() {
    // Fetch users and their business profiles when the component is mounted
    this.fetchUsers();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Alkatra:wght@400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
* {
  font-family: "Poppins", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.banner {
  position: relative;
  width: 100vw;
  min-height: 95vh;
  padding: 0 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-position: center !important;
  overflow: hidden;
  transition: 0.5s;
}

.banner::before {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.content {
  position: relative;
  max-width: 550px;
  min-width: 500px;
  display: none;
  visibility: hidden;
  transform: scale(0);
  transition: 0.5s;
}

.content.active {
  display: block;
  visibility: visible;
  transform: scale(1);
  transition: 0.5s;
}

.banner .content h1 {
  font-weight: 700;
  text-transform: uppercase;
  color: white;
}

.banner .content h4 {
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
  font-size: 20px;
}

.banner .content h4 span {
  padding: 0 10px;
  border-right: 1px solid rgba(255, 255, 255, 0.5);
}

.banner .content h4 span:first-child {
  padding-left: 0;
}
.banner .content h4 span:last-child {
  border-right: none;
}

.banner .content p {
  font-size: 1em;
  font-weight: 300;
  line-height: 1.5em;
  color: white;
  margin: 10px 0 20px;
}

.banner .content .buttons {
  position: relative;
}

.banner .content .buttons a {
  position: relative;
  display: inline-block;
  margin-right: 10px;
  color: white;
  background: rgba(255, 255, 255, 0.5);
  padding: 8px 20px;
  text-decoration: none;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: 0.5s;
  cursor: pointer;
}

.banner .content .buttons a:nth-child(2) {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.banner .content .buttons a:hover:nth-child(2) {
  background: rgba(255, 255, 255, 0.5);
}
.banner .content ul#links li {
  list-style-type: none;
  display: inline;
  padding-right: 20px;
  font-size: 20px;
}
.banner .content ul#links li a {
  color: white;
  transition: 0.3s;
}

.carousel-buttons {
  position: absolute;
  top: 80%;
  left: 10%;
  width: 300px;
  max-width: 30%;
  display: flex;
  gap: 10px;
  align-items: center;
}

.carousel-buttons button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #eee4;
  border: none;
  color: white;
  font-size: large;
  cursor: pointer;
}
.carousel-buttons button:hover {
  background-color: white;
  color: #555;
}

.carousel-control:first-child {
  margin-right: 15px;
}

.banner .carousel-box {
  position: relative;
  min-width: 70vh;
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  border-radius: 10px;
  max-width: 80vw; /* Limit the maximum width of the carousel box */
  overflow-x: auto; /* Enable horizontal scrolling if there are too many thumbnails */
}

.carousel-box .carousel-item {
  width: 250px;
  cursor: pointer;
  display: flex;
  text-align: center;
}
.carousel-box .carousel-item img {
  max-height: 25vh;
  width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
  object-position: center;
  padding: 5px;
}
/* Sliding effect to the left */
.slide-left {
  animation: slide-to-start 0.3s forwards;
}

/* Sliding effect to the right */
.slide-right {
  animation: slide-to-end 0.3s forwards;
}

/* Keyframes for sliding left */
@keyframes slide-to-start {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

/* Keyframes for sliding right */
@keyframes slide-to-end {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}
</style>
