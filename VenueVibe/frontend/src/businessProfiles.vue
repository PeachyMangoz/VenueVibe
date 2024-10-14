<template>
    <div class="business-profile">
      <h1>{{ businessName }}</h1>
      <div class="profile-info">
        <p>{{ description }}</p>
        <h2>Interests</h2>
        <ul>
          <li v-for="interest in interests" :key="interest">{{ interest }}</li>
        </ul>
        <h2>Experience</h2>
        <p>{{ experience }}</p>
        <h2>Products</h2>
        <ul>
          <li v-for="product in products" :key="product.id">
            {{ product.name }} - ${{ product.price }}
          </li>
        </ul>
      </div>
  
      <h2>Application Profiles</h2>
      <div v-for="profile in applicationProfiles" :key="profile.id" class="application-profile">
        <h3>{{ profile.name }}</h3>
        <p>{{ profile.description }}</p>
        <p>Focus: {{ profile.focus }}</p>
      </div>
  
      <button @click="createNewApplicationProfile">Create New Application Profile</button>
  
      <div v-if="showNewProfileForm" class="new-profile-form">
        <h3>Create New Application Profile</h3>
        <input v-model="newProfile.name" placeholder="Profile Name">
        <textarea v-model="newProfile.description" placeholder="Profile Description"></textarea>
        <input v-model="newProfile.focus" placeholder="Profile Focus">
        <button @click="saveNewProfile">Save Profile</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive } from 'vue'
  
  export default {
    name: 'BusinessProfile',
    setup() {
      const businessName = ref('Your Business Name')
      const description = ref('Your business description goes here.')
      const interests = ref(['Interest 1', 'Interest 2', 'Interest 3'])
      const experience = ref('Your experience description goes here.')
      const products = ref([
        { id: 1, name: 'Product 1', price: 19.99 },
        { id: 2, name: 'Product 2', price: 29.99 },
      ])
  
      const applicationProfiles = ref([
        { id: 1, name: 'Sustainability Profile', description: 'Focus on eco-friendly practices', focus: 'Sustainability' },
        { id: 2, name: 'Art Showcase Profile', description: 'Highlight artistic works', focus: 'Art' },
      ])
  
      const showNewProfileForm = ref(false)
      const newProfile = reactive({
        name: '',
        description: '',
        focus: '',
      })
  
      const createNewApplicationProfile = () => {
        showNewProfileForm.value = true
      }
  
      const saveNewProfile = () => {
        applicationProfiles.value.push({
          id: applicationProfiles.value.length + 1,
          ...newProfile
        })
        showNewProfileForm.value = false
        Object.assign(newProfile, { name: '', description: '', focus: '' })
      }
  
      return {
        businessName,
        description,
        interests,
        experience,
        products,
        applicationProfiles,
        showNewProfileForm,
        newProfile,
        createNewApplicationProfile,
        saveNewProfile,
      }
    }
  }
  </script>
  
  <style scoped>
  .business-profile {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .profile-info, .application-profile {
    margin-bottom: 20px;
  }
  
  .new-profile-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }
  
  button {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  input, textarea {
    padding: 5px;
    margin-bottom: 10px;
  }
  </style>