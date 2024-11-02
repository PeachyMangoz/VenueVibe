# ReviewForm.vue
<template>
  <div 
    class="modal fade" 
    id="reviewModal" 
    tabindex="-1" 
    aria-labelledby="reviewModalLabel" 
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="reviewModalLabel">
            <i class="bi bi-pencil-square me-2"></i>
            Submit Your Review
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            data-bs-dismiss="modal" 
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <!-- Event ID -->
            <div class="mb-3">
              <label for="eventId" class="form-label">Event ID:</label>
              <input 
                type="text" 
                id="eventId" 
                v-model="formData.eventId" 
                class="form-control" 
                required 
              />
            </div>

            <!-- Username -->
            <div class="mb-3">
              <label for="username" class="form-label">Username:</label>
              <input 
                type="text" 
                id="username" 
                v-model="formData.username" 
                class="form-control" 
                required 
              />
            </div>

            <!-- Category -->
            <div class="mb-3">
              <label for="category" class="form-label">Category:</label>
              <select 
                id="category" 
                v-model="formData.category" 
                class="form-select" 
                required
              >
                <option value="" disabled>Select a category</option>
                <option 
                  v-for="category in categories" 
                  :key="category" 
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
            </div>

            <!-- Rating -->
            <div class="mb-3">
              <label for="rating" class="form-label">Rating:</label>
              <select 
                id="rating" 
                v-model="formData.rating" 
                class="form-select" 
                required
              >
                <option value="">Select a rating</option>
                <option 
                  v-for="(label, rating) in ratingLabels" 
                  :key="rating" 
                  :value="rating"
                >
                  {{ rating }} - {{ label }}
                </option>
              </select>
            </div>

            <!-- Description -->
            <div class="mb-3">
              <label for="description" class="form-label">Description & Opinion:</label>
              <textarea 
                id="description" 
                v-model="formData.description" 
                class="form-control" 
                rows="4"
                required
              ></textarea>
            </div>

            <!-- Image Upload -->
            <div class="mb-3">
              <label for="imageFile" class="form-label">Upload Image (optional):</label>
              <input 
                type="file" 
                id="imageFile" 
                class="form-control" 
                accept="image/*"
                @change="handleImageUpload"
                :disabled="loading"
              />
              <!-- Image Preview -->
              <div v-if="formData.imageFile" class="mt-2 preview-container position-relative">
                <img 
                  :src="formData.imageFile" 
                  class="review-preview-image img-fluid"
                  alt="Preview" 
                  style="max-height: 200px;"
                />
                <button 
                  type="button" 
                  class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                  @click="removeImage"
                >
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="text-end">
              <button 
                type="submit" 
                class="btn"
                :disabled="loading"
              >
                <i class="bi bi-check-circle me-1"></i>
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';

import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";

const storage = getStorage();
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit']);

// Constants
const categories = [
  'Food & Beverages',
  'Artist, Creator, Crafts',
  'Jewellery & Accessories',
  'Fashion, Apparel & Clothing',
  'Family & Pets',
  'Others'
];

const ratingLabels = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

// State
const modalRef = ref(null);
const modal = ref(null);
const formData = ref(getInitialFormData());

// Initialize form data
function getInitialFormData() {
  return {
    eventId: '',
    username: '',
    category: '',
    rating: '',
    description: '',
    imageFile: null,
    imageFileObject: null
  };
}

// Methods
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      // Create a unique filename
      const filename = `${Date.now()}-${file.name}`;
      const imageRef = storageRef(storage, `reviewImages/${filename}`);
      
      // Upload the file
      const snapshot = await uploadBytes(imageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      formData.value.imageFile = downloadURL;
      formData.value.imageFileObject = file;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert('Failed to upload image');
    }
  }
};

const removeImage = () => {
  if (formData.value.imageFile?.startsWith('blob:')) {
    URL.revokeObjectURL(formData.value.imageFile);
  }
  formData.value.imageFile = null;
  formData.value.imageFileObject = null;
};

const resetForm = () => {
  removeImage();
  formData.value = getInitialFormData();
};

const handleSubmit = () => {
  emit('submit', { ...formData.value });
};

// Modal methods
const openModal = () => {
  modal.value?.show();
};

const closeModal = () => {
  modal.value?.hide();
  resetForm();
};

// Lifecycle hooks
onMounted(() => {
  modal.value = new Modal(modalRef.value);
  
  modalRef.value.addEventListener('hidden.bs.modal', () => {
    resetForm();
  });
});

// Expose methods to parent
defineExpose({
  openModal,
  closeModal
});
</script>

<style src="@/styles/review.css" scoped />

<style scoped>

.green-btn {
  background-color: #484039;
  color: white;
}

.green-btn:hover {
  background-color:#484039;
  color: white;
}

.preview-container {
  max-width: 100%;
  overflow: hidden;
  border-radius: 4px;
}

.review-preview-image {
  width: 100%;
  object-fit: contain;
}
</style>