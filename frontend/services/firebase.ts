// Firebase core
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  type User as FirebaseUser,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDHpREBJBJn9yQHMWDh6cl5G89BzsIEHgE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "medifind-9ba00.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "medifind-9ba00",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "medifind-9ba00.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "172336217284",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:172336217284:web:b20402736fb0cdb304dd91",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-L4461K5780",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser env)
let analytics: ReturnType<typeof getAnalytics> | null = null;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // Analytics may fail in non-browser environments
}

// Firebase Auth instance — the single source of truth for authentication
export const auth = getAuth(app);

// Re-export Firebase Auth helpers for use in AuthContext
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
};

export type { FirebaseUser };
export { analytics };
export default app;
