<template>
  <div class="business-profile">
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <div class="profile-container">
      <h1 class="profile-title">Business Profile</h1>
      
      <form @submit.prevent="saveBusinessProfile" class="profile-form">
        <div class="form-group">
          <label for="businessName">Business Name</label>
          <input 
            id="businessName"
            v-model.trim="businessName" 
            placeholder="Enter your business name"
            :disabled="loading"
            required
          >
        </div>

        <div class="form-group">
          <label for="description">Business Description</label>
          <textarea 
            id="description"
            v-model.trim="description" 
            placeholder="Describe your business"
            rows="4"
            :disabled="loading"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label>Business Interests</label>
          <div class="interests-container">
            <div v-for="(interest, index) in interests" 
                 :key="index" 
                 class="interest-item">
              <input 
                v-model.trim="interests[index]"
                placeholder="Enter an interest"
                :disabled="loading"
              >
              <button 
                type="button"
                @click="removeInterest(index)"
                class="remove-btn"
                :disabled="loading"
              >
                ✕
              </button>
            </div>
          </div>
          <button 
            type="button"
            @click="addInterest"
            class="add-btn"
            :disabled="loading"
          >
            + Add Interest
          </button>
        </div>

        <div class="form-group">
          <label for="experience">Business Experience</label>
          <textarea 
            id="experience"
            v-model.trim="experience" 
            placeholder="Describe your business experience"
            rows="4"
            :disabled="loading"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Products</label>
          <div class="products-container">
            <div v-for="product in products" 
                 :key="product.id" 
                 class="product-item">
              <input 
                v-model.trim="product.name"
                placeholder="Product name"
                :disabled="loading"
                required
              >
              <input 
                v-model.number="product.price"
                type="number"
                step="0.01"
                min="0"
                placeholder="Price"
                :disabled="loading"
                required
              >
              <button 
                type="button"
                @click="removeProduct(product.id)"
                class="remove-btn"
                :disabled="loading"
              >
                ✕
              </button>
            </div>
          </div>
          <button 
            type="button"
            @click="addProduct"
            class="add-btn"
            :disabled="loading"
          >
            + Add Product
          </button>
        </div>

        <div class="form-actions">
          <button 
            type="submit"
            class="save-btn"
            :disabled="loading || !isFormValid"
          >
            {{ loading ? 'Saving...' : 'Save Business Profile' }}
          </button>
        </div>
      </form>

      <div v-if="notification" :class="['notification', notification.type]">
        {{ notification.message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
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
    const loading = ref(false)
    const notification = ref(null)

    const isFormValid = computed(() => {
      return businessName.value.trim() &&
             description.value.trim() &&
             products.value.every(p => p.name.trim() && p.price >= 0)
    })

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userId.value = user.uid
          fetchBusinessProfile()
        } else {
          showNotification('Please log in to access your business profile', 'error')
        }
      })
    })

    const showNotification = (message, type = 'success') => {
      notification.value = { message, type }
      setTimeout(() => {
        notification.value = null
      }, 3000)
    }

    const fetchBusinessProfile = async () => {
      loading.value = true
      try {
        const docRef = doc(db, 'businessProfiles', userId.value)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          businessName.value = data.businessName || ''
          description.value = data.description || ''
          interests.value = data.interests || []
          experience.value = data.experience || ''
          products.value = data.products || []
        }
      } catch (error) {
        console.error("Error fetching business profile: ", error)
        showNotification('Failed to load business profile', 'error')
      } finally {
        loading.value = false
      }
    }

    const saveBusinessProfile = async () => {
      if (!isFormValid.value) return

      loading.value = true
      try {
        await setDoc(doc(db, 'businessProfiles', userId.value), {
          businessName: businessName.value.trim(),
          description: description.value.trim(),
          interests: interests.value.map(i => i.trim()).filter(Boolean),
          experience: experience.value.trim(),
          products: products.value.map(p => ({
            ...p,
            name: p.name.trim(),
            price: Number(p.price)
          }))
        })
        showNotification('Business profile saved successfully')
      } catch (error) {
        console.error("Error saving business profile: ", error)
        showNotification('Failed to save business profile', 'error')
      } finally {
        loading.value = false
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
      loading,
      notification,
      isFormValid,
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
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.profile-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.profile-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #444;
}

input, textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus, textarea:focus {
  border-color: #4CAF50;
  outline: none;
}

.interests-container, .products-container {
  margin-bottom: 10px;
}

.interest-item, .product-item {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.remove-btn {
  padding: 8px 12px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-btn:hover {
  background: #cc0000;
}

.add-btn {
  padding: 8px 16px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background: #1976D2;
}

.save-btn {
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-btn:hover {
  background: #45a049;
}

.save-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background: #4CAF50;
}

.notification.error {
  background: #f44336;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>