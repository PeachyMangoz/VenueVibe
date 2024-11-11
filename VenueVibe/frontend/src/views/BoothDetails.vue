<template>
  <div class="booth-details-container">
    <!-- Left Side: Booth Details -->
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
      </div >
      <div class="row">
      <button @click="applyForBooth" class="btn green-btn">Apply</button>
      
      <router-link to="/booths">
        <button class="btn green-btn">Back to Booth Listings</button>
      </router-link> </div>
    </div>

    <!-- Right Side: Google Map -->
    <div v-if="booth" class="map-container">
      <div id="map" class="map"></div>
    </div>

    <div v-else>
      <p v-if="error">{{ error }}</p>
      <p v-else>Loading booth details...</p>
    </div>
  </div>
</template>

<script>
import { Loader } from '@googlemaps/js-api-loader';
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
        if (this.booth && this.booth.postal_code) {
          this.loadGoogleMaps();
        }
      } catch (error) {
        this.error = 'Error fetching booth details';
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    },
    applyForBooth() {
      this.$router.push(`/applicationprofiles?boothId=${this.booth.booth_id}`);
    },
    loadGoogleMaps() {
      const loader = new Loader({
        apiKey: 'AIzaSyAeSyt0WZgXPM3dw-fB_ryg1Vs0Yq6OFl4',  /* Restricted API key */
        version: 'weekly',
      });

      loader.load().then(async () => {
        const { Map } = await google.maps.importLibrary('maps');
        const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

        const map = new Map(document.getElementById('map'), {
          center: { lat: 1.3521, lng: 103.8198 },
          zoom: 15,
          mapId: 'c41954172f2edac5',
        });

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: `${this.booth.postal_code}, Singapore` }, (results, status) => {
          if (status === 'OK' && results[0]) {
            map.setCenter(results[0].geometry.location);
            new AdvancedMarkerElement({
              map: map,
              position: results[0].geometry.location,
            });
          } else {
            console.error('Geocode error:', status);
          }
        });
      }).catch((error) => {
        console.error('Google Maps API load error:', error);
      });
    },
  },
};
</script>
<style src="@/styles/review.css" scoped />

<style scoped>
.apply-button {
  background-color: #16697a;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.booth-details-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
  gap: 20px;
}

.booth-details-card {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  align-items: center; 
  text-align: left; 
}

.booth-info p {
  margin: 8px 0;
  font-size: 1.1em;
  color: #555;
  text-align: left;
}

.booth-title {
  font-size: 2em;
  margin-bottom: 10px;
  color: #333;
  text-align: left; 
}


.map-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.map {
  width: 100%;
  height: 800px;
}

.booth-image {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 20px;
}

.booth-title {
  font-size: 2em;
  margin-bottom: 10px;
  color: #333;
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

@media screen and (min-width: 769px) {
  .booth-details-container {
    flex-direction: row;
    align-items: flex-start;
  }

  .booth-details-card, .map-container {
    flex: 1;
    margin: 0 10px;
  }

  .booth-details-card {
    max-width: 767px;
  }

  .map {
    height: 780px;
  }
}

@media screen and (max-width: 768px) {
  .booth-details-container {
    flex-direction: column;
  }

  .map {
    height: 400px;
  }
}

@media screen and (max-width: 480px) {
  .booth-title {
    font-size: 1.5em;
  }

  .booth-info p {
    font-size: 1em;
  }

  .map {
    height: 300px;
  }
}
</style>