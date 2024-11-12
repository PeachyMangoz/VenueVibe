<template>
  <div class="booth-card card">
    <div class="post-img position-relative overflow-hidden">
      <img :src="booth.booth_image" :alt="booth.booth_title" class="booth-image w-100 h-100 object-fit-cover" />
      <div class="booth-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
        <router-link :to="{ name: 'booth-details', params: { id: booth.booth_id } }" class="text-decoration-none">
          <button class="view-details-button">View Details</button>
        </router-link>
      </div>
    </div>
    
    <div class="card-body p-4">
      <h3 class="booth-title heading-montserrat mb-4">{{ booth.booth_title }}</h3>
      
      <div class="booth-info">
        <div class="mb-3 d-flex align-items-center">
          <i class="fas fa-tag me-2 "></i>
          <span class="booth-price">${{ booth.price }}</span>
        </div>
        
        <div class="mb-3 d-flex align-items-center">
          <i class="far fa-clock me-2 "></i>
          <span class="booth-duration">{{ booth.duration }} Days</span>
        </div>
        
        <div class="mb-3 d-flex align-items-center">
          <i class="fas fa-store me-2"></i>
          <span class="booth-space">{{ booth.size }} slots </span>
        </div>
        
        <div class="mb-3 d-flex align-items-center">
          <i class="far fa-building me-2"></i>
          <span class="booth-organizer">{{ booth.organizer_id }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BoothCard',
  props: {
    booth: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
i{
  color: #36b598
}
.booth-card {
  border: none;
  background: rgba(255,255,255,0.95);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  will-change: transform;
}

.booth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.post-img {
  height: 250px;
  overflow: hidden;
}

.booth-image {
  transition: transform 0.5s ease;
  object-fit: cover;
  width: 100%;
  height: 100%;
  will-change: transform;
}

.booth-card:hover .booth-image {
  transform: scale(1.1);
}

.booth-overlay {
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: all 0.3s ease;
}

.booth-card:hover .booth-overlay {
  opacity: 1;
}

.booth-title {
  font-size: 1.5rem;
  color: #333;
  font-weight: 700;
  line-height: 1.3;
}

.booth-info {
  font-size: 0.95rem;
}

.booth-price {
  color: #333;
  font-weight: 600;
  font-size: 1.1rem;
}

.booth-duration, .booth-space, .booth-organizer {
  color: #333;
}

.view-details-button {
  background-color: #36b598;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.9;
}

.view-details-button:hover {
  background-color: #2d9b82;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(54, 181, 152, 0.3);
  opacity: 1;
}

@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
</style>

<style src="@/styles/review.css" scoped />