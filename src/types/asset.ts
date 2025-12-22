export enum AssetType {
  EQUIPMENT = 'equipment',
  HVAC_EQUIPMENT = 'hvac_equipment',
  ELECTRICAL_EQUIPMENT = 'electrical_equipment',
  IT_EQUIPMENT = 'it_equipment',
  FURNITURE = 'furniture',
  SECURITY_EQUIPMENT = 'security_equipment',
  PLUMBING_EQUIPMENT = 'plumbing_equipment',
  FIRE_SAFETY_EQUIPMENT = 'fire_safety_equipment',
  GENERATOR = 'generator',
  ELEVATOR = 'elevator',
  OTHER = 'other'
}

export enum AssetCategory {
  CRITICAL_INFRASTRUCTURE = 'critical_infrastructure',
  OFFICE_EQUIPMENT = 'office_equipment',
  MAINTENANCE_EQUIPMENT = 'maintenance_equipment',
  SAFETY_EQUIPMENT = 'safety_equipment',
  IT_INFRASTRUCTURE = 'it_infrastructure',
  BUILDING_SYSTEMS = 'building_systems'
}

export enum AssetStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNDER_MAINTENANCE = 'under_maintenance',
  MAINTENANCE = 'maintenance',
  DISPOSED = 'disposed',
  RESERVED = 'reserved',
  RETIRED = 'retired'
}

export enum AssetPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  category: AssetCategory;
  description?: string;
  location: {
    branch: string;
    floor?: string;
    room?: string;
    specificLocation?: string;
  };
  technicalDetails: {
    serialNumber?: string;
    model?: string;
    manufacturer?: string;
    supplier?: string;
  };
  financialDetails: {
    purchaseDate?: string;
    purchasePrice?: number;
    warrantyExpiry?: string;
  };
  status: AssetStatus;
  priority: AssetPriority;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  maintenanceHistory?: MaintenanceRecord[];
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  type: 'preventive' | 'corrective' | 'emergency';
  description: string;
  performedBy: string;
  performedDate: Date;
  cost?: number;
  notes?: string;
  status: 'completed' | 'in_progress' | 'scheduled';
}

export interface CreateAssetData {
  name: string;
  type: AssetType;
  category: AssetCategory;
  description?: string;
  location: {
    branch: string;
    floor?: string;
    room?: string;
    specificLocation?: string;
  };
  technicalDetails: {
    serialNumber?: string;
    model?: string;
    manufacturer?: string;
    supplier?: string;
  };
  financialDetails: {
    purchaseDate?: string;
    purchasePrice?: number;
    warrantyExpiry?: string;
  };
  status: AssetStatus;
  priority: AssetPriority;
}

export interface AssetContextType {
  assets: Asset[];
  isLoading: boolean;
  error: string | null;
  addAsset: (assetData: CreateAssetData) => Promise<void>;
  updateAsset: (id: string, assetData: Partial<CreateAssetData>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  getAssetById: (id: string) => Asset | undefined;
  getAssetsByBranch: (branch: string) => Asset[];
  getAssetsByType: (type: AssetType) => Asset[];
  getAssetsByStatus: (status: AssetStatus) => Asset[];
}
