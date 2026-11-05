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
import { upsertUserProfile } from '../services/userService';
import { isEmailDomainAllowed } from '../utils/domainValidator';
import { AUTH_CONFIG } from '../config/authConfig';
import { AuthContextValue, AuthState } from '../types/auth';

const INITIAL_STATE: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isAuthorized: false,
  isLoading: true,       // starts true — resolved by onAuthStateChanged
  error: null,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);
  const mounted = useRef(true);

  useEffect(() => () => { mounted.current = false; }, []);

  const setPartial = useCallback((partial: Partial<AuthState>) => {
    if (mounted.current) setState(prev => ({ ...prev, ...partial }));
  }, []);

  // ── Firebase auth state listener ──────────────────────────────────────────
  useEffect(() => {
    // Safety net: if Firebase doesn't respond in 8 seconds, unblock the UI
    const timeoutId = setTimeout(() => {
      if (mounted.current) {
        console.warn('[AuthContext] Firebase onAuthStateChanged timed out — showing login screen.');
        setPartial({ isLoading: false });
      }
    }, 8000);

    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          clearTimeout(timeoutId); // Firebase responded — cancel timeout

          if (!firebaseUser) {
            // No session → show login screen
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

          const email = firebaseUser.email ?? '';
            const isAllowed = isEmailDomainAllowed(email);

            if (!isAllowed) {
              // Wrong domain → sign out immediately
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

            // Authorised → upsert profile (falls back to Auth data if Firestore unavailable)
            const profile = await upsertUserProfile(firebaseUser);

            setPartial({
              user: firebaseUser,
              profile,
              isAuthenticated: true,
              isAuthorized: true,
              isLoading: false,
              error: null,
            });
        },
        (authError) => {
          // onAuthStateChanged error handler
          clearTimeout(timeoutId);
          console.error('[AuthContext] Firebase auth error:', authError);
          setPartial({
            isLoading: false,
            error: 'Firebase connection failed. Check your internet connection.',
          });
        }
      );
    } catch (initErr: any) {
      clearTimeout(timeoutId);
      console.error('[AuthContext] onAuthStateChanged init error:', initErr);
      setPartial({ isLoading: false, error: 'Firebase failed to initialise.' });
    }

    return () => {
      clearTimeout(timeoutId);
      unsubscribe?.();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── signInWithGoogle ───────────────────────────────────────────────────────
  const signInWithGoogle = useCallback(async () => {
    setPartial({ isLoading: true, error: null });
    try {
      await googleSignIn();
      // onAuthStateChanged fires automatically after sign-in
    } catch (err: any) {
      const msg =
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request' ||
        err.message?.toLowerCase().includes('cancel')
          ? 'Sign-in was cancelled.'
          : err.message ?? 'Google sign-in failed. Please try again.';
      setPartial({ isLoading: false, error: msg });
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
    } catch {
      setPartial({ isLoading: false });
    }
  }, [setPartial]);

  const clearError = useCallback(
    () => setPartial({ error: null }),
    [setPartial]
  );

  return (
    <AuthContext.Provider value={{ ...state, signInWithGoogle, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
}
