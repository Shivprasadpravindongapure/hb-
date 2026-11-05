// ─── src/context/AuthContext.tsx ─────────────────────────────────────────────

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  signInWithGoogle as googleSignIn,
  signOut as googleSignOut,
} from '../services/authService';
import { upsertUserProfile, getUserProfile } from '../services/userService';
import { isEmailDomainAllowed } from '../utils/domainValidator';
import { AUTH_CONFIG } from '../config/authConfig';
import { AuthContextValue, AuthState } from '../types/auth';

const INITIAL_STATE: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isAuthorized: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);
  // Prevent state updates on unmounted component
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);

  const setPartial = useCallback((partial: Partial<AuthState>) => {
    if (mounted.current) {
      setState(prev => ({ ...prev, ...partial }));
    }
  }, []);

  // ── Firebase auth state listener ───────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (!firebaseUser) {
        setPartial({
          user: null,
          profile: null,
          isAuthenticated: false,
          isAuthorized: false,
          isLoading: false,
          error: null,
        });
        return;
      }

      try {
        const email = firebaseUser.email ?? '';
        const isAllowed = isEmailDomainAllowed(email);

        if (!isAllowed) {
          // Sign out unauthorized users immediately
          await googleSignOut();
          setPartial({
            user: null,
            profile: null,
            isAuthenticated: false,
            isAuthorized: false,
            isLoading: false,
            error: AUTH_CONFIG.UNAUTHORIZED_MESSAGE,
          });
          return;
        }

        // Fetch or create Firestore profile
        const profile = await upsertUserProfile(firebaseUser);

        setPartial({
          user: firebaseUser,
          profile,
          isAuthenticated: true,
          isAuthorized: true,
          isLoading: false,
          error: null,
        });
      } catch (err: any) {
        console.error('[AuthContext] onAuthStateChanged error:', err);
        setPartial({
          isLoading: false,
          error: 'An error occurred while loading your session. Please try again.',
        });
      }
    });

    return unsubscribe;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── signInWithGoogle ───────────────────────────────────────────────────────
  const signInWithGoogle = useCallback(async () => {
    setPartial({ isLoading: true, error: null });
    try {
      await googleSignIn();
      // onAuthStateChanged will handle the rest
    } catch (err: any) {
      const message =
        err.message?.includes('cancelled') || err.code === 'auth/popup-closed-by-user'
          ? 'Sign-in was cancelled.'
          : err.message ?? 'Google sign-in failed. Please try again.';
      setPartial({ isLoading: false, error: message });
    }
  }, [setPartial]);

  // ── signOut ────────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    setPartial({ isLoading: true });
    try {
      await googleSignOut();
      setPartial({
        user: null,
        profile: null,
        isAuthenticated: false,
        isAuthorized: false,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setPartial({ isLoading: false });
    }
  }, [setPartial]);

  const clearError = useCallback(() => setPartial({ error: null }), [setPartial]);

  return (
    <AuthContext.Provider
      value={{ ...state, signInWithGoogle, signOut, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside <AuthProvider>');
  }
  return ctx;
}
