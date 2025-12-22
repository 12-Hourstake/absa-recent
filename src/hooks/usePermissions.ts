import { useAuth } from "@/contexts/AuthContext";
import { hasPagePermission, hasActionPermission } from "@/utils/permissions";
import { UserPermissions } from "@/types/user";
import { isAdminPortal, isVendorPortal, isColleaguePortal } from "@/utils/portalGuards";
import { getSafePermissions } from "@/utils/safetyHelpers";

export const usePermissions = () => {
  const { session } = useAuth();

  const permissions = getSafePermissions(session?.permissions);

  const hasPage = (page: keyof UserPermissions['pages']): boolean => {
    return hasPagePermission(permissions, page);
  };

  const hasAction = (
    module: keyof UserPermissions['actions'], 
    action: string
  ): boolean => {
    return hasActionPermission(permissions, module, action);
  };

  const canManageUsers = (): boolean => {
    return hasAction('users', 'create') || hasAction('users', 'edit') || hasAction('users', 'delete');
  };

  const canManagePermissions = (): boolean => {
    return hasAction('users', 'managePermissions');
  };

  const isMainAdmin = (): boolean => {
    return session?.role === 'MAIN_ADMIN';
  };

  const isVendorAdmin = (): boolean => {
    return session?.role === 'VENDOR_ADMIN';
  };

  const getCurrentPortal = () => {
    return session?.portal;
  };

  const isCurrentPortalAdmin = (): boolean => {
    return session ? isAdminPortal(session.portal) : false;
  };

  const isCurrentPortalVendor = (): boolean => {
    return session ? isVendorPortal(session.portal) : false;
  };

  const isCurrentPortalColleague = (): boolean => {
    return session ? isColleaguePortal(session.portal) : false;
  };

  return {
    permissions,
    hasPage,
    hasAction,
    canManageUsers,
    canManagePermissions,
    isMainAdmin,
    isVendorAdmin,
    getCurrentPortal,
    isCurrentPortalAdmin,
    isCurrentPortalVendor,
    isCurrentPortalColleague,
  };
};