<script setup>
import { db } from "../firebase.js";
import { getDocs, collection, query, where } from "firebase/firestore";
import { ref, onMounted } from "vue";

const users = ref([]);

onMounted(async () => {
  let userlisting = await getDocs(collection(db, "user"));
  for (const user of userlisting.docs) {
    const userData = { ...user.data(), id: user.id };
    users.value.push(userData);

    // Call retrieveprofiles for each user and add their business profiles
    await retrieveProfile(user.id);
  }
  console.log(users);
});

// Function to retrieve business profiles and merge the data into the user object
const retrieveProfile = async (userId) => {
  // Query the "business_profiles" collection where "user_id" matches the provided userId
  const q = query(
    collection(db, "business_profiles"),
    where("user_id", "==", userId)
  );
  const profileDocs = await getDocs(q);

  // Find the corresponding user in the users array
  const user = users.value.find((u) => u.id === userId);
  if (user && profileDocs.docs.length > 0) {
    // Assuming one business profile per user, take the first profile
    const profileData = profileDocs.docs[0].data();

    // Retrieve nested "reviews" collection for the business profile
    const portfolio = await retrieveNestedPortfolio(profileDocs.docs[0].id);

    // Add the reviews array to the profile data
    profileData.portfolio_items = portfolio; // Add reviews array to profile

    // Merge the business profile data (with reviews) into the user object
    Object.assign(user, profileData);
  }
};

const retrieveNestedPortfolio = async (businessProfileId) => {
  const portfolioQuery = collection(
    db,
    "business_profiles",
    businessProfileId,
    "portfolio_items"
  );
  const portfolioDocs = await getDocs(portfolioQuery);

  // Return the reviews array
  return portfolioDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};
</script>

<template>
  <div class="banner">
    <div class="content">
      <div v-for="user in users">
        <!-- <img :src="user.profile_highlight" alt="" class="user-title"/> -->
        <h5><span>{{ user.profile_type }}</span><span>{{ user.interests }}</span></h5>
        <h1 class="business-name">{{ user.business_name }}</h1>
        <p>{{ user.bio }}</p>
      </div>
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Alkatra:wght@400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
h1 {
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  text-transform: uppercase;
}
h4 {
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  text-transform: capitalize;
}
p{
    font-family: "Poppins", sans-serif;
}
</style>

<script></script>
