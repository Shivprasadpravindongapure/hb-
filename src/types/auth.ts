// ─── src/types/auth.ts ───────────────────────────────────────────────────────

import { User as FirebaseUser } from 'firebase/auth';
import { AllowedRole } from '../config/authConfig';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;
  domain: string;
  role: AllowedRole;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthState {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isAuthorized: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}
