import { Portal, AuthSession } from "@/types/auth";

// Portal helper functions
export const isAdminPortal = (portal: Portal): boolean => portal === "admin";
export const isVendorPortal = (portal: Portal): boolean => portal === "vendor";
export const isColleaguePortal = (portal: Portal): boolean => portal === "colleague";

// Get portal from route path
export const getPortalFromRoute = (path: string): Portal | null => {
  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/vendor')) return 'vendor';
  if (path.startsWith('/colleague')) return 'colleague';
  return null;
};

// Validate session integrity
export const validateSessionIntegrity = (session: AuthSession): boolean => {
  if (!session.portal || !session.role) return false;
  
  // Vendor portal must have vendorId
  if (isVendorPortal(session.portal) && !session.vendorId) return false;
  
  // Role must match portal context
  const adminRoles = ['MAIN_ADMIN', 'HEAD_OF_FACILITIES', 'FACILITY_MANAGER'];
  const vendorRoles = ['VENDOR_ADMIN', 'VENDOR_USER'];
  const colleagueRoles = ['COLLEAGUE'];
  
  if (isAdminPortal(session.portal) && !adminRoles.includes(session.role)) return false;
  if (isVendorPortal(session.portal) && !vendorRoles.includes(session.role)) return false;
  if (isColleaguePortal(session.portal) && !colleagueRoles.includes(session.role)) return false;
  
  return true;
};

// Check if route matches session portal
export const isRouteAllowedForPortal = (path: string, portal: Portal): boolean => {
  const routePortal = getPortalFromRoute(path);
  return routePortal === portal;
};

// Clear session and redirect to login
export const clearSessionAndRedirect = (): void => {
  localStorage.removeItem("AUTH_SESSION_V1");
  window.location.href = "/login";
};