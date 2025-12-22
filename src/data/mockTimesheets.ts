export interface Timesheet {
  id: string;
  employeeName: string;
  employeeId: string;
  period: string;
  project: string;
  department: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  status: "approved" | "pending" | "rejected" | "draft";
  submittedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
}

export interface OvertimeRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  date: string;
  hours: number;
  reason: string;
  department: string;
  project?: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  notes?: string;
}

export const mockTimesheets: Timesheet[] = [
  {
    id: "TS001",
    employeeName: "Kwame Mensah",
    employeeId: "EMP001",
    period: "01 Dec - 07 Dec 2024",
    project: "Accra Mall Expansion",
    department: "Construction",
    totalHours: 40.0,
    regularHours: 40.0,
    overtimeHours: 0,
    status: "approved",
    submittedDate: "2024-12-08",
    approvedBy: "Manager A",
    approvedDate: "2024-12-09"
  },
  {
    id: "TS002",
    employeeName: "Adwoa Asante",
    employeeId: "EMP002",
    period: "01 Dec - 07 Dec 2024",
    project: "Tema Port Logistics",
    department: "Logistics",
    totalHours: 38.5,
    regularHours: 36.0,
    overtimeHours: 2.5,
    status: "pending",
    submittedDate: "2024-12-08"
  },
  {
    id: "TS003",
    employeeName: "Yaw Boateng",
    employeeId: "EMP003",
    period: "01 Dec - 07 Dec 2024",
    project: "Kumasi Roads Project",
    department: "Engineering",
    totalHours: 42.0,
    regularHours: 40.0,
    overtimeHours: 2.0,
    status: "approved",
    submittedDate: "2024-12-08",
    approvedBy: "Manager B",
    approvedDate: "2024-12-10"
  },
  {
    id: "TS004",
    employeeName: "Akosua Frimpong",
    employeeId: "EMP004",
    period: "01 Dec - 07 Dec 2024",
    project: "Takoradi Oil & Gas",
    department: "Operations",
    totalHours: 40.0,
    regularHours: 40.0,
    overtimeHours: 0,
    status: "draft"
  },
  {
    id: "TS005",
    employeeName: "Kofi Owusu",
    employeeId: "EMP005",
    period: "01 Dec - 07 Dec 2024",
    project: "Cape Coast Tourism",
    department: "Marketing",
    totalHours: 35.5,
    regularHours: 35.5,
    overtimeHours: 0,
    status: "rejected",
    submittedDate: "2024-12-08",
    approvedBy: "Manager C",
    approvedDate: "2024-12-09"
  }
];

export const mockOvertimeRequests: OvertimeRequest[] = [
  {
    id: "OT001",
    employeeName: "Kwesi Mensah",
    employeeId: "EMP001",
    date: "2024-11-25",
    hours: 2.5,
    reason: "Emergency plumbing repair at East Legon site",
    department: "Maintenance",
    project: "East Legon Development",
    status: "pending",
    submittedDate: "2024-11-26"
  },
  {
    id: "OT002",
    employeeName: "Ama Serwaa",
    employeeId: "EMP006",
    date: "2024-11-24",
    hours: 3.0,
    reason: "Weekend client viewing at Cantonments property",
    department: "Sales",
    project: "Cantonments Project",
    status: "pending",
    submittedDate: "2024-11-25"
  },
  {
    id: "OT003",
    employeeName: "Yaw Boateng",
    employeeId: "EMP003",
    date: "2024-11-23",
    hours: 4.0,
    reason: "Generator installation at Spintex site",
    department: "Technical",
    project: "Spintex Complex",
    status: "approved",
    submittedDate: "2024-11-24",
    reviewedBy: "Manager A",
    reviewedDate: "2024-11-25"
  },
  {
    id: "OT004",
    employeeName: "Efua Darko",
    employeeId: "EMP007",
    date: "2024-11-22",
    hours: 1.5,
    reason: "Month-end financial report preparation",
    department: "Finance",
    status: "approved",
    submittedDate: "2024-11-23",
    reviewedBy: "Manager D",
    reviewedDate: "2024-11-24"
  },
  {
    id: "OT005",
    employeeName: "Kwabena Nkrumah",
    employeeId: "EMP008",
    date: "2024-11-21",
    hours: 2.0,
    reason: "Security incident response",
    department: "Security",
    project: "Osu Office Complex",
    status: "rejected",
    submittedDate: "2024-11-22",
    reviewedBy: "Manager E",
    reviewedDate: "2024-11-23",
    notes: "Not pre-approved as per policy"
  }
];
