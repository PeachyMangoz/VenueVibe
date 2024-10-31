<template>
  <div class="container py-5">
    <div v-if="loading" class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75" style="z-index: 1000;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <h1 class="card-title h3 mb-4">Business Profile</h1>
        
        <form @submit.prevent="saveBusinessProfile">
          <div class="mb-4">
            <label for="businessName" class="form-label fw-semibold">Business Name</label>
            <input 
              id="businessName"
              v-model.trim="businessName" 
              class="form-control"
              placeholder="Enter your business name"
              :disabled="loading"
              required
            >
          </div>

          <div class="mb-4">
            <label for="description" class="form-label fw-semibold">Business Description</label>
            <textarea 
              id="description"
              v-model.trim="description" 
              class="form-control"
              placeholder="Describe your business"
              rows="4"
              :disabled="loading"
              required
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold">Business Interests</label>
            <div class="mb-2">
              <div v-for="(interest, index) in interests" 
                   :key="index" 
                   class="d-flex gap-2 mb-2">
                <input 
                  v-model.trim="interests[index]"
                  class="form-control"
                  placeholder="Enter an interest"
                  :disabled="loading"
                >
                <button 
                  type="button"
                  @click="removeInterest(index)"
                  class="btn btn-danger"
                  :disabled="loading"
                >
                  ✕
                </button>
              </div>
            </div>
            <button 
              type="button"
              @click="addInterest"
              class="btn btn-primary"
              :disabled="loading"
            >
              + Add Interest
            </button>
          </div>

          <div class="mb-4">
            <label for="experience" class="form-label fw-semibold">Business Experience</label>
            <textarea 
              id="experience"
              v-model.trim="experience" 
              class="form-control"
              placeholder="Describe your business experience"
              rows="4"
              :disabled="loading"
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold">Products</label>
            <div class="mb-2">
              <div v-for="product in products" 
                   :key="product.id" 
                   class="d-flex gap-2 mb-2">
                <input 
                  v-model.trim="product.name"
                  class="form-control"
                  placeholder="Product name"
                  :disabled="loading"
                  required
                >
                <input 
                  v-model.number="product.price"
                  type="number"
                  step="0.01"
                  min="0"
                  class="form-control"
                  placeholder="Price"
                  :disabled="loading"
                  required
                >
                <button 
                  type="button"
                  @click="removeProduct(product.id)"
                  class="btn btn-danger"
                  :disabled="loading"
                >
                  ✕
                </button>
              </div>
            </div>
            <button 
              type="button"
              @click="addProduct"
              class="btn btn-primary"
              :disabled="loading"
            >
              + Add Product
            </button>
          </div>

          <div>
            <button 
              type="submit"
              class="btn btn-success w-100"
              :disabled="loading || !isFormValid"
            >
              {{ loading ? 'Saving...' : 'Save Business Profile' }}
            </button>
          </div>
        </form>

        <div v-if="notification" 
             class="position-fixed bottom-0 end-0 p-3"
             style="z-index: 1000;">
          <div :class="['alert', notification.type === 'success' ? 'alert-success' : 'alert-danger']"
               role="alert">
            {{ notification.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { db } from '../firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

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