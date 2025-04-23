
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// This is a demo Firebase configuration for testing purposes
// For production, you should replace this with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC8xQsic7Q4iSR4082BDMCQiXDtpzuH_jM", // Updated valid test API key
  authDomain: "test-ice-cream-project.firebaseapp.com",
  projectId: "test-ice-cream-project",
  storageBucket: "test-ice-cream-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrstuv"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
