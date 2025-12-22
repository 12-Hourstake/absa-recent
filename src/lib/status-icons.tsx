/**
 * Shared status icon utilities for consistent icon rendering
 */

import {
  Circle,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileText,
  XCircle,
  AlertTriangle,
  Shield,
  UserCheck,
  Building2,
  Users,
} from "lucide-react";
import { WorkOrderStatus, RequestStatus } from "./constants";
import { UserRole } from "@/types/user";

/**
 * Get work order status icon
 */
export const getWorkOrderStatusIcon = (status: WorkOrderStatus, className?: string) => {
  const iconClass = className || "h-4 w-4";

  switch (status) {
    case "new":
      return <Circle className={`${iconClass} text-muted-foreground`} />;
    case "assigned":
      return <Clock className={`${iconClass} text-primary`} />;
    case "in_progress":
      return <AlertCircle className={`${iconClass} text-warning`} />;
    case "completed":
      return <CheckCircle2 className={`${iconClass} text-success`} />;
    case "cancelled":
      return <XCircle className={`${iconClass} text-destructive`} />;
    default:
      return <Circle className={`${iconClass}`} />;
  }
};

/**
 * Get request status icon
 */
export const getRequestStatusIcon = (status: RequestStatus, className?: string) => {
  const iconClass = className || "h-4 w-4";

  switch (status) {
    case "new":
      return <FileText className={`${iconClass} text-muted-foreground`} />;
    case "in_progress":
      return <Clock className={`${iconClass} text-primary`} />;
    case "completed":
      return <CheckCircle2 className={`${iconClass} text-success`} />;
    case "cancelled":
      return <XCircle className={`${iconClass} text-destructive`} />;
    default:
      return <FileText className={`${iconClass}`} />;
  }
};

/**
 * Get user role icon
 */
export const getRoleIcon = (role: UserRole, className?: string) => {
  const iconClass = className || "h-4 w-4";

  switch (role) {
    case UserRole.ADMIN:
      return <Shield className={iconClass} />;
    case UserRole.COLLEAGUE_REQUESTER:
      return <UserCheck className={iconClass} />;
    case UserRole.VENDOR:
      return <Building2 className={iconClass} />;
    default:
      return <Users className={iconClass} />;
  }
};

/**
 * Get priority icon
 */
export const getPriorityIcon = (priority: "high" | "medium" | "low", className?: string) => {
  const iconClass = className || "h-4 w-4";

  switch (priority) {
    case "high":
      return <AlertTriangle className={`${iconClass} text-destructive`} />;
    case "medium":
      return <AlertCircle className={`${iconClass} text-warning`} />;
    case "low":
      return <Circle className={`${iconClass} text-muted-foreground`} />;
    default:
      return <Circle className={iconClass} />;
  }
};
