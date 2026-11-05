// ─── src/services/userService.ts ─────────────────────────────────────────────
// Manages user profile documents in Firestore.
// Falls back to Firebase Auth data if Firestore is unavailable or blocked.

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

/** Build a profile object purely from Firebase Auth data (no Firestore needed) */
export function buildProfileFromAuth(firebaseUser: FirebaseUser): UserProfile {
  const now = new Date().toISOString();
  return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'User',
    email: firebaseUser.email ?? '',
    photoURL: firebaseUser.photoURL ?? null,
    domain: extractDomain(firebaseUser.email),
    role: AUTH_CONFIG.DEFAULT_ROLE,
    emailVerified: firebaseUser.emailVerified,
    createdAt: now,
    lastLoginAt: now,
  };
}

/**
 * Creates or updates the user profile in Firestore.
 * - On first sign-in: creates the document with the default role.
 * - On subsequent sign-ins: refreshes mutable fields only.
 * - Role is NEVER overwritten by the client.
 * - If Firestore is unavailable, falls back to Auth-only profile.
 */
export async function upsertUserProfile(
  firebaseUser: FirebaseUser
): Promise<UserProfile> {
  const now = new Date().toISOString();
  const domain = extractDomain(firebaseUser.email);

  try {
    const ref = doc(db, AUTH_CONFIG.USERS_COLLECTION, firebaseUser.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      // ── First login: create document ────────────────────────────────────
      const newDoc = {
        uid:           firebaseUser.uid,
        name:          firebaseUser.displayName ?? '',
        email:         firebaseUser.email ?? '',
        photoURL:      firebaseUser.photoURL ?? null,
        domain,
        role:          AUTH_CONFIG.DEFAULT_ROLE,
        emailVerified: firebaseUser.emailVerified,
        createdAt:     serverTimestamp(),
        lastLoginAt:   serverTimestamp(),
      };

      await setDoc(ref, newDoc);

      return {
        uid:           firebaseUser.uid,
        name:          firebaseUser.displayName ?? '',
        email:         firebaseUser.email ?? '',
        photoURL:      firebaseUser.photoURL ?? null,
        domain,
        role:          AUTH_CONFIG.DEFAULT_ROLE,
        emailVerified: firebaseUser.emailVerified,
        createdAt:     now,
        lastLoginAt:   now,
      };
    }

    // ── Subsequent login: update safe mutable fields only ─────────────────
    await updateDoc(ref, {
      name:          firebaseUser.displayName ?? snap.data().name,
      photoURL:      firebaseUser.photoURL ?? null,
      emailVerified: firebaseUser.emailVerified,
      lastLoginAt:   serverTimestamp(),
    });

    const data = snap.data();
    return {
      uid:           data.uid,
      name:          firebaseUser.displayName ?? data.name,
      email:         data.email,
      photoURL:      firebaseUser.photoURL ?? data.photoURL ?? null,
      domain:        data.domain,
      role:          data.role as AllowedRole,
      emailVerified: firebaseUser.emailVerified,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt ?? now,
      lastLoginAt: now,
    };

  } catch (err: any) {
    // Firestore not available / rules blocking (e.g. during testing with gmail.com)
    // Fall back to Auth-only profile — user still gets dashboard access
    console.warn(
      '[userService] Firestore unavailable, using Auth-only profile:',
      err?.code ?? err?.message ?? err
    );
    return buildProfileFromAuth(firebaseUser);
  }
}
