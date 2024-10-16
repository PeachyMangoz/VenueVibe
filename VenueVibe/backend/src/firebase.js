import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzp3OrAjzTsz4q00I3DDZ5q9xf5EkDBLk",
  authDomain: "venuevibe-a1675.firebaseapp.com",
  projectId: "venuevibe-a1675",
  storageBucket: "venuevibe-a1675.appspot.com",
  messagingSenderId: "605698985809",
  appId: "1:605698985809:web:ca6e225a8202acf781cd70",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };