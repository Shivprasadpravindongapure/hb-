// ─── src/utils/domainValidator.ts ────────────────────────────────────────────
// Pure, side-effect-free domain validation logic.
// This module is used by both frontend (gate UI) and can be mirrored in
// Cloud Functions for backend enforcement.

import { AUTH_CONFIG } from '../config/authConfig';

/**
 * Returns true ONLY if `email` is a valid address whose domain exactly
 * matches one of the configured allowed domains (case-insensitive).
 *
 * Explicitly rejects:
 *  - null / undefined / empty strings
 *  - addresses without an @
 *  - lookalike prefixes  → e.g.  hbplus.fit@gmail.com
 *  - lookalike suffixes  → e.g.  user@fakehbplus.fit
 *  - subdomain injection → e.g.  user@hbplus.fit.evil.com
 */
export function isEmailDomainAllowed(
  email: string | null | undefined,
  allowedDomains: readonly string[] = AUTH_CONFIG.ALLOWED_DOMAINS
): boolean {
  if (!email || typeof email !== 'string') return false;

  const normalized = email.trim().toLowerCase();
  const atIndex = normalized.lastIndexOf('@');

  // Must have exactly one @ that is not the first or last character
  if (atIndex <= 0 || atIndex === normalized.length - 1) return false;
  if (normalized.indexOf('@') !== atIndex) return false; // multiple @

  const domain = normalized.slice(atIndex + 1);
  const expectedDomains = allowedDomains.map((domain) =>
    domain.trim().toLowerCase()
  );

  // Exact match only — no subdomain, no suffix tricks
  return expectedDomains.includes(domain);
}

/**
 * Extracts the domain part of an email address.
 * Returns empty string if the email is invalid.
 */
export function extractDomain(email: string | null | undefined): string {
  if (!email) return '';
  const atIndex = email.lastIndexOf('@');
  if (atIndex < 0) return '';
  return email.slice(atIndex + 1).toLowerCase();
}
