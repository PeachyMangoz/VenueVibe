<!-- NavBar.vue -->
<template>
    <nav>
      <h1>VenueVibe</h1>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/booths">Booths</router-link></li>
        <li><router-link to="/organizers">Organizers</router-link></li>
        <li><router-link to="/events">Events</router-link></li>
        <li><router-link to="/contact">Contact</router-link></li>
        <li><router-link to="/profile">Profile</router-link></li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'NavBar',
  };
  </script>
  
  <style scoped>
  nav h1 {
    color: #16697a;
    text-align: center;
    margin: 20px 0;
  }
  
  nav ul {
    display: flex;
    list-style-type: none;
    justify-content: space-around;
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    padding: 0;
  }
  
  nav ul li {
    padding: 10px 15px;
  }
  
  nav ul li:hover {
    background-color: #3aafa9;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  