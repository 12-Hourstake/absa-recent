// Mock vehicles data based on Vehicles.tsx and fleet management needs
import { mockBranches } from './mockBranches';

export interface Vehicle {
  id: string;
  registration: string;
  make: string;
  model: string;
  year: number;
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  color: string;
  vin?: string;
  assignedDriver?: string;
  assignedBranch: string;
  status: 'active' | 'maintenance' | 'inactive' | 'unassigned';
  odometer: number;
  purchaseDate: string;
  insuranceExpiry: string;
  roadworthyExpiry: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  fuelCardNumber?: string;
  notes?: string;
}

export const mockVehicles: Vehicle[] = [
  {
    id: 'veh-001',
    registration: 'GR-2345-23',
    make: 'Toyota',
    model: 'Hilux',
    year: 2023,
    fuelType: 'Diesel',
    color: 'White',
    vin: 'JTFDE626500123456',
    assignedDriver: 'Kwame Osei',
    assignedBranch: 'Ring Road Central & Corporate Service Centre',
    status: 'active',
    odometer: 45231,
    purchaseDate: '2023-01-15',
    insuranceExpiry: '2025-01-15',
    roadworthyExpiry: '2025-01-15',
    lastServiceDate: '2024-11-20',
    nextServiceDate: '2025-02-20',
    fuelCardNumber: 'FC-001-2345',
    notes: 'General purpose vehicle for facilities team'
  },
  {
    id: 'veh-002',
    registration: 'GE-1902-22',
    make: 'Nissan',
    model: 'Navara',
    year: 2022,
    fuelType: 'Diesel',
    color: 'Silver',
    vin: 'JN1TANS50U0123456',
    assignedDriver: 'Abena Mensah',
    assignedBranch: 'Kumasi KPST Main',
    status: 'active',
    odometer: 12400,
    purchaseDate: '2022-06-10',
    insuranceExpiry: '2025-06-10',
    roadworthyExpiry: '2025-06-10',
    lastServiceDate: '2024-10-15',
    nextServiceDate: '2025-01-15',
    fuelCardNumber: 'FC-002-1902',
    notes: 'Kumasi depot vehicle'
  },
  {
    id: 'veh-003',
    registration: 'AS-8812-21',
    make: 'Hyundai',
    model: 'H-100',
    year: 2021,
    fuelType: 'Diesel',
    color: 'White',
    vin: 'KMJDA17BP1U123456',
    assignedDriver: 'Kofi Boateng',
    assignedBranch: 'Tema Fishing Harbour',
    status: 'maintenance',
    odometer: 89100,
    purchaseDate: '2021-03-20',
    insuranceExpiry: '2025-03-20',
    roadworthyExpiry: '2025-03-20',
    lastServiceDate: '2024-12-10',
    nextServiceDate: '2024-12-20',
    fuelCardNumber: 'FC-003-8812',
    notes: 'Currently undergoing major service'
  },
  {
    id: 'veh-004',
    registration: 'GT-4521-20',
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    fuelType: 'Petrol',
    color: 'Grey',
    vin: 'JTDBR32E300123456',
    assignedDriver: 'Esi Darko',
    assignedBranch: 'East Legon',
    status: 'active',
    odometer: 67000,
    purchaseDate: '2020-08-15',
    insuranceExpiry: '2025-08-15',
    roadworthyExpiry: '2025-02-15',
    lastServiceDate: '2024-09-20',
    nextServiceDate: '2025-03-20',
    fuelCardNumber: 'FC-004-4521',
    notes: 'Executive sedan for branch manager'
  },
  {
    id: 'veh-005',
    registration: 'GR-3310-23',
    make: 'Mitsubishi',
    model: 'Pajero',
    year: 2023,
    fuelType: 'Diesel',
    color: 'Black',
    vin: 'JA4AZ3A39GJ123456',
    assignedDriver: null,
    assignedBranch: 'Ridge Branch',
    status: 'unassigned',
    odometer: 5000,
    purchaseDate: '2023-10-01',
    insuranceExpiry: '2025-10-01',
    roadworthyExpiry: '2025-10-01',
    lastServiceDate: '2024-11-01',
    nextServiceDate: '2025-05-01',
    fuelCardNumber: 'FC-005-3310',
    notes: 'New vehicle awaiting assignment'
  },
  {
    id: 'veh-006',
    registration: 'GX-102-22',
    make: 'Yamaha',
    model: 'Dispatch Motorcycle',
    year: 2022,
    fuelType: 'Petrol',
    color: 'Red',
    vin: 'JYARN18E0DA123456',
    assignedDriver: 'Kojo Antwi',
    assignedBranch: 'Osu',
    status: 'active',
    odometer: 18300,
    purchaseDate: '2022-04-10',
    insuranceExpiry: '2025-04-10',
    roadworthyExpiry: '2025-04-10',
    lastServiceDate: '2024-10-05',
    nextServiceDate: '2025-01-05',
    fuelCardNumber: 'FC-006-0102',
    notes: 'Dispatch motorcycle for urgent deliveries'
  },
  {
    id: 'veh-007',
    registration: 'WR-5567-21',
    make: 'Isuzu',
    model: 'D-Max',
    year: 2021,
    fuelType: 'Diesel',
    color: 'White',
    vin: 'MPATFR26HD0123456',
    assignedDriver: 'Yaa Asantewaa',
    assignedBranch: 'Takoradi High Street',
    status: 'active',
    odometer: 54200,
    purchaseDate: '2021-07-15',
    insuranceExpiry: '2025-07-15',
    roadworthyExpiry: '2025-01-15',
    lastServiceDate: '2024-11-10',
    nextServiceDate: '2025-02-10',
    fuelCardNumber: 'FC-007-5567',
    notes: 'Western region operations vehicle'
  },
  {
    id: 'veh-008',
    registration: 'NR-7890-20',
    make: 'Toyota',
    model: 'Land Cruiser',
    year: 2020,
    fuelType: 'Diesel',
    color: 'White',
    vin: 'JTEBU14R900123456',
    assignedDriver: 'Alhassan Ibrahim',
    assignedBranch: 'Tamale Gumani & Prestige',
    status: 'active',
    odometer: 78500,
    purchaseDate: '2020-05-20',
    insuranceExpiry: '2025-05-20',
    roadworthyExpiry: '2025-05-20',
    lastServiceDate: '2024-10-25',
    nextServiceDate: '2025-01-25',
    fuelCardNumber: 'FC-008-7890',
    notes: 'Northern region executive vehicle'
  },
  {
    id: 'veh-009',
    registration: 'BA-4456-22',
    make: 'Ford',
    model: 'Ranger',
    year: 2022,
    fuelType: 'Diesel',
    color: 'Blue',
    vin: 'WFODXXGCDKJ123456',
    assignedDriver: 'Kwame Boakye',
    assignedBranch: 'Sunyani',
    status: 'active',
    odometer: 32100,
    purchaseDate: '2022-09-10',
    insuranceExpiry: '2025-09-10',
    roadworthyExpiry: '2025-03-10',
    lastServiceDate: '2024-09-15',
    nextServiceDate: '2025-03-15',
    fuelCardNumber: 'FC-009-4456',
    notes: 'Brong-Ahafo region vehicle'
  },
  {
    id: 'veh-010',
    registration: 'VR-2234-23',
    make: 'Honda',
    model: 'Accord',
    year: 2023,
    fuelType: 'Petrol',
    color: 'Black',
    vin: '1HGCV1F30MA123456',
    assignedDriver: 'Selorm Agbeko',
    assignedBranch: 'Ho',
    status: 'active',
    odometer: 15800,
    purchaseDate: '2023-03-15',
    insuranceExpiry: '2026-03-15',
    roadworthyExpiry: '2026-03-15',
    lastServiceDate: '2024-11-20',
    nextServiceDate: '2025-05-20',
    fuelCardNumber: 'FC-010-2234',
    notes: 'Volta region manager vehicle'
  }
];

export const getVehicleById = (id: string): Vehicle | undefined => {
  return mockVehicles.find(vehicle => vehicle.id === id);
};

export const getVehiclesByBranch = (branchName: string): Vehicle[] => {
  return mockVehicles.filter(vehicle => vehicle.assignedBranch === branchName);
};

export const getActiveVehicles = (): Vehicle[] => {
  return mockVehicles.filter(vehicle => vehicle.status === 'active');
};

export const getVehiclesByDriver = (driverName: string): Vehicle[] => {
  return mockVehicles.filter(vehicle => vehicle.assignedDriver === driverName);
};

export const getVehiclesByFuelType = (fuelType: string): Vehicle[] => {
  return mockVehicles.filter(vehicle => vehicle.fuelType === fuelType);
};

export const getUnassignedVehicles = (): Vehicle[] => {
  return mockVehicles.filter(vehicle => vehicle.status === 'unassigned' || !vehicle.assignedDriver);
};
