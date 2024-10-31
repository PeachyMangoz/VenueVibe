# ReviewSearch.vue
<template>
  <div class="col-md-6">
    <div class="card h-100 shadow-sm">
      <div class="card-body">
        <h2>Search Reviews</h2>
        <form @submit.prevent="handleSearch">
          <div class="input-group mb-3">
            <input 
              type="text" 
              v-model="searchInput" 
              class="form-control" 
              placeholder="Enter Event ID" 
              required 
              :disabled="loading"
            />
            <button 
              class="btn green-btn" 
              type="submit"
              :disabled="loading"
            >
              <i class="bi bi-search me-1"></i>
              Search
            </button>
          </div>
          <p class="button-info text-muted">
            Click search button or press enter to view data charts
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  searchId: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:searchId', 'search']);

const searchInput = ref(props.searchId);

// Watch for external changes to searchId
watch(() => props.searchId, (newValue) => {
  searchInput.value = newValue;
});

// Watch for local changes to searchInput
watch(searchInput, (newValue) => {
  emit('update:searchId', newValue);
});

const handleSearch = () => {
  emit('search');
};
</script>

<style scoped>
.green-btn {
  background-color: #36b598;
  color: white;
}

.green-btn:hover {
  background-color: #2d9b82;
  color: white;
}

.button-info {
  color: grey;
  font-size: 0.75em;
  text-align: right;
}

h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #545252;
}
</style>