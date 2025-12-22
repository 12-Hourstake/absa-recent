import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  validateSessionIntegrity, 
  isRouteAllowedForPortal, 
  clearSessionAndRedirect 
} from '@/utils/portalGuards';

export const usePortalGuard = () => {
  const { session, authReady, setAlert } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!authReady || !session) return;

    // Validate session integrity on route change
    if (!validateSessionIntegrity(session)) {
      setAlert({
        message: "Session invalid or access denied. Please sign in again.",
        variant: "error",
        title: "Session Invalid",
      });
      clearSessionAndRedirect();
      return;
    }

    // Check if current route is allowed for user's portal
    if (!isRouteAllowedForPortal(location.pathname, session.portal)) {
      setAlert({
        message: "Session invalid or access denied. Please sign in again.",
        variant: "error",
        title: "Access Denied",
      });
      clearSessionAndRedirect();
      return;
    }
  }, [authReady, session, location.pathname, setAlert]);

  return {
    isValidSession: session ? validateSessionIntegrity(session) : false,
  };
};