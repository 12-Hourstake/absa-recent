export interface Invoice {
  id: string;
  invoiceId: string;
  vendor: string;
  vendorId: string;
  propertyUnit: string;
  amount: number;
  currency: string;
  dueDate: string;
  invoiceDate: string;
  submittedBy: string;
  submittedDate: string;
  status: "Pending" | "Approved" | "Rejected" | "Paid";
  category: string;
  description: string;
  attachments?: string[];
  reviewedBy?: string;
  reviewedDate?: string;
  notes?: string;
}

export interface BillingInvoice {
  id: string;
  tenant: string;
  tenantId: string;
  property: string;
  propertyId: string;
  amount: string;
  dueDate: string;
  invoiceDate: string;
  status: "paid" | "overdue" | "pending" | "cancelled";
  avatar?: string;
  paymentDate?: string;
  paymentMethod?: string;
}

export const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceId: "INV-2024-001",
    vendor: "Ghana Water Company Ltd",
    vendorId: "VEN001",
    propertyUnit: "Accra Main Branch",
    amount: 2500.00,
    currency: "GHS",
    dueDate: "2024-03-30",
    invoiceDate: "2024-03-15",
    submittedBy: "Kwame Mensah",
    submittedDate: "2024-03-16",
    status: "Pending",
    category: "Utilities",
    description: "Water supply for March 2024",
    attachments: ["invoice_001.pdf"]
  },
  {
    id: "2",
    invoiceId: "INV-2024-002",
    vendor: "ECG - Electricity Company of Ghana",
    vendorId: "VEN002",
    propertyUnit: "Kumasi Branch",
    amount: 4800.00,
    currency: "GHS",
    dueDate: "2024-03-28",
    invoiceDate: "2024-03-12",
    submittedBy: "Ama Serwaa",
    submittedDate: "2024-03-13",
    status: "Approved",
    category: "Utilities",
    description: "Electricity bill for March 2024",
    attachments: ["invoice_002.pdf"],
    reviewedBy: "Manager A",
    reviewedDate: "2024-03-18"
  },
  {
    id: "3",
    invoiceId: "INV-2024-003",
    vendor: "CleanPro Services",
    vendorId: "VEN003",
    propertyUnit: "Tema Office",
    amount: 1200.00,
    currency: "GHS",
    dueDate: "2024-04-05",
    invoiceDate: "2024-03-20",
    submittedBy: "Yaw Boateng",
    submittedDate: "2024-03-21",
    status: "Pending",
    category: "Maintenance",
    description: "Monthly cleaning services",
    attachments: ["invoice_003.pdf"]
  },
  {
    id: "4",
    invoiceId: "INV-2024-004",
    vendor: "SecureGuard Ghana",
    vendorId: "VEN004",
    propertyUnit: "Takoradi Warehouse",
    amount: 3500.00,
    currency: "GHS",
    dueDate: "2024-03-25",
    invoiceDate: "2024-03-10",
    submittedBy: "Akosua Frimpong",
    submittedDate: "2024-03-11",
    status: "Rejected",
    category: "Security",
    description: "Security services for March 2024",
    attachments: ["invoice_004.pdf"],
    reviewedBy: "Manager B",
    reviewedDate: "2024-03-19",
    notes: "Invoice amount does not match contract terms"
  },
  {
    id: "5",
    invoiceId: "INV-2024-005",
    vendor: "TechFix Solutions",
    vendorId: "VEN005",
    propertyUnit: "All Properties",
    amount: 5600.00,
    currency: "GHS",
    dueDate: "2024-04-10",
    invoiceDate: "2024-03-25",
    submittedBy: "Kofi Owusu",
    submittedDate: "2024-03-26",
    status: "Approved",
    category: "IT Services",
    description: "IT maintenance and support - Q1 2024",
    attachments: ["invoice_005.pdf", "service_report.pdf"],
    reviewedBy: "Manager C",
    reviewedDate: "2024-03-27"
  }
];

export const mockBillingInvoices: BillingInvoice[] = [
  {
    id: "BILL-001",
    tenant: "Kwame Mensah",
    tenantId: "TEN001",
    property: "Unit 4B, East Legon Apts",
    propertyId: "PROP001",
    amount: "2,500",
    dueDate: "Oct 01, 2023",
    invoiceDate: "Sep 15, 2023",
    status: "paid",
    avatar: "https://www.bing.com/th?id=OIP.MRFqLe-Djizc2XkHWgYRzQHaHa",
    paymentDate: "Sep 28, 2023",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "BILL-002",
    tenant: "Abena Osei",
    tenantId: "TEN002",
    property: "Hse 12, Cantonments",
    propertyId: "PROP002",
    amount: "4,200",
    dueDate: "Sep 28, 2023",
    invoiceDate: "Sep 12, 2023",
    status: "overdue"
  },
  {
    id: "BILL-003",
    tenant: "Kojo Antwi",
    tenantId: "TEN003",
    property: "Shop 5, Osu Mall",
    propertyId: "PROP003",
    amount: "1,800",
    dueDate: "Oct 05, 2023",
    invoiceDate: "Sep 18, 2023",
    status: "pending"
  },
  {
    id: "BILL-004",
    tenant: "Ama Darko",
    tenantId: "TEN004",
    property: "Unit 10, Spintex Heights",
    propertyId: "PROP004",
    amount: "3,000",
    dueDate: "Oct 02, 2023",
    invoiceDate: "Sep 16, 2023",
    status: "paid",
    paymentDate: "Sep 30, 2023",
    paymentMethod: "Mobile Money"
  }
];
