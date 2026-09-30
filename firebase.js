import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {// Firebase-config for the project (Benjamin)
  apiKey: "AIzaSyD_vyckGqEsZ6gDaulqInQ7ruCCWW9ysyg",
  authDomain: "app200v-44990.firebaseapp.com",
  databaseURL: "https://app200v-44990-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "app200v-44990",
  storageBucket: "app200v-44990.firebasestorage.app",
  messagingSenderId: "1015329376595",
  appId: "1:1015329376595:web:8899d4b52335aa2b29b9a6"
};

const app = initializeApp(firebaseConfig);// Initialize Firebase-app with configuration

const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage };// Exports auth, db and storage to use in other modules