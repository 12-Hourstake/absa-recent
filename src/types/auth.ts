export enum UserRole {
  MAIN_ADMIN = 'MAIN_ADMIN',
  HEAD_OF_FACILITIES = 'HEAD_OF_FACILITIES',
  FACILITY_MANAGER = 'FACILITY_MANAGER',
  VENDOR_ADMIN = 'VENDOR_ADMIN',
  VENDOR_STAFF = 'VENDOR_STAFF',
  COLLEAGUE_REQUESTER = 'COLLEAGUE_REQUESTER'
}

export type Portal = 'admin' | 'vendor' | 'colleague';

export interface AuthSession {
  userId: string;
  fullName: string;
  email?: string;
  role: UserRole;
  portal: Portal;
  vendorId?: string;
  branchIds?: string[];
  permissions: UserPermissions;
  loggedInAt: string;
}

export interface User {
  id: string;
  email?: string;
  fullName: string;
  role: UserRole;
  portal: Portal;
  vendorId?: string;
  branchIds?: string[];
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  portal: Portal;
}

export interface MainAdminCredentials {
  pin: string;
}

export type AlertVariant = "error" | "success" | "info" | "warning";

export interface AlertState {
  message: string;
  variant: AlertVariant;
  title?: string;
}

export interface AuthContextType {
  session: AuthSession | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginMainAdmin: (credentials: MainAdminCredentials) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: string) => void;
  isLoading: boolean;
  authReady: boolean;
  hasPermission: (permission: string) => boolean;
  alert: AlertState | null;
  setAlert: (alert: AlertState | null) => void;
  clearAlert: () => void;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}
