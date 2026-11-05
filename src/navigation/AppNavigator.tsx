// ─── src/navigation/AppNavigator.tsx ─────────────────────────────────────────
// Cross-platform navigator using React Navigation native-stack.
// Auth state drives which screen stack is shown — no flashing protected content.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LoadingScreen from '../components/LoadingScreen';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Deep-link / URL config for web — /login and /dashboard
const linking = {
  prefixes: ['https://hbplus-auth.netlify.app', 'hbplusauth://'],
  config: {
    screens: {
      Login: 'login',
      Dashboard: 'dashboard',
    },
  },
};

export default function AppNavigator() {
  const { isLoading, isAuthenticated, isAuthorized } = useAuth();

  // Show full-screen loader while Firebase resolves the session.
  // This prevents any flash of the wrong screen on startup.
  if (isLoading) {
    return <LoadingScreen message="Initialising…" />;
  }

  const isLoggedIn = isAuthenticated && isAuthorized;

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'fade' }}
        // Set initial route based on auth state at mount time
        initialRouteName={isLoggedIn ? 'Dashboard' : 'Login'}
      >
        {isLoggedIn ? (
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
