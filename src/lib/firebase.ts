
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2DjzrxsX2-LfEjvpIzxGXcA1bDVoAn8w",
  authDomain: "lovable-ice-cream-app.firebaseapp.com",
  projectId: "lovable-ice-cream-app",
  storageBucket: "lovable-ice-cream-app.appspot.com",
  messagingSenderId: "375263697843",
  appId: "1:375263697843:web:9f65a8c2b49da78f7d1d7d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
