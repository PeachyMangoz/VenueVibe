<template>
  <div id="app">
    <header></header>

    <NavBar />

    <main class="main-content">
      <router-view />
    </main>
    <!-- SORRY I HAVENT ADD ALL THE LINKS -->
    <footer id="footer" class="footer">

<div class="container footer-top">
  <div class="row gy-4">
    <div class="col-lg-4 col-md-6 footer-about">
      <h5 class=" display-6 fw-bold" style="font-weight: 600">Boothy</h5>
      <div class="footer-contact pt-3">
        <p> 81 Victoria St</p>
        <p> Singapore, S188065</p>
        <p class="mt-3"><strong>Phone:</strong> <span>+1 5589 55488 55</span></p>
        <p><strong>Email:</strong> <span>ritz.chong.2022@scis.smu.edu.sg</span></p>
      </div>
      <div class="social-links d-flex mt-4">
        <a href="https://twitter.com/sgSMU"><i class="bi bi-twitter-x"></i></a>
        <a href="https://www.facebook.com/timothy.swee?mibextid=LQQJ4d"><i class="bi bi-facebook"></i></a>
        <a href="https://www.instagram.com/thisisisisshop/"><i class="bi bi-instagram"></i></a>
        <a href="https://www.linkedin.com/in/tasminfoo/"><i class="bi bi-linkedin"></i></a>
      </div>
    </div>

    <div class="col-lg-4 col-md-6 footer-links">
      <h5>Useful Links</h5>
      <ul>
        <li><router-link to="/" class="text-decoration-none text-white">Home</router-link></li>
        <!-- IDK WHAT TO PUT HERE HONESTLY -->
        <li><router-link to="/booths" class="text-decoration-none text-white">Booth Listings</router-link></li>
        <li><router-link to="/eventreviews" class="text-decoration-none text-white">Event Reviews</router-link></li>
        <li><router-link to="/collaborate" class="text-decoration-none text-white">Collaborate</router-link></li>
      </ul>
    </div>

    <div class="col-lg-2 col-md-3 footer-links">
      <h5>Our Services</h5>
      <ul>
        <li><a href="#" class="text-decoration-none text-white">Web Design</a></li>
        <li><a href="#" class="text-decoration-none text-white">Web Development</a></li>
        <li><a href="#" class="text-decoration-none text-white">Product Management</a></li>
        <li><a href="#" class="text-decoration-none text-white">Marketing</a></li>
        <li><a href="#" class="text-decoration-none text-white">Graphic Design</a></li>
      </ul>
    </div>

    <div class="col-lg-4 col-md-12 footer-newsletter">
      <h5>Our Newsletter</h5>
      <p>Subscribe to our newsletter and receive the latest news about our products and services!</p>
      <form action="forms/newsletter.php" method="post" class="php-email-form">
        <div class="newsletter-form"><input type="email" name="email"><input type="submit" value="Subscribe"></div>
        <!-- <div class="loading">Loading</div>
        <div class="error-message"></div>
        <div class="sent-message">Your subscription request has been sent. Thank you!</div> -->
      </form>
    </div>
    <p style="text-align:center;">© 2024 Boothy</p>

  </div>
</div>

</footer>

<!-- Scroll Top -->
<!-- <a href="#" id="scroll-top" class="scroll-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a> -->

<!-- Preloader -->
<div id="preloader"></div>

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
  /* padding: 30px; */
  max-width: 100%;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
  padding-top: 80px; /* Adjust this based on your nav bar height */
}
.footer {
  position: relative; /* Ensure footer is positioned relative to the main content */
  z-index: 10; /* Make sure it appears above the main content */
  color: white; 
  background-color: black;
  padding: 50px 0; /* Changed to vertical padding only */
  width: 100%;
  height: auto; /* Let content determine height */
  min-height: 200px;
  margin-top: 10px;
}

.footer h5{
  color:beige;
    /* margin-bottom: 10px; */
  font-weight: 700;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;  /* Adjust size as needed */
  height: 40px;  /* Adjust size as needed */
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-links a:hover {
  border-color: white;
  background: rgba(255, 255, 255, 0.1);
}

.social-links i {
  font-size: 18px;  /* Adjust icon size as needed */
}

/* .footer .social-media {
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
} */
</style>
