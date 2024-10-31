# LoadingOverlay.vue
<template>
  <div 
    class="loading-overlay"
    :class="{ 'fade-in': show }"
  >
    <div class="loading-content">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  message: {
    type: String,
    default: 'Please wait...'
  },
  delay: {
    type: Number,
    default: 200 // Delay in milliseconds before showing the overlay
  }
});

const show = ref(false);

onMounted(() => {
  // Add a small delay before showing the loading overlay
  // This prevents flashing for very quick operations
  setTimeout(() => {
    show.value = true;
  }, props.delay);
});
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1060;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.loading-overlay.fade-in {
  opacity: 1;
}

.loading-content {
  text-align: center;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

p {
  margin-bottom: 0;
  color: #666;
  font-size: 1.1rem;
}
</style>