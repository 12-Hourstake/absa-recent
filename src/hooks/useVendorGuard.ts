import { useAuth } from "@/contexts/AuthContext";
import { isVendorPortal } from "@/utils/portalGuards";

export const useVendorGuard = () => {
  const { session } = useAuth();

  const isVendorSession = (): boolean => {
    return session ? isVendorPortal(session.portal) : false;
  };

  const getCurrentVendorId = (): string | null => {
    return session?.vendorId || null;
  };

  const canAccessVendorResource = (resourceVendorId?: string): boolean => {
    if (!session) return false;
    
    // Non-vendor portals can access any resource
    if (!isVendorPortal(session.portal)) return true;
    
    // Vendor portal must have matching vendorId
    if (!session.vendorId || !resourceVendorId) return false;
    
    return session.vendorId === resourceVendorId;
  };

  const filterVendorResources = <T extends { vendorId?: string }>(resources: T[]): T[] => {
    if (!isVendorSession()) return resources;
    
    const vendorId = getCurrentVendorId();
    if (!vendorId) return [];
    
    return resources.filter(resource => resource.vendorId === vendorId);
  };

  return {
    isVendorSession,
    getCurrentVendorId,
    canAccessVendorResource,
    filterVendorResources,
  };
};