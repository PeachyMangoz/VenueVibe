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
          <li class="nav-item" v-for="link in navLinks" :key="link.name">
            <router-link class="nav-link" :to="link.path">{{ link.name }}</router-link>
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
      navLinks: [
        { name: 'Home', path: '/' },
        { name: "Apply", path: '/apply' },
        { name: 'Booths', path: '/booths' },
        { name: 'Event Reviews', path: '/eventreviews' },
        { name: 'Collaborate', path: '/collaborate' },
        { name: 'Login', path: '/login' },
      ],
    };
  },
};
</script>

<style scoped>

.navbar {
  padding: 20px;
}

.navbar-brand {
  color: rgb(54, 181, 152) !important;
  font-weight: bold;
}

.nav-link {
  color: #000 !important;
  margin-left: 15px;
}

.nav-link:hover {
  color: #3aafa9 !important;
  font-weight: bold;
}

@media (max-width: 992px) {
  .nav-link {
    margin-left: 0;
    padding: 10px 15px;
  }
}
</style>
