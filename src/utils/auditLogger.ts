import { AuditLog, LogAuditEventParams } from "@/types/audit";

const AUDIT_LOGS_CACHE_KEY = "AUDIT_LOGS_CACHE_V1";
const AUTH_SESSION_KEY = "AUTH_SESSION_V1";
const MAX_LOGS = 1000;

export const logAuditEvent = (params: LogAuditEventParams): void => {
  try {
    // Get current session
    const sessionData = localStorage.getItem(AUTH_SESSION_KEY);
    if (!sessionData) return;

    const session = JSON.parse(sessionData);
    
    // Create audit log entry
    const auditLog: AuditLog = {
      logId: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: session.userId,
      userName: session.fullName,
      role: session.role,
      portal: session.portal,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      description: params.description,
    };

    // Get existing logs
    const existingLogs = getAuditLogs();
    
    // Add new log at the beginning
    const updatedLogs = [auditLog, ...existingLogs];
    
    // Keep only the last MAX_LOGS entries
    const trimmedLogs = updatedLogs.slice(0, MAX_LOGS);
    
    // Save back to localStorage
    localStorage.setItem(AUDIT_LOGS_CACHE_KEY, JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error("Failed to log audit event:", error);
  }
};

export const getAuditLogs = (): AuditLog[] => {
  try {
    const logs = localStorage.getItem(AUDIT_LOGS_CACHE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error("Failed to get audit logs:", error);
    return [];
  }
};

export const clearAuditLogs = (): void => {
  try {
    localStorage.setItem(AUDIT_LOGS_CACHE_KEY, JSON.stringify([]));
  } catch (error) {
    console.error("Failed to clear audit logs:", error);
  }
};