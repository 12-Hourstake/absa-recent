// Mock data for vendor user accounts
export interface VendorAccount {
  id: string;
  vendorId: string;
  vendorName: string;
  userName: string;
  email: string;
  phone: string;
  role: 'vendor-admin' | 'vendor-technician' | 'vendor-supervisor';
  status: 'active' | 'inactive' | 'pending';
  createdDate: Date;
  lastLogin?: Date;
  permissions: string[];
  assignedBranches: string[];
}

export const mockVendorAccounts: VendorAccount[] = [
  {
    id: 'VA001',
    vendorId: 'vendor-001',
    vendorName: 'BLUPEST COMPANY LIMITED',
    userName: 'Samuel Ofosu',
    email: 'samuel@blupest.com.gh',
    phone: '+233 24 123 4567',
    role: 'vendor-admin',
    status: 'active',
    createdDate: new Date('2022-08-10'),
    lastLogin: new Date('2024-12-15'),
    permissions: ['view_contracts', 'submit_reports', 'manage_team', 'view_invoices'],
    assignedBranches: ['BR001', 'BR002', 'BR003', 'BR004', 'BR005']
  },
  {
    id: 'VA002',
    vendorId: 'vendor-001',
    vendorName: 'BLUPEST COMPANY LIMITED',
    userName: 'Kwaku Mensah',
    email: 'kwaku.m@blupest.com.gh',
    phone: '+233 24 234 5678',
    role: 'vendor-technician',
    status: 'active',
    createdDate: new Date('2022-09-01'),
    lastLogin: new Date('2024-12-16'),
    permissions: ['view_contracts', 'submit_reports'],
    assignedBranches: ['BR001', 'BR002']
  },
  {
    id: 'VA003',
    vendorId: 'vendor-002',
    vendorName: 'SPEEDY ELEVATORS LIMITED',
    userName: 'John Antwi',
    email: 'john@speedyelevators.gh',
    phone: '+233 24 345 6789',
    role: 'vendor-admin',
    status: 'active',
    createdDate: new Date('2023-01-01'),
    lastLogin: new Date('2024-12-14'),
    permissions: ['view_contracts', 'submit_reports', 'manage_team', 'view_invoices'],
    assignedBranches: ['BR001', 'BR002', 'BR003']
  },
  {
    id: 'VA004',
    vendorId: 'vendor-003',
    vendorName: 'BURRO BATTERIES GHANA LIMITED',
    userName: 'Emmanuel Asante',
    email: 'emmanuel@burrobatteries.com',
    phone: '+233 24 456 7890',
    role: 'vendor-admin',
    status: 'active',
    createdDate: new Date('2023-06-01'),
    lastLogin: new Date('2024-12-13'),
    permissions: ['view_contracts', 'submit_reports', 'manage_team', 'view_invoices'],
    assignedBranches: ['BR001', 'BR004', 'BR005']
  },
  {
    id: 'VA005',
    vendorId: 'vendor-004',
    vendorName: 'ARCO & SONS',
    userName: 'Michael Arco',
    email: 'michael@arcosons.com.gh',
    phone: '+233 24 567 8901',
    role: 'vendor-admin',
    status: 'active',
    createdDate: new Date('2023-03-15'),
    lastLogin: new Date('2024-12-16'),
    permissions: ['view_contracts', 'submit_reports', 'manage_team', 'view_invoices'],
    assignedBranches: ['BR001', 'BR002', 'BR006']
  },
  {
    id: 'VA006',
    vendorId: 'vendor-004',
    vendorName: 'ARCO & SONS',
    userName: 'Peter Boateng',
    email: 'peter.b@arcosons.com.gh',
    phone: '+233 24 678 9012',
    role: 'vendor-supervisor',
    status: 'active',
    createdDate: new Date('2023-04-01'),
    lastLogin: new Date('2024-12-15'),
    permissions: ['view_contracts', 'submit_reports', 'manage_team'],
    assignedBranches: ['BR001', 'BR002']
  },
  {
    id: 'VA007',
    vendorId: 'vendor-005',
    vendorName: 'STANBIC BANK GHANA',
    userName: 'Grace Mensah',
    email: 'grace.mensah@stanbic.com.gh',
    phone: '+233 24 789 0123',
    role: 'vendor-admin',
    status: 'active',
    createdDate: new Date('2022-07-01'),
    lastLogin: new Date('2024-12-12'),
    permissions: ['view_contracts', 'submit_reports', 'manage_team', 'view_invoices'],
    assignedBranches: ['BR001', 'BR003', 'BR007']
  },
  {
    id: 'VA008',
    vendorId: 'vendor-006',
    vendorName: 'GHANA WATER COMPANY LTD',
    userName: 'Joseph Owusu',
    email: 'joseph.owusu@gwcl.com.gh',
    phone: '+233 24 890 1234',
    role: 'vendor-admin',
    status: 'active',
    createdDate: new Date('2022-01-01'),
    lastLogin: new Date('2024-12-11'),
    permissions: ['view_contracts', 'submit_reports', 'view_invoices'],
    assignedBranches: ['BR001', 'BR002', 'BR003', 'BR004', 'BR005', 'BR006', 'BR007']
  },
  {
    id: 'VA009',
    vendorId: 'vendor-007',
    vendorName: 'ECG - ELECTRICITY COMPANY OF GHANA',
    userName: 'Beatrice Adu',
    email: 'beatrice.adu@ecg.com.gh',
    phone: '+233 24 901 2345',
    role: 'vendor-admin',
    status: 'active',
    createdDate: new Date('2022-01-01'),
    lastLogin: new Date('2024-12-10'),
    permissions: ['view_contracts', 'submit_reports', 'view_invoices'],
    assignedBranches: ['BR001', 'BR002', 'BR003', 'BR004', 'BR005', 'BR006', 'BR007']
  },
  {
    id: 'VA010',
    vendorId: 'vendor-008',
    vendorName: 'CLEANPRO SERVICES',
    userName: 'Rebecca Osei',
    email: 'rebecca@cleanpro.com.gh',
    phone: '+233 24 012 3456',
    role: 'vendor-admin',
    status: 'active',
    createdDate: new Date('2023-02-01'),
    lastLogin: new Date('2024-12-16'),
    permissions: ['view_contracts', 'submit_reports', 'manage_team', 'view_invoices'],
    assignedBranches: ['BR001', 'BR002', 'BR003']
  },
  {
    id: 'VA011',
    vendorId: 'vendor-009',
    vendorName: 'SECUREGUARD GHANA',
    userName: 'Alex Nkrumah',
    email: 'alex@secureguard.com.gh',
    phone: '+233 24 123 5678',
    role: 'vendor-admin',
    status: 'active',
    createdDate: new Date('2022-11-01'),
    lastLogin: new Date('2024-12-17'),
    permissions: ['view_contracts', 'submit_reports', 'manage_team', 'view_invoices'],
    assignedBranches: ['BR001', 'BR002', 'BR004', 'BR005']
  },
  {
    id: 'VA012',
    vendorId: 'vendor-010',
    vendorName: 'TECHFIX SOLUTIONS',
    userName: 'Daniel Appiah',
    email: 'daniel@techfix.com.gh',
    phone: '+233 24 234 6789',
    role: 'vendor-admin',
    status: 'active',
    createdDate: new Date('2023-05-01'),
    lastLogin: new Date('2024-12-15'),
    permissions: ['view_contracts', 'submit_reports', 'manage_team', 'view_invoices'],
    assignedBranches: ['BR001', 'BR003', 'BR006']
  }
];

export const getActiveVendorAccounts = () => 
  mockVendorAccounts.filter(va => va.status === 'active');

export const getVendorAccountsByVendor = (vendorId: string) => 
  mockVendorAccounts.filter(va => va.vendorId === vendorId);

export const getVendorAccountsByRole = (role: string) => 
  mockVendorAccounts.filter(va => va.role === role);

export const getPendingVendorAccounts = () => 
  mockVendorAccounts.filter(va => va.status === 'pending');
