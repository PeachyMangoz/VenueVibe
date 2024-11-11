<template>
<div class="image-container">
  <div class="container section-title" data-aos="fade-up">
    <h2>
      <div class="heading-montserrat">
        Booth Listings
      </div>
    </h2>

    <!-- Conditionally show the button if the user is an organiser -->
    <AddBoothFormButton 
      v-if="isLoggedIn && isOrganiser"
      :loading="loading"
      @click="openReviewModal"
    />
  </div>

  <!-- Booth listings -->
  <div>
    <section class="booth-listings">
      <BoothCard v-for="booth in booths" :key="booth.id" :booth="booth" />
    </section>
  </div>

  <!-- Modal for adding a new booth -->
  <AddBoothForm 
    ref="AddBoothFormRef"
    @submit="handleBoothSubmit"
  />
</div>
</template>

<script>
import BoothCard from '../components/BoothCard.vue';
import AddBoothForm from '@/components/AddBoothForm.vue';
import AddBoothFormButton from '@/components/AddBoothFormButton.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { boothAPI } from '../services/api';
import { mapGetters } from "vuex";

export default {
  name: 'Booth',
  components: {
    BoothCard,
    AddBoothForm, // Register the form component
    AddBoothFormButton, // Register the button component
  },
  computed: {
    ...mapGetters(['user']), // Access the user getter
    isLoggedIn() {
      return this.user.loggedIn; // Determine if the user is logged in
    }
  },
  data() {
    return {
      booths: [],
      loading: true,
      error: null,
      isOrganiser: false, // Will be true if the user's profile_type is 'organiser'
      AddBoothFormRef: null, // Reference to the review form
    };
  },
  methods: {
    async fetchBooths() {
      try {
        const response = await boothAPI.get('/booths');
        this.booths = response.data;
      } catch (error) {
        this.error = 'Error fetching booths';
      } finally {
        this.loading = false;
      }
    },
async checkUserProfile() {
  const auth = getAuth();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'user', user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.isOrganiser = userData.profile_type === 'organiser';
        } else {
          console.error('User document not found!');
          this.isOrganiser = false;
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        this.isOrganiser = false;
      }
    } else {
      // User is logged out - make sure to reset isOrganiser
      this.isOrganiser = false;
      console.log('No authenticated user found');
    }
  });
},
    openReviewModal() {
      // Open the modal by triggering the review form's `openModal` method
      this.$refs.AddBoothFormRef.openModal();
    },
    handleBoothSubmit(reviewData) {
      console.log('Submitted Booth:', reviewData);
      // Logic for handling the review submission
      // You can send this data to your API or Firebase, etc.
      this.$refs.AddBoothFormRef.closeModal(); // Close modal after submission
    }
  },
  async mounted() {
    this.fetchBooths();
    this.checkUserProfile(); // Check if the logged-in user is an organiser
  }
};
</script>

<style src="@/styles/review.css" scoped />

<style scoped>

.image-container{
  background-image: url('@/images/marketdark.jpg');
  background-size: cover;
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

