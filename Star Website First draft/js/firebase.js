// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, updatePassword } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import { getFirestore, collection, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";

import {getDatabase, ref, set, child, update, remove} from
"https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBI1hVWzFsdCEzyBuFWitNPleYowvrWW0",
  authDomain: "starsponsorshipprogram.firebaseapp.com",
  databaseURL: "https://starsponsorshipprogram-default-rtdb.firebaseio.com",
  projectId: "starsponsorshipprogram",
  storageBucket: "starsponsorshipprogram.appspot.com",
  messagingSenderId: "1066304531005",
  appId: "1:1066304531005:web:84cd41613c25cb31d6d854",
  measurementId: "G-PPQK74XF80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();

export {
    auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, updatePassword
}

  //Initialize Firebase Functions
  const db = getFirestore(app);
  const storage = getStorage(app);
  const database = getDatabase();



  //export variables to other js files
  export {
          db, storage, database
         }
