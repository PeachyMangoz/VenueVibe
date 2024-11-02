<template>
  <nav class="navbar navbar-expand-lg navbar-transparent fixed-top">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Boothy</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item" v-for="link in loggedOutLinks" :key="link.name" v-if="!isLoggedIn">
            <router-link class="nav-link" :to="link.path">{{ link.name }}</router-link>
          </li>
          <li class="nav-item" v-for="link in loggedInLinks" :key="link.name" v-if="isLoggedIn">
            <router-link class="nav-link" :to="link.path">{{ link.name }}</router-link>
          </li>
          
          <!-- Profile Dropdown -->
          <!-- Profile Dropdown for logged-in users -->
          <li class="nav-item dropdown" v-if="isLoggedIn">
            <a class="nav-link dropdown-toggle" 
               href="#" 
               id="profilesDropdown" 
               role="button" 
               data-bs-toggle="dropdown" 
               aria-expanded="false">
              {{ user.data.displayName || 'Profile' }} <!-- Display user's name or 'Profile' -->
            </a>
            <ul class="dropdown-menu" aria-labelledby="profilesDropdown">
              <li>
                <router-link class="dropdown-item" to="/businessprofile">
                  Business Profile
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/applicationprofiles">
                  Application Profiles
                </router-link>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="logout">Logout</a>
              </li>
            </ul>
          </li>

          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'NavBar',
  computed: {
    ...mapGetters(['user']), // Access the user getter
    isLoggedIn() {
      return this.user.loggedIn; // Determine if the user is logged in
    }
  },
  data() {
    return {
      loggedOutLinks: [
        { name: 'Home', path: '/' },
        { name: 'Booths', path: '/booths' },
        { name: 'Event Reviews', path: '/eventreviews' },
        { name: 'About', path: '/about' },
      ],
      loggedInLinks: [
        { name: 'Home', path: '/' },
        { name: 'Apply', path: '/eventapplications' },
        { name: 'Booths', path: '/booths' },
        { name: 'Event Reviews', path: '/eventreviews' },
        { name: 'Collaborate', path: '/collaborate' },
        { name: 'About', path: '/about' },
        { name: 'Payments', path: '/payments'}
      ]
    };
  },
  methods: {
    logout() {
      // Here you would typically commit a Vuex action to log out the user
      // For example:
      this.$store.commit('SET_LOGGED_IN', false);
      this.$store.commit('SET_USER', null);
      // Optionally redirect to the login page or home
      this.$router.push('/'); // Redirect to the login page
    }
  },
};
</script>

<style scoped>
.navbar {
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
}

.navbar-brand {
  color: rgb(54, 181, 152) !important;
  font-weight: bold;
}

.nav-link {
  color: #000 !important;
  margin-left: 15px;
}

.nav-link:hover, 
.dropdown-item:hover {
  color: #3aafa9 !important;
  font-weight: bold;
}

.dropdown-menu {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.dropdown-item {
  padding: 8px 20px;
  color: #000;
}

@media (max-width: 992px) {
  .nav-link {
    margin-left: 0;
    padding: 10px 15px;
  }
  
  .dropdown-menu {
    border: none;
    box-shadow: none;
    padding-left: 20px;
  }
}
</style>