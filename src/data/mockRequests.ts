// Mock maintenance requests and incidents based on request types
import { MaintenanceRequest, IncidentReport, RequestType, RequestPriority, RequestStatus, IncidentType, IncidentSeverity } from '@/types/request';
import { mockBranches } from './mockBranches';

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'req-001',
    title: 'Air Conditioning Not Working - Banking Hall',
    description: 'The main AC unit in the banking hall is not cooling. Temperature is uncomfortably high for customers and staff.',
    type: RequestType.MAINTENANCE,
    priority: RequestPriority.HIGH,
    status: RequestStatus.IN_PROGRESS,
    location: {
      branch: 'Abeka Lapaz',
      floor: 'Ground Floor',
      room: 'Banking Hall',
      specificLocation: 'Main AC Unit'
    },
    submittedBy: {
      userId: 'user-col-001',
      name: 'Akua Frimpong',
      email: 'akua.frimpong@absa.com.gh',
      department: 'Customer Service'
    },
    submittedAt: new Date('2024-12-15T08:30:00'),
    assignedTo: 'ALLIED TEMPERATURE',
    estimatedCompletion: new Date('2024-12-18T17:00:00'),
    photos: [],
    notes: 'Technician dispatched, compressor issue identified'
  },
  {
    id: 'req-002',
    title: 'Broken Window in Manager Office',
    description: 'Window pane cracked, needs replacement before it shatters completely',
    type: RequestType.FACILITIES,
    priority: RequestPriority.MEDIUM,
    status: RequestStatus.SUBMITTED,
    location: {
      branch: 'Kumasi KPST Main',
      floor: '2nd Floor',
      room: 'Branch Manager Office',
      specificLocation: 'East-facing window'
    },
    submittedBy: {
      userId: 'user-col-002',
      name: 'Yaw Mensah',
      email: 'yaw.mensah@absa.com.gh',
      department: 'Operations'
    },
    submittedAt: new Date('2024-12-16T10:15:00'),
    photos: [],
    notes: 'Urgent - rainy season approaching'
  },
  {
    id: 'req-003',
    title: 'Computer Network Issues',
    description: 'Multiple workstations losing network connection intermittently. Affecting customer service operations.',
    type: RequestType.IT_SUPPORT,
    priority: RequestPriority.URGENT,
    status: RequestStatus.IN_PROGRESS,
    location: {
      branch: 'Osu',
      floor: 'Ground Floor',
      room: 'Customer Service Area',
      specificLocation: 'Workstations 5-10'
    },
    submittedBy: {
      userId: 'user-col-003',
      name: 'Emmanuel Osei',
      email: 'emmanuel.osei@absa.com.gh',
      department: 'IT Support'
    },
    submittedAt: new Date('2024-12-17T09:00:00'),
    assignedTo: 'IT Department',
    estimatedCompletion: new Date('2024-12-17T16:00:00'),
    photos: [],
    notes: 'Network switch malfunction suspected'
  },
  {
    id: 'req-004',
    title: 'Cleaning - Spillage in Lobby',
    description: 'Water spillage near entrance, needs immediate cleaning to prevent slips',
    type: RequestType.CLEANING,
    priority: RequestPriority.HIGH,
    status: RequestStatus.COMPLETED,
    location: {
      branch: 'Circle & Prestige',
      floor: 'Ground Floor',
      room: 'Main Lobby',
      specificLocation: 'Near entrance doors'
    },
    submittedBy: {
      userId: 'user-col-004',
      name: 'Abena Serwaa',
      email: 'abena.serwaa@absa.com.gh',
      department: 'Security'
    },
    submittedAt: new Date('2024-12-16T14:20:00'),
    assignedTo: 'TROPIC SHINE',
    actualCompletion: new Date('2024-12-16T14:45:00'),
    photos: [],
    notes: 'Cleaned and dried, caution signs placed'
  },
  {
    id: 'req-005',
    title: 'Elevator Making Strange Noises',
    description: 'Main elevator producing loud grinding noise when moving between floors. Needs inspection.',
    type: RequestType.MAINTENANCE,
    priority: RequestPriority.HIGH,
    status: RequestStatus.SUBMITTED,
    location: {
      branch: 'Ring Road Central & Corporate Service Centre',
      floor: 'All Floors',
      room: 'Main Lobby',
      specificLocation: 'Elevator 1'
    },
    submittedBy: {
      userId: 'user-col-005',
      name: 'Kofi Amponsah',
      email: 'kofi.amponsah@absa.com.gh',
      department: 'Facilities'
    },
    submittedAt: new Date('2024-12-17T07:30:00'),
    photos: [],
    notes: 'Safety concern - may need to restrict use'
  },
  {
    id: 'req-006',
    title: 'Restroom Deep Cleaning Required',
    description: 'Staff restrooms need thorough cleaning and sanitization',
    type: RequestType.CLEANING,
    priority: RequestPriority.MEDIUM,
    status: RequestStatus.SUBMITTED,
    location: {
      branch: 'East Legon',
      floor: '1st Floor',
      room: 'Staff Restrooms',
      specificLocation: 'Both male and female facilities'
    },
    submittedBy: {
      userId: 'user-col-006',
      name: 'Esi Kwarteng',
      email: 'esi.kwarteng@absa.com.gh',
      department: 'Administration'
    },
    submittedAt: new Date('2024-12-15T16:00:00'),
    photos: [],
    notes: 'Regular deep clean needed'
  },
  {
    id: 'req-007',
    title: 'Security Camera Not Working',
    description: 'Camera 12 at rear entrance showing no feed to security office',
    type: RequestType.SECURITY,
    priority: RequestPriority.HIGH,
    status: RequestStatus.IN_PROGRESS,
    location: {
      branch: 'Makola Square',
      floor: 'Exterior',
      room: 'Rear Entrance',
      specificLocation: 'Camera 12'
    },
    submittedBy: {
      userId: 'user-col-007',
      name: 'Samuel Adjei',
      email: 'samuel.adjei@absa.com.gh',
      department: 'Security'
    },
    submittedAt: new Date('2024-12-16T06:00:00'),
    assignedTo: 'TROPIC SHINE',
    estimatedCompletion: new Date('2024-12-20T17:00:00'),
    photos: [],
    notes: 'Vendor checking cable connections'
  },
  {
    id: 'req-008',
    title: 'Generator Fuel Level Low',
    description: 'Backup generator fuel tank below 25%. Needs refueling for emergency readiness.',
    type: RequestType.MAINTENANCE,
    priority: RequestPriority.MEDIUM,
    status: RequestStatus.COMPLETED,
    location: {
      branch: 'Tamale Gumani & Prestige',
      floor: 'Basement',
      room: 'Generator Room',
      specificLocation: 'Main Generator'
    },
    submittedBy: {
      userId: 'user-col-008',
      name: 'Alhassan Yakubu',
      email: 'alhassan.yakubu@absa.com.gh',
      department: 'Operations'
    },
    submittedAt: new Date('2024-12-14T08:00:00'),
    assignedTo: 'Fuel Supplier',
    actualCompletion: new Date('2024-12-15T12:00:00'),
    photos: [],
    notes: 'Tank refilled to 95% capacity'
  }
];

export const mockIncidentReports: IncidentReport[] = [
  {
    id: 'inc-001',
    title: 'Water Leak from Ceiling',
    description: 'Significant water leaking from ceiling in IT server room. Potential damage to equipment.',
    type: IncidentType.EMERGENCY,
    severity: IncidentSeverity.CRITICAL,
    status: RequestStatus.IN_PROGRESS,
    location: {
      branch: 'Ridge Branch',
      floor: '2nd Floor',
      room: 'IT Server Room',
      specificLocation: 'Above Server Rack 3'
    },
    reportedBy: {
      userId: 'user-col-009',
      name: 'Kwabena Asare',
      email: 'kwabena.asare@absa.com.gh',
      department: 'IT Department'
    },
    reportedAt: new Date('2024-12-17T10:30:00'),
    assignedTo: 'Emergency Response Team',
    photos: [],
    actionsTaken: 'Equipment moved, buckets placed, plumber called'
  },
  {
    id: 'inc-002',
    title: 'Suspicious Package Found',
    description: 'Unattended bag found in banking hall. Security protocol activated.',
    type: IncidentType.SECURITY,
    severity: IncidentSeverity.HIGH,
    status: RequestStatus.COMPLETED,
    location: {
      branch: 'Accra High Street & Prestige',
      floor: 'Ground Floor',
      room: 'Banking Hall',
      specificLocation: 'Near Queue Management System'
    },
    reportedBy: {
      userId: 'user-col-010',
      name: 'Grace Owusu',
      email: 'grace.owusu@absa.com.gh',
      department: 'Security'
    },
    reportedAt: new Date('2024-12-16T11:15:00'),
    assignedTo: 'Security Team',
    resolvedAt: new Date('2024-12-16T12:00:00'),
    photos: [],
    actionsTaken: 'Area evacuated, police called, bag belonged to customer who returned'
  },
  {
    id: 'inc-003',
    title: 'Power Outage - No Backup',
    description: 'Main power failed and backup generator did not start. Complete power loss.',
    type: IncidentType.EQUIPMENT_FAILURE,
    severity: IncidentSeverity.CRITICAL,
    status: RequestStatus.COMPLETED,
    location: {
      branch: 'Takoradi High Street',
      floor: 'All Floors',
      room: 'Entire Building',
      specificLocation: 'Generator Room'
    },
    reportedBy: {
      userId: 'user-col-011',
      name: 'Ekow Mensah',
      email: 'ekow.mensah@absa.com.gh',
      department: 'Facilities'
    },
    reportedAt: new Date('2024-12-15T14:00:00'),
    assignedTo: 'DANIMAR ENGINEERING LIMITED',
    resolvedAt: new Date('2024-12-15T16:30:00'),
    photos: [],
    actionsTaken: 'Generator fuel pump replaced, system tested and operational'
  },
  {
    id: 'inc-004',
    title: 'Slip and Fall Incident',
    description: 'Customer slipped on wet floor in lobby. Minor injury, first aid administered.',
    type: IncidentType.SAFETY,
    severity: IncidentSeverity.MEDIUM,
    status: RequestStatus.COMPLETED,
    location: {
      branch: 'Kumasi KPST Main',
      floor: 'Ground Floor',
      room: 'Main Lobby',
      specificLocation: 'Near entrance'
    },
    reportedBy: {
      userId: 'user-col-012',
      name: 'Akosua Agyei',
      email: 'akosua.agyei@absa.com.gh',
      department: 'Customer Service'
    },
    reportedAt: new Date('2024-12-14T09:30:00'),
    assignedTo: 'Branch Manager',
    resolvedAt: new Date('2024-12-14T10:00:00'),
    photos: [],
    actionsTaken: 'First aid provided, incident report filed, caution signs placed'
  },
  {
    id: 'inc-005',
    title: 'Fire Alarm False Activation',
    description: 'Fire alarm system activated without actual fire. Building evacuated as per protocol.',
    type: IncidentType.SAFETY,
    severity: IncidentSeverity.HIGH,
    status: RequestStatus.COMPLETED,
    location: {
      branch: 'Spintex Main & Prestige',
      floor: '3rd Floor',
      room: 'Conference Room B',
      specificLocation: 'Smoke detector'
    },
    reportedBy: {
      userId: 'user-col-013',
      name: 'Richard Appiah',
      email: 'richard.appiah@absa.com.gh',
      department: 'Operations'
    },
    reportedAt: new Date('2024-12-13T15:45:00'),
    assignedTo: 'Fire Safety Team',
    resolvedAt: new Date('2024-12-13T16:30:00'),
    photos: [],
    actionsTaken: 'Building evacuated, fire service called, sensor cleaned and tested'
  }
];

export const getRequestById = (id: string): MaintenanceRequest | undefined => {
  return mockMaintenanceRequests.find(req => req.id === id);
};

export const getIncidentById = (id: string): IncidentReport | undefined => {
  return mockIncidentReports.find(inc => inc.id === id);
};

export const getRequestsByBranch = (branch: string): MaintenanceRequest[] => {
  return mockMaintenanceRequests.filter(req => req.location.branch === branch);
};

export const getRequestsByStatus = (status: RequestStatus): MaintenanceRequest[] => {
  return mockMaintenanceRequests.filter(req => req.status === status);
};

export const getRequestsByType = (type: RequestType): MaintenanceRequest[] => {
  return mockMaintenanceRequests.filter(req => req.type === type);
};

export const getUrgentRequests = (): MaintenanceRequest[] => {
  return mockMaintenanceRequests.filter(req => 
    req.priority === RequestPriority.URGENT || req.priority === RequestPriority.HIGH
  );
};

export const getCriticalIncidents = (): IncidentReport[] => {
  return mockIncidentReports.filter(inc => 
    inc.severity === IncidentSeverity.CRITICAL || inc.severity === IncidentSeverity.HIGH
  );
};
