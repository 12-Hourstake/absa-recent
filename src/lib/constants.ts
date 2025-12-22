/**
 * Shared constants used across the application
 */

// Branch locations
export const BRANCHES = [
  "Accra Main Branch",
  "Kumasi Branch",
  "Takoradi Branch",
  "Tamale Branch",
  "Cape Coast Branch",
  "Sunyani Branch",
] as const;

// Departments
export const DEPARTMENTS = [
  "Facilities Management",
  "Operations",
  "IT",
  "Finance",
  "HR",
  "Security",
  "Maintenance",
] as const;

// Priority levels
export const PRIORITIES = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

// Work order statuses
export const WORK_ORDER_STATUSES = {
  NEW: "new",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

// Request statuses
export const REQUEST_STATUSES = {
  NEW: "new",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

// SLA statuses
export const SLA_STATUSES = {
  ON_TRACK: "on_track",
  AT_RISK: "at_risk",
  BREACHED: "breached",
  MET: "met",
  MISSED: "missed",
} as const;

// Maintenance types
export const MAINTENANCE_TYPES = {
  PREVENTIVE: "preventive",
  REACTIVE: "reactive",
} as const;

// Asset statuses
export const ASSET_STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  UNDER_MAINTENANCE: "under_maintenance",
  DISPOSED: "disposed",
} as const;

// Contract statuses
export const CONTRACT_STATUSES = {
  ACTIVE: "active",
  EXPIRING: "expiring",
  EXPIRED: "expired",
} as const;

// Inventory statuses
export const INVENTORY_STATUSES = {
  IN_STOCK: "in_stock",
  LOW_STOCK: "low_stock",
  OUT_OF_STOCK: "out_of_stock",
} as const;

// ABSA Brand Colors
export const ABSA_COLORS = {
  PRIMARY: "#AF144B",
  PRIMARY_DARK: "#870A3C",
  SECONDARY: "#dc0037",
  ACCENT: "#f9551e",
  GRADIENT_FROM: "#AF144B",
  GRADIENT_TO: "#870A3C",
} as const;

// Chart colors for consistency
export const CHART_COLORS = {
  PRIMARY: "#AF144B",
  SECONDARY: "#870A3C",
  TERTIARY: "#dc0037",
  QUATERNARY: "#ca2b3d",
  SUCCESS: "#10b981",
  WARNING: "#f59e0b",
  DANGER: "#ef4444",
  INFO: "#3b82f6",
} as const;

export type Branch = typeof BRANCHES[number];
export type Department = typeof DEPARTMENTS[number];
export type Priority = typeof PRIORITIES[keyof typeof PRIORITIES];
export type WorkOrderStatus = typeof WORK_ORDER_STATUSES[keyof typeof WORK_ORDER_STATUSES];
export type RequestStatus = typeof REQUEST_STATUSES[keyof typeof REQUEST_STATUSES];
export type SLAStatus = typeof SLA_STATUSES[keyof typeof SLA_STATUSES];
export type MaintenanceType = typeof MAINTENANCE_TYPES[keyof typeof MAINTENANCE_TYPES];
export type AssetStatus = typeof ASSET_STATUSES[keyof typeof ASSET_STATUSES];
export type ContractStatus = typeof CONTRACT_STATUSES[keyof typeof CONTRACT_STATUSES];
export type InventoryStatus = typeof INVENTORY_STATUSES[keyof typeof INVENTORY_STATUSES];
