import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDV1RFra5YPvs7ItN43GoamiGOMQdx4Awk",
  authDomain: "dk-pizza-33bb8.firebaseapp.com",
  projectId: "dk-pizza-33bb8",
  storageBucket: "dk-pizza-33bb8.firebasestorage.app",
  messagingSenderId: "492943185536",
  appId: "1:492943185536:web:df15d1de09728498cf3865",
  measurementId: "G-GDNF9C6B5Q"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
