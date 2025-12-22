import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  UserRole,
  Portal,
  CreateUserData,
  UpdateUserData,
  UserManagementContextType,
  UserPermissions,
} from "@/types/user";
import { getDefaultPermissions } from "@/utils/permissions";
import { isVendorPortal } from "@/utils/portalGuards";
import { logAuditEvent } from "@/utils/auditLogger";
import { safeGetFromStorage, safeSetToStorage } from "@/utils/safetyHelpers";
import { loadUsersFromCache, saveUsersToCache } from "@/utils/userCache";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/contexts/UsersProvider";

const USERS_CACHE_KEY = "USERS_CACHE_V1";
const BRANCHES_CACHE_KEY = "BRANCHES_CACHE_V1";

const UserManagementContext = createContext<
  UserManagementContextType | undefined
>(undefined);

export const UserManagementProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { session } = useAuth();
  const { users, updateUsersCache } = useUsers();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get filtered users based on session
  const getFilteredUsers = (): User[] => {
    if (!session) {
      return users; // Show all users when no session (for login validation)
    }
    
    if (isVendorPortal(session.portal)) {
      if (!session.vendorId) {
        return []; // No vendorId in vendor portal - security violation
      }
      return users.filter((user: any) => user.vendorId === session.vendorId);
    }
    
    return users; // Admin and colleague portals see all users
  };
  
  const filteredUsers = getFilteredUsers();

  const generateTempPassword = (): string => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    const symbols = '!@#$%';
    let password = '';
    
    // Add uppercase letter
    password += chars.charAt(Math.floor(Math.random() * 26));
    // Add lowercase letter  
    password += chars.charAt(26 + Math.floor(Math.random() * 26));
    // Add number
    password += chars.charAt(52 + Math.floor(Math.random() * 7));
    // Add symbol
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    
    // Add 4 more random characters
    for (let i = 0; i < 4; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
  };

  const getRolePortal = (role: UserRole): Portal => {
    switch (role) {
      case UserRole.FACILITY_MANAGER:
      case UserRole.HEAD_OF_FACILITIES:
        return 'admin';
      case UserRole.VENDOR_ADMIN:
      case UserRole.VENDOR_USER:
        return 'vendor';
      case UserRole.COLLEAGUE:
        return 'colleague';
      default:
        return 'admin';
    }
  };

  const addUser = async (userData: CreateUserData): Promise<void> => {
    if (!session) throw new Error("No active session");
    
    setIsLoading(true);
    setError(null);

    try {
      // Validation - read from cache directly
      const allUsers = loadUsersFromCache();
      const emailExists = allUsers.some((user: any) => user.email === userData.email);
      if (emailExists) {
        throw new Error("Email already exists");
      }

      // Access control validation with portal isolation
      if (isVendorPortal(session.portal)) {
        // Vendor portal restrictions
        if (!session.vendorId) {
          throw new Error("Vendor session missing vendorId");
        }
        if (userData.role !== UserRole.VENDOR_ADMIN && userData.role !== UserRole.VENDOR_USER) {
          throw new Error("Vendor portal can only create vendor users");
        }
        if (userData.vendorId !== session.vendorId) {
          throw new Error("Cannot assign users to other vendors");
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const tempPass = generateTempPassword();
      const newUser: User = {
        userId: `USER-${Date.now()}`,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        portal: getRolePortal(userData.role),
        vendorId: userData.vendorId || (session.role === 'VENDOR_ADMIN' ? session.vendorId : undefined),
        branchIds: userData.branchIds,
        tempPassword: tempPass,
        password: tempPass,
        isFirstLogin: true,
        status: 'ACTIVE',
        isActive: true,
        createdBy: session.userId,
        createdAt: new Date().toISOString(),
        permissions: getDefaultPermissions(userData.role),
      };

      // Update cache - write back to USERS_CACHE_V1
      const updatedAllUsers = [...allUsers, newUser];
      updateUsersCache(updatedAllUsers);
      
      // Log user creation
      logAuditEvent({
        action: "Create User",
        entity: "User",
        entityId: newUser.userId,
        description: `Created user: ${newUser.fullName} (${newUser.email}) with role ${newUser.role}`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add user";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (
    userId: string,
    userData: UpdateUserData
  ): Promise<void> => {
    if (!session) throw new Error("No active session");
    
    setIsLoading(true);
    setError(null);

    try {
      const allUsers = loadUsersFromCache();
      const userToUpdate = allUsers.find((user: any) => user.userId === userId);
      
      if (!userToUpdate) {
        throw new Error("User not found");
      }

      // Access control validation with portal isolation
      if (isVendorPortal(session.portal)) {
        if (!session.vendorId) {
          throw new Error("Vendor session missing vendorId");
        }
        if (userToUpdate.vendorId !== session.vendorId) {
          throw new Error("Cannot edit users from other vendors");
        }
      }

      // Prevent editing Main Admin
      if (userToUpdate.userId === 'main-admin') {
        throw new Error("Cannot edit Main Admin user");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Ensure both status formats are updated for compatibility
      const updateData = {
        ...userData,
        ...(userData.status && {
          status: userData.status,
          isActive: userData.status === 'ACTIVE'
        })
      };
      
      // Update user in cache directly
      const updatedUsers = allUsers.map((user: any) => 
        user.userId === userId ? { ...user, ...updateData } : user
      );
      updateUsersCache(updatedUsers);
      
      // Log user update
      logAuditEvent({
        action: userData.status === 'DISABLED' ? "Disable User" : "Edit User",
        entity: "User",
        entityId: userId,
        description: `Updated user: ${userToUpdate.fullName} - ${Object.keys(userData).join(', ')}`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update user";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string): Promise<void> => {
    if (!session) throw new Error("No active session");
    
    setIsLoading(true);
    setError(null);

    try {
      const allUsers = loadUsersFromCache();
      const userToDelete = allUsers.find((user: any) => user.userId === userId);
      
      if (!userToDelete) {
        throw new Error("User not found");
      }

      // Access control validation with portal isolation
      if (isVendorPortal(session.portal)) {
        if (!session.vendorId) {
          throw new Error("Vendor session missing vendorId");
        }
        if (userToDelete.vendorId !== session.vendorId) {
          throw new Error("Cannot delete users from other vendors");
        }
      }

      // Prevent deleting Main Admin or currently logged-in user
      if (userToDelete.userId === 'main-admin' || userToDelete.userId === session.userId) {
        throw new Error("Cannot delete this user");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Delete user from cache directly
      const updatedUsers = allUsers.filter((user: any) => user.userId !== userId);
      updateUsersCache(updatedUsers);
      
      // Log user deletion
      logAuditEvent({
        action: "Delete User",
        entity: "User",
        entityId: userId,
        description: `Deleted user: ${userToDelete.fullName} (${userToDelete.email})`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete user";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPermissions = async (userId: string, permissions: UserPermissions): Promise<void> => {
    if (!session) throw new Error("No active session");
    
    setIsLoading(true);
    setError(null);

    try {
      const allUsers = loadUsersFromCache();
      const userToUpdate = allUsers.find((user: any) => user.userId === userId);
      
      if (!userToUpdate) {
        throw new Error("User not found");
      }

      // Access control validation with portal isolation
      if (isVendorPortal(session.portal)) {
        if (!session.vendorId) {
          throw new Error("Vendor session missing vendorId");
        }
        if (userToUpdate.vendorId !== session.vendorId) {
          throw new Error("Cannot edit permissions for users from other vendors");
        }
        // Vendor portal cannot grant admin-only permissions
        if (permissions.pages.userManagement || permissions.pages.settings) {
          throw new Error("Cannot grant admin-only permissions");
        }
      }

      // Prevent editing Main Admin permissions
      if (userToUpdate.userId === 'main-admin') {
        throw new Error("Cannot edit Main Admin permissions");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update permissions in cache directly
      const updatedUsers = allUsers.map((user: any) => 
        user.userId === userId ? { ...user, permissions } : user
      );
      updateUsersCache(updatedUsers);
      
      // Log permission change
      logAuditEvent({
        action: "Permission Change",
        entity: "User",
        entityId: userId,
        description: `Updated permissions for user: ${userToUpdate.fullName}`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update permissions";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserManagementContext.Provider
      value={{
        users: filteredUsers,
        addUser,
        updateUser,
        deleteUser,
        updateUserPermissions,
        isLoading,
        error,
      }}
    >
      {children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagement = () => {
  const context = useContext(UserManagementContext);
  if (context === undefined) {
    throw new Error(
      "useUserManagement must be used within a UserManagementProvider"
    );
  }
  return context;
};
