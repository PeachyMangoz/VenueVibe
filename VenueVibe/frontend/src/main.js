// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialize AOS ( for animation )
AOS.init({
  // Global settings:
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  mirror: false
});

createApp(App).use(router).mount('#app');
