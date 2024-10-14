<template>
  <div class="search-bar">
    <input type="text" placeholder="Search for booths..." v-model="searchQuery" />
    <button @click="searchBooths">Search</button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      searchQuery: ''
    };
  },
  methods: {
    searchBooths() {
      // Add search functionality logic here
      console.log('Searching for: ', this.searchQuery);
    }
  }
};
</script>

<style scoped>
.search-bar {
  background-color: #82c0cc;
  padding: 15px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

input {
  padding: 10px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #489fb5;
}

button {
  background-color: #ffa62b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #e68a19;
}
</style>
