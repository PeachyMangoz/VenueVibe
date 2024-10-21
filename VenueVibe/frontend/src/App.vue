<template>
  <div id="app">
    <header></header>

    <NavBar />

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <p>© 2024 Booth Listings</p>
      <div class="social-media">
        <!-- Social media icons -->
      </div>
    </footer>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar,
  },
};
</script>

<style scoped>
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
  max-width: 100%;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
  padding-top: 80px; /* Adjust this based on your nav bar height */
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
