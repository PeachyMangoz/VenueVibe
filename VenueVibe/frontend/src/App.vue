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
  padding: 15px 30px;
  font-size: 18px;
}

nav h1 {
  color: #16697a;
  text-align: center;
  margin: 20px 0;
}

nav ul {
  display: flex;
  list-style-type: none;
  justify-content: space-around;
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  padding: 0;
}

nav ul li {
  padding: 10px 15px;
}

nav ul li:hover {
  background-color: #3aafa9;
  border-radius: 5px;
  cursor: pointer;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
  max-width: 1000px;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
}

.booth-listings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  padding: 20px;
}

.booth-listings .booth-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: all 0.3s ease-in-out;
}

.booth-listings .booth-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.2);
}

.booth-card h2 {
  font-size: 20px;
  color: #16697a;
  text-align: center;
  margin-bottom: 10px;
}

.booth-card .price {
  font-size: 18px;
  color: #ff7f50;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.booth-card .details {
  font-size: 14px;
  color: #555;
  text-align: center;
  margin-bottom: 8px;
}

.footer {
  background-color: #16697a;
  color: white;
  text-align: center;
  padding: 30px;
  margin-top: 30px;
}

.footer .social-media {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.footer .social-media i {
  font-size: 24px;
  color: white;
  transition: color 0.3s;
}

.footer .social-media i:hover {
  color: #ff7f50;
}

</style>
