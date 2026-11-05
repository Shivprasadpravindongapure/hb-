// ─── src/hooks/useAuth.ts ─────────────────────────────────────────────────────

import { useAuthContext } from '../context/AuthContext';

/** Convenience re-export so consumers can import from hooks/useAuth */
export const useAuth = useAuthContext;
export default useAuthContext;
