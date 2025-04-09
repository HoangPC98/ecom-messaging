npm install firebase

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDE7u4JhxQl_vcSCWHuFcl2uMRELJ-nzUU",
  authDomain: "ecom-messaging.firebaseapp.com",
  projectId: "ecom-messaging",
  storageBucket: "ecom-messaging.firebasestorage.app",
  messagingSenderId: "675365150997",
  appId: "1:675365150997:web:5793a21c892f730c50491c",
  measurementId: "G-2C9NC279BV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);