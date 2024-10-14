<template>
    <div class="business-profile">
      <h1>Business Profile</h1>
      <div class="profile-info">
        <input v-model="businessName" placeholder="Business Name">
        <textarea v-model="description" placeholder="Business Description"></textarea>
        <h2>Interests</h2>
        <ul>
          <li v-for="(interest, index) in interests" :key="index">
            <input v-model="interests[index]">
            <button @click="removeInterest(index)">Remove</button>
          </li>
        </ul>
        <button @click="addInterest">Add Interest</button>
        <h2>Experience</h2>
        <textarea v-model="experience" placeholder="Your experience"></textarea>
        <h2>Products</h2>
        <ul>
          <li v-for="product in products" :key="product.id">
            <input v-model="product.name" placeholder="Product Name">
            <input v-model.number="product.price" type="number" step="0.01" placeholder="Price">
            <button @click="removeProduct(product.id)">Remove</button>
          </li>
        </ul>
        <button @click="addProduct">Add Product</button>
      </div>
      <button @click="saveBusinessProfile">Save Business Profile</button>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { db, auth } from './firebase'
  import { doc, setDoc, getDoc } from 'firebase/firestore'
  import { onAuthStateChanged } from 'firebase/auth'
  
  export default {
    name: 'BusinessProfile',
    setup() {
      const businessName = ref('')
      const description = ref('')
      const interests = ref([])
      const experience = ref('')
      const products = ref([])
      const userId = ref(null)
  
      onMounted(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            userId.value = user.uid
            fetchBusinessProfile()
          } else {
            console.log('No user logged in')
          }
        })
      })
  
      const fetchBusinessProfile = async () => {
        const docRef = doc(db, 'businessProfiles', userId.value)
        const docSnap = await getDoc(docRef)
  
        if (docSnap.exists()) {
          const data = docSnap.data()
          businessName.value = data.businessName
          description.value = data.description
          interests.value = data.interests
          experience.value = data.experience
          products.value = data.products
        }
      }
  
      const saveBusinessProfile = async () => {
        try {
          await setDoc(doc(db, 'businessProfiles', userId.value), {
            businessName: businessName.value,
            description: description.value,
            interests: interests.value,
            experience: experience.value,
            products: products.value
          })
          console.log("Business profile saved successfully")
        } catch (error) {
          console.error("Error saving business profile: ", error)
        }
      }
  
      const addInterest = () => {
        interests.value.push('')
      }
  
      const removeInterest = (index) => {
        interests.value.splice(index, 1)
      }
  
      const addProduct = () => {
        products.value.push({ id: Date.now(), name: '', price: 0 })
      }
  
      const removeProduct = (id) => {
        products.value = products.value.filter(product => product.id !== id)
      }
  
      return {
        businessName,
        description,
        interests,
        experience,
        products,
        saveBusinessProfile,
        addInterest,
        removeInterest,
        addProduct,
        removeProduct,
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
    margin-top: 10px;
  }
  
  input, textarea {
    padding: 5px;
    margin-bottom: 10px;
    width: 100%;
  }
  </style>