import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAl1H-J2MiD3YiYDCJyITHBKvyaaarFKuE",
  authDomain: "commerce-wave-621e9.firebaseapp.com",
  projectId: "commerce-wave-621e9",
  storageBucket: "commerce-wave-621e9.appspot.com",
  messagingSenderId: "370568500266",
  appId: "1:370568500266:web:5419eb58a11c342a305f53",
  measurementId: "G-180ESR9D2K"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
