/**
 * Shared badge utility functions for consistent badge rendering
 */

import { Badge } from "@/components/ui/badge";
import {
  Priority,
  WorkOrderStatus,
  RequestStatus,
  SLAStatus,
  MaintenanceType,
  AssetStatus,
  ContractStatus,
  InventoryStatus,
} from "./constants";
import { UserRole } from "@/types/user";

/**
 * Get priority badge with consistent styling
 */
export const getPriorityBadge = (priority: Priority) => {
  const variants: Record<Priority, { className: string; label: string }> = {
    high: {
      className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      label: "High",
    },
    medium: {
      className: "bg-warning text-warning-foreground hover:bg-warning/90",
      label: "Medium",
    },
    low: {
      className: "bg-muted text-muted-foreground hover:bg-muted/90",
      label: "Low",
    },
  };

  const config = variants[priority];
  return <Badge className={config.className}>{config.label}</Badge>;
};

/**
 * Get work order status badge
 */
export const getWorkOrderStatusBadge = (status: WorkOrderStatus) => {
  const variants: Record<
    WorkOrderStatus,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      label: string;
    }
  > = {
    new: { variant: "outline", label: "New" },
    assigned: { variant: "default", label: "Assigned" },
    in_progress: { variant: "default", label: "In Progress" },
    completed: { variant: "secondary", label: "Completed" },
    cancelled: { variant: "destructive", label: "Cancelled" },
  };

  const config = variants[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

/**
 * Get request status badge
 */
export const getRequestStatusBadge = (status: RequestStatus) => {
  const variants: Record<
    RequestStatus,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      label: string;
    }
  > = {
    new: { variant: "outline", label: "New" },
    in_progress: { variant: "default", label: "In Progress" },
    completed: { variant: "secondary", label: "Completed" },
    cancelled: { variant: "destructive", label: "Cancelled" },
  };

  const config = variants[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

/**
 * Get SLA status badge
 */
export const getSLABadge = (slaStatus: SLAStatus) => {
  const variants: Record<SLAStatus, { className: string; label: string }> = {
    on_track: {
      className: "bg-success text-success-foreground hover:bg-success/90",
      label: "On Track",
    },
    at_risk: {
      className: "bg-warning text-warning-foreground hover:bg-warning/90",
      label: "At Risk",
    },
    breached: {
      className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      label: "SLA Breached",
    },
    met: {
      className: "bg-success text-success-foreground hover:bg-success/90",
      label: "SLA Met",
    },
    missed: {
      className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      label: "SLA Missed",
    },
  };

  const config = variants[slaStatus];
  return <Badge className={config.className}>{config.label}</Badge>;
};

/**
 * Get maintenance type badge
 */
export const getMaintenanceTypeBadge = (type: MaintenanceType) => {
  const variants: Record<MaintenanceType, { className: string; label: string }> = {
    preventive: {
      className: "bg-primary text-primary-foreground",
      label: "Preventive",
    },
    reactive: {
      className: "bg-warning text-warning-foreground",
      label: "Reactive",
    },
  };

  const config = variants[type];
  return <Badge className={config.className}>{config.label}</Badge>;
};

/**
 * Get asset status badge
 */
export const getAssetStatusBadge = (status: AssetStatus) => {
  const variants: Record<AssetStatus, { className: string; label: string }> = {
    active: {
      className: "bg-success text-success-foreground",
      label: "Active",
    },
    inactive: {
      className: "bg-muted text-muted-foreground",
      label: "Inactive",
    },
    under_maintenance: {
      className: "bg-warning text-warning-foreground",
      label: "Under Maintenance",
    },
    disposed: {
      className: "bg-destructive text-destructive-foreground",
      label: "Disposed",
    },
  };

  const config = variants[status];
  return <Badge className={config.className}>{config.label}</Badge>;
};

/**
 * Get contract status badge
 */
export const getContractStatusBadge = (status: ContractStatus) => {
  const variants: Record<ContractStatus, { className: string; label: string }> = {
    active: {
      className: "bg-success text-success-foreground",
      label: "Active",
    },
    expiring: {
      className: "bg-warning text-warning-foreground",
      label: "Expiring Soon",
    },
    expired: {
      className: "bg-destructive text-destructive-foreground",
      label: "Expired",
    },
  };

  const config = variants[status];
  return <Badge className={config.className}>{config.label}</Badge>;
};

/**
 * Get inventory status badge
 */
export const getInventoryStatusBadge = (status: InventoryStatus) => {
  const variants: Record<InventoryStatus, { className: string; label: string }> = {
    in_stock: {
      className: "bg-success text-success-foreground",
      label: "In Stock",
    },
    low_stock: {
      className: "bg-warning text-warning-foreground",
      label: "Low Stock",
    },
    out_of_stock: {
      className: "bg-destructive text-destructive-foreground",
      label: "Out of Stock",
    },
  };

  const config = variants[status];
  return <Badge className={config.className}>{config.label}</Badge>;
};

/**
 * Get user role badge
 */
export const getRoleBadge = (role: UserRole) => {
  const variants: Record<UserRole, { variant: "default" | "secondary" | "destructive"; label: string }> = {
    [UserRole.ADMIN]: { variant: "destructive", label: "Admin" },
    [UserRole.COLLEAGUE_REQUESTER]: { variant: "default", label: "Colleague" },
    [UserRole.VENDOR]: { variant: "secondary", label: "Vendor" },
  };

  const config = variants[role];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
