// ─── src/components/GoogleLoginButton.tsx ────────────────────────────────────

import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';

interface Props {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function GoogleLoginButton({ onPress, loading, disabled }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, (loading || disabled) && styles.buttonDisabled]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
    >
      {loading ? (
        <ActivityIndicator color="#4285F4" size="small" />
      ) : (
        <>
          {/* Google "G" SVG-ish using nested Text — no external SVG needed */}
          <View style={styles.iconWrapper}>
            <Text style={styles.gLetter}>G</Text>
          </View>
          <Text style={styles.label}>Continue with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#dadce0',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minWidth: 240,
    ...Platform.select({
      web: { cursor: 'pointer' } as any,
    }),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gLetter: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3c4043',
    letterSpacing: 0.1,
  },
});
