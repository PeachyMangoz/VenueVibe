<template>
  <header></header>

  <div>
    <NavBar />

    <main class="main-content">
      <router-view></router-view>
    </main>

  </div>

  <footer class="footer">
    <p>© 2024 Booth Listings</p>
    <div class="social-media">
      <!-- Social media icons -->
    </div>
  </footer>
</template>

<script>
// import BoothCard from './components/BoothCard.vue';
import NavBar from './components/NavBar.vue';
// import SearchBar from './components/SearchBar.vue';
// import EventDescription from './components/EventDescription.vue';
// import BusinessProfile from './components/BusinessProfile.vue';
// import EventApplications from './components/EventApplications.vue';
// import ApplicationProfiles from './components/ApplicationProfiles.vue';

import { boothAPI } from './services/api';

export default {
  name: 'App',
  components: {
    NavBar,
    // BoothCard,
    // SearchBar,
    // EventDescription,
    // BusinessProfile,
    // EventApplications,
    // ApplicationProfiles,
  },
  data() {
    return {
      // booths: [],
      loading: true,
      error: null,
    };
  },
  mounted() {
    // this.fetchBooths();
  },
  methods: {
    // async fetchBooths() {
    //   try {
    //     const response = await boothAPI.get('/booths'); // Fetch booths from the backend
    //     this.booths = response.data;
    //   } catch (error) {
    //     this.error = 'Error fetching booths';
    //   } finally {
    //     this.loading = false;
    //   }
    // },
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

.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
  max-width: 1000px;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
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
