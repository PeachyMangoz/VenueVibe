<template>
  <div class="booth-card">
    <img :src="boothImage" alt="Booth Image" class="booth-image" />
    <h3 class="booth-title">{{ booth.title }}</h3>
    <p class="booth-price">Price: {{ booth.price }}</p>
    <p class="booth-duration">Duration: {{ booth.duration }}</p>
    <p class="booth-space">Space: {{ booth.space }}</p>
    <p class="booth-organizer">Organizer: {{ booth.organizer }}</p>
    <p class="booth-description">{{ booth.description }}</p>
  </div>
</template>

<script>
export default {
  name: 'BoothCard',
  props: ['booth'],
  data() {
    return {
      boothImage: 'https://via.placeholder.com/250' // Replace with real booth images
    };
  }
};
</script>

<style scoped>
.booth-card {
  background-color: #ede7e3;
  padding: 15px;
  border-radius: 10px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.booth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.booth-image {
  width: 100%;
  border-radius: 5px;
}

.booth-title {
  color: #16697a;
  margin: 10px 0;
}

.booth-price {
  color: #ffa62b;
  font-weight: bold;
}

.booth-duration, .booth-space {
  color: #489fb5;
  font-style: italic;
}

.booth-organizer {
  color: #82c0cc;
  font-size: 0.9em;
}
</style>
