<template>
  <div class="container section-title" data-aos="fade-up">
    <h2>
      <div class="title-with-lines">
        <span class="line"></span>
        Business Profile
        <span class="line"></span>
      </div>
    </h2>
  </div>
  <div class="container py-5">
    <div v-if="loading" class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75" style="z-index: 1000;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <!-- View Mode -->
        <div v-if="hasProfile && !isEditing">
          <div class="d-flex justify-content-end mb-4">
            <button 
              @click="toggleEdit"
              class="btn btn-primary"
              :disabled="loading"
            >
              Edit Profile
            </button>
          </div>

          <div class="mb-4">
            <h3 class="h5 fw-bold">Business Name</h3>
            <p>{{ businessName }}</p>
          </div>

          <div class="mb-4">
            <h3 class="h5 fw-bold">Business Description</h3>
            <p>{{ description }}</p>
          </div>

          <div class="mb-4">
            <h3 class="h5 fw-bold">Business Interests</h3>
            <div class="d-flex flex-wrap gap-2">
              <span 
                v-for="(interest, index) in interests" 
                :key="index"
                class="badge bg-primary"
              >
                {{ interest }}
              </span>
            </div>
          </div>

          <div class="mb-4">
            <h3 class="h5 fw-bold">Business Experience</h3>
            <p>{{ experience }}</p>
          </div>

          <div class="mb-4">
            <h3 class="h5 fw-bold">Products</h3>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in products" :key="product.id">
                    <td>{{ product.name }}</td>
                    <td>${{ product.price.toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Edit Mode -->
        <form v-else @submit.prevent="saveBusinessProfile">
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

          <div class="d-flex gap-2">
            <button 
              v-if="hasProfile"
              type="button"
              @click="toggleEdit"
              class="btn btn-secondary flex-grow-1"
              :disabled="loading"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="btn btn-success flex-grow-1"
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
    const hasProfile = ref(false)
    const isEditing = ref(false)

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
          hasProfile.value = true
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
        hasProfile.value = true
        isEditing.value = false
        showNotification('Business profile saved successfully')
      } catch (error) {
        console.error("Error saving business profile: ", error)
        showNotification('Failed to save business profile', 'error')
      } finally {
        loading.value = false
      }
    }

    const toggleEdit = () => {
      isEditing.value = !isEditing.value
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

    onMounted(() => {
      // Assume userId is set somewhere in your app
      userId.value = 'current-user-id' // Replace with actual user ID
      fetchBusinessProfile()
    })

    return {
      businessName,
      description,
      interests,
      experience,
      products,
      loading,
      notification,
      hasProfile,
      isEditing,
      isFormValid,
      saveBusinessProfile,
      toggleEdit,
      addInterest,
      removeInterest,
      addProduct,
      removeProduct,
    }
  }
}
</script>

<style scoped>
.section-title {
  text-align: center;
  margin-bottom: 50px;
  padding: 30px 0;
}

.section-title h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
}

.title-with-lines {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.line {
  width: 70px;
  height: 3px;
  background: #36b598;
  display: inline-block;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  animation: fadeIn 1.5s;
}
</style>