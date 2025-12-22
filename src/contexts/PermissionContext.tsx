import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  UserPermissions,
  RoleTemplate,
  DEFAULT_ROLE_TEMPLATES,
} from "@/types/permissions";
import { useAuth } from "@/contexts/AuthContext";

interface PermissionContextType {
  userPermissions: UserPermissions | null;
  roleTemplates: RoleTemplate[];
  updateUserPermissions: (
    userId: string,
    permissions: UserPermissions["permissions"]
  ) => void;
  getUserPermissions: (userId: string) => UserPermissions | null;
  hasPermission: (permission: string) => boolean;
  hasDashboardAccess: (section: string) => boolean;
  hasActionPermission: (action: string) => boolean;
  canAccessMenuItem: (menuItem: string) => boolean;
  getAllUsers: () => UserPermissions[];
  createRoleTemplate: (template: Omit<RoleTemplate, "id">) => void;
  updateRoleTemplate: (id: string, template: Partial<RoleTemplate>) => void;
  deleteRoleTemplate: (id: string) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
);

// Mock data for demonstration - in real app, this would come from API
const mockUsers: UserPermissions[] = [
  {
    userId: "admin@absa.com.gh",
    role: "Administrator",
    permissions: DEFAULT_ROLE_TEMPLATES[0].permissions,
  },
  {
    userId: "requesters@absa.com.gh",
    role: "Colleague Requester",
    permissions: DEFAULT_ROLE_TEMPLATES[4].permissions,
  },
  {
    userId: "vendor@absa.com.gh",
    role: "Vendor",
    permissions: DEFAULT_ROLE_TEMPLATES[3].permissions,
  },
];

export const PermissionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [userPermissions, setUserPermissions] =
    useState<UserPermissions | null>(null);
  const [roleTemplates, setRoleTemplates] = useState<RoleTemplate[]>(
    DEFAULT_ROLE_TEMPLATES
  );
  const [allUsers, setAllUsers] = useState<UserPermissions[]>(mockUsers);

  // Load user permissions when user changes
  useEffect(() => {
    if (user?.email) {
      const permissions = getUserPermissions(user.email);
      setUserPermissions(permissions);
    }
  }, [user]);

  const getUserPermissions = (userId: string): UserPermissions | null => {
    return allUsers.find((u) => u.userId === userId) || null;
  };

  const updateUserPermissions = (
    userId: string,
    permissions: UserPermissions["permissions"]
  ) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, permissions } : u))
    );

    // Update current user permissions if it's the same user
    if (user?.email === userId) {
      setUserPermissions((prev) => (prev ? { ...prev, permissions } : null));
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!userPermissions) return false;

    // Check dashboard permissions
    if (permission.startsWith("dashboard.")) {
      const section = permission.split(".")[1];
      return (
        userPermissions.permissions.dashboard[
          section as keyof typeof userPermissions.permissions.dashboard
        ] || false
      );
    }

    // Check action permissions
    if (permission.startsWith("action.")) {
      const action = permission.split(".")[1];
      return (
        userPermissions.permissions.actions[
          action as keyof typeof userPermissions.permissions.actions
        ] || false
      );
    }

    // Check custom permissions
    if (userPermissions.permissions.customPermissions) {
      return userPermissions.permissions.customPermissions[permission] || false;
    }

    return false;
  };

  const hasDashboardAccess = (section: string): boolean => {
    return hasPermission(`dashboard.${section}`);
  };

  const hasActionPermission = (action: string): boolean => {
    return hasPermission(`action.${action}`);
  };

  const canAccessMenuItem = (menuItem: string): boolean => {
    if (!userPermissions) return false;
    return userPermissions.permissions.menuItems.includes(menuItem);
  };

  const getAllUsers = (): UserPermissions[] => {
    return allUsers;
  };

  const createRoleTemplate = (template: Omit<RoleTemplate, "id">) => {
    const newTemplate: RoleTemplate = {
      ...template,
      id: `template_${Date.now()}`,
    };
    setRoleTemplates((prev) => [...prev, newTemplate]);
  };

  const updateRoleTemplate = (id: string, template: Partial<RoleTemplate>) => {
    setRoleTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...template } : t))
    );
  };

  const deleteRoleTemplate = (id: string) => {
    setRoleTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const value: PermissionContextType = {
    userPermissions,
    roleTemplates,
    updateUserPermissions,
    getUserPermissions,
    hasPermission,
    hasDashboardAccess,
    hasActionPermission,
    canAccessMenuItem,
    getAllUsers,
    createRoleTemplate,
    updateRoleTemplate,
    deleteRoleTemplate,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};
