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
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header, .main-content, footer {
  width: 100%;
}

.main-content {
  flex-grow: 1; /* Ensures the main content takes up available space */
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Centers the content vertically */
}

.footer {
  background-color: #16697a;
  color: white;
  text-align: center;
  padding: 30px;
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

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
}
</style>
