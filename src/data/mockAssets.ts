// Mock data derived from ASSET REGISTER.xlsx
import { Asset, AssetType, AssetCategory, AssetStatus, AssetPriority } from '@/types/asset';
import { mockBranches } from './mockBranches';
import { mockVendors } from './mockVendors';

export const mockAssets: Asset[] = [
  // UPS Systems from Excel data
  {
    id: 'asset-ups-001',
    name: 'SITEPRO S7 10KVA UPS',
    type: AssetType.ELECTRICAL_EQUIPMENT,
    category: AssetCategory.CRITICAL_INFRASTRUCTURE,
    description: 'Uninterruptible Power Supply - 10KVA capacity',
    location: {
      branch: 'Abeka Lapaz',
      floor: 'Ground Floor',
      room: 'Server Room',
      specificLocation: 'UPS Room'
    },
    technicalDetails: {
      serialNumber: 'A70102107A526M',
      model: 'SITEPRO S7',
      manufacturer: 'Sitepro',
      supplier: 'REISS & CO.'
    },
    financialDetails: {
      purchaseDate: '2007-09-01',
      purchasePrice: 45000,
      warrantyExpiry: '2010-09-01'
    },
    status: AssetStatus.ACTIVE,
    priority: AssetPriority.CRITICAL,
    createdAt: new Date('2007-09-01'),
    updatedAt: new Date('2024-10-19'),
    createdBy: 'admin@absa.com.gh',
    lastMaintenanceDate: new Date('2024-10-19'),
    nextMaintenanceDate: new Date('2025-04-19'),
    maintenanceHistory: []
  },
  {
    id: 'asset-ups-002',
    name: 'Ortea Orion 20KVA AVR',
    type: AssetType.ELECTRICAL_EQUIPMENT,
    category: AssetCategory.CRITICAL_INFRASTRUCTURE,
    description: 'Automatic Voltage Regulator - 20KVA capacity',
    location: {
      branch: 'Osu',
      floor: 'Ground Floor',
      room: 'Electrical Room',
      specificLocation: 'AVR Cabinet'
    },
    technicalDetails: {
      serialNumber: 'Y0300857-1914',
      model: 'Ortea Orion',
      manufacturer: 'Ortea',
      supplier: 'REISS & CO.'
    },
    financialDetails: {
      purchaseDate: '2015-04-15',
      purchasePrice: 85000,
      warrantyExpiry: '2018-04-15'
    },
    status: AssetStatus.ACTIVE,
    priority: AssetPriority.HIGH,
    createdAt: new Date('2015-04-15'),
    updatedAt: new Date('2024-11-10'),
    createdBy: 'admin@absa.com.gh',
    lastMaintenanceDate: new Date('2024-09-15'),
    nextMaintenanceDate: new Date('2025-03-15'),
    maintenanceHistory: []
  },
  {
    id: 'asset-gen-001',
    name: 'Perkins 150KVA Generator',
    type: AssetType.GENERATOR,
    category: AssetCategory.CRITICAL_INFRASTRUCTURE,
    description: 'Backup diesel generator - 150KVA capacity',
    location: {
      branch: 'Kumasi KPST Main',
      floor: 'Basement',
      room: 'Generator House',
      specificLocation: 'Main Generator'
    },
    technicalDetails: {
      serialNumber: 'PKS-150-2020-045',
      model: 'Perkins 150KVA',
      manufacturer: 'Perkins',
      supplier: 'DANIMAR ENGINEERING LIMITED'
    },
    financialDetails: {
      purchaseDate: '2020-08-15',
      purchasePrice: 320000,
      warrantyExpiry: '2023-08-15'
    },
    status: AssetStatus.ACTIVE,
    priority: AssetPriority.CRITICAL,
    createdAt: new Date('2020-08-15'),
    updatedAt: new Date('2024-12-01'),
    createdBy: 'admin@absa.com.gh',
    lastMaintenanceDate: new Date('2024-12-01'),
    nextMaintenanceDate: new Date('2025-01-01'),
    maintenanceHistory: []
  },
  {
    id: 'asset-hvac-001',
    name: 'Carrier Central AC System',
    type: AssetType.HVAC_EQUIPMENT,
    category: AssetCategory.BUILDING_SYSTEMS,
    description: 'Central air conditioning system - 50 ton capacity',
    location: {
      branch: 'Accra High Street & Prestige',
      floor: 'Roof',
      room: 'HVAC Room',
      specificLocation: 'Central Chiller'
    },
    technicalDetails: {
      serialNumber: 'CAR-50T-2021-088',
      model: 'Carrier 50RB',
      manufacturer: 'Carrier',
      supplier: 'ALLIED TEMPERATURE'
    },
    financialDetails: {
      purchaseDate: '2021-06-10',
      purchasePrice: 450000,
      warrantyExpiry: '2024-06-10'
    },
    status: AssetStatus.ACTIVE,
    priority: AssetPriority.HIGH,
    createdAt: new Date('2021-06-10'),
    updatedAt: new Date('2024-11-15'),
    createdBy: 'admin@absa.com.gh',
    lastMaintenanceDate: new Date('2024-11-15'),
    nextMaintenanceDate: new Date('2025-02-15'),
    maintenanceHistory: []
  },
  {
    id: 'asset-elevator-001',
    name: 'Otis Passenger Elevator',
    type: AssetType.ELEVATOR,
    category: AssetCategory.BUILDING_SYSTEMS,
    description: 'Main passenger elevator - 8 person capacity',
    location: {
      branch: 'Ring Road Central & Corporate Service Centre',
      floor: 'All Floors',
      room: 'Main Lobby',
      specificLocation: 'Elevator Bank A'
    },
    technicalDetails: {
      serialNumber: 'OTIS-GEN2-2019-012',
      model: 'Otis Gen2',
      manufacturer: 'Otis',
      supplier: 'ARG ELEVATOR SERVICES'
    },
    financialDetails: {
      purchaseDate: '2019-11-05',
      purchasePrice: 380000,
      warrantyExpiry: '2024-11-05'
    },
    status: AssetStatus.ACTIVE,
    priority: AssetPriority.HIGH,
    createdAt: new Date('2019-11-05'),
    updatedAt: new Date('2024-12-03'),
    createdBy: 'admin@absa.com.gh',
    lastMaintenanceDate: new Date('2024-12-03'),
    nextMaintenanceDate: new Date('2025-01-03'),
    maintenanceHistory: []
  },
  {
    id: 'asset-sec-001',
    name: 'Hikvision CCTV System - 32 Cameras',
    type: AssetType.SECURITY_EQUIPMENT,
    category: AssetCategory.SAFETY_EQUIPMENT,
    description: 'IP CCTV surveillance system with 32 cameras',
    location: {
      branch: 'Circle & Prestige',
      floor: 'All Floors',
      room: 'Security Office',
      specificLocation: 'Central DVR'
    },
    technicalDetails: {
      serialNumber: 'HIK-DS-2023-056',
      model: 'Hikvision DS-2CD2385G1',
      manufacturer: 'Hikvision',
      supplier: 'TROPIC SHINE'
    },
    financialDetails: {
      purchaseDate: '2023-02-20',
      purchasePrice: 125000,
      warrantyExpiry: '2026-02-20'
    },
    status: AssetStatus.ACTIVE,
    priority: AssetPriority.HIGH,
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2024-10-11'),
    createdBy: 'admin@absa.com.gh',
    lastMaintenanceDate: new Date('2024-10-10'),
    nextMaintenanceDate: new Date('2025-04-10'),
    maintenanceHistory: []
  },
  {
    id: 'asset-purifier-001',
    name: 'Bionaire Air Purifier - Banking Hall',
    type: AssetType.OTHER,
    category: AssetCategory.OFFICE_EQUIPMENT,
    description: 'Air purifier for banking hall - 170M2/H capacity',
    location: {
      branch: 'Achimota & Prestige',
      floor: 'Ground Floor',
      room: 'Banking Hall',
      specificLocation: 'Central Area'
    },
    technicalDetails: {
      serialNumber: 'BBG/011/FF/046',
      model: 'BAP1300RC',
      manufacturer: 'Bionaire',
      supplier: 'SACRON AIR PURIFIER SERVICES'
    },
    financialDetails: {
      purchaseDate: '2009-01-01',
      purchasePrice: 8500,
      warrantyExpiry: '2011-01-01'
    },
    status: AssetStatus.ACTIVE,
    priority: AssetPriority.MEDIUM,
    createdAt: new Date('2009-01-01'),
    updatedAt: new Date('2024-08-15'),
    createdBy: 'admin@absa.com.gh',
    lastMaintenanceDate: new Date('2024-08-15'),
    nextMaintenanceDate: new Date('2025-02-15'),
    maintenanceHistory: []
  },
  {
    id: 'asset-server-001',
    name: 'Dell PowerEdge Server Rack',
    type: AssetType.IT_EQUIPMENT,
    category: AssetCategory.IT_INFRASTRUCTURE,
    description: 'Core banking server infrastructure',
    location: {
      branch: 'Ring Road Central & Corporate Service Centre',
      floor: 'Ground Floor',
      room: 'Data Center',
      specificLocation: 'Rack Row 1'
    },
    technicalDetails: {
      serialNumber: 'DELL-PE-2022-001',
      model: 'PowerEdge R750',
      manufacturer: 'Dell Technologies',
      supplier: 'REISS & CO.'
    },
    financialDetails: {
      purchaseDate: '2022-01-15',
      purchasePrice: 380000,
      warrantyExpiry: '2025-01-15'
    },
    status: AssetStatus.ACTIVE,
    priority: AssetPriority.CRITICAL,
    createdAt: new Date('2022-01-15'),
    updatedAt: new Date('2024-12-10'),
    createdBy: 'admin@absa.com.gh',
    lastMaintenanceDate: new Date('2024-12-05'),
    nextMaintenanceDate: new Date('2025-03-05'),
    maintenanceHistory: []
  },
  {
    id: 'asset-fire-001',
    name: 'Fire Suppression System',
    type: AssetType.FIRE_SAFETY_EQUIPMENT,
    category: AssetCategory.SAFETY_EQUIPMENT,
    description: 'Automatic fire detection and suppression system',
    location: {
      branch: 'Makola Square',
      floor: 'All Floors',
      room: 'Building Wide',
      specificLocation: 'Control Panel - Security'
    },
    technicalDetails: {
      serialNumber: 'FIRE-SYS-2020-033',
      model: 'Honeywell FS90',
      manufacturer: 'Honeywell',
      supplier: 'BLUPEST COMPANY LIMITED'
    },
    financialDetails: {
      purchaseDate: '2020-03-15',
      purchasePrice: 280000,
      warrantyExpiry: '2025-03-15'
    },
    status: AssetStatus.ACTIVE,
    priority: AssetPriority.CRITICAL,
    createdAt: new Date('2020-03-15'),
    updatedAt: new Date('2024-11-20'),
    createdBy: 'admin@absa.com.gh',
    lastMaintenanceDate: new Date('2024-11-20'),
    nextMaintenanceDate: new Date('2025-02-20'),
    maintenanceHistory: []
  },
  {
    id: 'asset-furniture-001',
    name: 'Executive Boardroom Table - 16 Seater',
    type: AssetType.FURNITURE,
    category: AssetCategory.OFFICE_EQUIPMENT,
    description: 'Executive conference table with leather chairs',
    location: {
      branch: 'Ridge Branch',
      floor: '3rd Floor',
      room: 'Executive Boardroom',
      specificLocation: 'Center of Room'
    },
    technicalDetails: {
      serialNumber: 'FURN-EXEC-2021-045',
      model: 'Executive Series',
      manufacturer: 'Office Furniture Ghana',
      supplier: 'MID ATLANTICS'
    },
    financialDetails: {
      purchaseDate: '2021-05-10',
      purchasePrice: 65000,
      warrantyExpiry: '2023-05-10'
    },
    status: AssetStatus.ACTIVE,
    priority: AssetPriority.LOW,
    createdAt: new Date('2021-05-10'),
    updatedAt: new Date('2024-09-05'),
    createdBy: 'admin@absa.com.gh',
    maintenanceHistory: []
  }
];

export const getAssetById = (id: string): Asset | undefined => {
  return mockAssets.find(asset => asset.id === id);
};

export const getAssetsByBranch = (branchName: string): Asset[] => {
  return mockAssets.filter(asset => asset.location.branch === branchName);
};

export const getAssetsByType = (type: AssetType): Asset[] => {
  return mockAssets.filter(asset => asset.type === type);
};

export const getAssetsByStatus = (status: AssetStatus): Asset[] => {
  return mockAssets.filter(asset => asset.status === status);
};

export const getCriticalAssets = (): Asset[] => {
  return mockAssets.filter(asset => asset.priority === AssetPriority.CRITICAL);
};

export const getAssetsBySupplier = (supplierName: string): Asset[] => {
  return mockAssets.filter(asset => 
    asset.technicalDetails.supplier?.toLowerCase().includes(supplierName.toLowerCase())
  );
};
