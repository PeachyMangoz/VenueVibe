<template>
  <div class="booth-card card">
    <img :src="boothImage" alt="Booth Image" class="booth-image" />
    <h3 class="booth-title">{{ booth.booth_title }}</h3>
    <p class="booth-price">Price: {{ booth.price }}</p>
    <p class="booth-duration">Duration: {{ booth.duration }}</p>
    <p class="booth-space">Space: {{ booth.size }}</p>
    <p class="booth-organizer">Organiser: {{ booth.organizer_id }}</p>
    <p class="booth-description">{{ booth.description }}</p>

    <router-link :to="{ name: 'booth-details', params: { id: booth.booth_id } }">
      <button class="view-details-button">View Details</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'BoothCard',
  props: ['booth'],
  data() {
    return {
      boothImage: this.booth.booth_image
    };
  },
  mounted() {
    this.fetchImage();
  },
  methods: {
    async fetchImage() {
      try {
        const response = await fetch(this.booth.booth_image, {
          mode: 'cors', // Ensure CORS is handled correctly
        });

        if (!response.ok) {
          throw new Error('Image not found');
        }

        const imageBlob = await response.blob();
        this.boothImage = URL.createObjectURL(imageBlob); // Create an object URL from the blob

      } catch (error) {
        console.error('Error fetching the image:', error);
      }
    }
  }
};
</script>

<style scoped>

.booth-card {
  padding: 15px;
  border-radius: 10px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.booth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.booth-image {
  width: 100%;
  border-radius: 5px;
}

.booth-title {
  margin: 10px 0;
}

.booth-price {
  color: black;
  font-weight: bold;
}

.booth-duration, .booth-space {
  color: #489fb5;
  font-style: italic;
}

.booth-organizer {
  color: #82c0cc;
  font-size: 0.9em;
}

.view-details-button {
  background-color: #36b598;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 16px; 
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.view-details-button:hover {
  background-color: #16697a;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.view-details-button:active {
  background-color: #16697a;
  transform: translateY(0);
}

</style>
