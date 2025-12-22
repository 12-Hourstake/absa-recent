export enum UserRole {
  FACILITY_MANAGER = 'FACILITY_MANAGER',
  HEAD_OF_FACILITIES = 'HEAD_OF_FACILITIES', 
  VENDOR_ADMIN = 'VENDOR_ADMIN',
  VENDOR_USER = 'VENDOR_USER',
  COLLEAGUE = 'COLLEAGUE'
}

export type Portal = 'admin' | 'vendor' | 'colleague';

export interface UserPermissions {
  pages: {
    dashboard: boolean;
    assets: boolean;
    maintenance: boolean;
    workOrders: boolean;
    vendors: boolean;
    utilities: boolean;
    fuel: boolean;
    water: boolean;
    reports: boolean;
    userManagement: boolean;
    branches: boolean;
    sla: boolean;
    timesheets: boolean;
    invoices: boolean;
    documents: boolean;
    settings: boolean;
  };
  actions: {
    assets: {
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    workOrders: {
      create: boolean;
      edit: boolean;
      close: boolean;
      delete: boolean;
    };
    utilities: {
      addBill: boolean;
      approveBill: boolean;
      uploadReceipt: boolean;
    };
    vendors: {
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    users: {
      create: boolean;
      edit: boolean;
      delete: boolean;
      managePermissions: boolean;
    };
  };
}

export interface User {
  userId: string;
  id?: string; // For compatibility with auth types
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  portal: Portal;
  vendorId?: string;
  branchIds: string[];
  tempPassword?: string;
  password?: string; // For login validation
  isFirstLogin?: boolean;
  status?: 'ACTIVE' | 'DISABLED';
  isActive?: boolean; // For compatibility with auth types
  createdBy?: string;
  createdAt: string;
  lastLogin?: string;
  permissions?: UserPermissions;
}

export interface CreateUserData {
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  branchIds: string[];
  vendorId?: string;
}

export interface UpdateUserData {
  fullName?: string;
  phone?: string;
  branchIds?: string[];
  status?: 'ACTIVE' | 'DISABLED';
}

export interface UserManagementContextType {
  users: User[];
  addUser: (userData: CreateUserData) => Promise<void>;
  updateUser: (userId: string, userData: UpdateUserData) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateUserPermissions: (userId: string, permissions: UserPermissions) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}
