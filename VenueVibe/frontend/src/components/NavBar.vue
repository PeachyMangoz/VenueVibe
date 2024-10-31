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
          <li class="nav-item" v-for="link in regularLinks" :key="link.name">
            <router-link class="nav-link" :to="link.path">{{ link.name }}</router-link>
          </li>
          
          <!-- Profile Dropdown -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" 
               href="#" 
               id="profilesDropdown" 
               role="button" 
               data-bs-toggle="dropdown" 
               aria-expanded="false">
              Profiles
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
            </ul>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      regularLinks: [
        { name: 'Home', path: '/' },
        { name: 'Apply', path: '/eventapplications' },
        { name: 'Booths', path: '/booths' },
        { name: 'Event Reviews', path: '/eventreviews' },
        { name: 'Collaborate', path: '/collaborate' },
        { name: 'About', path: '/about' },
        { name: 'Payments', path: '/payments'}
      ],
    };
  },
};
</script>

<style scoped>
.navbar {
  padding: 20px;
  background-color: white;
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