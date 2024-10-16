import { createRouter, createWebHistory } from 'vue-router';
import Booth from './views/Booth.vue';
// import Organizers from './views/Organizers.vue';
// import Events from './views/Events.vue';
// import Contact from './views/Contact.vue';
// import Profile from './views/Profile.vue';
import NotFound from './views/NotFound.vue';

const routes = [
  { path: '/', name: 'Home', component: NotFound },
  { path: '/booths', name: 'Booth', component: Booth },
  { path: '/organizers', name: 'Organizers', component: NotFound },
  { path: '/events', name: 'Events', component: NotFound },
  { path: '/contact', name: 'Contact', component: NotFound },
  { path: '/profile', name: 'Profile', component: NotFound },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;