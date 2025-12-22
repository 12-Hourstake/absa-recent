import React, { ReactNode } from "react";
import { usePermissions } from "@/contexts/PermissionContext";

interface ProtectedComponentProps {
  children: ReactNode;
  permission?: string;
  dashboardSection?: string;
  action?: string;
  menuItem?: string;
  fallback?: ReactNode;
  requireAll?: boolean; // If true, all specified permissions must be true
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  permission,
  dashboardSection,
  action,
  menuItem,
  fallback = null,
  requireAll = false,
}) => {
  const {
    hasPermission,
    hasDashboardAccess,
    hasActionPermission,
    canAccessMenuItem,
  } = usePermissions();

  const checkPermissions = () => {
    const checks: boolean[] = [];

    if (permission) {
      checks.push(hasPermission(permission));
    }

    if (dashboardSection) {
      checks.push(hasDashboardAccess(dashboardSection));
    }

    if (action) {
      checks.push(hasActionPermission(action));
    }

    if (menuItem) {
      checks.push(canAccessMenuItem(menuItem));
    }

    if (checks.length === 0) {
      return true; // No permissions specified, allow access
    }

    if (requireAll) {
      return checks.every((check) => check);
    } else {
      return checks.some((check) => check);
    }
  };

  const hasAccess = checkPermissions();

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Convenience components for common use cases
export const DashboardSection: React.FC<{
  section: string;
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ section, children, fallback }) => (
  <ProtectedComponent dashboardSection={section} fallback={fallback}>
    {children}
  </ProtectedComponent>
);

export const ActionButton: React.FC<{
  action: string;
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ action, children, fallback }) => (
  <ProtectedComponent action={action} fallback={fallback}>
    {children}
  </ProtectedComponent>
);

export const MenuItem: React.FC<{
  item: string;
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ item, children, fallback }) => (
  <ProtectedComponent menuItem={item} fallback={fallback}>
    {children}
  </ProtectedComponent>
);

export default ProtectedComponent;
