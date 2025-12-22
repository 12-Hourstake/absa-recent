// Centralized export for all mock data
// This file provides a single import point for all mock data across the application

export * from './mockBranches';
export * from './mockVendors';
export * from './mockVendorAccounts';
export * from './mockColleagues';
export * from './mockAssets';
export * from './mockVehicles';
export * from './mockWorkOrders';
export * from './mockRequests';
export * from './mockUsers';
export * from './mockFuel';
export * from './mockTimesheets';
export * from './mockInvoices';

// Re-export commonly used data for convenience
import { mockBranches, getBranchNames } from './mockBranches';
import { mockVendors, getActiveVendors } from './mockVendors';
import { mockVendorAccounts, getActiveVendorAccounts } from './mockVendorAccounts';
import { mockColleagues, getActiveColleagues, getTopRequestors } from './mockColleagues';
import { mockAssets, getCriticalAssets } from './mockAssets';
import { mockVehicles, getActiveVehicles } from './mockVehicles';
import { mockWorkOrders, getOverdueWorkOrders } from './mockWorkOrders';
import { mockMaintenanceRequests, mockIncidentReports, getUrgentRequests } from './mockRequests';
import { mockUsers, getActiveUsers } from './mockUsers';
import { mockFuelLevelLogs, mockFuelDeliveries } from './mockFuel';
import { mockTimesheets, mockOvertimeRequests } from './mockTimesheets';
import { mockInvoices, mockBillingInvoices } from './mockInvoices';

export const mockData = {
  branches: mockBranches,
  vendors: mockVendors,
  vendorAccounts: mockVendorAccounts,
  colleagues: mockColleagues,
  assets: mockAssets,
  vehicles: mockVehicles,
  workOrders: mockWorkOrders,
  maintenanceRequests: mockMaintenanceRequests,
  incidentReports: mockIncidentReports,
  users: mockUsers,
  fuelLevelLogs: mockFuelLevelLogs,
  fuelDeliveries: mockFuelDeliveries,
  timesheets: mockTimesheets,
  overtimeRequests: mockOvertimeRequests,
  invoices: mockInvoices,
  billingInvoices: mockBillingInvoices
};

export const quickAccess = {
  branchNames: getBranchNames(),
  activeVendors: getActiveVendors(),
  activeVendorAccounts: getActiveVendorAccounts(),
  activeColleagues: getActiveColleagues(),
  topRequestors: getTopRequestors(),
  criticalAssets: getCriticalAssets(),
  activeVehicles: getActiveVehicles(),
  overdueWorkOrders: getOverdueWorkOrders(),
  urgentRequests: getUrgentRequests(),
  activeUsers: getActiveUsers()
};

// Summary statistics
export const mockDataSummary = {
  totalBranches: mockBranches.length,
  totalVendors: mockVendors.length,
  totalVendorAccounts: mockVendorAccounts.length,
  totalColleagues: mockColleagues.length,
  totalAssets: mockAssets.length,
  totalVehicles: mockVehicles.length,
  totalWorkOrders: mockWorkOrders.length,
  totalRequests: mockMaintenanceRequests.length,
  totalIncidents: mockIncidentReports.length,
  totalUsers: mockUsers.length,
  activeBranches: mockBranches.filter(b => b.status === 'active').length,
  activeVendors: getActiveVendors().length,
  activeVendorAccounts: getActiveVendorAccounts().length,
  activeColleagues: getActiveColleagues().length,
  criticalAssets: getCriticalAssets().length,
  activeVehicles: getActiveVehicles().length,
  overdueWorkOrders: getOverdueWorkOrders().length,
  urgentRequests: getUrgentRequests().length,
  activeUsers: getActiveUsers().length
};
