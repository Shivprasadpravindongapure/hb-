// ─── src/services/firebase.ts ─────────────────────────────────────────────────
// Firebase initialisation — all values read from .env (EXPO_PUBLIC_* prefix
// makes them available in the Expo/Metro bundler at build time).
//
// Copy .env.example → .env and fill in your values before running.

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Guard — fail fast with a clear message if the env file is missing
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    '[firebase.ts] Missing Firebase config.\n' +
    'Copy .env.example → .env and fill in your EXPO_PUBLIC_FIREBASE_* values.'
  );
}

// Avoid re-initialising on hot reloads
const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;
