<template>
  <div class="booth-details-container">
    <div v-if="booth" class="booth-details-card">
      <img :src="booth.booth_image" alt="Booth Image" class="booth-image" />
      <h1 class="booth-title">{{ booth.booth_title }}</h1>
      
      <div class="booth-info">
        <p><strong>Booth ID:</strong> {{ booth.booth_id }}</p>
        <p><strong>Event ID:</strong> {{ booth.event_id }}</p>
        <p><strong>Organizer ID:</strong> {{ booth.organizer_id }}</p>
        <p><strong>Status:</strong> {{ booth.availability_status }}</p>
        <p><strong>Duration:</strong> {{ booth.duration }} hours</p>
        <p><strong>Price:</strong> ${{ booth.price.toFixed(2) }}</p>
        <p><strong>Size:</strong> {{ booth.size }} sq. ft.</p>
        <p><strong>Created At:</strong> {{ formatDate(booth.created_at) }}</p>
        <p><strong>Updated At:</strong> {{ formatDate(booth.updated_at) }}</p>
      </div>

      <!-- Back Button to Booth Listings -->
      <router-link to="/booths">
        <button class="back-button">Back to Booth Listings</button>
      </router-link>
    </div>
    <div v-else>
      <p>Loading booth details...</p>
    </div>
  </div>
</template>

<script>
import { boothAPI } from '../services/api';

export default {
  name: 'BoothDetails',
  props: ['id'],
  data() {
    return {
      booth: null,
      error: null,
    };
  },
  mounted() {
    this.fetchBoothDetails();
  },
  methods: {
    async fetchBoothDetails() {
      try {
        const response = await boothAPI.get(`/booths/${this.id}`);
        this.booth = response.data;
      } catch (error) {
        this.error = 'Error fetching booth details';
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
  }
};
</script>

<style scoped>
.booth-details-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.booth-details-card {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;
}

.booth-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
}

.booth-title {
  font-size: 2em;
  margin-bottom: 10px;
  color: #333;
}

.booth-info p {
  margin: 8px 0;
  font-size: 1.1em;
  color: #555;
}

.booth-info p strong {
  color: #16697a;
}

.back-button {
  background-color: #16697a;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

.back-button:hover {
  background-color: #135a68;
}

@media screen and (max-width: 600px) {
  .booth-details-card {
    padding: 15px;
  }
  
  .booth-title {
    font-size: 1.5em;
  }

  .booth-info p {
    font-size: 1em;
  }
}
</style>
