// ─── src/services/userService.ts ─────────────────────────────────────────────
// Manages user profile documents in Firestore.

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from './firebase';
import { UserProfile } from '../types/auth';
import { AUTH_CONFIG, AllowedRole } from '../config/authConfig';
import { extractDomain } from '../utils/domainValidator';

/**
 * Fetches the Firestore profile for a given uid.
 * Returns null if the document does not exist.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const ref = doc(db, AUTH_CONFIG.USERS_COLLECTION, uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data();
    return {
      uid: data.uid,
      name: data.name,
      email: data.email,
      photoURL: data.photoURL ?? null,
      domain: data.domain,
      role: data.role as AllowedRole,
      emailVerified: data.emailVerified,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
      lastLoginAt:
        data.lastLoginAt instanceof Timestamp
          ? data.lastLoginAt.toDate().toISOString()
          : data.lastLoginAt,
    };
  } catch (err) {
    console.error('[userService] getUserProfile error:', err);
    return null;
  }
}

/**
 * Creates or updates the user profile in Firestore.
 * - On first sign-in: creates the document with the default role.
 * - On subsequent sign-ins: only refreshes mutable fields (name, photo,
 *   lastLoginAt). Role is never overwritten by the client.
 */
export async function upsertUserProfile(
  firebaseUser: FirebaseUser
): Promise<UserProfile> {
  const ref = doc(db, AUTH_CONFIG.USERS_COLLECTION, firebaseUser.uid);
  const snap = await getDoc(ref);
  const now = new Date().toISOString();
  const domain = extractDomain(firebaseUser.email);

  if (!snap.exists()) {
    // ── First login ──────────────────────────────────────────────────────────
    const newProfile: Omit<UserProfile, 'createdAt' | 'lastLoginAt'> & {
      createdAt: ReturnType<typeof serverTimestamp>;
      lastLoginAt: ReturnType<typeof serverTimestamp>;
    } = {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName ?? '',
      email: firebaseUser.email ?? '',
      photoURL: firebaseUser.photoURL ?? null,
      domain,
      role: AUTH_CONFIG.DEFAULT_ROLE,
      emailVerified: firebaseUser.emailVerified,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };

    await setDoc(ref, newProfile);

    return {
      ...newProfile,
      createdAt: now,
      lastLoginAt: now,
    };
  }

  // ── Subsequent login — only refresh safe mutable fields ──────────────────
  await updateDoc(ref, {
    name: firebaseUser.displayName ?? snap.data().name,
    photoURL: firebaseUser.photoURL ?? null,
    emailVerified: firebaseUser.emailVerified,
    lastLoginAt: serverTimestamp(),
  });

  const updated = { ...snap.data() } as any;
  return {
    uid: updated.uid,
    name: firebaseUser.displayName ?? updated.name,
    email: updated.email,
    photoURL: firebaseUser.photoURL ?? updated.photoURL ?? null,
    domain: updated.domain,
    role: updated.role as AllowedRole,
    emailVerified: firebaseUser.emailVerified,
    createdAt:
      updated.createdAt instanceof Timestamp
        ? updated.createdAt.toDate().toISOString()
        : updated.createdAt ?? now,
    lastLoginAt: now,
  };
}
