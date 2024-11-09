<template>
  <div class="container section-title" data-aos="fade-up">
    <h2>
      <div class="title-with-lines">
        <span class="line"></span>
          Booth Listings
        <span class="line"></span>
      </div>
    </h2>
  </div>
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

.section-title {
  text-align: center;
  margin-bottom: 50px;
  padding: 30px 0;
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

  .booth-listings {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    padding: 20px;
  }
</style>