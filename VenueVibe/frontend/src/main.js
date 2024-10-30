// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Bootstrap imports
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// Font Awesome imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Add icons to the library
library.add(fas, far, fab);


const app = createApp(App);
app.use(router);

// Register Font Awesome component globally
// You can use either 'fa' or 'font-awesome-icon' as the component name
app.component('fa', FontAwesomeIcon);
app.component('font-awesome-icon', FontAwesomeIcon); // Optional: register with full name too

app.mount('#app');