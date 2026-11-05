// ─── src/utils/domainValidator.test.ts ───────────────────────────────────────
// Unit tests for the domain validation logic.
// Run with: npx jest  (after installing jest + ts-jest)
// These tests document the security contract and can be executed in CI.

import { isEmailDomainAllowed, extractDomain } from './domainValidator';

describe('isEmailDomainAllowed', () => {
  // ── ALLOWED ──────────────────────────────────────────────────────────────
  test('TEST 1: employee@hbplus.fit → allowed', () => {
    expect(isEmailDomainAllowed('employee@hbplus.fit')).toBe(true);
  });

  test('TEST 1b: prasad@hbplus.fit → allowed', () => {
    expect(isEmailDomainAllowed('prasad@hbplus.fit')).toBe(true);
  });

  test('Case-insensitive: EMPLOYEE@HBPLUS.FIT → allowed', () => {
    expect(isEmailDomainAllowed('EMPLOYEE@HBPLUS.FIT')).toBe(true);
  });

  test('Mixed case: Admin@HbPlus.Fit → allowed', () => {
    expect(isEmailDomainAllowed('Admin@HbPlus.Fit')).toBe(true);
  });

  // ── BLOCKED ───────────────────────────────────────────────────────────────
  test('TEST 2: example@gmail.com → blocked', () => {
    expect(isEmailDomainAllowed('example@gmail.com')).toBe(false);
  });

  test('TEST 3: user@yahoo.com → blocked', () => {
    expect(isEmailDomainAllowed('user@yahoo.com')).toBe(false);
  });

  test('Lookalike: user@fakehbplus.fit → blocked', () => {
    expect(isEmailDomainAllowed('user@fakehbplus.fit')).toBe(false);
  });

  test('Lookalike: user@hbplus.fit.evil.com → blocked', () => {
    expect(isEmailDomainAllowed('user@hbplus.fit.evil.com')).toBe(false);
  });

  test('TEST 9: Prefix injection hbplus.fit@gmail.com → blocked', () => {
    expect(isEmailDomainAllowed('hbplus.fit@gmail.com')).toBe(false);
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
    expect(isEmailDomainAllowed('user@sub.hbplus.fit')).toBe(false);
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
