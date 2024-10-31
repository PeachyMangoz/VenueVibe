# ReviewFormButton.vue
<template>
  <div class="card h-100 shadow-sm">
    <div class="card-body">
      <h2 class="card-title">Submit Your Review</h2>
      <button 
        class="btn green-btn" 
        @click="$emit('click')"
        :disabled="loading"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Open Review Form
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>

<style src="@/styles/review.css" scoped />

<style scoped>
.green-btn {
  background-color: #36b598;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.green-btn:hover {
  background-color: #2d9b82;
  transform: translateY(-1px);
}

.green-btn:disabled {
  background-color: #a8d5c9;
  cursor: not-allowed;
  transform: none;
}

h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #545252;
}
</style>