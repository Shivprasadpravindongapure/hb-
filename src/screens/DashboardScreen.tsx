// ─── src/screens/DashboardScreen.tsx ─────────────────────────────────────────

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { AUTH_CONFIG } from '../config/authConfig';

export default function DashboardScreen() {
  const { profile, signOut, isLoading } = useAuth();

  if (!profile) return null;

  const initials = profile.name
    ? profile.name
        .split(' ')
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase()
    : profile.email[0].toUpperCase();

  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <View style={styles.headerLogo}>
            <Text style={styles.headerLogoText}>HB+</Text>
          </View>
          <Text style={styles.headerTitle}>{AUTH_CONFIG.ORG_NAME} Portal</Text>
        </View>
        <TouchableOpacity
          style={[styles.logoutBtn, isLoading && styles.logoutBtnDisabled]}
          onPress={signOut}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
        >
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Welcome card ───────────────────────────────────────────────── */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeCardInner}>
            <View style={styles.avatarWrapper}>
              {profile.photoURL ? (
                <Image
                  source={{ uri: profile.photoURL }}
                  style={styles.avatar}
                  accessibilityLabel="Profile photo"
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitials}>{initials}</Text>
                </View>
              )}
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeGreeting}>Welcome back,</Text>
              <Text style={styles.welcomeName} numberOfLines={1}>
                {profile.name || profile.email}
              </Text>
              <View style={styles.rolePill}>
                <View
                  style={[
                    styles.roleDot,
                    profile.role === 'admin'
                      ? styles.roleDotAdmin
                      : styles.roleDotUser,
                  ]}
                />
                <Text style={styles.roleText}>
                  {profile.role === 'admin' ? 'Administrator' : 'Team Member'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Info cards grid ─────────────────────────────────────────────── */}
        <View style={styles.grid}>
          <InfoCard
            icon="📧"
            label="Email"
            value={profile.email}
            accent="#1A73E8"
          />
          <InfoCard
            icon="🔐"
            label="User ID"
            value={profile.uid}
            small
            accent="#34A853"
          />
          <InfoCard
            icon="🏢"
            label="Domain"
            value={`@${profile.domain}`}
            accent="#FBBC04"
          />
          <InfoCard
            icon="🛡️"
            label="Role"
            value={profile.role === 'admin' ? 'Administrator' : 'User'}
            accent={profile.role === 'admin' ? '#EA4335' : '#1A73E8'}
          />
          <InfoCard
            icon="✅"
            label="Email Verified"
            value={profile.emailVerified ? 'Yes' : 'No'}
            accent={profile.emailVerified ? '#34A853' : '#EA4335'}
          />
          <InfoCard
            icon="📅"
            label="Member Since"
            value={memberSince}
            accent="#9b59b6"
          />
        </View>

        {/* ── Auth status banner ──────────────────────────────────────────── */}
        <View style={styles.statusBanner}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            Authenticated · Authorised · Session active
          </Text>
        </View>

        {/* ── Bottom padding ───────────────────────────────────────────────── */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── InfoCard sub-component ────────────────────────────────────────────────────

interface InfoCardProps {
  icon: string;
  label: string;
  value: string;
  accent?: string;
  small?: boolean;
}

function InfoCard({ icon, label, value, accent = '#1A73E8', small }: InfoCardProps) {
  return (
    <View style={[cardStyles.card, { borderTopColor: accent }]}>
      <Text style={cardStyles.icon}>{icon}</Text>
      <Text style={cardStyles.label}>{label}</Text>
      <Text
        style={[cardStyles.value, small && cardStyles.valueSmall]}
        numberOfLines={2}
        selectable
      >
        {value}
      </Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4ff' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  headerBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1A73E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoText: { color: '#fff', fontWeight: '900', fontSize: 11 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#202124' },
  logoutBtn: {
    backgroundColor: '#fce8e6',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    ...Platform.select({ web: { cursor: 'pointer' } as any }),
  },
  logoutBtnDisabled: { opacity: 0.5 },
  logoutText: { fontSize: 13, fontWeight: '600', color: '#c5221f' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 24 },

  // Welcome card
  welcomeCard: {
    backgroundColor: '#1A73E8',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  welcomeCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: '#fff' },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#d2e3fc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarInitials: { fontSize: 26, fontWeight: '800', color: '#1A73E8' },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34A853',
    borderWidth: 2,
    borderColor: '#1A73E8',
  },
  welcomeText: { flex: 1 },
  welcomeGreeting: { fontSize: 13, color: '#a8c7fa', fontWeight: '500', marginBottom: 2 },
  welcomeName: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 8 },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    gap: 6,
  },
  roleDot: { width: 7, height: 7, borderRadius: 4 },
  roleDotAdmin: { backgroundColor: '#FBBC04' },
  roleDotUser: { backgroundColor: '#34A853' },
  roleText: { fontSize: 12, color: '#fff', fontWeight: '600' },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },

  // Status
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6f4ea',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34A853',
  },
  statusText: { fontSize: 13, color: '#137333', fontWeight: '600' },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 140,
    flex: 1,
    // ensure at least two per row on narrow screens
    ...Platform.select({ default: { flexBasis: '45%' }, web: { flexBasis: '30%' } }),
  },
  icon: { fontSize: 22, marginBottom: 8 },
  label: { fontSize: 11, color: '#9aa0a6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  value: { fontSize: 14, color: '#202124', fontWeight: '700' },
  valueSmall: { fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
});
