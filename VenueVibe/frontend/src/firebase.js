import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.VITE_FIREBASE_API_KEY,
  authDomain: "venuevibe-a1675.firebaseapp.com",
  projectId: "venuevibe-a1675",
  storageBucket: "venuevibe-a1675.appspot.com",
  messagingSenderId: "605698985809",
  appId: "1:605698985809:web:ca6e225a8202acf781cd70",
};

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// let db = firebase.firestore()

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Allow users to sign up and log in using email/password, phone number, or social media accounts (Google, Facebook, etc.).
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// const auth = getAuth();
// createUserWithEmailAndPassword(auth, "user@example.com", "password123")
//   .then((userCredential) => {
//     const user = userCredential.user;
//     console.log(user);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
