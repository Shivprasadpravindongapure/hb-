// ─── src/components/ProtectedRoute.tsx ───────────────────────────────────────
// Wraps a screen and blocks access until the auth state is resolved.
// Never flashes protected content while Firebase is loading.

import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './LoadingScreen';

interface Props {
  children: React.ReactNode;
  onRedirectToLogin: () => void;
}

export default function ProtectedRoute({ children, onRedirectToLogin }: Props) {
  const { isLoading, isAuthenticated, isAuthorized } = useAuth();

  const shouldRedirect = !isLoading && (!isAuthenticated || !isAuthorized);

  useEffect(() => {
    if (shouldRedirect) {
      onRedirectToLogin();
    }
  }, [shouldRedirect, onRedirectToLogin]);

  if (isLoading || shouldRedirect) {
    return <LoadingScreen message={isLoading ? 'Verifying session…' : 'Redirecting…'} />;
  }

  return <>{children}</>;
}
