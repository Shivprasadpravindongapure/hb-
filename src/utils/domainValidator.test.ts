// ─── src/utils/domainValidator.test.ts ───────────────────────────────────────
// Unit tests for the domain validation logic.
// Run with: npx jest  (after installing jest + ts-jest)
// These tests document the security contract and can be executed in CI.

import { isEmailDomainAllowed, extractDomain } from './domainValidator';

const ALLOWED_DOMAINS = ['hbplus.fit', 'gmail.com'];

describe('isEmailDomainAllowed', () => {
  // ── ALLOWED ──────────────────────────────────────────────────────────────
  test('employee@hbplus.fit → allowed', () => {
    expect(isEmailDomainAllowed('employee@hbplus.fit', ALLOWED_DOMAINS)).toBe(true);
  });

  test('prasad@hbplus.fit → allowed', () => {
    expect(isEmailDomainAllowed('prasad@hbplus.fit', ALLOWED_DOMAINS)).toBe(true);
  });

  test('test account at gmail.com → allowed', () => {
    expect(isEmailDomainAllowed('example@gmail.com', ALLOWED_DOMAINS)).toBe(true);
  });

  test('Case-insensitive: EMPLOYEE@HBPLUS.FIT → allowed', () => {
    expect(isEmailDomainAllowed('EMPLOYEE@HBPLUS.FIT', ALLOWED_DOMAINS)).toBe(true);
  });

  test('Mixed case: Admin@HbPlus.Fit → allowed', () => {
    expect(isEmailDomainAllowed('Admin@HbPlus.Fit', ALLOWED_DOMAINS)).toBe(true);
  });

  // ── BLOCKED ───────────────────────────────────────────────────────────────
  test('user@yahoo.com → blocked', () => {
    expect(isEmailDomainAllowed('user@yahoo.com', ALLOWED_DOMAINS)).toBe(false);
  });

  test('Lookalike: user@fakehbplus.fit → blocked', () => {
    expect(isEmailDomainAllowed('user@fakehbplus.fit', ALLOWED_DOMAINS)).toBe(false);
  });

  test('Lookalike: user@hbplus.fit.evil.com → blocked', () => {
    expect(isEmailDomainAllowed('user@hbplus.fit.evil.com', ALLOWED_DOMAINS)).toBe(false);
  });

  test('TEST 9: Prefix injection hbplus.fit@gmail.com → blocked', () => {
    expect(isEmailDomainAllowed('hbplus.fit@gmail.com', ALLOWED_DOMAINS)).toBe(false);
  });

  test('Null → blocked', () => {
    expect(isEmailDomainAllowed(null)).toBe(false);
  });

  test('Empty string → blocked', () => {
    expect(isEmailDomainAllowed('')).toBe(false);
  });

  test('No @ symbol → blocked', () => {
    expect(isEmailDomainAllowed('noemail')).toBe(false);
  });

  test('Subdomain: user@sub.hbplus.fit → blocked (exact match only)', () => {
    expect(isEmailDomainAllowed('user@sub.hbplus.fit', ALLOWED_DOMAINS)).toBe(false);
  });

  test('custom allowlist is respected', () => {
    expect(isEmailDomainAllowed('example@gmail.com', ['hbplus.fit'])).toBe(false);
  });
});

describe('extractDomain', () => {
  test('extracts domain from valid email', () => {
    expect(extractDomain('user@hbplus.fit')).toBe('hbplus.fit');
  });

  test('returns empty string for null', () => {
    expect(extractDomain(null)).toBe('');
  });

  test('returns empty string for no @', () => {
    expect(extractDomain('noemail')).toBe('');
  });
});
