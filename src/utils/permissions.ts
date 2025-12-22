import { UserRole, UserPermissions } from "@/types/user";
import { Portal } from "@/types/auth";

// Default permissions based on role
export const getDefaultPermissions = (role: UserRole): UserPermissions => {
  const basePermissions: UserPermissions = {
    pages: {
      dashboard: false,
      assets: false,
      maintenance: false,
      workOrders: false,
      vendors: false,
      utilities: false,
      fuel: false,
      water: false,
      reports: false,
      userManagement: false,
      branches: false,
      sla: false,
      timesheets: false,
      invoices: false,
      documents: false,
      settings: false,
    },
    actions: {
      assets: {
        create: false,
        edit: false,
        delete: false,
      },
      workOrders: {
        create: false,
        edit: false,
        close: false,
        delete: false,
      },
      utilities: {
        addBill: false,
        approveBill: false,
        uploadReceipt: false,
      },
      vendors: {
        create: false,
        edit: false,
        delete: false,
      },
      users: {
        create: false,
        edit: false,
        delete: false,
        managePermissions: false,
      },
    },
  };

  switch (role) {
    case UserRole.HEAD_OF_FACILITIES:
      return {
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
          assets: {
            create: true,
            edit: true,
            delete: true,
          },
          workOrders: {
            create: true,
            edit: true,
            close: true,
            delete: true,
          },
          utilities: {
            addBill: true,
            approveBill: true,
            uploadReceipt: true,
          },
          vendors: {
            create: true,
            edit: true,
            delete: true,
          },
          users: {
            create: true,
            edit: true,
            delete: true,
            managePermissions: true,
          },
        },
      };

    case UserRole.FACILITY_MANAGER:
      return {
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
          userManagement: false,
          branches: true,
          sla: true,
          timesheets: true,
          invoices: true,
          documents: true,
          settings: false,
        },
        actions: {
          assets: {
            create: true,
            edit: true,
            delete: false,
          },
          workOrders: {
            create: true,
            edit: true,
            close: true,
            delete: false,
          },
          utilities: {
            addBill: true,
            approveBill: false,
            uploadReceipt: true,
          },
          vendors: {
            create: false,
            edit: true,
            delete: false,
          },
          users: {
            create: false,
            edit: false,
            delete: false,
            managePermissions: false,
          },
        },
      };

    case UserRole.VENDOR_ADMIN:
      return {
        pages: {
          dashboard: true,
          assets: false,
          maintenance: false,
          workOrders: true,
          vendors: false,
          utilities: false,
          fuel: false,
          water: false,
          reports: true,
          userManagement: true,
          branches: false,
          sla: false,
          timesheets: false,
          invoices: false,
          documents: false,
          settings: false,
        },
        actions: {
          assets: {
            create: false,
            edit: false,
            delete: false,
          },
          workOrders: {
            create: false,
            edit: true,
            close: true,
            delete: false,
          },
          utilities: {
            addBill: false,
            approveBill: false,
            uploadReceipt: false,
          },
          vendors: {
            create: false,
            edit: false,
            delete: false,
          },
          users: {
            create: true,
            edit: true,
            delete: true,
            managePermissions: true,
          },
        },
      };

    case UserRole.VENDOR_USER:
      return {
        pages: {
          dashboard: true,
          assets: false,
          maintenance: false,
          workOrders: true,
          vendors: false,
          utilities: false,
          fuel: false,
          water: false,
          reports: false,
          userManagement: false,
          branches: false,
          sla: false,
          timesheets: false,
          invoices: false,
          documents: false,
          settings: false,
        },
        actions: {
          assets: {
            create: false,
            edit: false,
            delete: false,
          },
          workOrders: {
            create: false,
            edit: true,
            close: false,
            delete: false,
          },
          utilities: {
            addBill: false,
            approveBill: false,
            uploadReceipt: false,
          },
          vendors: {
            create: false,
            edit: false,
            delete: false,
          },
          users: {
            create: false,
            edit: false,
            delete: false,
            managePermissions: false,
          },
        },
      };

    case UserRole.COLLEAGUE:
      return {
        pages: {
          dashboard: true,
          assets: false,
          maintenance: false,
          workOrders: true,
          vendors: false,
          utilities: false,
          fuel: false,
          water: false,
          reports: false,
          userManagement: false,
          branches: false,
          sla: false,
          timesheets: false,
          invoices: false,
          documents: false,
          settings: false,
        },
        actions: {
          assets: {
            create: false,
            edit: false,
            delete: false,
          },
          workOrders: {
            create: true,
            edit: false,
            close: false,
            delete: false,
          },
          utilities: {
            addBill: false,
            approveBill: false,
            uploadReceipt: false,
          },
          vendors: {
            create: false,
            edit: false,
            delete: false,
          },
          users: {
            create: false,
            edit: false,
            delete: false,
            managePermissions: false,
          },
        },
      };

    default:
      return basePermissions;
  }
};

// Check if user has permission for a specific page
export const hasPagePermission = (permissions: UserPermissions | undefined, page: keyof UserPermissions['pages']): boolean => {
  return permissions?.pages[page] ?? false;
};

// Check if user has permission for a specific action
export const hasActionPermission = (
  permissions: UserPermissions | undefined, 
  module: keyof UserPermissions['actions'], 
  action: string
): boolean => {
  return (permissions?.actions[module] as any)?.[action] ?? false;
};

// Get page permission key from route path
export const getPagePermissionFromRoute = (path: string): keyof UserPermissions['pages'] | null => {
  if (path.includes('/dashboard')) return 'dashboard';
  if (path.includes('/assets')) return 'assets';
  if (path.includes('/maintenance')) return 'maintenance';
  if (path.includes('/work-orders')) return 'workOrders';
  if (path.includes('/vendors')) return 'vendors';
  if (path.includes('/utilities') || path.includes('/ecg-electricity') || path.includes('/ghana-water') || path.includes('/water-tanker')) return 'utilities';
  if (path.includes('/fuel')) return 'fuel';
  if (path.includes('/water')) return 'water';
  if (path.includes('/reports')) return 'reports';
  if (path.includes('/user-management') || path.includes('/user-permissions')) return 'userManagement';
  if (path.includes('/branches')) return 'branches';
  if (path.includes('/sla')) return 'sla';
  if (path.includes('/timesheets') || path.includes('/overtime') || path.includes('/payroll')) return 'timesheets';
  if (path.includes('/invoice')) return 'invoices';
  if (path.includes('/documents') || path.includes('/analytics')) return 'documents';
  if (path.includes('/settings')) return 'settings';
  return null;
};

// Validate if portal can access specific routes
export const validatePortalRouteAccess = (portal: Portal, path: string): boolean => {
  const routePortal = path.split('/')[1]; // Get first path segment
  return routePortal === portal;
};