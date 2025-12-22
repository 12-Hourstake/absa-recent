import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  UserRole,
  Portal,
  AuthSession,
  LoginCredentials,
  MainAdminCredentials,
  AuthContextType,
  AlertState,
} from "@/types/auth";
import { UserPermissions } from "@/types/user";
import { getDefaultPermissions } from "@/utils/permissions";
import { validateSessionIntegrity } from "@/utils/portalGuards";
import { logAuditEvent } from "@/utils/auditLogger";
import { safeGetFromStorage, safeSetToStorage, getSafePermissions } from "@/utils/safetyHelpers";
import { loadUsersFromCache, saveUsersToCache } from "@/utils/userCache";

const AUTH_SESSION_KEY = "AUTH_SESSION_V1";
const USERS_CACHE_KEY = "USERS_CACHE_V1";
const MAIN_ADMIN_PIN_KEY = "MAIN_ADMIN_PIN_V1";
const BRANCHES_CACHE_KEY = "BRANCHES_CACHE_V1";



const DEFAULT_MAIN_ADMIN_PIN = "123456";

const BOOTSTRAP_USERS_V1 = [
  {
    fullName: "Colleague Requester",
    email: "requesters@absa.com.gh",
    password: "requester123ABSA",
    role: "COLLEAGUE",
    portal: "colleague",
    status: "ACTIVE"
  },
  {
    fullName: "Vendor Admin",
    email: "vendor@absa.com.gh",
    password: "vendor123ABSA",
    role: "VENDOR",
    portal: "vendor",
    status: "ACTIVE"
  },
  {
    fullName: "Facility Manager",
    email: "FM1@absa.com.gh",
    password: "FM123ABSA",
    role: "ADMIN",
    portal: "admin",
    status: "ACTIVE"
  },
  {
    fullName: "Head of Facilities Manager",
    email: "HFM1@absa.com.gh",
    password: "HFM1123ABSA",
    role: "ADMIN",
    portal: "admin",
    status: "ACTIVE"
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);

  useEffect(() => {
    // Initialize seed data
    initializeSeedData();
    
    // Check for existing session with safe operations
    const savedSession = safeGetFromStorage(AUTH_SESSION_KEY, null);
    if (savedSession) {
      // Validate session integrity
      if (validateSessionIntegrity(savedSession)) {
        // Ensure permissions are safe
        const safeSession = {
          ...savedSession,
          permissions: getSafePermissions(savedSession.permissions)
        };
        setSession(safeSession);
      } else {
        // Invalid session - clear it
        localStorage.removeItem(AUTH_SESSION_KEY);
      }
    }
    setAuthReady(true);
    setIsLoading(false);
  }, []);

  const initializeSeedData = () => {
    // Initialize main admin PIN FIRST - critical for login
    const existingPin = localStorage.getItem(MAIN_ADMIN_PIN_KEY);
    if (!existingPin) {
      localStorage.setItem(MAIN_ADMIN_PIN_KEY, DEFAULT_MAIN_ADMIN_PIN);
    }
    
    // Initialize bootstrap users ONLY if cache does not exist
    if (!localStorage.getItem(USERS_CACHE_KEY)) {
      localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(BOOTSTRAP_USERS_V1));
      console.log('✅ Bootstrap users created:', BOOTSTRAP_USERS_V1);
    } else {
      console.log('📦 Users cache already exists:', JSON.parse(localStorage.getItem(USERS_CACHE_KEY) || '[]'));
    }
    
    // Initialize branches cache if empty
    const existingBranches = localStorage.getItem(BRANCHES_CACHE_KEY);
    if (!existingBranches) {
      const branches = [];
      for (let i = 1; i <= 35; i++) {
        branches.push({
          id: `BR-${String(i).padStart(3, '0')}`,
          name: `Branch ${i}`,
          code: `BR${i}`,
          status: 'active'
        });
      }
      localStorage.setItem(BRANCHES_CACHE_KEY, JSON.stringify(branches));
    }
  };





  const clearAlert = () => {
    setAlert(null);
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    clearAlert();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Handle auto-login and regular credentials
    let foundUser;
    if (credentials.email === "auto@login.com") {
      // Auto-login for admin/vendor cards
      foundUser = {
        fullName: credentials.portal === "admin" ? "Facility Manager" : "Vendor Admin",
        email: credentials.email,
        role: credentials.portal === "admin" ? "FACILITY_MANAGER" : "VENDOR_ADMIN",
        portal: credentials.portal,
        status: "ACTIVE",
        permissions: null
      };
    } else {
      // Regular login for colleague portal
      foundUser = {
        fullName: "Colleague Requester",
        email: credentials.email,
        role: "COLLEAGUE",
        portal: "colleague",
        status: "ACTIVE",
        permissions: null
      };
    }

    // Ensure user has permissions, initialize if missing
    if (!foundUser.permissions) {
      foundUser.permissions = getDefaultPermissions(foundUser.role);
    }

    // Create auth session
    const authSession: AuthSession = {
      userId: foundUser.userId || foundUser.id,
      fullName: foundUser.fullName || foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      portal: foundUser.portal,
      vendorId: foundUser.vendorId,
      branchIds: foundUser.branchIds || [],
      permissions: foundUser.permissions,
      loggedInAt: new Date().toISOString(),
    };

    setSession(authSession);
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(authSession));
    
    // Skip cache update for test user
    
    // Log successful login
    setTimeout(() => {
      logAuditEvent({
        action: "Login",
        entity: "Session",
        description: `User logged in to ${credentials.portal} portal`
      });
    }, 100);
    
    setAlert({
      message: "Successfully logged in!",
      variant: "success",
      title: "Welcome",
    });
    setIsLoading(false);
  };

  const loginMainAdmin = async (credentials: MainAdminCredentials): Promise<void> => {
    setIsLoading(true);
    clearAlert();

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Read PIN directly from localStorage
    const storedPin = localStorage.getItem(MAIN_ADMIN_PIN_KEY) || DEFAULT_MAIN_ADMIN_PIN;
    
    if (storedPin !== credentials.pin) {
      setIsLoading(false);
      setAlert({
        message: "Invalid PIN. Please try again.",
        variant: "error",
        title: "Access Denied",
      });
      throw new Error("Invalid PIN");
    }

    // Create main admin session with full permissions
    const mainAdminPermissions: UserPermissions = {
      pages: {
        dashboard: true,
        assets: true,
        maintenance: true,
        workOrders: true,
        vendors: true,
        utilities: true,
        fuel: true,
        water: true,
        reports: true,
        userManagement: true,
        branches: true,
        sla: true,
        timesheets: true,
        invoices: true,
        documents: true,
        settings: true,
      },
      actions: {
        assets: { create: true, edit: true, delete: true },
        workOrders: { create: true, edit: true, close: true, delete: true },
        utilities: { addBill: true, approveBill: true, uploadReceipt: true },
        vendors: { create: true, edit: true, delete: true },
        users: { create: true, edit: true, delete: true, managePermissions: true },
      },
    };

    const authSession: AuthSession = {
      userId: "main-admin",
      fullName: "Main Administrator",
      role: UserRole.MAIN_ADMIN,
      portal: "admin",
      permissions: mainAdminPermissions,
      loggedInAt: new Date().toISOString(),
    };

    setSession(authSession);
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(authSession));
    
    // Log Main Admin login
    setTimeout(() => {
      logAuditEvent({
        action: "Login",
        entity: "Session",
        description: "Main Administrator logged in with PIN"
      });
    }, 100);
    
    setAlert({
      message: "Main Admin access granted!",
      variant: "success",
      title: "Welcome",
    });
    setIsLoading(false);
  };

  const logout = () => {
    // Log logout before clearing session
    if (session) {
      logAuditEvent({
        action: "Logout",
        entity: "Session",
        description: "User logged out"
      });
    }
    
    // ONLY clear session - DO NOT touch USERS_CACHE_V1
    setSession(null);
    localStorage.removeItem(AUTH_SESSION_KEY);
    setAlert({
      message: "You have been logged out successfully.",
      variant: "info",
      title: "Logged Out",
    });
  };

  const hasPermission = (permission: string): boolean => {
    if (!session) return false;

    // Define role-based permissions
    const rolePermissions: Record<UserRole, string[]> = {
      [UserRole.MAIN_ADMIN]: ["*"], // Full access
      [UserRole.HEAD_OF_FACILITIES]: [
        "assets:read", "assets:write", "assets:delete",
        "workorders:read", "workorders:write", "workorders:delete",
        "vendors:read", "vendors:write", "vendors:delete",
        "utilities:read", "utilities:write",
        "reports:read", "reports:write",
      ],
      [UserRole.FACILITY_MANAGER]: [
        "assets:read", "assets:write",
        "workorders:read", "workorders:write",
        "vendors:read",
        "utilities:read", "utilities:write",
        "reports:read",
      ],
      [UserRole.VENDOR_ADMIN]: [
        "workorders:read", "workorders:write",
        "contracts:read",
        "performance:read",
      ],
      [UserRole.VENDOR_STAFF]: [
        "workorders:read", "workorders:write",
      ],
      [UserRole.COLLEAGUE_REQUESTER]: [
        "requests:read", "requests:write",
        "incidents:read", "incidents:write",
        "workorders:read",
      ],
    };

    const permissions = rolePermissions[session.role] || [];
    return permissions.includes("*") || permissions.includes(permission);
  };

  const generateMockRequests = () => {
    const existingRequests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
    if (existingRequests.length >= 5) return;
    
    const mockRequests = [
      {
        id: `REQ-${Date.now()}-1`,
        type: 'FUEL',
        title: 'Generator Fuel Request',
        assetName: 'Generator Unit A',
        description: 'Fuel required for backup generator',
        quantity: '500L',
        mode: 'Card & PIN',
        status: 'PENDING',
        submittedBy: { name: 'Facility Manager', department: 'Operations' },
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `REQ-${Date.now()}-2`,
        type: 'FUEL',
        title: 'Vehicle Fuel Request',
        assetName: 'Fleet Vehicle 001',
        description: 'Monthly fuel allocation',
        quantity: '200L',
        mode: 'Card & PIN',
        status: 'PENDING',
        submittedBy: { name: 'Facility Manager', department: 'Transport' },
        submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `REQ-${Date.now()}-3`,
        type: 'FUEL',
        title: 'Emergency Generator Fuel',
        assetName: 'Emergency Generator B',
        description: 'Emergency fuel top-up required',
        quantity: '300L',
        mode: 'Card & PIN',
        status: 'PENDING',
        submittedBy: { name: 'Facility Manager', department: 'Maintenance' },
        submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    const updatedRequests = [...existingRequests, ...mockRequests].slice(0, 5);
    localStorage.setItem('maintenanceRequests', JSON.stringify(updatedRequests));
  };

  const switchRole = (newRole: string) => {
    if (!session || session.portal !== "admin") return;
    
    const allowedRoles = ["FACILITY_MANAGER", "HEAD_OF_FACILITIES"];
    if (!allowedRoles.includes(newRole)) return;
    
    const updatedSession = {
      ...session,
      role: newRole,
      fullName: newRole === "FACILITY_MANAGER" ? "Facility Manager" : "Head of Facilities Manager"
    };
    
    setSession(updatedSession);
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updatedSession));
    
    // Generate mock requests for Head of Facilities
    if (newRole === "HEAD_OF_FACILITIES") {
      generateMockRequests();
    }
    
    setAlert({
      message: `Switched to ${newRole.replace('_', ' ').toLowerCase()}`,
      variant: "success",
      title: "Role Changed",
    });
  };

  const value: AuthContextType = {
    session,
    login,
    loginMainAdmin,
    logout,
    switchRole,
    isLoading,
    authReady,
    hasPermission,
    alert,
    setAlert,
    clearAlert,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
