<!-- have yet to to edit the content --> 
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
                <!-- Changed from text-primary to custom-icon-color -->
                <i class="bi bi-people-fill display-4 custom-icon-color mb-3"></i>
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
                <i class="bi bi-graph-up-arrow display-4 custom-icon-color mb-3"></i>
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
                <i class="bi bi-star-fill display-4 custom-icon-color mb-3"></i>
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
                <i class="bi bi-check-circle-fill custom-icon-color me-2"></i>
                Easy-to-use platform for both organizers and businesses
              </li>
              <li class="mb-3">
                <i class="bi bi-check-circle-fill custom-icon-color me-2"></i>
                Verified business profiles and reviews
              </li>
              <li class="mb-3">
                <i class="bi bi-check-circle-fill custom-icon-color me-2"></i>
                Direct communication channels
              </li>
              <li class="mb-3">
                <i class="bi bi-check-circle-fill custom-icon-color me-2"></i>
                Secure booking and payment system
              </li>
            </ul>
          </div>
          <div class="col-md-6" data-aos="fade-left">
          </div>
        </div>
      </div>
  
      <!-- Call to Action -->
      <div class="text-white py-5" style="background-color:#36b598  ;">
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
    name: 'About',
  }
  </script>
  
  <style scoped>
  /* Add your custom icon color */
  .custom-icon-color {
    color: #36b598
  }

  .about-page {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
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