// ─── src/screens/LoginScreen.tsx ─────────────────────────────────────────────

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import GoogleLoginButton from '../components/GoogleLoginButton';
import ErrorMessage from '../components/ErrorMessage';
import { AUTH_CONFIG } from '../config/authConfig';

export default function LoginScreen() {
  const { signInWithGoogle, isLoading, error, clearError } = useAuth();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Background blobs (decorative) ── */}
          <View style={styles.blobTopLeft} pointerEvents="none" />
          <View style={styles.blobBottomRight} pointerEvents="none" />

          {/* ── Auth Card ── */}
          <View style={styles.card}>
            {/* Logo / Brand */}
            <View style={styles.brandRow}>
              <View style={styles.logoBox}>
                <Text style={styles.logoText}>HB+</Text>
              </View>
            </View>

            <Text style={styles.appName}>{AUTH_CONFIG.ORG_NAME}</Text>
            <Text style={styles.tagline}>{AUTH_CONFIG.APP_TAGLINE}</Text>

            <View style={styles.divider} />

            <Text style={styles.welcomeHeading}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in with your organisation account to continue.
            </Text>

            {/* Error banner */}
            {error ? (
              <ErrorMessage message={error} onDismiss={clearError} />
            ) : null}

            {/* Google Sign-In button */}
            <View style={styles.buttonWrapper}>
              <GoogleLoginButton
                onPress={signInWithGoogle}
                loading={isLoading}
              />
            </View>

            {/* Domain restriction notice */}
            <View style={styles.domainNotice}>
              <Text style={styles.domainLabel}>Restricted to</Text>
              <View style={styles.domainPill}>
                <Text style={styles.domainText}>
                  @{AUTH_CONFIG.ALLOWED_DOMAIN}
                </Text>
              </View>
            </View>

            <Text style={styles.helperText}>
              Only email addresses from{' '}
              <Text style={styles.helperBold}>@{AUTH_CONFIG.ALLOWED_DOMAIN}</Text>{' '}
              are authorised to access this portal.
            </Text>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            © {new Date().getFullYear()} {AUTH_CONFIG.ORG_NAME} · All rights reserved
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const CARD_MAX_WIDTH = 440;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4ff' },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  // Decorative background shapes
  blobTopLeft: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#d0e4ff',
    opacity: 0.5,
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: -80,
    right: -40,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#c7f2e8',
    opacity: 0.4,
  },

  // Card
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 36,
    width: '100%',
    maxWidth: CARD_MAX_WIDTH,
    alignItems: 'center',
    shadowColor: '#1a73e8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    zIndex: 1,
  },

  // Brand
  brandRow: { marginBottom: 12 },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#1A73E8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  logoText: { color: '#fff', fontWeight: '900', fontSize: 20, letterSpacing: 1 },

  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: -0.5,
    marginTop: 4,
  },
  tagline: {
    fontSize: 13,
    color: '#5f6368',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  divider: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#1A73E8',
    marginVertical: 20,
  },
  welcomeHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#5f6368',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: 300,
  },

  buttonWrapper: { width: '100%', maxWidth: 320, marginTop: 4, marginBottom: 20 },

  // Domain notice
  domainNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  domainLabel: { fontSize: 12, color: '#5f6368', fontWeight: '500' },
  domainPill: {
    backgroundColor: '#e8f0fe',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  domainText: { fontSize: 12, color: '#1A73E8', fontWeight: '700' },

  helperText: {
    fontSize: 12,
    color: '#80868b',
    textAlign: 'center',
    lineHeight: 17,
    maxWidth: 300,
  },
  helperBold: { fontWeight: '700', color: '#5f6368' },

  footer: {
    marginTop: 32,
    fontSize: 11,
    color: '#9aa0a6',
    textAlign: 'center',
  },
});
