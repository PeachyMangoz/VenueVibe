<template>
  <div>
    <section class="booth-listings">
      <BoothCard v-for="booth in booths" :key="booth.id" :booth="booth" />
    </section>  
  </div>
</template>

<script>
import BoothCard from '../components/BoothCard.vue';

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
  .booth-listings {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    padding: 20px;
  }
</style>