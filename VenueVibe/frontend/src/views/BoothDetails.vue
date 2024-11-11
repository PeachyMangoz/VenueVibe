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
      </div>
      <button @click="openProfileSelection" class="apply-button">Apply</button>
      <router-link to="/booths">
        <button class="back-button">Back to Booth Listings</button>
      </router-link>
    </div>

    <!-- Right Side: Google Map -->
    <div v-if="booth" class="map-container">
      <div id="map" class="map"></div>
    </div>

    <div v-else>
      <p v-if="error">{{ error }}</p>
      <p v-else>Loading booth details...</p>
    </div>

    <!-- Profile Selection Modal -->
    <ProfileSelectionModal 
      :isOpen="showProfileModal"
      :profiles="profiles"
      :boothDetails="booth"
      @close="closeProfileModal"
      @selectProfile="handleProfileSelection"
    />

    <!-- Toast Notification -->
    <div v-if="notification" class="notification-toast" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import { boothAPI } from '../services/api';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useRouter } from 'vue-router';
import ProfileSelectionModal from '../components/ProfileSelectionModal.vue';

export default {
  name: 'BoothDetails',
  components: {
    ProfileSelectionModal
  },
  props: ['id'],
  setup(props) {
    const booth = ref(null);
    const error = ref(null);
    const showProfileModal = ref(false);
    const profiles = ref([]);
    const auth = getAuth();
    const router = useRouter();
    const notification = ref(null);

    const showNotification = (message, type = 'success') => {
      notification.value = { message, type };
      setTimeout(() => {
        notification.value = null;
      }, 3000);
    };

    const fetchProfiles = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          // If no user is logged in, redirect to login
          router.push('/login');
          return;
        }

        const querySnapshot = await getDocs(
          collection(db, 'application_profiles', user.uid, 'profiles')
        );
        
        profiles.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (err) {
        console.error('Error fetching profiles:', err);
        showNotification('Error fetching application profiles', 'error');
      }
    };

    const fetchBoothDetails = async () => {
      try {
        const response = await boothAPI.get(`/booths/${props.id}`);
        booth.value = response.data;
        if (booth.value && booth.value.postal_code) {
          loadGoogleMaps();
        }
      } catch (err) {
        error.value = 'Error fetching booth details';
        showNotification('Error fetching booth details', 'error');
      }
    };

    const createApplication = async (profile) => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push('/login');
          return;
        }

        // Create the application document
        await addDoc(collection(db, 'eventApplications'), {
          userId: user.uid,
          boothId: booth.value.booth_id,
          eventId: booth.value.event_id,
          profileId: profile.id,
          eventName: booth.value.booth_title,
          status: 'PENDING',
          date: new Date(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          notes: `Applied using profile: ${profile.name}`,
          profileDetails: {
            name: profile.name,
            focus: profile.focus,
            description: profile.description
          },
          boothDetails: {
            title: booth.value.booth_title,
            price: booth.value.price,
            size: booth.value.size,
            duration: booth.value.duration
          }
        });

        showNotification('Application submitted successfully!', 'success');
        
        // Redirect to applications page
        setTimeout(() => {
          router.push('/eventapplications');
        }, 1500);
      } catch (err) {
        console.error('Error creating application:', err);
        showNotification('Error creating application', 'error');
      }
    };

    const openProfileSelection = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }
      await fetchProfiles();
      showProfileModal.value = true;
    };

    const closeProfileModal = () => {
      showProfileModal.value = false;
    };

    const handleProfileSelection = async (profile) => {
      await createApplication(profile);
      closeProfileModal();
    };

    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const loadGoogleMaps = () => {
      const loader = new Loader({
        apiKey: 'AIzaSyAeSyt0WZgXPM3dw-fB_ryg1Vs0Yq6OFl4', // Your API key
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
        geocoder.geocode({ address: `${booth.value.postal_code}, Singapore` }, (results, status) => {
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
    };

    onMounted(() => {
      fetchBoothDetails();
    });

    return {
      booth,
      error,
      showProfileModal,
      profiles,
      notification,
      formatDate,
      openProfileSelection,
      closeProfileModal,
      handleProfileSelection
    };
  }
};
</script>

<style scoped>
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
  border-radius: 10px;
  overflow: hidden;
}

.booth-image {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 20px;
}

.booth-info p strong {
  color: #36b598;
}

.apply-button, .back-button {
  background-color: #36b598;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 10px;
}

.apply-button:hover, .back-button:hover {
  background-color: #2d9a82;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.notification-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.notification-toast.success {
  background-color: #36b598;
}

.notification-toast.error {
  background-color: #f44336;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive Design */
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

  .booth-title {
    font-size: 1.5em;
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

  .notification-toast {
    left: 20px;
    right: 20px;
    text-align: center;
  }

  .apply-button, .back-button {
    font-size: 14px;
    padding: 8px 16px;
  }
}
</style>