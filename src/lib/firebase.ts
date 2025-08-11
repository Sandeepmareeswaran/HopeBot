import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA69rIy0tX917Vi1Tfl9EG6pa22vML8DSM",
  authDomain: "goodpsyche-2365e.firebaseapp.com",
  projectId: "goodpsyche-2365e",
  storageBucket: "goodpsyche-2365e.firebasestorage.app",
  messagingSenderId: "24288999506",
  appId: "1:24288999506:web:1291c6ecb0aad23fc0478b",
  measurementId: "G-1NBPFDKRWR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };

    