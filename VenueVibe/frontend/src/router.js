import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Homepage.vue';
import Booth from './views/Booth.vue';
import BoothDetails from './views/BoothDetails.vue';
import EventReview from './views/EventReview.vue';
// import Organizers from './views/Organizers.vue';
// import Events from './views/Events.vue';
// import Contact from './views/Contact.vue';
// import Profile from './views/Profile.vue';
import About from './views/About.vue';
import NotFound from './views/NotFound.vue';
import Collaboration from './views/Collaboration.vue';
import Login from './views/Login.vue';
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/apply', name: 'Apply', component: NotFound },
  { path: '/booths/:id', name: 'booth-details', component: BoothDetails, props: true},
  { path: '/booths', name: 'Booth', component: Booth },
  { path: '/eventreviews', name: 'Events', component: EventReview },
  { path: '/forum', name: 'Forum', component: NotFound },
  { path: '/collaborate', name: 'Collaborate', component: Collaboration},
  { path: '/about', name:'About', component: About },
  { path: '/login', name: 'Login', component: Login },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
