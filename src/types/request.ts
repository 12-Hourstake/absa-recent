// Original maintenance request types
export enum RequestType {
  MAINTENANCE = 'MAINTENANCE',
  FACILITIES = 'FACILITIES',
  IT_SUPPORT = 'IT_SUPPORT',
  CLEANING = 'CLEANING',
  SECURITY = 'SECURITY'
}

export enum RequestPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum RequestStatus {
  SUBMITTED = 'SUBMITTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum IncidentType {
  EMERGENCY = 'EMERGENCY',
  SECURITY = 'SECURITY',
  EQUIPMENT_FAILURE = 'EQUIPMENT_FAILURE',
  SAFETY = 'SAFETY'
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Location {
  branch: string;
  floor: string;
  room: string;
  specificLocation: string;
}

export interface Submitter {
  userId: string;
  name: string;
  email: string;
  department: string;
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  type: RequestType;
  priority: RequestPriority;
  status: RequestStatus;
  location: Location;
  submittedBy: Submitter;
  submittedAt: Date;
  assignedTo?: string;
  estimatedCompletion?: Date;
  actualCompletion?: Date;
  photos: string[];
  notes?: string;
}

export interface IncidentReport {
  id: string;
  title: string;
  description: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: RequestStatus;
  location: Location;
  reportedBy: Submitter;
  reportedAt: Date;
  assignedTo?: string;
  resolvedAt?: Date;
  photos: string[];
  actionsTaken?: string;
}

// New fuel/water request types
export type FuelWaterRequestType = "GEN_FUEL" | "CAR_FUEL" | "WATER";
export type FuelWaterRequestStatus = "PENDING" | "APPROVED" | "DENIED";

export interface FuelWaterRequest {
  requestId: string;
  requestType: FuelWaterRequestType;
  name: string;
  assetName?: string;
  customAssetName?: string;
  description?: string;
  quantity: string;
  mode: "CARD_AND_PIN";
  createdBy: string;
  approvedBy?: string;
  createdOn: string;
  approvedOn?: string;
  status: FuelWaterRequestStatus;
  adminComment?: string;
}

export interface CreateFuelWaterRequestData {
  requestType: FuelWaterRequestType;
  name: string;
  assetName?: string;
  customAssetName?: string;
  description?: string;
  quantity: string;
  createdBy: string;
}