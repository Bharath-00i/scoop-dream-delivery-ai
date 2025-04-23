
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Firebase configuration - Using test project configuration
// You should replace these with your own Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyDzJaPz7m-chhusMZvw8vsCZiUPeyZomkY", // Updated valid API key
  authDomain: "lovable-ice-cream-test.firebaseapp.com",
  projectId: "lovable-ice-cream-test",
  storageBucket: "lovable-ice-cream-test.appspot.com",
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
