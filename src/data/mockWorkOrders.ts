// Mock work orders based on CreateWorkOrder.tsx requirements
import { mockAssets } from './mockAssets';
import { mockBranches } from './mockBranches';
import { mockVendors } from './mockVendors';

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  type: 'maintenance' | 'repair' | 'inspection' | 'emergency' | 'installation';
  assetId?: string;
  assetName?: string;
  assignedTo?: string;
  assignedVendor?: string;
  location: string;
  branch: string;
  dueDate: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const mockWorkOrders: WorkOrder[] = [
  {
    id: 'wo-001',
    title: 'UPS Battery Replacement - Abeka Lapaz',
    description: 'Replace aging UPS batteries as per maintenance schedule. Current batteries showing reduced capacity.',
    priority: 'high',
    status: 'in_progress',
    type: 'maintenance',
    assetId: 'asset-ups-001',
    assetName: 'SITEPRO S7 10KVA UPS',
    assignedTo: 'REISS & CO.',
    assignedVendor: 'vendor-011',
    location: 'Server Room, Ground Floor',
    branch: 'Abeka Lapaz',
    dueDate: '2024-12-25',
    estimatedHours: 4,
    estimatedCost: 15000,
    notes: 'Batteries ordered, awaiting delivery',
    createdBy: 'admin@absa.com.gh',
    createdAt: '2024-12-10',
    updatedAt: '2024-12-15'
  },
  {
    id: 'wo-002',
    title: 'Generator Preventive Maintenance - Kumasi',
    description: 'Quarterly preventive maintenance for 150KVA generator including oil change, filter replacement, and load test',
    priority: 'critical',
    status: 'assigned',
    type: 'maintenance',
    assetId: 'asset-gen-001',
    assetName: 'Perkins 150KVA Generator',
    assignedTo: 'DANIMAR ENGINEERING LIMITED',
    assignedVendor: 'vendor-009',
    location: 'Generator House, Basement',
    branch: 'Kumasi KPST Main',
    dueDate: '2025-01-05',
    estimatedHours: 8,
    estimatedCost: 8500,
    notes: 'Critical asset - must be completed before due date',
    createdBy: 'admin@absa.com.gh',
    createdAt: '2024-12-01',
    updatedAt: '2024-12-10'
  },
  {
    id: 'wo-003',
    title: 'HVAC System Inspection - High Street',
    description: 'Annual inspection and cleaning of central AC system. Check refrigerant levels and coil condition.',
    priority: 'medium',
    status: 'completed',
    type: 'inspection',
    assetId: 'asset-hvac-001',
    assetName: 'Carrier Central AC System',
    assignedTo: 'ALLIED TEMPERATURE',
    assignedVendor: 'vendor-012',
    location: 'HVAC Room, Roof',
    branch: 'Accra High Street & Prestige',
    dueDate: '2024-11-20',
    completedDate: '2024-11-18',
    estimatedHours: 6,
    actualHours: 5.5,
    estimatedCost: 12000,
    actualCost: 11500,
    notes: 'System in good condition, minor coil cleaning performed',
    createdBy: 'admin@absa.com.gh',
    createdAt: '2024-11-01',
    updatedAt: '2024-11-18'
  },
  {
    id: 'wo-004',
    title: 'Elevator Emergency Repair - Ring Road',
    description: 'Emergency repair - elevator stuck between floors. Passenger safety issue requiring immediate attention.',
    priority: 'critical',
    status: 'completed',
    type: 'emergency',
    assetId: 'asset-elevator-001',
    assetName: 'Otis Passenger Elevator',
    assignedTo: 'ARG ELEVATOR SERVICES',
    assignedVendor: 'vendor-015',
    location: 'Main Lobby',
    branch: 'Ring Road Central & Corporate Service Centre',
    dueDate: '2024-12-05',
    completedDate: '2024-12-05',
    estimatedHours: 4,
    actualHours: 6,
    estimatedCost: 15000,
    actualCost: 18500,
    notes: 'Cable mechanism fault repaired, additional safety checks performed',
    createdBy: 'facilities@absa.com.gh',
    createdAt: '2024-12-05',
    updatedAt: '2024-12-05'
  },
  {
    id: 'wo-005',
    title: 'CCTV Camera Replacement - Circle Branch',
    description: 'Replace 5 faulty exterior CCTV cameras. Cameras showing no feed to DVR system.',
    priority: 'high',
    status: 'assigned',
    type: 'repair',
    assetId: 'asset-sec-001',
    assetName: 'Hikvision CCTV System - 32 Cameras',
    assignedTo: 'TROPIC SHINE',
    assignedVendor: 'vendor-005',
    location: 'Building Exterior',
    branch: 'Circle & Prestige',
    dueDate: '2024-12-28',
    estimatedHours: 8,
    estimatedCost: 25000,
    notes: 'Cameras ordered, installation scheduled for Dec 20',
    createdBy: 'security@absa.com.gh',
    createdAt: '2024-12-12',
    updatedAt: '2024-12-14'
  },
  {
    id: 'wo-006',
    title: 'Fire System Annual Inspection - Makola',
    description: 'Mandatory annual fire safety system inspection and certification',
    priority: 'high',
    status: 'pending',
    type: 'inspection',
    assetId: 'asset-fire-001',
    assetName: 'Fire Suppression System',
    assignedTo: 'BLUPEST COMPANY LIMITED',
    assignedVendor: 'vendor-001',
    location: 'Building Wide',
    branch: 'Makola Square',
    dueDate: '2025-02-15',
    estimatedHours: 4,
    estimatedCost: 8000,
    notes: 'Awaiting vendor confirmation of inspection date',
    createdBy: 'admin@absa.com.gh',
    createdAt: '2024-12-15',
    updatedAt: '2024-12-15'
  },
  {
    id: 'wo-007',
    title: 'Air Purifier Filter Replacement - Achimota',
    description: 'Replace air purifier filters as part of quarterly maintenance schedule',
    priority: 'medium',
    status: 'completed',
    type: 'maintenance',
    assetId: 'asset-purifier-001',
    assetName: 'Bionaire Air Purifier - Banking Hall',
    assignedTo: 'SACRON AIR PURIFIER SERVICES',
    assignedVendor: 'vendor-017',
    location: 'Banking Hall, Ground Floor',
    branch: 'Achimota & Prestige',
    dueDate: '2024-12-10',
    completedDate: '2024-12-08',
    estimatedHours: 2,
    actualHours: 1.5,
    estimatedCost: 2500,
    actualCost: 2500,
    notes: 'Filters replaced, unit tested and operational',
    createdBy: 'admin@absa.com.gh',
    createdAt: '2024-11-25',
    updatedAt: '2024-12-08'
  },
  {
    id: 'wo-008',
    title: 'Plumbing Leak Repair - Osu Branch',
    description: 'Water leak detected in ground floor restroom. Requires immediate attention to prevent water damage.',
    priority: 'high',
    status: 'in_progress',
    type: 'emergency',
    location: 'Ground Floor Restroom',
    branch: 'Osu',
    dueDate: '2024-12-18',
    estimatedHours: 4,
    estimatedCost: 5000,
    notes: 'Plumber on site, source of leak identified',
    createdBy: 'facilities@absa.com.gh',
    createdAt: '2024-12-17',
    updatedAt: '2024-12-17'
  },
  {
    id: 'wo-009',
    title: 'Network Switch Installation - East Legon',
    description: 'Install new 48-port network switch to support additional workstations',
    priority: 'medium',
    status: 'pending',
    type: 'installation',
    location: 'IT Room, First Floor',
    branch: 'East Legon',
    dueDate: '2024-12-30',
    estimatedHours: 6,
    estimatedCost: 35000,
    notes: 'Equipment delivered, awaiting IT team availability',
    createdBy: 'it@absa.com.gh',
    createdAt: '2024-12-14',
    updatedAt: '2024-12-16'
  },
  {
    id: 'wo-010',
    title: 'Janitorial Deep Clean - Takoradi',
    description: 'Deep cleaning of entire branch including carpets, windows, and air vents',
    priority: 'low',
    status: 'assigned',
    type: 'maintenance',
    assignedTo: 'SCIENTIFIC WORLD',
    assignedVendor: 'vendor-008',
    location: 'Entire Branch',
    branch: 'Takoradi High Street',
    dueDate: '2024-12-23',
    estimatedHours: 16,
    estimatedCost: 8000,
    notes: 'Scheduled for weekend to minimize disruption',
    createdBy: 'facilities@absa.com.gh',
    createdAt: '2024-12-10',
    updatedAt: '2024-12-12'
  }
];

export const getWorkOrderById = (id: string): WorkOrder | undefined => {
  return mockWorkOrders.find(wo => wo.id === id);
};

export const getWorkOrdersByBranch = (branch: string): WorkOrder[] => {
  return mockWorkOrders.filter(wo => wo.branch === branch);
};

export const getWorkOrdersByStatus = (status: string): WorkOrder[] => {
  return mockWorkOrders.filter(wo => wo.status === status);
};

export const getWorkOrdersByPriority = (priority: string): WorkOrder[] => {
  return mockWorkOrders.filter(wo => wo.priority === priority);
};

export const getWorkOrdersByVendor = (vendorName: string): WorkOrder[] => {
  return mockWorkOrders.filter(wo => wo.assignedTo === vendorName);
};

export const getOverdueWorkOrders = (): WorkOrder[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockWorkOrders.filter(wo => 
    wo.status !== 'completed' && 
    wo.status !== 'cancelled' && 
    wo.dueDate < today
  );
};
