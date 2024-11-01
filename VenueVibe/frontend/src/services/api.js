import axios from 'axios';

const boothAPI = axios.create({
  baseURL: 'http://34.31.89.5:8081', // Booth Listing service URL
});

// const eventAPI = axios.create({
//   baseURL: 'http://localhost:8081', // Event service URL
// });

// const businessAPI = axios.create({
//   baseURL: 'http://localhost:8082', // Business profile service URL
// });

// export { boothAPI, eventAPI, businessAPI };

export {boothAPI};