<template>
    <div>
        <!-- Splash Screen -->
        <div id="splash-screen">
            <div class="animated-text">Welcome to <span class="fw-bold" style="color:#36b598;">Boothy</span></div>
        </div>

        <!-- Navbar -->
        <NavBar />

        <!-- Banner Section -->
    <div class="wrapper">
    <div class="left"></div>
    <div class="right"></div>

        <div class="container-fluid p-0 d-none d-md-block" id="imgBanner">
            <div class="position-relative">
                <img src="../images/img1.png" class="img-fluid w-100" alt="Banner Image">
                <div class="centered-text " style="color:white;">
                    <!-- Split "Boothy" into individual spans for animation -->
                    <span class="letter">B</span>
                    <span class="letter">o</span>
                    <span class="letter">o</span>
                    <span class="letter">t</span>
                    <span class="letter">h</span>
                    <span class="letter">y</span>
                </div>
            </div>
        </div>

        <!-- Main Content Section -->
        <div class="container mt-5 main-content">
            <div class="main-banner">
                <h2>WHERE TO BOOTH FOR CREATORS?</h2>
                <p>From bustling street markets to upscale fairs, find the right spaces to showcase your work and the right people to do it with. Find the right customers, maximise your space, and ensure a smooth experience at every event. Make each market or fair a success and unlock new opportunities for your business.</p>
                <router-link to="/login" class="btn btn-light mt-3">Log in</router-link>
            </div>

            <!-- Carousel Section -->
            <div id="eventCardsCarousel" class="carousel slide mt-5" data-bs-ride="carousel">
  <div class="carousel-inner">
      <!-- First slide -->
      <div class="carousel-item active">
          <div class="col-8 mx-auto">
              <div class="card event-card">
                  <img src="../images/img4.png" alt="Event Image">
                  <p>The Epitome Pushcarts By INVADE</p>
              </div>
          </div>
      </div>
      <!-- Second slide -->
      <div class="carousel-item">
          <div class="col-8 mx-auto">
              <div class="card event-card">
                  <img src="../images/img2.png" alt="Event Image">
                  <p>Merry Makers Market @FoundryArtCentre</p>
              </div>
          </div>
      </div>
      <!-- Third slide -->
      <div class="carousel-item">
          <div class="col-8 mx-auto">
              <div class="card event-card">
                  <img src="../images/img5.png" alt="Event Image">
                  <p>Night At Orchard By INVADE</p>
              </div>
          </div>
      </div>
  </div>
                <!-- Carousel Controls -->
                <button class="carousel-control-prev" type="button" data-bs-target="#eventCardsCarousel"
                    data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#eventCardsCarousel"
                    data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    </div>
</div>
</template>

<script>

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default {
  name: 'HomePage',
  mounted() {
    // Initially lock scrolling
    document.body.style.overflow = 'hidden';

    // Splash screen hide logic
    setTimeout(() => {
      const splashScreen = document.getElementById('splash-screen');
      if (splashScreen) {
        splashScreen.classList.add('splash-hidden');
        // Unlock scrolling after splash screen is hidden
        document.body.style.overflow = 'auto';

        // GSAP animation sequence
        const timeline = gsap.timeline();

        // Animate the left and right divs
        timeline.to('.left', {
          duration: 1, // Duration of 2 seconds
          width: '50%', // Animate to 50% width
          ease: "power2.inOut", // Smooth easing
        }, 0.5); // Start after 0.8 seconds

        timeline.to('.right', {
          duration: 1, // Duration of 2 seconds
          width: '50%', // Animate to 50% width
          ease: "power3.inOut", // Smooth easing
        }, 0.4); // Start after 0.6 seconds

        // Animate the banner image sliding in from the left
        timeline.fromTo('#imgBanner img', {
          x: '-100%', // Initial state: off-screen on the left
        }, {
          x: '0%', // Final state: in its original position
          duration: 1.5, // Duration of 2 seconds
          ease: "power2.inOut", // Smooth easing
        });

                // Animate the main-banner sliding in from the left
                timeline.fromTo('.main-banner', {
          x: '120%', // Initial state: off-screen on the left
        }, {
          x: '0%', // Final state: in its original position
          duration: 1.5, // Duration of 1 second
          ease: "power2.inOut", // Smooth easing
        }, "<"); // Start this animation simultaneously with the end of the imgBanner animation
        

        // Animate the letters after the banner image has appeared
        timeline.fromTo(
          ".letter", // Select all elements with class "letter"
          { opacity: 0, y: 50 }, // Initial state: invisible and below the position
          {
            opacity: 1, // Final state: fully visible
            y: 0, // Move to the original position
            duration: 0.5, // Duration of 1 second per letter
            stagger: 0.1, // Stagger effect: delay each letter by 0.1 second
            ease: "power2.out", // Easing effect for smooth animation
          }
        );
       
    }
    }, 3000); // 3 seconds delay for the splash screen to disappear
  }
};

</script>

<style scoped>
/* Add your styles here, copied from splash.css, vv.css, or directly from the HTML */
/* General Reset */
body,
html {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: 'Arial', sans-serif;
    /* Prevents scrolling during the animation */
}

/* Splash Screen Style */
#splash-screen {
    position: fixed;
    width: 100%;
    height: 100vh;
    background-color: #1a1a1a;
    /* Dark background */
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 2rem;
    z-index: 10;
    transition: all 0.5s ease-in-out;
}

/* Text Animation */
.animated-text {
    opacity: 0;
    animation: fadeInOut 3s ease-in-out;
    animation-fill-mode: forwards;
}

@keyframes fadeInOut {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

/* Splash Screen Hide Animation */
.splash-hidden {
    transform: translateY(-100%);
    /* Slide up effect */
    opacity: 0;
}

/* Main Content Style */
#main-content {
    opacity: 0;
    transition: opacity 1s ease-in-out;
}

.main-visible {
    opacity: 1;
}

/*vv.css*/
body {
    background-color: #f0f4f8;
    position: relative;
}

.header {
    background-color: white;
    padding: 20px;
    text-align: center;
}

.header h1 {
    color: #36b598;
}

.main-banner {
    background-color: #382a3e;
    color: white;
    text-align: center;
    padding: 50px 20px;
    border-radius: 15px;
    position: relative;
    overflow: hidden;
}

.main-banner h2 {
    font-size: 2rem;
    font-weight: bold;
}

.main-banner p {
    margin-top: 15px;
    font-size: 1.1rem;
}

.main-banner::before {
    content: '';
    position: absolute;
    top: -100px;
    right: -100px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
    border-radius: 50%;
    z-index: 1;
}

.main-banner::after {
    content: '';
    position: absolute;
    bottom: -150px;
    left: -150px;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
    border-radius: 50%;
    z-index: 1;
}

.event-card {
    border-radius: 15px;
    align-items: center;
    overflow: hidden;
}

.event-card img {
    width: 800px;
    height: 400px;
    object-fit: cover;
}

.event-card p {
    margin-top: 10px;
    text-align: center;
    font-weight: bold;
}

@keyframes fade-in {
    to {
        scale: 1;
        opacity: 1;
    }
}

@keyframes fade-out {
    25% {
        opacity: 1
    }

    50% {
        filter: blur(1px)
    }

    75%,
    100% {
        opacity: 0;
        scale: 1;
        filter: blur(1px)
    }
}

#eventCardsCarousel {
    scale: .8;
    opacity: 0;
    animation: fade-in linear forwards;
    animation-timeline: view();
    animation-range: entry 200px;
}

#imgBanner {
    animation: fade-out linear;
    animation-timeline: view();
    animation-range: exit;
}

/* #imgBanner img {
    filter: grayscale(50%);

} */

.position-relative {
    position: relative;
}

.centered-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #36b598;
    font-size: 5rem;
    font-weight: bold;
    text-align: center;
    width: 100%;
}

.letter {
    display: inline-block;
    opacity: 0; /* Set initial opacity to 0 for GSAP animation */
}

.left,
.right {
  position: fixed;   /* Make the divs fixed to the viewport */
  top: 0;
  height: 100vh;     /* Full viewport height */
  z-index: -1;       /* Ensure they stay behind other content */
}

.left {
  background: #36b598;
  left: 0%;
  width: 0%;
}

.right {
  background: #191921;
  right: 0%;
  width: 100%;
}
</style>

<style>
.main-content[data-v-7ba5bd90] {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 30px;
    max-width: 100%;
    margin: 0 auto;
    font-family: 'Roboto', sans-serif;
    padding-top: 80px;
    padding-bottom: 80px;
}

</style>