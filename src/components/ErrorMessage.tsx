// ─── src/components/ErrorMessage.tsx ─────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface Props {
  message: string;
  onDismiss?: () => void;
}

export default function ErrorMessage({ message, onDismiss }: Props) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>⚠</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          style={styles.dismiss}
          accessibilityLabel="Dismiss error"
        >
          <Text style={styles.dismissText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fce8e6',
    borderColor: '#f28b82',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 8,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  iconBox: {
    marginRight: 10,
  },
  icon: {
    fontSize: 16,
    color: '#c5221f',
  },
  message: {
    flex: 1,
    fontSize: 13,
    color: '#c5221f',
    lineHeight: 18,
    fontWeight: '500',
  },
  dismiss: {
    paddingLeft: 8,
    ...Platform.select({ web: { cursor: 'pointer' } as any }),
  },
  dismissText: {
    fontSize: 14,
    color: '#c5221f',
    fontWeight: '700',
  },
});
