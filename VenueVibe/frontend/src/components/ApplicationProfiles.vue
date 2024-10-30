<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <h2 class="text-2xl font-bold">Application Profiles</h2>

    <div class="space-y-4">
      <div v-for="profile in applicationProfiles" 
           :key="profile.id" 
           class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <h3 class="text-xl font-semibold">{{ profile.name }}</h3>
              <p class="text-gray-600">{{ profile.description }}</p>
              <p class="text-sm">
                <span class="font-medium">Focus:</span> {{ profile.focus }}
              </p>
            </div>
            <div class="space-x-2">
              <button @click="editProfile(profile.id)"
                      class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Edit
              </button>
              <button @click="deleteProfile(profile.id)"
                      class="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button @click="showNewProfileForm = true"
            class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
      Create New Application Profile
    </button>

    <div v-if="showNewProfileForm" 
         class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6">
        <h3 class="text-lg font-semibold mb-4">
          {{ editingProfileId ? 'Edit' : 'Create New' }} Application Profile
        </h3>
        <div class="space-y-4">
          <div class="space-y-2">
            <input v-model="newProfile.name" 
                   placeholder="Profile Name"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            
            <textarea v-model="newProfile.description" 
                      placeholder="Profile Description"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]">
            </textarea>
            
            <input v-model="newProfile.focus" 
                   placeholder="Profile Focus"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div class="flex justify-end space-x-2">
            <button @click="cancelEdit"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button @click="saveProfile"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
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
import { db, auth } from './firebase'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

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

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userId.value = user.uid
          fetchApplicationProfiles()
        } else {
          console.log('No user logged in')
        }
      })
    })

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

<style scoped>
</style>