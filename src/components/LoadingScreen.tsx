// ─── src/components/LoadingScreen.tsx ────────────────────────────────────────

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface Props {
  message?: string;
}

export default function LoadingScreen({ message = 'Loading…' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1A73E8" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    gap: 16,
  },
  text: {
    fontSize: 15,
    color: '#5f6368',
    fontWeight: '500',
  },
});
