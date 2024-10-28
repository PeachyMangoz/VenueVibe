<!-- src/views/AboutUs.vue -->
<template>
    <div class="about-page">
      <!-- Hero Section -->
      <div class="hero-section bg-dark text-white py-5 mb-5">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-6" data-aos="fade-right">
              <h1 class="display-4 fw-bold">About Us</h1>
              <p class="lead">Bridging the gap between event organizers and small businesses</p>
            </div>
            <div class="col-md-6" data-aos="fade-left">
              <img src="@/assets/about-hero.jpg" alt="Event Connection" class="img-fluid rounded">
            </div>
          </div>
        </div>
      </div>
  
      <!-- Mission Section -->
      <div class="container mb-5">
        <div class="row">
          <div class="col-md-8 mx-auto text-center" data-aos="fade-up">
            <h2 class="fw-bold mb-4">Our Mission</h2>
            <p class="lead mb-4">
              We're dedicated to creating meaningful connections between event organizers 
              and small businesses, fostering growth and success in the events industry.
            </p>
          </div>
        </div>
      </div>
  
      <!-- What We Do Section -->
      <div class="container mb-5">
        <div class="row g-4">
          <div class="col-md-4" data-aos="fade-up" data-aos-delay="100">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center">
                <i class="bi bi-people-fill display-4 text-primary mb-3"></i>
                <h3 class="card-title h4">Connect</h3>
                <p class="card-text">
                  We connect event organizers with the perfect small businesses 
                  to make their events unique and memorable.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center">
                <i class="bi bi-graph-up-arrow display-4 text-primary mb-3"></i>
                <h3 class="card-title h4">Grow</h3>
                <p class="card-text">
                  Help small businesses expand their reach and event organizers 
                  find the perfect partners for their events.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-4" data-aos="fade-up" data-aos-delay="300">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center">
                <i class="bi bi-star-fill display-4 text-primary mb-3"></i>
                <h3 class="card-title h4">Succeed</h3>
                <p class="card-text">
                  Create successful partnerships that lead to outstanding events 
                  and business growth opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Why Choose Us Section -->
      <div class="container mb-5">
        <div class="row align-items-center">
          <div class="col-md-6" data-aos="fade-right">
            <h2 class="fw-bold mb-4">Why Choose Us?</h2>
            <ul class="list-unstyled">
              <li class="mb-3">
                <i class="bi bi-check-circle-fill text-primary me-2"></i>
                Easy-to-use platform for both organizers and businesses
              </li>
              <li class="mb-3">
                <i class="bi bi-check-circle-fill text-primary me-2"></i>
                Verified business profiles and reviews
              </li>
              <li class="mb-3">
                <i class="bi bi-check-circle-fill text-primary me-2"></i>
                Direct communication channels
              </li>
              <li class="mb-3">
                <i class="bi bi-check-circle-fill text-primary me-2"></i>
                Secure booking and payment system
              </li>
            </ul>
          </div>
          <div class="col-md-6" data-aos="fade-left">
            <img src="@/assets/why-choose-us.jpg" alt="Platform Features" class="img-fluid rounded">
          </div>
        </div>
      </div>
  
      <!-- Call to Action -->
      <div class="bg-primary text-white py-5">
        <div class="container">
          <div class="row text-center">
            <div class="col-md-8 mx-auto" data-aos="fade-up">
              <h2 class="fw-bold mb-4">Ready to Get Started?</h2>
              <p class="lead mb-4">
                Join our platform today and start connecting with potential partners!
              </p>
              <router-link to="/login" class="btn btn-light btn-lg px-5">
                Join Now
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AboutUs',
  }
  </script>
  
  <style scoped>
  .hero-section {
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                url('@/assets/hero-background.jpg') center/cover;
    min-height: 400px;
    display: flex;
    align-items: center;
  }
  
  .card {
    transition: transform 0.3s ease;
  }
  
  .card:hover {
    transform: translateY(-5px);
  }
  
  /* Add responsive image placeholders if you don't have images yet */
  img {
    max-height: 400px;
    object-fit: cover;
  }
  </style>