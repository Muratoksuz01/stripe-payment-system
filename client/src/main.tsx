import App from "./App.tsx";
import "./index.css";






import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
 
    <App />
  </StrictMode>,
)





/**
 * lib/firebase.ts add this code to there
  // Import the functions you need from the SDKs you need
 import { initializeApp } from "firebase/app";
 import { getAuth } from "firebase/auth";
 import { getFirestore } from "firebase/firestore";
 import { getStorage } from "firebase/storage";
 import { getAnalytics } from "firebase/analytics";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 
 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaS8AOzA1Q",
   authDomain: "paymenseapp.com",
   projectId: "paym08b9",
   storageBucket: "paymasestorage.app",
   messagingSenderId: "174992",
   appId: "1:17e446d",
   measurementId: "GKL"
 };
 // Initialize Firebase
 const app = initializeApp(firebaseConfig)
 export const auth = getAuth();
 const analytics = getAnalytics(app);
 export const db = getFirestore();
 export const storage = getStorage();
 
 */