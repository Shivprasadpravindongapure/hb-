// ─── src/services/firebase.ts ─────────────────────────────────────────────────
// Firebase initialisation — all values read from .env at build time.
// EXPO_PUBLIC_* prefix is required for Expo/Metro to inject env vars.

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, setPersistence, browserLocalPersistence, inMemoryPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Fail fast with a clear message if .env is not set up
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    '[firebase.ts] Missing Firebase config.\n' +
    'Copy .env.example → .env and fill in your EXPO_PUBLIC_FIREBASE_* values.'
  );
}

// Avoid re-initialising on hot reloads
const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Auth — set persistence based on platform
export const auth: Auth = getAuth(app);

// On web: persist session in localStorage so refresh doesn't log out
// On native: use in-memory (AsyncStorage handled by Firebase RN SDK)
if (Platform.OS === 'web') {
  setPersistence(auth, browserLocalPersistence).catch((err) =>
    console.warn('[firebase] Could not set persistence:', err)
  );
}

export const db: Firestore = getFirestore(app);

export default app;
