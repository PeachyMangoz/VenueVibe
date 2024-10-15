<template>
    <div class="event-applications">
      <h2>Event Applications</h2>
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="application in applications" :key="application.id">
            <td>{{ application.eventName }}</td>
            <td>{{ application.date }}</td>
            <td>{{ application.status }}</td>
            <td>
              <button @click="viewApplication(application.id)">View</button>
              <button @click="editApplication(application.id)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="createNewApplication">Apply for New Event</button>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { db, auth } from './firebase'
  import { collection, getDocs, query, where } from 'firebase/firestore'
  import { onAuthStateChanged } from 'firebase/auth'
  
  export default {
    name: 'EventApplications',
    setup() {
      const applications = ref([])
      const userId = ref(null)
  
      onMounted(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            userId.value = user.uid
            fetchApplications()
          } else {
            console.log('No user logged in')
          }
        })
      })
  
      const fetchApplications = async () => {
        const q = query(collection(db, 'eventApplications'), where('userId', '==', userId.value))
        const querySnapshot = await getDocs(q)
        applications.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      }
  
      const viewApplication = (id) => {
        // Implement view logic
        console.log('Viewing application', id)
      }
  
      const editApplication = (id) => {
        // Implement edit logic
        console.log('Editing application', id)
      }
  
      const createNewApplication = () => {
        // Implement new application logic
        console.log('Creating new application')
      }
  
      return {
        applications,
        viewApplication,
        editApplication,
        createNewApplication
      }
    }
  }
  </script>
  
  <style scoped>
  .event-applications {
    margin-top: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  button {
    margin-right: 5px;
  }
  </style>