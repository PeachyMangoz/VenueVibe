<template>
  <div class="event-applications">
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <div class="applications-container">
      <div class="header">
        <h2 class="title">Event Applications</h2>
        <button 
          @click="createNewApplication"
          class="create-btn"
          :disabled="loading"
        >
          + Apply for New Event
        </button>
      </div>

      <div v-if="applications.length === 0 && !loading" class="empty-state">
        <p>No applications found. Start by applying for an event!</p>
      </div>

      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="application in sortedApplications" 
                :key="application.id"
                :class="['application-row', application.status.toLowerCase()]">
              <td>{{ application.eventName }}</td>
              <td>{{ formatDate(application.date) }}</td>
              <td>
                <span :class="['status-badge', application.status.toLowerCase()]">
                  {{ application.status }}
                </span>
              </td>
              <td>{{ formatDate(application.updatedAt) }}</td>
              <td class="actions">
                <button 
                  @click="viewApplication(application)"
                  class="action-btn view"
                  :disabled="loading"
                >
                  View
                </button>
                <button 
                  @click="editApplication(application)"
                  class="action-btn edit"
                  :disabled="loading || !isEditable(application)"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selectedApplication" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ selectedApplication.eventName }}</h3>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        <div class="modal-content">
          <div class="detail-item">
            <span class="label">Status:</span>
            <span :class="['status-badge', selectedApplication.status.toLowerCase()]">
              {{ selectedApplication.status }}
            </span>
          </div>
          <div class="detail-item">
            <span class="label">Date:</span>
            <span>{{ formatDate(selectedApplication.date) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Submitted:</span>
            <span>{{ formatDate(selectedApplication.createdAt) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Last Updated:</span>
            <span>{{ formatDate(selectedApplication.updatedAt) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Notes:</span>
            <p>{{ selectedApplication.notes || 'No notes available' }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button 
            v-if="isEditable(selectedApplication)"
            @click="editApplication(selectedApplication)"
            class="edit-btn"
          >
            Edit Application
          </button>
          <button @click="closeModal" class="cancel-btn">Close</button>
        </div>
      </div>
    </div>

    <div v-if="notification" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { db, auth } from './firebase'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'EventApplications',
  setup() {
    const router = useRouter()
    const applications = ref([])
    const loading = ref(false)
    const userId = ref(null)
    const selectedApplication = ref(null)
    const notification = ref(null)

    const sortedApplications = computed(() => {
      return [...applications.value].sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      })
    })

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userId.value = user.uid
          fetchApplications()
        } else {
          showNotification('Please log in to view your applications', 'error')
        }
      })
    })

    const showNotification = (message, type = 'success') => {
      notification.value = { message, type }
      setTimeout(() => {
        notification.value = null
      }, 3000)
    }

    const fetchApplications = async () => {
      loading.value = true
      try {
        const q = query(
          collection(db, 'eventApplications'),
          where('userId', '==', userId.value),
          orderBy('updatedAt', 'desc')
        )
        const querySnapshot = await getDocs(q)
        applications.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        console.error('Error fetching applications:', error)
        showNotification('Failed to load applications', 'error')
      } finally {
        loading.value = false
      }
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const isEditable = (application) => {
      return ['DRAFT', 'PENDING'].includes(application.status)
    }

    const viewApplication = (application) => {
      selectedApplication.value = application
    }

    const editApplication = (application) => {
      if (!isEditable(application)) {
        showNotification('This application cannot be edited', 'error')
        return
      }
      router.push(`/applications/${application.id}/edit`)
    }

    const createNewApplication = () => {
      router.push('/applications/new')
    }

    const closeModal = () => {
      selectedApplication.value = null
    }

    return {
      applications,
      sortedApplications,
      loading,
      selectedApplication,
      notification,
      formatDate,
      viewApplication,
      editApplication,
      createNewApplication,
      closeModal,
      isEditable
    }
  }
}
</script>

<style scoped>
.event-applications {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.applications-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.create-btn {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-btn:hover {
  background: #45a049;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: #444;
}

.application-row {
  transition: background-color 0.2s;
}

.application-row:hover {
  background: #f5f5f5;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.draft {
  background: #e3f2fd;
  color: #1976d2;
}

.status-badge.pending {
  background: #fff3e0;
  color: #f57c00;
}

.status-badge.approved {
  background: #e8f5e9;
  color: #388e3c;
}

.status-badge.rejected {
  background: #ffebee;
  color: #d32f2f;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn.view {
  background: #2196F3;
  color: white;
}

.action-btn.view:hover {
  background: #1976D2;
}

.action-btn.edit {
  background: #FF9800;
  color: white;
}

.action-btn.edit:hover {
  background: #F57C00;
}

.action-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
}

.modal-content {
  padding: 16px;
}

.detail-item {
  margin-bottom: 16px;
}

.detail-item .label {
  font-weight: 500;
  color: #666;
  margin-right: 8px;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.edit-btn {
  padding: 8px 16px;
  background: #FF9800;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  padding: 8px 16px;
  background: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background: #4CAF50;
}

.notification.error {
  background: #f44336;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>