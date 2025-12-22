import { logAuditEvent } from "@/utils/auditLogger";
import { LogAuditEventParams } from "@/types/audit";

export const useAuditLog = () => {
  const log = (params: LogAuditEventParams) => {
    logAuditEvent(params);
  };

  const logAssetAction = (action: string, assetId?: string, description?: string) => {
    log({
      action,
      entity: "Asset",
      entityId: assetId,
      description: description || `${action} asset ${assetId || ''}`
    });
  };

  const logWorkOrderAction = (action: string, workOrderId?: string, description?: string) => {
    log({
      action,
      entity: "WorkOrder", 
      entityId: workOrderId,
      description: description || `${action} work order ${workOrderId || ''}`
    });
  };

  const logUtilityAction = (action: string, utilityType: string, description?: string) => {
    log({
      action,
      entity: "Utility",
      description: description || `${action} ${utilityType} utility`
    });
  };

  const logVendorAction = (action: string, vendorId?: string, description?: string) => {
    log({
      action,
      entity: "Vendor",
      entityId: vendorId,
      description: description || `${action} vendor ${vendorId || ''}`
    });
  };

  return {
    log,
    logAssetAction,
    logWorkOrderAction,
    logUtilityAction,
    logVendorAction,
  };
};