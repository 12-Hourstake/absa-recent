import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { UserPermissions } from '@/types/user';

interface PermissionWrapperProps {
  children: React.ReactNode;
  module?: keyof UserPermissions['actions'];
  action?: string;
  page?: keyof UserPermissions['pages'];
  fallback?: React.ReactNode;
  showTooltip?: boolean;
}

const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  children,
  module,
  action,
  page,
  fallback = null,
  showTooltip = false,
}) => {
  const { hasPage, hasAction } = usePermissions();

  let hasPermission = true;

  if (page) {
    hasPermission = hasPage(page);
  } else if (module && action) {
    hasPermission = hasAction(module, action);
  }

  if (!hasPermission) {
    if (showTooltip) {
      return (
        <div title="You don't have permission to perform this action" className="opacity-50 cursor-not-allowed">
          {React.cloneElement(children as React.ReactElement, { disabled: true })}
        </div>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionWrapper;