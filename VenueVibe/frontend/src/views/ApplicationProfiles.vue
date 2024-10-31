<template>
  <div class="container section-title" data-aos="fade-up">
    <h2>
      <div class="title-with-lines">
        <span class="line"></span>
        Application Profiles
        <span class="line"></span>
      </div>
    </h2>
  </div>

  <div class="container py-5">

    <button @click="showNewProfileForm = true"
            class="btn btn-primary w-100 mb-4"
            v-if="!showNewProfileForm">
      Create New Application Profile
    </button>

    <div v-if="showNewProfileForm" 
         class="card mb-4 shadow-sm">
      <div class="card-body">
        <h3 class="h5 mb-4">
          {{ editingProfileId ? 'Edit' : 'Create New' }} Application Profile
        </h3>
        <div class="mb-4">
          <div class="mb-3">
            <label class="form-label">Profile Name</label>
            <input v-model="newProfile.name" 
                   placeholder="Enter profile name"
                   class="form-control mb-3"
                   required>
            
            <label class="form-label">Profile Description</label>
            <textarea v-model="newProfile.description" 
                      placeholder="Enter profile description"
                      class="form-control mb-3"
                      style="min-height: 100px;"
                      required>
            </textarea>
            
            <label class="form-label">Profile Focus</label>
            <input v-model="newProfile.focus" 
                   placeholder="Enter profile focus"
                   class="form-control"
                   required>
          </div>
          
          <div class="d-flex justify-content-end gap-2">
            <button @click="cancelEdit"
                    class="btn btn-outline-secondary">
              Cancel
            </button>
            <button @click="saveProfile"
                    class="btn btn-primary"
                    :disabled="!isFormValid">
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="profiles-list">
      <h3 class="h4 mb-4" v-if="applicationProfiles.length > 0">Your Profiles</h3>
      
      <div class="row g-4">
        <div v-for="profile in applicationProfiles" 
             :key="profile.id" 
             class="col-12">
          <div class="card shadow-sm hover-shadow">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div class="profile-info flex-grow-1">
                  <div class="d-flex justify-content-between">
                    <h4 class="h5 mb-3">{{ profile.name }}</h4>
                    <span class="text-muted small">
                      Created: {{ formatDate(profile.createdAt) }}
                    </span>
                  </div>
                  <p class="text-muted mb-2">{{ profile.description }}</p>
                  <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-primary-subtle text-primary">
                      Focus: {{ profile.focus }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="profile-actions mt-3 d-flex justify-content-end gap-2">
                <button @click="editProfile(profile.id)"
                        class="btn btn-outline-primary btn-sm">
                  Edit
                </button>
                <button @click="confirmDelete(profile.id)"
                        class="btn btn-outline-danger btn-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="applicationProfiles.length === 0" 
           class="text-center py-5 text-muted">
        <p>No application profiles created yet. Create your first profile to get started!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'

export default {
  name: 'ApplicationProfiles',
  setup() {
    const applicationProfiles = ref([])
    const showNewProfileForm = ref(false)
    const newProfile = reactive({
      name: '',
      description: '',
      focus: '',
    })
    const userId = ref(null) 
    const editingProfileId = ref(null)

    const isFormValid = computed(() => {
      return newProfile.name.trim() && 
             newProfile.description.trim() && 
             newProfile.focus.trim()
    })

    const fetchApplicationProfiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'businessProfiles', userId.value, 'applicationProfiles'))
        applicationProfiles.value = querySnapshot.docs
          .map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date() 
          }))
          .sort((a, b) => b.createdAt - a.createdAt)
      } catch (error) {
        console.error("Error fetching profiles: ", error)
      }
    }

    const saveProfile = async () => {
      try {
        const profileData = {
          ...newProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }

        if (editingProfileId.value) {
          await updateDoc(
            doc(db, 'businessProfiles', userId.value, 'applicationProfiles', editingProfileId.value), 
            profileData
          )
        } else {
          await addDoc(
            collection(db, 'businessProfiles', userId.value, 'applicationProfiles'), 
            profileData
          )
        }
        
        showNewProfileForm.value = false
        editingProfileId.value = null
        Object.assign(newProfile, { name: '', description: '', focus: '' })
        await fetchApplicationProfiles()
      } catch (error) {
        console.error("Error saving profile: ", error)
      }
    }

    const editProfile = (id) => {
      const profile = applicationProfiles.value.find(p => p.id === id)
      if (profile) {
        Object.assign(newProfile, profile)
        editingProfileId.value = id
        showNewProfileForm.value = true
      }
    }

    const confirmDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this profile?')) {
        await deleteProfile(id)
      }
    }

    const deleteProfile = async (id) => {
      try {
        await deleteDoc(doc(db, 'businessProfiles', userId.value, 'applicationProfiles', id))
        await fetchApplicationProfiles()
      } catch (error) {
        console.error("Error deleting profile: ", error)
      }
    }

    const cancelEdit = () => {
      showNewProfileForm.value = false
      editingProfileId.value = null
      Object.assign(newProfile, { name: '', description: '', focus: '' })
    }

    const formatDate = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    onMounted(() => {
      userId.value = 'testUser' 
      fetchApplicationProfiles()
    })

    return {
      applicationProfiles,
      showNewProfileForm,
      newProfile,
      isFormValid,
      saveProfile,
      editProfile,
      deleteProfile,
      confirmDelete,
      cancelEdit,
      editingProfileId,
      formatDate
    }
  }
}
</script>

<style scoped>
.hover-shadow {
  transition: box-shadow 0.3s ease;
}

.hover-shadow:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.badge {
  padding: 0.5em 1em;
}

.profiles-list {
  margin-top: 2rem;
}

.profile-info {
  padding-right: 1rem;
}

.profile-actions {
  border-top: 1px solid #eee;
  padding-top: 1rem;
}
.section-title {
  text-align: center;
  margin-bottom: 50px;
  padding: 30px 0;
}

.section-title h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
}

.title-with-lines {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.line {
  width: 70px;
  height: 3px;
  background: #36b598;
  display: inline-block;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  animation: fadeIn 1.5s;
}

</style>