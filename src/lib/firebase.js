import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyClVn0A4QiXTHwhZ9wMLaGyFy7hhbGDscc",
  authDomain: "carsai-mozambique.firebaseapp.com",
  projectId: "carsai-mozambique",
  storageBucket: "carsai-mozambique.firebasestorage.app",
  messagingSenderId: "440987291042",
  appId: "1:440987291042:web:544c24e8b339c8c04d76fb",
  measurementId: "G-WR19TFGFTV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };