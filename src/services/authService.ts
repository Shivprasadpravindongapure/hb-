// ─── src/services/authService.ts ─────────────────────────────────────────────
// Platform-aware Google Sign-In via Firebase Auth.
// Web  → Firebase signInWithPopup
// Native → expo-auth-session (AuthRequest) + Firebase signInWithCredential

import { Platform } from 'react-native';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { auth } from './firebase';

// Required for expo-auth-session on web
WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const ANDROID_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? '';
const IOS_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';

const GOOGLE_DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

/** Sign in with Google — platform-adaptive */
export async function signInWithGoogle() {
  if (Platform.OS === 'web') {
    return _webSignIn();
  }
  return _nativeSignIn();
}

async function _webSignIn() {
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err: any) {
    if (
      err.code === 'auth/popup-blocked' ||
      err.code === 'auth/popup-closed-by-user' ||
      err.code === 'auth/cancelled-popup-request'
    ) {
      throw new Error(
        'Google sign-in was cancelled. Please allow popups and try again.'
      );
    }
    throw err;
  }
}

async function _nativeSignIn() {
  const clientId =
    Platform.OS === 'android' ? ANDROID_CLIENT_ID : IOS_CLIENT_ID;

  if (!clientId) {
    throw new Error(
      'Google OAuth client ID is not configured for this platform. ' +
        'Set EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID or EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID in .env'
    );
  }

  const redirectUri = AuthSession.makeRedirectUri();

  const nonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${Date.now()}-${Math.random()}`
  );

  const request = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    scopes: ['openid', 'profile', 'email'],
    responseType: AuthSession.ResponseType.Token,
    extraParams: { nonce },
  });

  const result = await request.promptAsync(GOOGLE_DISCOVERY);

  if (result.type === 'cancel' || result.type === 'dismiss') {
    throw new Error('Google sign-in was cancelled.');
  }
  if (result.type !== 'success') {
    throw new Error('Google authentication failed. Please try again.');
  }

  const credential = GoogleAuthProvider.credential(
    null,
    result.params.access_token
  );
  const userCredential = await signInWithCredential(auth, credential);
  return userCredential.user;
}

/** Sign out from Firebase */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}
