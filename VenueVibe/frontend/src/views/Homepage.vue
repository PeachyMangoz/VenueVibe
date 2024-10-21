<template>
    <div>
        <!-- Splash Screen -->
        <div id="splash-screen">
            <div class="animated-text">Welcome to <span style="color:#36b598;">Boothy</span></div>
        </div>

        <!-- Navbar -->
        <NavBar />

        <!-- Banner Section -->
        <div class="container-fluid p-0 d-none d-md-block" id="imgBanner">
            <div class="position-relative">
                <img src="../images/img1.png" class="img-fluid w-100" alt="Banner Image">
                <div class="centered-text">
                    Boothy
                </div>
            </div>
        </div>

        <!-- Main Content Section -->
        <div class="container mt-5 main-content">
            <div class="main-banner">
                <h2>WHERE TO BOOTH FOR CREATORS?</h2>
                <p>From bustling street markets to upscale fairs, artists can find a variety of spaces...</p>
                <a href="#" class="btn btn-light mt-3">READ MORE</a>
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
</template>

<script>
export default {
    name: 'HomePage',
    mounted() {
        // Splash screen hide logic
        setTimeout(() => {
            const splashScreen = document.getElementById('splash-screen');
            if (splashScreen) {
                splashScreen.classList.add('splash-hidden');
                document.body.style.overflow = 'auto';
            }
        }, 3000);
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
    margin-left: -30px;
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

#imgBanner img {
    filter: grayscale(100%);

}

.position-relative {
    position: relative;
}

.centered-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #36b598;
    ;
    /* Adjust color for contrast */
    font-size: 5rem;
    font-weight: bold;
    text-align: center;
    width: 100%;
}
</style>