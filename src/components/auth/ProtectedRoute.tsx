import { useAuth } from "@/contexts/AuthContext";
import { Portal } from "@/types/auth";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
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
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);

  useEffect(() => {
    if (!authReady || shouldRedirect) return;
    
    if (!session) {
      setAlert({
        message: "Access denied. Please sign in.",
        variant: "error",
        title: "Authentication Required",
      });
      setShouldRedirect("/login");
      return;
    }

    if (!validateSessionIntegrity(session)) {
      setAlert({
        message: "Session invalid or access denied. Please sign in again.",
        variant: "error",
        title: "Session Invalid",
      });
      setShouldRedirect("/login");
      return;
    }

    if (session.portal !== requiredPortal) {
      setAlert({
        message: "Session invalid or access denied. Please sign in again.",
        variant: "error",
        title: "Portal Mismatch",
      });
      setShouldRedirect("/login");
      return;
    }

    if (!isRouteAllowedForPortal(location.pathname, session.portal)) {
      setAlert({
        message: "Session invalid or access denied. Please sign in again.",
        variant: "error",
        title: "Access Denied",
      });
      setShouldRedirect("/login");
      return;
    }

    if (requiresPermission && session.portal === requiredPortal) {
      const pagePermission = getPagePermissionFromRoute(location.pathname);
      if (pagePermission && !hasPagePermission(session.permissions, pagePermission)) {
        setAlert({
          message: "You don't have access to this page.",
          variant: "error",
          title: "Access Denied",
        });
        setShouldRedirect(`/${session.portal}/dashboard`);
        return;
      }
    }
  }, [authReady, session, requiredPortal, setAlert, location.pathname, requiresPermission, shouldRedirect]);

  if (!authReady) {
    return null;
  }

  if (shouldRedirect) {
    return <Navigate to={shouldRedirect} replace />;
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!validateSessionIntegrity(session)) {
    return <Navigate to="/login" replace />;
  }

  if (session.portal !== requiredPortal) {
    return <Navigate to="/login" replace />;
  }

  if (!isRouteAllowedForPortal(location.pathname, session.portal)) {
    return <Navigate to="/login" replace />;
  }

  if (requiresPermission && session.portal === requiredPortal) {
    const pagePermission = getPagePermissionFromRoute(location.pathname);
    if (pagePermission && !hasPagePermission(session.permissions, pagePermission)) {
      return <Navigate to={`/${session.portal}/dashboard`} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;