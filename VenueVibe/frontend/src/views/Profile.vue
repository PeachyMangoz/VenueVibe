<template>
<body>
    <div class="container.fluid py-4 mx-3">
      <div class="row">
        <!-- Profile Photo Column -->
        <div class="col-lg-2 text-center">
          <img
            :src="profileImageUrl || 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg'"
            class="rounded-circle mb-4"
            alt="Profile photo"
            width="150px"
            height="150px"
            style="object-fit: cover;"
          />
          <input type="file" @change="uploadProfileImage" accept="image/*" class="form-control mt-3" />
          <h3 style="color:white" class="mb-0">{{ username }}</h3>
          <!-- <p class="text-muted">{{ email }}</p> -->
        </div>
  
        <!-- Main Form Column -->
        <div class="col-lg-6 mt-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title mb-4">Profile Settings</h5>
              <form @submit.prevent="updateProfile">
                <!-- Business Name -->
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input
                    v-model="email"
                    type="text"
                    class="form-control"
                    placeholder="Enter Name of Your Business"
                    required
                    disabled
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Business Name</label>
                  <input
                    v-model="business_name"
                    type="text"
                    class="form-control"
                    placeholder="Enter Name of Your Business"
                    required
                  />
                </div>
  
                <!-- Profile Type Toggle -->
                <div class="mb-3">
                  <label class="form-label">Profile Type</label>
                  <div class="toggle-switch">
                    <input
                      type="checkbox"
                      id="roleToggle"
                      v-model="isCreator"
                      class="toggle-input"
                    />
                    <label for="roleToggle" class="toggle-label">
                      <span class="toggle-text left">Creator</span>
                      <span class="toggle-text right">Organiser</span>
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
  
                <!-- Links -->
                <div class="mb-3">
                  <label class="form-label">Website Link</label>
                  <input
                    v-model="website_link"
                    type="text"
                    class="form-control"
                    placeholder="Enter Link to Your Website"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Portfolio Link</label>
                  <input
                    v-model="portfolio_link"
                    type="text"
                    class="form-control"
                    placeholder="Enter Link to Your Portfolio"
                  />
                </div>
  
                <!-- Business Bio -->
                <div class="mb-3">
                  <label class="form-label">Business Bio</label>
                  <textarea
                    v-model="bio"
                    class="form-control"
                    placeholder="Enter Your Bio"
                    rows="4"
                  ></textarea>
                </div>
  
                <div class="text-center">
                  <button type="submit" class="btn btn-primary">Save Profile</button>
                </div>
              </form>
            </div>
          </div>
        </div>
  
        <!-- Additional Profile Columns -->
        <div class="col-lg-4 mt-4">
          <div class="row">
            <!-- Business Profiles Box -->
            <div class="col-6 col-lg-12 mb-4">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title mb-0">Business Profiles</h5>
                    <button class="btn btn-sm btn-outline-primary">
                      <i class="fa fa-plus"></i> Add
                    </button>
                  </div>
                  <div class="mb-3">
                    <span>Profiles:</span>
                  </div>
                  <div class="mb-3">
                    <span>Additional Details:</span>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Application Profiles Box -->
            <div class="col-6 col-lg-12 mb-4">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title mb-0">Application Profiles</h5>
                    <button class="btn btn-sm btn-outline-primary">
                      <i class="fa fa-plus"></i> Add
                    </button>
                  </div>
                  <div class="mb-3">
                    <span>Profiles:</span>
                  </div>
                  <div class="mb-3">
                    <span>Additional Details:</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </body>
  </template>
  
<script>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as necessary
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage imports

export default {
  setup() {
    const auth = getAuth();
    const user = auth.currentUser;
    const storage = getStorage();

    const username = ref('');
    const email = ref('');
    const bio = ref('');
    const business_name = ref('');
    const website_link = ref('');
    const portfolio_link = ref('');
    const isCreator = ref(true); // Default to 'creator' profile type
    const profileImageUrl = ref(''); // Reactive variable for profile image URL

    // Fetch user data from Firestore
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'user', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          username.value = userData.username || '';
          email.value = userData.email || '';
          bio.value = userData.bio || '';
          business_name.value = userData.business_name || '';
          website_link.value = userData.website_link || '';
          portfolio_link.value = userData.portfolio_link || '';
          isCreator.value = userData.profile_type === 'creator';
          profileImageUrl.value = userData.profile_image || ''; // Set profile image URL
        }
      }
    };

    // Update user profile in Firestore
    const updateProfile = async () => {
      if (user) {
        await setDoc(doc(db, 'user', user.uid), {
          bio: bio.value,
          business_name: business_name.value,
          profile_type: isCreator.value ? 'organiser' : 'creator',
          website_link: website_link.value,
          portfolio_link: portfolio_link.value,
        }, { merge: true }); // Merge to update specific fields

        alert('Profile updated successfully!');
      }
    };

    // Upload profile image to Firebase Storage
    const uploadProfileImage = async (event) => {
      const file = event.target.files[0];
      if (file && user) {
        const storagePath = `profile_images/${user.uid}/${file.name}`;
        const fileRef = storageRef(storage, storagePath);

        try {
          // Upload the file to Firebase Storage
          await uploadBytes(fileRef, file);
          console.log('File uploaded successfully!');

          // Get the download URL of the uploaded image
          const downloadUrl = await getDownloadURL(fileRef);

          // Save the image URL to Firestore under the 'profile_image' field
          await setDoc(doc(db, 'user', user.uid), {
            profile_image: downloadUrl,
          }, { merge: true });

          // Update the profile image URL in the UI
          profileImageUrl.value = downloadUrl;
        } catch (error) {
          console.error('Error uploading profile image:', error);
        }
      }
    };

    // Fetch user data when component is mounted
    onMounted(() => {
      fetchUserData();
    });

    return {
      username,
      email,
      bio,
      business_name,
      website_link,
      portfolio_link,
      isCreator,
      updateProfile,
      uploadProfileImage,
      profileImageUrl,
    };
  },
};

</script>
  
  <style scoped>

  body {
    background: #36b598;
  }
  
  img {
    width: 150px;
    height: 150px;
    object-fit: cover;
  }
  
  .form-control:focus {
    box-shadow: none;
    border-color: #36b598;
  }
  
  .labels {
    font-size: 11px;
  }
  
  .toggle-switch {
    position: relative;
    width: auto;
    height: 40px;
  }
  
  .toggle-input {
    display: none;
  }
  
  .toggle-label {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    background-color: #e0e0e0;
    border-radius: 20px;
    cursor: pointer;
  }
  
  .toggle-slider {
    position: absolute;
    width: 50%;
    height: 100%;
    background-color: #007bff;
    opacity: 50%;
    border-radius: 20px;
    transition: 0.3s;
  }
  
  .toggle-text {
    position: absolute;
    width: 50%;
    line-height: 40px;
    text-align: center;
    font-weight: bold;
    z-index: 2;
  }
  
  .toggle-text.left {
    left: 0;
    color: black;
  }
  
  .toggle-text.right {
    right: 0;
    color: grey;
  }
  
  .toggle-input:checked + .toggle-label .toggle-slider {
    left: 50%;
    background-color: #28a745;
    opacity: 50%;
  }
  
  .toggle-input:checked + .toggle-label .toggle-text.left {
    color: grey;
  }
  
  .toggle-input:checked + .toggle-label .toggle-text.right {
    color: black;
  }
  </style>
  


            <!-- #Address
            <div class="mb-3">
              <label class="form-label">Address Line 1</label>
              <input type="text" class="form-control" placeholder="Enter address line 1">
            </div>
            <div class="mb-3">
              <label class="form-label">Address Line 2</label>
              <input type="text" class="form-control" placeholder="Enter address line 2">
            </div>
            <div class="mb-3">
              <label class="form-label">Postal Code</label>
              <input type="text" class="form-control" placeholder="Enter address line 2">
            </div>

            #Location 
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label">Country</label>
                <input type="text" class="form-control" placeholder="Enter country">
              </div>
              <div class="col-md-6">
                <label class="form-label">State/Region</label>
                <input type="text" class="form-control" placeholder="Enter state/region">
              </div>
            </div> -->