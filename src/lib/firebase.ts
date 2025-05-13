
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// This is a demo Firebase configuration for testing purposes
// For production, you should replace this with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBJ9HcdFos8Bx85m9Jj2X3BPt3U7MfNrVA", // Updated working test API key
  authDomain: "test-ice-cream-project.firebaseapp.com",
  projectId: "test-ice-cream-project",
  storageBucket: "test-ice-cream-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrstuv"
};

// Initialize Firebase
// Check if Firebase app has been initialized already to prevent duplicate app error
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();

// Enable offline persistence for Firestore (helps with connection issues)
try {
  enableIndexedDbPersistence(firestore).catch((err) => {
    console.error("Firestore persistence error:", err.code, err.message);
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support offline persistence');
    }
  });
} catch (error) {
  console.error("Error enabling Firestore persistence:", error);
}

console.log("Firebase initialized with project:", firebaseConfig.projectId);

export default app;
