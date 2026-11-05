// ─── src/services/firebase.ts ────────────────────────────────────────────────
// Firebase app initialisation. All credentials come from environment variables
// (EXPO_PUBLIC_* prefix makes them available in the Expo/Metro bundler).

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY            ?? 'AIzaSyDyfqf-y4ZvBp2cyMX4GPis7eJxf0nXXZE',
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN        ?? 'hbplus-authentication-93ca5.firebaseapp.com',
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID         ?? 'hbplus-authentication-93ca5',
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET     ?? 'hbplus-authentication-93ca5.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '443207669424',
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID             ?? '1:443207669424:web:0de4ce0fd9710fc5cd4d75',
  measurementId:     process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID     ?? 'G-JKZYTEZSN8',
};

// Avoid re-initializing on hot reloads
const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;
