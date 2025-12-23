import { FuelType } from "./fuelContext";

// Interfaces for different fuel data types
export interface FuelLevelLog {
  id: string;
  dateTime: string;
  branchSite: string;
  generatorId: string;
  generatorName: string;
  recordedFuelLevel: number;
  minimumRequiredLevel: number;
  reorderRequired: boolean;
  recordedBy: string;
  notes?: string;
  createdDate: string;
}

export interface FuelReorderRequest {
  id: string;
  branchSite: string;
  generatorId: string;
  generatorName: string;
  currentFuelLevel: number;
  requestedQuantity: number;
  requestReason: string;
  requestDate: string;
  status: 'Pending Approval' | 'Approved' | 'Corrections Required' | 'Rejected';
  approvedBy?: string;
  approvalDate?: string;
  corrections?: string;
  createdDate: string;
}

export interface FuelCard {
  id: string;
  cardNumber: string;
  assignedBranch: string;
  generatorName: string;
  generatorId: string;
  status: "in-safe" | "in-use" | "suspended";
  lastUsedDate: string;
  dualControl: boolean;
  notes: string;
  createdAt: string;
}

export interface FuelDelivery {
  id: string;
  branchSite: string;
  generator: string;
  fuelCardUsed: string;
  omc: string;
  approvedQuantity: number;
  deliveredQuantity: number;
  tankLevelBefore: number;
  tankLevelAfter: number;
  discrepancyStatus: "matched" | "short-supplied" | "over-supplied";
  escalationStatus: "none" | "pending" | "resolved";
  deliveryDate: string;
  notes: string;
  createdAt: string;
}

export interface MonthlyReconciliation {
  id: string;
  month: string;
  branchSite: string;
  totalApproved: number;
  totalDelivered: number;
  omcStatement: number;
  variance: number;
  status: "pending" | "balanced" | "discrepancy" | "resolved";
  verifiedBy: string;
  dateVerified: string;
  notes: string;
}

export interface FuelAudit {
  id: string;
  deliveryId: string;
  branchSite: string;
  auditType: "snap-check" | "emergency-review";
  approvalTrailVerified: boolean;
  deliveryAccuracyVerified: boolean;
  documentationComplete: boolean;
  findings: string;
  actionRequired: string;
  status: "open" | "addressed" | "closed";
  auditDate: string;
  auditorName: string;
  createdAt: string;
}

// Separate data sources for Generator and Vehicle fuel
const GENERATOR_DATA = {
  fuelLogs: [
    {
      id: "GFL001",
      dateTime: "2024-01-15T08:30:00Z",
      branchSite: "Accra Main Branch",
      generatorId: "GEN-ACC-001",
      generatorName: "Main Backup Generator",
      recordedFuelLevel: 850,
      minimumRequiredLevel: 500,
      reorderRequired: false,
      recordedBy: "Security Team Alpha",
      notes: "Normal operation levels",
      createdDate: "2024-01-15"
    },
    {
      id: "GFL002", 
      dateTime: "2024-01-14T09:15:00Z",
      branchSite: "Kumasi Branch",
      generatorId: "GEN-KUM-001", 
      generatorName: "Emergency Generator",
      recordedFuelLevel: 300,
      minimumRequiredLevel: 400,
      reorderRequired: true,
      recordedBy: "Facilities Team",
      notes: "Below minimum threshold",
      createdDate: "2024-01-14"
    }
  ],
  reorderRequests: [
    {
      id: "GRQ001",
      branchSite: "Kumasi Branch",
      generatorId: "GEN-KUM-001",
      generatorName: "Emergency Generator", 
      currentFuelLevel: 300,
      requestedQuantity: 800,
      requestReason: "Below minimum threshold - emergency backup required",
      requestDate: "2024-01-14",
      status: "Pending Approval" as const,
      createdDate: "2024-01-14"
    }
  ],
  fuelCards: [
    {
      id: "GFC001",
      cardNumber: "5432-1098-7654-3210",
      assignedBranch: "Accra Main Branch",
      generatorName: "Main Backup Generator",
      generatorId: "GEN-ACC-001",
      status: "in-use" as const,
      lastUsedDate: "2024-01-15",
      dualControl: true,
      notes: "Primary site generator card",
      createdAt: "2024-01-01"
    },
    {
      id: "GFC002",
      cardNumber: "5432-1098-7654-3211", 
      assignedBranch: "Kumasi Branch",
      generatorName: "Emergency Generator",
      generatorId: "GEN-KUM-001",
      status: "in-safe" as const,
      lastUsedDate: "2024-01-10",
      dualControl: true,
      notes: "Emergency backup generator",
      createdAt: "2024-01-01"
    }
  ],
  deliveries: [
    {
      id: "GFD001",
      branchSite: "Accra Main Branch",
      generator: "Main Backup Generator (GEN-ACC-001)",
      fuelCardUsed: "5432-****-****-3210",
      omc: "Shell Ghana",
      approvedQuantity: 1000,
      deliveredQuantity: 1000,
      tankLevelBefore: 200,
      tankLevelAfter: 1200,
      discrepancyStatus: "matched" as const,
      escalationStatus: "none" as const,
      deliveryDate: "2024-01-12",
      notes: "Bulk delivery to site tank",
      createdAt: "2024-01-12"
    }
  ],
  reconciliations: [
    {
      id: "GRC-2024-01-ACC",
      month: "January 2024",
      branchSite: "Accra Main Branch",
      totalApproved: 2000,
      totalDelivered: 2000,
      omcStatement: 2000,
      variance: 0,
      status: "balanced" as const,
      verifiedBy: "Site Manager",
      dateVerified: "2024-02-05",
      notes: "Generator fuel reconciliation complete"
    }
  ],
  audits: [
    {
      id: "GAD001",
      deliveryId: "GFD001",
      branchSite: "Accra Main Branch",
      auditType: "snap-check" as const,
      approvalTrailVerified: true,
      deliveryAccuracyVerified: true,
      documentationComplete: true,
      findings: "Generator fuel procedures followed correctly",
      actionRequired: "None",
      status: "closed" as const,
      auditDate: "2024-01-16",
      auditorName: "Generator Audit Team",
      createdAt: "2024-01-16"
    }
  ]
};

const VEHICLE_DATA = {
  fuelLogs: [
    {
      id: "VFL001",
      dateTime: "2024-01-15T14:20:00Z",
      branchSite: "Fleet Operations Center",
      generatorId: "VEH-001",
      generatorName: "Toyota Hilux - Security Patrol",
      recordedFuelLevel: 45,
      minimumRequiredLevel: 25,
      reorderRequired: false,
      recordedBy: "Fleet Coordinator",
      notes: "Post-patrol fuel check",
      createdDate: "2024-01-15"
    },
    {
      id: "VFL002",
      dateTime: "2024-01-14T16:45:00Z", 
      branchSite: "Regional Office",
      generatorId: "VEH-002",
      generatorName: "Ford Transit - Cash Transport",
      recordedFuelLevel: 15,
      minimumRequiredLevel: 20,
      reorderRequired: true,
      recordedBy: "Transport Manager",
      notes: "Low fuel after cash run",
      createdDate: "2024-01-14"
    }
  ],
  reorderRequests: [
    {
      id: "VRQ001",
      branchSite: "Regional Office",
      generatorId: "VEH-002",
      generatorName: "Ford Transit - Cash Transport",
      currentFuelLevel: 15,
      requestedQuantity: 60,
      requestReason: "Vehicle fuel below minimum for operational requirements",
      requestDate: "2024-01-14",
      status: "Approved" as const,
      approvedBy: "Fleet Manager",
      approvalDate: "2024-01-15",
      createdDate: "2024-01-14"
    }
  ],
  fuelCards: [
    {
      id: "VFC001",
      cardNumber: "6543-2109-8765-4321",
      assignedBranch: "Fleet Operations Center",
      generatorName: "Toyota Hilux - Security Patrol",
      generatorId: "VEH-001",
      status: "in-use" as const,
      lastUsedDate: "2024-01-15",
      dualControl: false,
      notes: "Assigned to security vehicle",
      createdAt: "2024-01-01"
    },
    {
      id: "VFC002",
      cardNumber: "6543-2109-8765-4322",
      assignedBranch: "Regional Office", 
      generatorName: "Ford Transit - Cash Transport",
      generatorId: "VEH-002",
      status: "in-safe" as const,
      lastUsedDate: "2024-01-14",
      dualControl: true,
      notes: "High-security transport vehicle",
      createdAt: "2024-01-01"
    }
  ],
  deliveries: [
    {
      id: "VFD001",
      branchSite: "Shell Station - Ring Road",
      generator: "Toyota Hilux - Security Patrol (VEH-001)",
      fuelCardUsed: "6543-****-****-4321",
      omc: "Shell Ghana",
      approvedQuantity: 50,
      deliveredQuantity: 50,
      tankLevelBefore: 20,
      tankLevelAfter: 70,
      discrepancyStatus: "matched" as const,
      escalationStatus: "none" as const,
      deliveryDate: "2024-01-13",
      notes: "Routine vehicle refuel at pump",
      createdAt: "2024-01-13"
    }
  ],
  reconciliations: [
    {
      id: "VRC-2024-01-FLT",
      month: "January 2024",
      branchSite: "Fleet Operations Center",
      totalApproved: 800,
      totalDelivered: 780,
      omcStatement: 800,
      variance: 20,
      status: "discrepancy" as const,
      verifiedBy: "",
      dateVerified: "",
      notes: "Vehicle fuel variance under investigation"
    }
  ],
  audits: [
    {
      id: "VAD001",
      deliveryId: "VFD001",
      branchSite: "Fleet Operations Center",
      auditType: "emergency-review" as const,
      approvalTrailVerified: true,
      deliveryAccuracyVerified: false,
      documentationComplete: true,
      findings: "Vehicle fuel card usage not properly logged",
      actionRequired: "Update vehicle fuel logging procedures",
      status: "addressed" as const,
      auditDate: "2024-01-15",
      auditorName: "Fleet Audit Team",
      createdAt: "2024-01-15"
    }
  ]
};

// Data manager class
export class FuelDataManager {
  private static getStorageKey(fuelType: FuelType, dataType: string): string {
    return `${fuelType}_${dataType}_CACHE_V1`;
  }

  // Generic data loader
  private static loadData<T>(fuelType: FuelType, dataType: string, defaultData: T[]): T[] {
    try {
      const cached = localStorage.getItem(this.getStorageKey(fuelType, dataType));
      if (cached) {
        return JSON.parse(cached);
      }
      // Initialize with default data and save
      this.saveData(fuelType, dataType, defaultData);
      return defaultData;
    } catch (error) {
      console.error(`Error loading ${fuelType} ${dataType}:`, error);
      return defaultData;
    }
  }

  // Generic data saver
  private static saveData<T>(fuelType: FuelType, dataType: string, data: T[]): void {
    try {
      localStorage.setItem(this.getStorageKey(fuelType, dataType), JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${fuelType} ${dataType}:`, error);
    }
  }

  // Fuel Logs
  static getFuelLogs(fuelType: FuelType): FuelLevelLog[] {
    const defaultData = fuelType === "GENERATOR" ? GENERATOR_DATA.fuelLogs : VEHICLE_DATA.fuelLogs;
    return this.loadData(fuelType, "FUEL_LOGS", defaultData);
  }

  static saveFuelLogs(fuelType: FuelType, data: FuelLevelLog[]): void {
    this.saveData(fuelType, "FUEL_LOGS", data);
  }

  // Reorder Requests
  static getReorderRequests(fuelType: FuelType): FuelReorderRequest[] {
    const defaultData = fuelType === "GENERATOR" ? GENERATOR_DATA.reorderRequests : VEHICLE_DATA.reorderRequests;
    return this.loadData(fuelType, "REORDER_REQUESTS", defaultData);
  }

  static saveReorderRequests(fuelType: FuelType, data: FuelReorderRequest[]): void {
    this.saveData(fuelType, "REORDER_REQUESTS", data);
  }

  // Fuel Cards
  static getFuelCards(fuelType: FuelType): FuelCard[] {
    const defaultData = fuelType === "GENERATOR" ? GENERATOR_DATA.fuelCards : VEHICLE_DATA.fuelCards;
    return this.loadData(fuelType, "FUEL_CARDS", defaultData);
  }

  static saveFuelCards(fuelType: FuelType, data: FuelCard[]): void {
    this.saveData(fuelType, "FUEL_CARDS", data);
  }

  // Deliveries
  static getDeliveries(fuelType: FuelType): FuelDelivery[] {
    const defaultData = fuelType === "GENERATOR" ? GENERATOR_DATA.deliveries : VEHICLE_DATA.deliveries;
    return this.loadData(fuelType, "DELIVERIES", defaultData);
  }

  static saveDeliveries(fuelType: FuelType, data: FuelDelivery[]): void {
    this.saveData(fuelType, "DELIVERIES", data);
  }

  // Reconciliations
  static getReconciliations(fuelType: FuelType): MonthlyReconciliation[] {
    const defaultData = fuelType === "GENERATOR" ? GENERATOR_DATA.reconciliations : VEHICLE_DATA.reconciliations;
    return this.loadData(fuelType, "RECONCILIATIONS", defaultData);
  }

  static saveReconciliations(fuelType: FuelType, data: MonthlyReconciliation[]): void {
    this.saveData(fuelType, "RECONCILIATIONS", data);
  }

  // Audits
  static getAudits(fuelType: FuelType): FuelAudit[] {
    const defaultData = fuelType === "GENERATOR" ? GENERATOR_DATA.audits : VEHICLE_DATA.audits;
    return this.loadData(fuelType, "AUDITS", defaultData);
  }

  static saveAudits(fuelType: FuelType, data: FuelAudit[]): void {
    this.saveData(fuelType, "AUDITS", data);
  }
}