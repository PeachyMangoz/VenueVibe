<template>
  <header></header>

  <div>
    <nav>
      <h1>Booth Listings</h1>
      <ul>
        <li>Home</li>
        <li>Browse Booths</li>
        <li>Organizers</li>
        <li>Events</li>
        <li>Contact</li>
        <li>Profile</li>
      </ul>
    </nav>

    <SearchBar />

    <main class="main-content">
      <BusinessProfile />
      <EventApplications />
      <ApplicationProfiles />
    </main>

    <section class="booth-listings">
      <BoothCard v-for="booth in booths" :key="booth.id" :booth="booth" />
    </section>

    <EventDescription />
  </div>

  <footer class="footer">
    <p>© 2024 Booth Listings</p>
    <div class="social-media">
      <!-- Social media icons -->
    </div>
  </footer>
</template>

<script>
import BoothCard from './components/BoothCard.vue';
// import SearchBar from './components/SearchBar.vue';
// import EventDescription from './components/EventDescription.vue';
// import BusinessProfile from './components/BusinessProfile.vue';
// import EventApplications from './components/EventApplications.vue';
// import ApplicationProfiles from './components/ApplicationProfiles.vue';

import { boothAPI } from './services/api';

export default {
  name: 'App',
  components: {
    BoothCard,
    // SearchBar,
    // EventDescription,
    // BusinessProfile,
    // EventApplications,
    // ApplicationProfiles,
  },
  data() {
    return {
      booths: [],
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchBooths();
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
  },
};
</script>

<style scoped>
/* Basic Styling for the Layout */
.header {
  background-color: #16697a;
  color: white;
  padding: 10px 20px;
}

nav ul {
  display: flex;
  list-style-type: none;
  gap: 20px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.booth-listings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.footer {
  background-color: #16697a;
  color: white;
  text-align: center;
  padding: 20px;
}

.social-media {
  display: flex;
  justify-content: center;
  gap: 15px;
}
</style>
