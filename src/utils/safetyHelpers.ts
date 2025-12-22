import { UserPermissions } from "@/types/user";
import { logAuditEvent } from "@/utils/auditLogger";

// Safe localStorage operations
export const safeGetFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    logSafetyError(`localStorage read error for key: ${key}`, error);
    return fallback;
  }
};

export const safeSetToStorage = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    logSafetyError(`localStorage write error for key: ${key}`, error);
    return false;
  }
};

// Safe permission fallback
export const getSafePermissions = (permissions?: UserPermissions): UserPermissions => {
  if (!permissions || typeof permissions !== 'object') {
    return {
      pages: {
        dashboard: true,
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
        assets: { create: false, edit: false, delete: false },
        workOrders: { create: false, edit: false, close: false, delete: false },
        utilities: { addBill: false, approveBill: false, uploadReceipt: false },
        vendors: { create: false, edit: false, delete: false },
        users: { create: false, edit: false, delete: false, managePermissions: false },
      },
    };
  }

  // Ensure all required properties exist
  return {
    pages: {
      dashboard: permissions.pages?.dashboard ?? true,
      assets: permissions.pages?.assets ?? false,
      maintenance: permissions.pages?.maintenance ?? false,
      workOrders: permissions.pages?.workOrders ?? false,
      vendors: permissions.pages?.vendors ?? false,
      utilities: permissions.pages?.utilities ?? false,
      fuel: permissions.pages?.fuel ?? false,
      water: permissions.pages?.water ?? false,
      reports: permissions.pages?.reports ?? false,
      userManagement: permissions.pages?.userManagement ?? false,
      branches: permissions.pages?.branches ?? false,
      sla: permissions.pages?.sla ?? false,
      timesheets: permissions.pages?.timesheets ?? false,
      invoices: permissions.pages?.invoices ?? false,
      documents: permissions.pages?.documents ?? false,
      settings: permissions.pages?.settings ?? false,
    },
    actions: {
      assets: {
        create: permissions.actions?.assets?.create ?? false,
        edit: permissions.actions?.assets?.edit ?? false,
        delete: permissions.actions?.assets?.delete ?? false,
      },
      workOrders: {
        create: permissions.actions?.workOrders?.create ?? false,
        edit: permissions.actions?.workOrders?.edit ?? false,
        close: permissions.actions?.workOrders?.close ?? false,
        delete: permissions.actions?.workOrders?.delete ?? false,
      },
      utilities: {
        addBill: permissions.actions?.utilities?.addBill ?? false,
        approveBill: permissions.actions?.utilities?.approveBill ?? false,
        uploadReceipt: permissions.actions?.utilities?.uploadReceipt ?? false,
      },
      vendors: {
        create: permissions.actions?.vendors?.create ?? false,
        edit: permissions.actions?.vendors?.edit ?? false,
        delete: permissions.actions?.vendors?.delete ?? false,
      },
      users: {
        create: permissions.actions?.users?.create ?? false,
        edit: permissions.actions?.users?.edit ?? false,
        delete: permissions.actions?.users?.delete ?? false,
        managePermissions: permissions.actions?.users?.managePermissions ?? false,
      },
    },
  };
};

// Log safety errors to audit trail
const logSafetyError = (message: string, error: any) => {
  try {
    logAuditEvent({
      action: "System Error",
      entity: "System",
      description: `${message}: ${error?.message || 'Unknown error'}`
    });
  } catch (e) {
    // Fail silently if audit logging fails
  }
};

// Development reset function
export const resetAuthForDevelopment = (): void => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Auth reset is only available in development mode');
    return;
  }

  try {
    localStorage.removeItem('AUTH_SESSION_V1');
    localStorage.removeItem('USERS_CACHE_V1');
    localStorage.removeItem('AUDIT_LOGS_CACHE_V1');
    localStorage.removeItem('MAIN_ADMIN_PIN_V1');
    
    // Redirect to login
    window.location.href = '/login';
  } catch (error) {
    console.error('Error during auth reset:', error);
  }
};