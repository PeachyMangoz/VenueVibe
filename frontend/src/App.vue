<template>
  <div id="app">
    <header class="header">
      <nav>
        <h1>Booth Listings</h1>
        <ul>
          <li>Home</li>
          <li>Browse Booths</li>
          <li>Organizers</li>
          <li>Events</li>
          <li>Contact</li>
        </ul>
      </nav>
    </header>

    <SearchBar />

    <section class="booth-listings">
      <BoothCard
        v-for="booth in booths"
        :key="booth.id"
        :booth="booth"
      />
    </section>

    <EventDescription />

    <footer class="footer">
      <p>© 2024 Booth Listings</p>
      <div class="social-media">
        <!-- Social media icons -->
      </div>
    </footer>
  </div>
</template>

<script>
import BoothCard from './components/BoothCard.vue';
import SearchBar from './components/SearchBar.vue';
import EventDescription from './components/EventDescription.vue';

export default {
  name: 'App',
  components: {
    BoothCard,
    SearchBar,
    EventDescription
  },
  data() {
    return {
      booths: [
        { id: 1, title: 'Booth A', price: '$300', duration: '2 hours', space: 'Large', organizer: 'John Doe', description: 'An exciting booth...' },
        { id: 2, title: 'Booth B', price: '$200', duration: '1 hour', space: 'Medium', organizer: 'Jane Smith', description: 'A thrilling booth...' }
      ]
    };
  }
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
