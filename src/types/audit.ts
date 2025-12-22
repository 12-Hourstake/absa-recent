import { Portal } from "@/types/auth";

export interface AuditLog {
  logId: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  portal: Portal;
  action: string;
  entity: string;
  entityId?: string;
  description: string;
}

export interface LogAuditEventParams {
  action: string;
  entity: string;
  entityId?: string;
  description: string;
}