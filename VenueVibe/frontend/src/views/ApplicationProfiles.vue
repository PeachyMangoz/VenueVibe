<template>
  <div class="container py-5">
    <h2 class="h3 mb-4">Application Profiles</h2>

    <div class="row g-4 mb-4">
      <div v-for="profile in applicationProfiles" 
           :key="profile.id" 
           class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h3 class="h5 mb-2">{{ profile.name }}</h3>
                <p class="text-muted mb-2">{{ profile.description }}</p>
                <p class="small">
                  <span class="fw-semibold">Focus:</span> {{ profile.focus }}
                </p>
              </div>
              <div class="btn-group">
                <button @click="editProfile(profile.id)"
                        class="btn btn-outline-secondary btn-sm">
                  Edit
                </button>
                <button @click="deleteProfile(profile.id)"
                        class="btn btn-danger btn-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button @click="showNewProfileForm = true"
            class="btn btn-primary w-100 mb-4">
      Create New Application Profile
    </button>

    <div v-if="showNewProfileForm" 
         class="card mt-4">
      <div class="card-body">
        <h3 class="h5 mb-4">
          {{ editingProfileId ? 'Edit' : 'Create New' }} Application Profile
        </h3>
        <div class="mb-4">
          <div class="mb-3">
            <input v-model="newProfile.name" 
                   placeholder="Profile Name"
                   class="form-control mb-3">
            
            <textarea v-model="newProfile.description" 
                      placeholder="Profile Description"
                      class="form-control mb-3"
                      style="min-height: 100px;">
            </textarea>
            
            <input v-model="newProfile.focus" 
                   placeholder="Profile Focus"
                   class="form-control">
          </div>
          
          <div class="d-flex justify-content-end gap-2">
            <button @click="cancelEdit"
                    class="btn btn-outline-secondary">
              Cancel
            </button>
            <button @click="saveProfile"
                    class="btn btn-primary">
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'

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

    const fetchApplicationProfiles = async () => {
      const querySnapshot = await getDocs(collection(db, 'businessProfiles', userId.value, 'applicationProfiles'))
      applicationProfiles.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }

    const saveProfile = async () => {
      try {
        if (editingProfileId.value) {
          await updateDoc(doc(db, 'businessProfiles', userId.value, 'applicationProfiles', editingProfileId.value), newProfile)
        } else {
          await addDoc(collection(db, 'businessProfiles', userId.value, 'applicationProfiles'), newProfile)
        }
        showNewProfileForm.value = false
        editingProfileId.value = null
        Object.assign(newProfile, { name: '', description: '', focus: '' })
        fetchApplicationProfiles()
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

    const deleteProfile = async (id) => {
      try {
        await deleteDoc(doc(db, 'businessProfiles', userId.value, 'applicationProfiles', id))
        fetchApplicationProfiles()
      } catch (error) {
        console.error("Error deleting profile: ", error)
      }
    }

    const cancelEdit = () => {
      showNewProfileForm.value = false
      editingProfileId.value = null
      Object.assign(newProfile, { name: '', description: '', focus: '' })
    }

    return {
      applicationProfiles,
      showNewProfileForm,
      newProfile,
      saveProfile,
      editProfile,
      deleteProfile,
      cancelEdit,
      editingProfileId
    }
  }
}
</script>