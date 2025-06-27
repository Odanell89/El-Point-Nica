// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCrsS4hEGPSy9vYQK7JCIBzw0Md3VkH-uQ",
  authDomain: "el-pointnica.firebaseapp.com",
  projectId: "el-pointnica",
  storageBucket: "el-pointnica.firebasestorage.app", // Corrected this line
  messagingSenderId: "668872948763",
  appId: "1:668872948763:web:6c7fd1fdd78c82d4484cbe",
  measurementId: "G-CGG0MSKRCG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
