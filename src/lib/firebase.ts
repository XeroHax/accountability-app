// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider, EmailAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGFIN25cezdlLDxgaHEqMtJb_JTg3Jnbc",
  authDomain: "accountability-place-bkdz2b.firebaseapp.com",
  projectId: "accountability-place-bkdz2b",
  storageBucket: "accountability-place-bkdz2b.appspot.com",
  messagingSenderId: "52255105108",
  appId: "1:52255105108:web:829a13abb90e2021620dc1"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');
const emailProvider = EmailAuthProvider;

export { app, auth, db, googleProvider, appleProvider, emailProvider };