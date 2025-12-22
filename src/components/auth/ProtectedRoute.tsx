import { useAuth } from "@/contexts/AuthContext";
import { Portal } from "@/types/auth";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getPagePermissionFromRoute, hasPagePermission } from "@/utils/permissions";
import { 
  validateSessionIntegrity, 
  isRouteAllowedForPortal, 
  getPortalFromRoute,
  clearSessionAndRedirect 
} from "@/utils/portalGuards";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPortal: Portal;
  requiresPermission?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPortal,
  requiresPermission = true
}) => {
  const { session, authReady, setAlert } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Only run validation after auth is ready
    if (!authReady) return;
    
    if (!session) {
      setAlert({
        message: "Access denied. Please sign in.",
        variant: "error",
        title: "Authentication Required",
      });
    } else {
      // Validate session integrity
      if (!validateSessionIntegrity(session)) {
        setAlert({
          message: "Session invalid or access denied. Please sign in again.",
          variant: "error",
          title: "Session Invalid",
        });
        clearSessionAndRedirect();
        return;
      }
      
      // Check portal mismatch
      console.log('Portal check:', { sessionPortal: session.portal, requiredPortal });
      if (session.portal !== requiredPortal) {
        console.log('Portal mismatch detected');
        setAlert({
          message: "Session invalid or access denied. Please sign in again.",
          variant: "error",
          title: "Portal Mismatch",
        });
        clearSessionAndRedirect();
        return;
      }
      
      // Check route-portal alignment
      if (!isRouteAllowedForPortal(location.pathname, session.portal)) {
        setAlert({
          message: "Session invalid or access denied. Please sign in again.",
          variant: "error",
          title: "Access Denied",
        });
        clearSessionAndRedirect();
        return;
      }
    }
  }, [authReady, session, requiredPortal, setAlert, location.pathname]);

  // Wait for auth to be ready
  if (!authReady) {
    return null;
  }

  // No session - redirect to login
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Session integrity check
  if (!validateSessionIntegrity(session)) {
    return <Navigate to="/login" replace />;
  }

  // Portal mismatch - redirect to login
  if (session.portal !== requiredPortal) {
    return <Navigate to="/login" replace />;
  }

  // Route-portal alignment check
  if (!isRouteAllowedForPortal(location.pathname, session.portal)) {
    return <Navigate to="/login" replace />;
  }

  // Check page permissions if required
  if (requiresPermission && session.portal === requiredPortal) {
    const pagePermission = getPagePermissionFromRoute(location.pathname);
    if (pagePermission && !hasPagePermission(session.permissions, pagePermission)) {
      setAlert({
        message: "You don't have access to this page.",
        variant: "error",
        title: "Access Denied",
      });
      return <Navigate to={`/${session.portal}/dashboard`} replace />;
    }
  }

  // All checks passed - allow access
  return <>{children}</>;
};

export default ProtectedRoute;