
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration, adapted for web
const firebaseConfig = {
  apiKey: "AIzaSyA69rIy0tX917Vi1Tfl9EG6pa22vML8DSM",
  authDomain: "goodpsyche-2365e.firebaseapp.com",
  projectId: "goodpsyche-2365e",
  storageBucket: "goodpsyche-2365e.appspot.com",
  messagingSenderId: "24288999506",
  appId: "1:24288999506:web:1291c6ecb0aad23fc0478b",
  measurementId: "G-1NBPFDKRWR",
};

// Initialize Firebase
// We check if the app is already initialized to avoid errors in Next.js hot-reloading environments.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Export initialized services
export { app, auth, db };
