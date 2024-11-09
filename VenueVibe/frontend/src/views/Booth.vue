<template>
  <div class="container section-title mb-0" data-aos="fade-up">
    <h2>
      <div class="title-with-lines">
        <span class="line"></span>
          Booth Listings
        <span class="line"></span>
      </div>
    </h2>
    <!-- Conditionally show the button if the user is an organiser -->
  </div>
  <div>
    <section class="booth-listings">
      <BoothCard v-for="booth in booths" :key="booth.id" :booth="booth" />
      <button v-if="isOrganiser" class="btn custom-btn" @click="addNewBooth">+ Add New Booth</button>
    </section> 
  </div>
</template>

<script>
import BoothCard from '../components/BoothCard.vue';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this points to your Firebase setup
import { boothAPI } from '../services/api';

export default {
  name: 'Booth',
  components: {
    BoothCard,
  },
  data() {
    return {
      booths: [],
      loading: true,
      error: null,
      isOrganiser: false, // Will be true if the user's profile_type is 'organiser'
    };
  },
  async mounted() {
    this.fetchBooths();
    await this.checkUserProfile(); // Check if the logged-in user is an organiser
  },
  methods: {
    async fetchBooths() {
      try {
        const response = await boothAPI.get('/booths'); // Fetch booths from the backend
        this.booths = response.data;
      } catch (error) {
        this.error = 'Error fetching booths';
      } finally {
        this.loading = false;
      }
    },
    async checkUserProfile() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'user', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Check if the profile_type is 'organiser'
            if (userData.profile_type === 'organiser') {
              this.isOrganiser = true;
            }
          } else {
            console.error('User document not found!');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        console.error('No authenticated user found');
      }
    },
    addNewBooth() {
      // Logic for adding a new booth (could open a modal or navigate to a form page)
      console.log("Add New Booth button clicked");
    },
  },
};
</script>

<style scoped>
.section-title {
  text-align: center;
  margin-bottom: 50px;
  padding: 30px 0;
  position: relative; /* Make the container relative to position the button */
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

.btn.custom-btn {
  background-color: #36b598;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 16px; 
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.btn.custom-btn:hover {
  background-color: #16697a;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.booth-listings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  padding: 20px;
}
</style>
