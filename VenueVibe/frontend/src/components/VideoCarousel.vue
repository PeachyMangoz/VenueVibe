<template>
  <div class="carousel-container container-fluid">
    <div class="cards-wrapper">
      <div 
        class="carousel-card" 
        v-for="(card, index) in cards" 
        :key="index"
        :class="{ 'd-none d-xl-flex': index !== currentCardIndex }"
      >
        <h3 class="carousel-title">{{ card.title }}</h3>
        
        <!-- Video Section -->
        <div class="carousel-video-container container-fluid">
          <video
            class="carousel-video"
            autoplay
            muted
            loop
            playsinline
          >
            <source :src="card.videoSrc" type="video/mp4">
          </video>
        </div>

        <!-- Description Section -->
        <div class="carousel-description">
          {{ card.description }}
        </div>
        <div class="video-source">
          {{ card.source }}
        </div>
      </div>
    </div>

    <!-- Navigation Buttons for MD/LG -->
    <div class="navigation-buttons d-md-flex d-xl-none">
      <button 
        class="btn btn-primary me-2" 
        @click="previousCard" 
        :disabled="currentCardIndex === 0"
      >
        Previous
      </button>
      <button 
        class="btn btn-primary" 
        @click="nextCard" 
        :disabled="currentCardIndex === cards.length - 1"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const cards = [
  {
    title: 'Public Garden',
    videoSrc: '/videos/Tiktok1.mp4',
    description: 'Recurring artisan trade show | Suntec Singapore Convention Centre',
    source:' Creds: @halfacoffee. '
  },
  {
    title: 'Resurrack Vintage Market',
    videoSrc: '/videos/Tiktok2.mp4',
    description: 'EVERY WEEKEND | Bugis Street Art Lane',
    source:' Creds: @hiddenjemmm. '
  },
  {
    title: 'Entertainment',
    videoSrc: '/videos/Tiktok3.mp4',
    description: 'Monthly night market | Orchard Road',
    source:' Creds: @kai.icloud. '
  },
  {
    title: 'Shopping',
    videoSrc: '/videos/shopping.mp4',
    description: 'Find amazing deals',
    source:' Creds: @halfacoffee. '
  }
];

const currentCardIndex = ref(0);

const nextCard = () => {
  if (currentCardIndex.value < cards.length - 1) {
    currentCardIndex.value++;
  }
};

const previousCard = () => {
  if (currentCardIndex.value > 0) {
    currentCardIndex.value--;
  }
};
</script>

<style scoped>
.carousel-container {
  margin: auto;
  padding: 0px;
  perspective: 1000px;
}

.cards-wrapper {
  display: flex;
  justify-content: center;
  gap: -50px;
}

.carousel-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  opacity: 0.9;
  border-radius: 10px;
  box-shadow: -1rem 0 3rem rgba(0, 0, 0, 0.3);
  transition: 0.4s ease-out;
  position: relative;
  padding: 20px;
  /* Add minimum height to ensure content fits */
  min-height: 400px;
  /* Add padding bottom to make room for buttons */
  padding-bottom: 60px; /* Increase this value if buttons still get cut */
}


/* XL screens and up - Show overlapping cards */
@media (min-width: 1200px) {
  .carousel-card {
    margin-left: -45px;
  }

  .carousel-card:first-child {
    margin-left: 0;
  }

  .carousel-card:hover {
    transform: translateY(-20px);
  }

  .carousel-card:hover ~ .carousel-card {
    position: relative;
    left: 50px;
    transition: 0.4s ease-out;
  }
}

/* MD and LG screens - Single card view */
@media (max-width: 1199px) {
  .cards-wrapper {
    gap: 0;
  }

  .carousel-card {
    margin-left: 0;
    width: 100%;
    max-width: 500px;
    max-height: 500px;
  }
}

/* SM screens and down */
@media (max-width: 767px) {
  .cards-wrapper {
    flex-direction: column;
    align-items: center;
  }
  
  .carousel-card {
    max-width: 300px;
  }
}

.carousel-video-container {
  opacity: 1;
  overflow: hidden;
  padding-bottom: 15px;
  margin: 15px 0;
}

.carousel-video {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.carousel-title {
  color: #333;
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: 'Montserrat', sans-serif;
}

.carousel-description {
  color: #36b598;
  font-weight: bold;
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 15px;
}

.navigation-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.video-source{
  font-size:0.7rem;
  color:#333;
}


</style>