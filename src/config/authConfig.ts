// ─── src/config/authConfig.ts ───────────────────────────────────────────────
// Centralized auth & domain configuration.
// Never hard-code secrets here — values are pulled from env at build time.

export const AUTH_CONFIG = {
  /** The only email domain allowed to access the application */
  ALLOWED_DOMAIN: process.env.EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN ?? 'hbplus.fit',

  /** Organisation display name shown in the UI */
  ORG_NAME: 'HBPlus',

  /** App tagline */
  APP_TAGLINE: 'Team Portal',

  /** Error shown to unauthorized users */
  UNAUTHORIZED_MESSAGE:
    'Access restricted. Please login using your official domain email.',

  /** Firestore collection for user profiles */
  USERS_COLLECTION: 'users',

  /** Default role assigned to new users */
  DEFAULT_ROLE: 'user' as const,
} as const;

export type AllowedRole = 'admin' | 'user';
