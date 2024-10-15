<template>
    <div class="application-profiles">
      <h2>Application Profiles</h2>
      <div v-for="profile in applicationProfiles" :key="profile.id" class="application-profile">
        <h3>{{ profile.name }}</h3>
        <p>{{ profile.description }}</p>
        <p>Focus: {{ profile.focus }}</p>
        <button @click="editProfile(profile.id)">Edit</button>
        <button @click="deleteProfile(profile.id)">Delete</button>
      </div>
  
      <button @click="showNewProfileForm = true">Create New Application Profile</button>
  
      <div v-if="showNewProfileForm" class="new-profile-form">
        <h3>{{ editingProfileId ? 'Edit' : 'Create New' }} Application Profile</h3>
        <input v-model="newProfile.name" placeholder="Profile Name">
        <textarea v-model="newProfile.description" placeholder="Profile Description"></textarea>
        <input v-model="newProfile.focus" placeholder="Profile Focus">
        <button @click="saveProfile">Save Profile</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, onMounted } from 'vue'
  import { db, auth } from './firebase'
  import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
  import { onAuthStateChanged } from 'firebase/auth'
  
  export default {
    name: 'ApplicationProfiles',
    setup() {
      const applicationProfiles = ref([])
      const showNewProfileForm = ref(false)
      const newProfile = reactive({
        name: '',
        description: '',
        focus: '',
      })
      const userId = ref(null)
      const editingProfileId = ref(null)
  
      onMounted(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            userId.value = user.uid
            fetchApplicationProfiles()
          } else {
            console.log('No user logged in')
          }
        })
      })
  
      const fetchApplicationProfiles = async () => {
        const querySnapshot = await getDocs(collection(db, 'businessProfiles', userId.value, 'applicationProfiles'))
        applicationProfiles.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      }
  
      const saveProfile = async () => {
        try {
          if (editingProfileId.value) {
            await updateDoc(doc(db, 'businessProfiles', userId.value, 'applicationProfiles', editingProfileId.value), newProfile)
          } else {
            await addDoc(collection(db, 'businessProfiles', userId.value, 'applicationProfiles'), newProfile)
          }
          showNewProfileForm.value = false
          editingProfileId.value = null
          Object.assign(newProfile, { name: '', description: '', focus: '' })
          fetchApplicationProfiles()
        } catch (error) {
          console.error("Error saving profile: ", error)
        }
      }
  
      const editProfile = (id) => {
        const profile = applicationProfiles.value.find(p => p.id === id)
        if (profile) {
          Object.assign(newProfile, profile)
          editingProfileId.value = id
          showNewProfileForm.value = true
        }
      }
  
      const deleteProfile = async (id) => {
        try {
          await deleteDoc(doc(db, 'businessProfiles', userId.value, 'applicationProfiles', id))
          fetchApplicationProfiles()
        } catch (error) {
          console.error("Error deleting profile: ", error)
        }
      }
  
      const cancelEdit = () => {
        showNewProfileForm.value = false
        editingProfileId.value = null
        Object.assign(newProfile, { name: '', description: '', focus: '' })
      }
  
      return {
        applicationProfiles,
        showNewProfileForm,
        newProfile,
        saveProfile,
        editProfile,
        deleteProfile,
        cancelEdit,
        editingProfileId
      }
    }
  }
  </script>
  
  <style scoped>
  .application-profiles {
    margin-top: 20px;
  }
  
  .application-profile {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
  }
  
  .new-profile-form {
    margin-top: 20px;
    border: 1px solid #ddd;
    padding: 10px;
  }
  
  button {
    margin-right: 5px;
  }
  </style>