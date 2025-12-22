// Mock data for colleague requestors based on Excel template data
export interface Colleague {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  branchId: string;
  branchName: string;
  position: string;
  status: 'active' | 'inactive';
  joinDate: Date;
  requestCount: number;
}

export const mockColleagues: Colleague[] = [
  {
    id: 'COL001',
    name: 'Kwame Mensah',
    email: 'kwame.mensah@absa.africa',
    phone: '+233 24 123 4567',
    department: 'Operations',
    branchId: 'BR001',
    branchName: 'Accra Main Branch',
    position: 'Operations Manager',
    status: 'active',
    joinDate: new Date('2020-01-15'),
    requestCount: 45
  },
  {
    id: 'COL002',
    name: 'Ama Osei',
    email: 'ama.osei@absa.africa',
    phone: '+233 24 234 5678',
    department: 'IT',
    branchId: 'BR001',
    branchName: 'Accra Main Branch',
    position: 'IT Supervisor',
    status: 'active',
    joinDate: new Date('2019-06-20'),
    requestCount: 62
  },
  {
    id: 'COL003',
    name: 'Kofi Appiah',
    email: 'kofi.appiah@absa.africa',
    phone: '+233 24 345 6789',
    department: 'Facilities',
    branchId: 'BR002',
    branchName: 'Kumasi Branch',
    position: 'Facilities Coordinator',
    status: 'active',
    joinDate: new Date('2021-03-10'),
    requestCount: 38
  },
  {
    id: 'COL004',
    name: 'Akua Bonsu',
    email: 'akua.bonsu@absa.africa',
    phone: '+233 24 456 7890',
    department: 'Admin',
    branchId: 'BR003',
    branchName: 'Takoradi Branch',
    position: 'Admin Officer',
    status: 'active',
    joinDate: new Date('2020-09-01'),
    requestCount: 29
  },
  {
    id: 'COL005',
    name: 'Yaw Owusu',
    email: 'yaw.owusu@absa.africa',
    phone: '+233 24 567 8901',
    department: 'Security',
    branchId: 'BR004',
    branchName: 'Tema Branch',
    position: 'Security Supervisor',
    status: 'active',
    joinDate: new Date('2018-11-15'),
    requestCount: 51
  },
  {
    id: 'COL006',
    name: 'Efua Agyeman',
    email: 'efua.agyeman@absa.africa',
    phone: '+233 24 678 9012',
    department: 'Customer Service',
    branchId: 'BR005',
    branchName: 'Cape Coast Branch',
    position: 'Customer Service Lead',
    status: 'active',
    joinDate: new Date('2021-07-01'),
    requestCount: 24
  },
  {
    id: 'COL007',
    name: 'Kwabena Asante',
    email: 'kwabena.asante@absa.africa',
    phone: '+233 24 789 0123',
    department: 'Operations',
    branchId: 'BR006',
    branchName: 'Sunyani Branch',
    position: 'Branch Operations Officer',
    status: 'active',
    joinDate: new Date('2022-02-14'),
    requestCount: 18
  },
  {
    id: 'COL008',
    name: 'Abena Darko',
    email: 'abena.darko@absa.africa',
    phone: '+233 24 890 1234',
    department: 'Facilities',
    branchId: 'BR007',
    branchName: 'Ho Branch',
    position: 'Facilities Assistant',
    status: 'active',
    joinDate: new Date('2020-05-20'),
    requestCount: 33
  },
  {
    id: 'COL009',
    name: 'Kojo Boateng',
    email: 'kojo.boateng@absa.africa',
    phone: '+233 24 901 2345',
    department: 'IT',
    branchId: 'BR008',
    branchName: 'Wa Branch',
    position: 'IT Technician',
    status: 'active',
    joinDate: new Date('2021-08-12'),
    requestCount: 27
  },
  {
    id: 'COL010',
    name: 'Adwoa Frimpong',
    email: 'adwoa.frimpong@absa.africa',
    phone: '+233 24 012 3456',
    department: 'Admin',
    branchId: 'BR009',
    branchName: 'Koforidua Branch',
    position: 'Administrative Manager',
    status: 'active',
    joinDate: new Date('2019-04-18'),
    requestCount: 42
  }
];

export const getActiveColleagues = () => mockColleagues.filter(c => c.status === 'active');

export const getColleaguesByBranch = (branchId: string) => 
  mockColleagues.filter(c => c.branchId === branchId);

export const getColleaguesByDepartment = (department: string) => 
  mockColleagues.filter(c => c.department === department);

export const getTopRequestors = (limit: number = 5) => 
  [...mockColleagues]
    .sort((a, b) => b.requestCount - a.requestCount)
    .slice(0, limit);
