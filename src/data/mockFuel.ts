export interface FuelLevelLog {
  id: string;
  dateTime: string;
  branchSite: string;
  generatorId: string;
  generatorName: string;
  recordedFuelLevel: number;
  minimumRequiredLevel: number;
  reorderRequired: boolean;
  status: "normal" | "low" | "critical";
  recordedBy: string;
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

export const mockFuelLevelLogs: FuelLevelLog[] = [
  {
    id: "FLL001",
    dateTime: "2024-03-15 08:30",
    branchSite: "Accra Main Branch",
    generatorId: "GEN-ACC-001",
    generatorName: "Generator A1",
    recordedFuelLevel: 85,
    minimumRequiredLevel: 60,
    reorderRequired: false,
    status: "normal",
    recordedBy: "Kwame Mensah"
  },
  {
    id: "FLL002",
    dateTime: "2024-03-15 09:00",
    branchSite: "Kumasi Branch",
    generatorId: "GEN-KUM-002",
    generatorName: "Generator B2",
    recordedFuelLevel: 45,
    minimumRequiredLevel: 60,
    reorderRequired: true,
    status: "low",
    recordedBy: "Ama Serwaa"
  },
  {
    id: "FLL003",
    dateTime: "2024-03-15 10:15",
    branchSite: "Tema Branch",
    generatorId: "GEN-TEM-003",
    generatorName: "Generator C1",
    recordedFuelLevel: 25,
    minimumRequiredLevel: 60,
    reorderRequired: true,
    status: "critical",
    recordedBy: "Yaw Boateng"
  },
  {
    id: "FLL004",
    dateTime: "2024-03-15 11:00",
    branchSite: "Takoradi Branch",
    generatorId: "GEN-TAK-004",
    generatorName: "Generator D1",
    recordedFuelLevel: 75,
    minimumRequiredLevel: 60,
    reorderRequired: false,
    status: "normal",
    recordedBy: "Akosua Frimpong"
  }
];

export const mockFuelDeliveries: FuelDelivery[] = [
  {
    id: "FD001",
    branchSite: "Accra Main Branch",
    generator: "Generator A1 (GEN-ACC-001)",
    fuelCardUsed: "5432-****-****-3210",
    omc: "Shell Ghana",
    approvedQuantity: 500,
    deliveredQuantity: 500,
    tankLevelBefore: 200,
    tankLevelAfter: 700,
    discrepancyStatus: "matched",
    escalationStatus: "none",
    deliveryDate: "2024-03-10",
    notes: "Delivery completed successfully",
    createdAt: "2024-03-10T08:30:00"
  },
  {
    id: "FD002",
    branchSite: "Kumasi Branch",
    generator: "Generator B2 (GEN-KUM-002)",
    fuelCardUsed: "5432-****-****-7654",
    omc: "Total Ghana",
    approvedQuantity: 600,
    deliveredQuantity: 580,
    tankLevelBefore: 150,
    tankLevelAfter: 720,
    discrepancyStatus: "short-supplied",
    escalationStatus: "pending",
    deliveryDate: "2024-03-12",
    notes: "Short supply of 20L reported",
    createdAt: "2024-03-12T09:15:00"
  },
  {
    id: "FD003",
    branchSite: "Tema Branch",
    generator: "Generator C1 (GEN-TEM-003)",
    fuelCardUsed: "5432-****-****-9876",
    omc: "Goil Ghana",
    approvedQuantity: 450,
    deliveredQuantity: 470,
    tankLevelBefore: 180,
    tankLevelAfter: 650,
    discrepancyStatus: "over-supplied",
    escalationStatus: "resolved",
    deliveryDate: "2024-03-14",
    notes: "Excess supply of 20L credited",
    createdAt: "2024-03-14T10:45:00"
  }
];
