export interface DashboardPermissions {
  assets: boolean;
  workOrders: boolean;
  maintenance: boolean;
  vendors: boolean;
  utilities: boolean;
  reports: boolean;
  inventory: boolean;
  userManagement: boolean;
}

export interface ActionPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  canView: boolean;
}

export interface UserPermissions {
  userId: string;
  role: string;
  permissions: {
    dashboard: DashboardPermissions;
    actions: ActionPermissions;
    menuItems: string[];
    customPermissions?: Record<string, boolean>;
  };
}

export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  permissions: UserPermissions['permissions'];
}

export const DEFAULT_ROLE_TEMPLATES: RoleTemplate[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: {
      dashboard: {
        assets: true,
        workOrders: true,
        maintenance: true,
        vendors: true,
        utilities: true,
        reports: true,
        inventory: true,
        userManagement: true,
      },
      actions: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canExport: true,
        canView: true,
      },
      menuItems: ['dashboard', 'assets', 'work-orders', 'maintenance', 'vendors', 'utilities', 'reports', 'inventory', 'user-management', 'user-permissions', 'profile', 'settings'],
    },
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Management access with limited admin functions',
    permissions: {
      dashboard: {
        assets: true,
        workOrders: true,
        maintenance: true,
        vendors: true,
        utilities: true,
        reports: true,
        inventory: true,
        userManagement: false,
      },
      actions: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canExport: true,
        canView: true,
      },
      menuItems: ['dashboard', 'assets', 'work-orders', 'maintenance', 'vendors', 'utilities', 'reports', 'inventory', 'user-management', 'user-permissions', 'profile', 'settings'],
    },
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to most features',
    permissions: {
      dashboard: {
        assets: true,
        workOrders: true,
        maintenance: true,
        vendors: true,
        utilities: true,
        reports: true,
        inventory: true,
        userManagement: false,
      },
      actions: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canExport: true,
        canView: true,
      },
      menuItems: ['dashboard', 'assets', 'work-orders', 'maintenance', 'vendors', 'utilities', 'reports', 'inventory', 'profile'],
    },
  },
  {
    id: 'vendor',
    name: 'Vendor',
    description: 'Vendor-specific access to work orders and tools',
    permissions: {
      dashboard: {
        assets: false,
        workOrders: true,
        maintenance: false,
        vendors: false,
        utilities: false,
        reports: true,
        inventory: false,
        userManagement: false,
      },
      actions: {
        canCreate: false,
        canEdit: true,
        canDelete: false,
        canExport: true,
        canView: true,
      },
      menuItems: ['dashboard', 'work-orders', 'contracts', 'reports', 'tools', 'profile', 'settings'],
    },
  },
  {
    id: 'colleague',
    name: 'Colleague Requester',
    description: 'Request submission and incident reporting access',
    permissions: {
      dashboard: {
        assets: false,
        workOrders: false,
        maintenance: false,
        vendors: false,
        utilities: false,
        reports: false,
        inventory: false,
        userManagement: false,
      },
      actions: {
        canCreate: true,
        canEdit: false,
        canDelete: false,
        canExport: false,
        canView: true,
      },
      menuItems: ['dashboard', 'submit-request', 'report-incident', 'upload-photos', 'request-history', 'profile', 'settings'],
    },
  },
];
