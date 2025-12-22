// Mock users data
import { User, UserRole } from '@/types/user';
import { mockBranches } from './mockBranches';

export const mockUsers: User[] = [
  // Admin Users
  {
    id: 'user-admin-001',
    email: 'admin@absa.com.gh',
    name: 'System Administrator',
    role: UserRole.ADMIN,
    department: 'IT & Facilities',
    branch: 'Ring Road Central & Corporate Service Centre',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date('2024-12-17T08:00:00')
  },
  {
    id: 'user-admin-002',
    email: 'facilities.manager@absa.com.gh',
    name: 'Kwame Mensah',
    role: UserRole.ADMIN,
    department: 'Facilities Management',
    branch: 'Ring Road Central & Corporate Service Centre',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    lastLogin: new Date('2024-12-16T16:30:00')
  },
  {
    id: 'user-admin-003',
    email: 'it.manager@absa.com.gh',
    name: 'Abena Osei',
    role: UserRole.ADMIN,
    department: 'IT Department',
    branch: 'Ring Road Central & Corporate Service Centre',
    isActive: true,
    createdAt: new Date('2023-02-01'),
    lastLogin: new Date('2024-12-17T07:15:00')
  },

  // Colleague/Requester Users
  {
    id: 'user-col-001',
    email: 'akua.frimpong@absa.com.gh',
    name: 'Akua Frimpong',
    role: UserRole.COLLEAGUE_REQUESTER,
    department: 'Customer Service',
    branch: 'Abeka Lapaz',
    isActive: true,
    createdAt: new Date('2023-03-10'),
    lastLogin: new Date('2024-12-15T08:30:00')
  },
  {
    id: 'user-col-002',
    email: 'yaw.mensah@absa.com.gh',
    name: 'Yaw Mensah',
    role: UserRole.COLLEAGUE_REQUESTER,
    department: 'Operations',
    branch: 'Kumasi KPST Main',
    isActive: true,
    createdAt: new Date('2023-04-05'),
    lastLogin: new Date('2024-12-16T10:15:00')
  },
  {
    id: 'user-col-003',
    email: 'emmanuel.osei@absa.com.gh',
    name: 'Emmanuel Osei',
    role: UserRole.COLLEAGUE_REQUESTER,
    department: 'IT Support',
    branch: 'Osu',
    isActive: true,
    createdAt: new Date('2023-04-20'),
    lastLogin: new Date('2024-12-17T09:00:00')
  },
  {
    id: 'user-col-004',
    email: 'abena.serwaa@absa.com.gh',
    name: 'Abena Serwaa',
    role: UserRole.COLLEAGUE_REQUESTER,
    department: 'Security',
    branch: 'Circle & Prestige',
    isActive: true,
    createdAt: new Date('2023-05-15'),
    lastLogin: new Date('2024-12-16T14:20:00')
  },
  {
    id: 'user-col-005',
    email: 'kofi.amponsah@absa.com.gh',
    name: 'Kofi Amponsah',
    role: UserRole.COLLEAGUE_REQUESTER,
    department: 'Facilities',
    branch: 'Ring Road Central & Corporate Service Centre',
    isActive: true,
    createdAt: new Date('2023-06-01'),
    lastLogin: new Date('2024-12-17T07:30:00')
  },
  {
    id: 'user-col-006',
    email: 'esi.kwarteng@absa.com.gh',
    name: 'Esi Kwarteng',
    role: UserRole.COLLEAGUE_REQUESTER,
    department: 'Administration',
    branch: 'East Legon',
    isActive: true,
    createdAt: new Date('2023-06-20'),
    lastLogin: new Date('2024-12-15T16:00:00')
  },
  {
    id: 'user-col-007',
    email: 'samuel.adjei@absa.com.gh',
    name: 'Samuel Adjei',
    role: UserRole.COLLEAGUE_REQUESTER,
    department: 'Security',
    branch: 'Makola Square',
    isActive: true,
    createdAt: new Date('2023-07-10'),
    lastLogin: new Date('2024-12-16T06:00:00')
  },
  {
    id: 'user-col-008',
    email: 'alhassan.yakubu@absa.com.gh',
    name: 'Alhassan Yakubu',
    role: UserRole.COLLEAGUE_REQUESTER,
    department: 'Operations',
    branch: 'Tamale Gumani & Prestige',
    isActive: true,
    createdAt: new Date('2023-08-01'),
    lastLogin: new Date('2024-12-14T08:00:00')
  },
  {
    id: 'user-col-009',
    email: 'kwabena.asare@absa.com.gh',
    name: 'Kwabena Asare',
    role: UserRole.COLLEAGUE_REQUESTER,
    department: 'IT Department',
    branch: 'Ridge Branch',
    isActive: true,
    createdAt: new Date('2023-08-15'),
    lastLogin: new Date('2024-12-17T10:30:00')
  },
  {
    id: 'user-col-010',
    email: 'grace.owusu@absa.com.gh',
    name: 'Grace Owusu',
    role: UserRole.COLLEAGUE_REQUESTER,
    department: 'Security',
    branch: 'Accra High Street & Prestige',
    isActive: true,
    createdAt: new Date('2023-09-01'),
    lastLogin: new Date('2024-12-16T11:15:00')
  },
  {
    id: 'user-col-011',
    email: 'ekow.mensah@absa.com.gh',
    name: 'Ekow Mensah',
    role: UserRole.COLLEAGUE_REQUESTER,
    department: 'Facilities',
    branch: 'Takoradi High Street',
    isActive: true,
    createdAt: new Date('2023-09-20'),
    lastLogin: new Date('2024-12-15T14:00:00')
  },
  {
    id: 'user-col-012',
    email: 'akosua.agyei@absa.com.gh',
    name: 'Akosua Agyei',
    role: UserRole.COLLEAGUE_REQUESTER,
    department: 'Customer Service',
    branch: 'Kumasi KPST Main',
    isActive: true,
    createdAt: new Date('2023-10-05'),
    lastLogin: new Date('2024-12-14T09:30:00')
  },
  {
    id: 'user-col-013',
    email: 'richard.appiah@absa.com.gh',
    name: 'Richard Appiah',
    role: UserRole.COLLEAGUE_REQUESTER,
    department: 'Operations',
    branch: 'Spintex Main & Prestige',
    isActive: true,
    createdAt: new Date('2023-10-20'),
    lastLogin: new Date('2024-12-13T15:45:00')
  },

  // Vendor Users
  {
    id: 'user-vendor-001',
    email: 'contact@reissco.gh',
    name: 'Michael Reiss',
    role: UserRole.VENDOR,
    department: 'Service Provider',
    vendorId: 'vendor-011',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    lastLogin: new Date('2024-12-16T14:00:00')
  },
  {
    id: 'user-vendor-002',
    email: 'info@alliedtemp.gh',
    name: 'Joseph Mensah',
    role: UserRole.VENDOR,
    department: 'Service Provider',
    vendorId: 'vendor-012',
    isActive: true,
    createdAt: new Date('2023-03-01'),
    lastLogin: new Date('2024-12-15T16:30:00')
  },
  {
    id: 'user-vendor-003',
    email: 'info@danimar.gh',
    name: 'Emmanuel Danso',
    role: UserRole.VENDOR,
    department: 'Service Provider',
    vendorId: 'vendor-009',
    isActive: true,
    createdAt: new Date('2023-02-15'),
    lastLogin: new Date('2024-12-16T09:00:00')
  },
  {
    id: 'user-vendor-004',
    email: 'info@argelevator.gh',
    name: 'George Acquah',
    role: UserRole.VENDOR,
    department: 'Service Provider',
    vendorId: 'vendor-015',
    isActive: true,
    createdAt: new Date('2022-11-01'),
    lastLogin: new Date('2024-12-17T08:30:00')
  },
  {
    id: 'user-vendor-005',
    email: 'info@tropicshine.gh',
    name: 'Yaw Boateng',
    role: UserRole.VENDOR,
    department: 'Service Provider',
    vendorId: 'vendor-005',
    isActive: true,
    createdAt: new Date('2023-06-04'),
    lastLogin: new Date('2024-12-16T11:00:00')
  }
];

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getUsersByRole = (role: UserRole): User[] => {
  return mockUsers.filter(user => user.role === role);
};

export const getUsersByBranch = (branch: string): User[] => {
  return mockUsers.filter(user => user.branch === branch);
};

export const getUsersByDepartment = (department: string): User[] => {
  return mockUsers.filter(user => user.department === department);
};

export const getActiveUsers = (): User[] => {
  return mockUsers.filter(user => user.isActive);
};

export const getAdminUsers = (): User[] => {
  return mockUsers.filter(user => user.role === UserRole.ADMIN);
};

export const getVendorUsers = (): User[] => {
  return mockUsers.filter(user => user.role === UserRole.VENDOR);
};

export const getColleagueUsers = (): User[] => {
  return mockUsers.filter(user => user.role === UserRole.COLLEAGUE_REQUESTER);
};
