import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomSelectDropdown from "@/components/ui/CustomSelectDropdown";
import { 
  Plus, 
  Droplets, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Truck, 
  Eye, 
  Edit, 
  Trash2,
  Building2,
  User,
  Calendar,
  TrendingDown,
  TrendingUp,
  Flag
} from "lucide-react";

// Interfaces
interface MinimumLevel {
  id: string;
  branchSite: string;
  tankCapacity: number;
  minimumLevel: number;
  definedBy: string;
  approvedBy: string;
  approvalDate: string;
  lastReviewDate: string;
  status: 'Active' | 'Needs Review';
  createdDate: string;
}

interface TankLog {
  id: string;
  dateTime: string;
  branchSite: string;
  recordedLevel: number;
  recordedBy: string;
  belowMinimum: boolean;
  countersignedBy?: string;
  notes?: string;
  createdDate: string;
}

interface ReplenishmentRequest {
  id: string;
  branchSite: string;
  currentLevel: number;
  minimumLevel: number;
  requestMethod: 'Call' | 'Text' | 'Email';
  requestType: 'Emergency' | 'Non-Emergency';
  requestedBy: string;
  dateTime: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Remediation Required';
  approvedBy?: string;
  approvalTime?: string;
  confirmationEmail?: string;
  flaggedForAudit?: boolean;
  createdDate: string;
}

interface Delivery {
  id: string;
  requestId: string;
  vendorId: string;
  vendorName: string;
  tankerVehicle: string;
  driverName: string;
  arrivalTime: string;
  expectedVolume: number;
  actualVolume: number;
  volumeAgreed: boolean;
  qualityStatus: 'Passed' | 'Failed';
  qualityNotes?: string;
  completionCertificate?: string;
  signedByOfficer?: string;
  countersignedBy?: string;
  invoiceStatus: 'Pending' | 'Certificate Sent' | 'Invoice Received' | 'Forwarded to Finance' | 'Processed';
  flaggedForAudit?: boolean;
  createdDate: string;
}

interface AuditRecord {
  id: string;
  deliveryId: string;
  auditType: 'Monthly Snap Check' | 'Random Audit';
  auditDate: string;
  auditedBy: string;
  deliveryDetails: string;
  approvalTrail: string;
  volumeAccuracy: string;
  documentationIntegrity: string;
  findings?: string;
  status: 'Pending' | 'Completed' | 'Issues Found';
  createdDate: string;
}

// Storage keys
const WATER_MIN_LEVEL_STORAGE_KEY = "WATER_MIN_LEVEL_CACHE_V1";
const WATER_TANK_LOG_STORAGE_KEY = "WATER_TANK_LOG_CACHE_V1";
const WATER_REQUESTS_STORAGE_KEY = "WATER_REQUESTS_CACHE_V1";
const WATER_DELIVERIES_STORAGE_KEY = "WATER_DELIVERIES_CACHE_V1";
const WATER_AUDIT_STORAGE_KEY = "WATER_AUDIT_CACHE_V1";
const BRANCHES_STORAGE_KEY = "BRANCHES_CACHE_V1";
const VENDORS_STORAGE_KEY = "VENDORS_CACHE_V1";

const WaterTankerManagement = () => {
  // State
  const [minimumLevels, setMinimumLevels] = useState<MinimumLevel[]>([]);
  const [tankLogs, setTankLogs] = useState<TankLog[]>([]);
  const [requests, setRequests] = useState<ReplenishmentRequest[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  
  // Modal states
  const [isMinLevelModalOpen, setIsMinLevelModalOpen] = useState(false);
  const [isTankLogModalOpen, setIsTankLogModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ReplenishmentRequest | null>(null);
  
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Form states
  const [minLevelForm, setMinLevelForm] = useState({
    branchSite: "",
    tankCapacity: "",
    minimumLevel: "",
    definedBy: "",
    approvedBy: ""
  });

  const [tankLogForm, setTankLogForm] = useState({
    branchSite: "",
    recordedLevel: "",
    recordedBy: "",
    countersignedBy: "",
    notes: ""
  });

  const [requestForm, setRequestForm] = useState({
    branchSite: "",
    requestMethod: "Call" as 'Call' | 'Text' | 'Email',
    requestType: "Non-Emergency" as 'Emergency' | 'Non-Emergency',
    requestedBy: ""
  });

  const [deliveryForm, setDeliveryForm] = useState({
    vendorId: "",
    tankerVehicle: "",
    driverName: "",
    expectedVolume: "",
    actualVolume: "",
    volumeAgreed: true,
    qualityStatus: "Passed" as 'Passed' | 'Failed',
    qualityNotes: "",
    signedByOfficer: "",
    countersignedBy: ""
  });

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    loadMinimumLevels();
    loadTankLogs();
    loadRequests();
    loadDeliveries();
    loadAudits();
    loadBranches();
    loadVendors();
  };

  const loadMinimumLevels = () => {
    try {
      const cached = localStorage.getItem(WATER_MIN_LEVEL_STORAGE_KEY);
      setMinimumLevels(cached ? JSON.parse(cached) : []);
    } catch (err) {
      console.error("Error loading minimum levels:", err);
      setMinimumLevels([]);
    }
  };

  const loadTankLogs = () => {
    try {
      const cached = localStorage.getItem(WATER_TANK_LOG_STORAGE_KEY);
      setTankLogs(cached ? JSON.parse(cached) : []);
    } catch (err) {
      console.error("Error loading tank logs:", err);
      setTankLogs([]);
    }
  };

  const loadRequests = () => {
    try {
      const cached = localStorage.getItem(WATER_REQUESTS_STORAGE_KEY);
      setRequests(cached ? JSON.parse(cached) : []);
    } catch (err) {
      console.error("Error loading requests:", err);
      setRequests([]);
    }
  };

  const loadDeliveries = () => {
    try {
      const cached = localStorage.getItem(WATER_DELIVERIES_STORAGE_KEY);
      setDeliveries(cached ? JSON.parse(cached) : []);
    } catch (err) {
      console.error("Error loading deliveries:", err);
      setDeliveries([]);
    }
  };

  const loadAudits = () => {
    try {
      const cached = localStorage.getItem(WATER_AUDIT_STORAGE_KEY);
      setAudits(cached ? JSON.parse(cached) : []);
    } catch (err) {
      console.error("Error loading audits:", err);
      setAudits([]);
    }
  };

  const loadBranches = () => {
    try {
      const cached = localStorage.getItem(BRANCHES_STORAGE_KEY);
      setBranches(cached ? JSON.parse(cached) : []);
    } catch (err) {
      console.error("Error loading branches:", err);
      setBranches([]);
    }
  };

  const loadVendors = () => {
    try {
      const cached = localStorage.getItem(VENDORS_STORAGE_KEY);
      setVendors(cached ? JSON.parse(cached) : []);
    } catch (err) {
      console.error("Error loading vendors:", err);
      setVendors([]);
    }
  };

  // Save functions
  const saveMinimumLevels = (data: MinimumLevel[]) => {
    localStorage.setItem(WATER_MIN_LEVEL_STORAGE_KEY, JSON.stringify(data));
    setMinimumLevels(data);
  };

  const saveTankLogs = (data: TankLog[]) => {
    localStorage.setItem(WATER_TANK_LOG_STORAGE_KEY, JSON.stringify(data));
    setTankLogs(data);
  };

  const saveRequests = (data: ReplenishmentRequest[]) => {
    localStorage.setItem(WATER_REQUESTS_STORAGE_KEY, JSON.stringify(data));
    setRequests(data);
  };

  const saveDeliveries = (data: Delivery[]) => {
    localStorage.setItem(WATER_DELIVERIES_STORAGE_KEY, JSON.stringify(data));
    setDeliveries(data);
  };

  // Summary statistics
  const summaryStats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const sitesMonitored = minimumLevels.filter(ml => ml.status === 'Active').length;
    const activeRequests = requests.filter(r => r.status === 'Pending Review' || r.status === 'Approved').length;
    const emergencyRequests = requests.filter(r => {
      const reqDate = new Date(r.createdDate);
      return r.requestType === 'Emergency' && 
             reqDate.getMonth() === currentMonth && 
             reqDate.getFullYear() === currentYear;
    }).length;
    const completedDeliveries = deliveries.length;
    const pendingApprovals = requests.filter(r => r.status === 'Pending Review').length;

    return {
      sitesMonitored,
      activeRequests,
      emergencyRequests,
      completedDeliveries,
      pendingApprovals
    };
  }, [minimumLevels, requests, deliveries]);

  // Handle form submissions
  const handleAddMinimumLevel = () => {
    try {
      if (!minLevelForm.branchSite || !minLevelForm.tankCapacity || !minLevelForm.minimumLevel) {
        setError("Please fill in all required fields");
        return;
      }

      const newId = `WML-${String(minimumLevels.length + 1).padStart(3, '0')}`;
      const newLevel: MinimumLevel = {
        id: newId,
        branchSite: minLevelForm.branchSite,
        tankCapacity: parseFloat(minLevelForm.tankCapacity),
        minimumLevel: parseFloat(minLevelForm.minimumLevel),
        definedBy: minLevelForm.definedBy,
        approvedBy: minLevelForm.approvedBy,
        approvalDate: new Date().toISOString().split('T')[0],
        lastReviewDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        createdDate: new Date().toISOString().split('T')[0]
      };

      saveMinimumLevels([...minimumLevels, newLevel]);
      setMinLevelForm({ branchSite: "", tankCapacity: "", minimumLevel: "", definedBy: "", approvedBy: "" });
      setIsMinLevelModalOpen(false);
      setSuccess("Minimum level defined successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to add minimum level");
    }
  };

  const handleAddTankLog = () => {
    try {
      if (!tankLogForm.branchSite || !tankLogForm.recordedLevel || !tankLogForm.recordedBy) {
        setError("Please fill in all required fields");
        return;
      }

      const recordedLevel = parseFloat(tankLogForm.recordedLevel);
      const minLevel = minimumLevels.find(ml => ml.branchSite === tankLogForm.branchSite);
      const belowMinimum = minLevel ? recordedLevel < minLevel.minimumLevel : false;

      const newId = `WTL-${String(tankLogs.length + 1).padStart(3, '0')}`;
      const newLog: TankLog = {
        id: newId,
        dateTime: new Date().toISOString(),
        branchSite: tankLogForm.branchSite,
        recordedLevel: recordedLevel,
        recordedBy: tankLogForm.recordedBy,
        belowMinimum: belowMinimum,
        countersignedBy: tankLogForm.countersignedBy,
        notes: tankLogForm.notes,
        createdDate: new Date().toISOString().split('T')[0]
      };

      saveTankLogs([...tankLogs, newLog]);
      setTankLogForm({ branchSite: "", recordedLevel: "", recordedBy: "", countersignedBy: "", notes: "" });
      setIsTankLogModalOpen(false);
      setSuccess("Tank level logged successfully!");
      
      // Auto-trigger request if below minimum
      if (belowMinimum) {
        setError("⚠️ Level below minimum! You can now create a replenishment request.");
      }
      
      setTimeout(() => { setSuccess(""); setError(""); }, 5000);
    } catch (err) {
      setError("Failed to log tank level");
    }
  };

  const handleCreateRequest = (branchSite?: string) => {
    if (branchSite) {
      setRequestForm(prev => ({ ...prev, branchSite }));
    }
    setIsRequestModalOpen(true);
  };

  const handleAddRequest = () => {
    try {
      if (!requestForm.branchSite || !requestForm.requestedBy) {
        setError("Please fill in all required fields");
        return;
      }

      const latestLog = tankLogs
        .filter(log => log.branchSite === requestForm.branchSite)
        .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())[0];
      
      const minLevel = minimumLevels.find(ml => ml.branchSite === requestForm.branchSite);

      const newId = `WRQ-${String(requests.length + 1).padStart(3, '0')}`;
      const newRequest: ReplenishmentRequest = {
        id: newId,
        branchSite: requestForm.branchSite,
        currentLevel: latestLog?.recordedLevel || 0,
        minimumLevel: minLevel?.minimumLevel || 0,
        requestMethod: requestForm.requestMethod,
        requestType: requestForm.requestType,
        requestedBy: requestForm.requestedBy,
        dateTime: new Date().toISOString(),
        status: 'Pending Review',
        flaggedForAudit: requestForm.requestType === 'Emergency',
        createdDate: new Date().toISOString().split('T')[0]
      };

      saveRequests([...requests, newRequest]);
      setRequestForm({ branchSite: "", requestMethod: "Call", requestType: "Non-Emergency", requestedBy: "" });
      setIsRequestModalOpen(false);
      setSuccess("Replenishment request created successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to create request");
    }
  };

  const handleAddDelivery = () => {
    if (!selectedRequest) return;

    try {
      if (!deliveryForm.vendorId || !deliveryForm.tankerVehicle || !deliveryForm.driverName) {
        setError("Please fill in all required fields");
        return;
      }

      const vendor = vendors.find(v => v.id === deliveryForm.vendorId);
      const newId = `WDL-${String(deliveries.length + 1).padStart(3, '0')}`;
      
      const newDelivery: Delivery = {
        id: newId,
        requestId: selectedRequest.id,
        vendorId: deliveryForm.vendorId,
        vendorName: vendor?.name || 'Unknown',
        tankerVehicle: deliveryForm.tankerVehicle,
        driverName: deliveryForm.driverName,
        arrivalTime: new Date().toISOString(),
        expectedVolume: parseFloat(deliveryForm.expectedVolume),
        actualVolume: parseFloat(deliveryForm.actualVolume),
        volumeAgreed: deliveryForm.volumeAgreed,
        qualityStatus: deliveryForm.qualityStatus,
        qualityNotes: deliveryForm.qualityNotes,
        signedByOfficer: deliveryForm.signedByOfficer,
        countersignedBy: deliveryForm.countersignedBy,
        invoiceStatus: 'Pending',
        flaggedForAudit: Math.random() < 0.25, // 25% flagged for audit
        createdDate: new Date().toISOString().split('T')[0]
      };

      saveDeliveries([...deliveries, newDelivery]);
      
      // Update request status
      const updatedRequests = requests.map(r => 
        r.id === selectedRequest.id ? { ...r, status: 'Approved' as const } : r
      );
      saveRequests(updatedRequests);

      setDeliveryForm({
        vendorId: "", tankerVehicle: "", driverName: "", expectedVolume: "", 
        actualVolume: "", volumeAgreed: true, qualityStatus: "Passed", 
        qualityNotes: "", signedByOfficer: "", countersignedBy: ""
      });
      setIsDeliveryModalOpen(false);
      setSelectedRequest(null);
      setSuccess("Delivery logged successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to log delivery");
    }
  };

  const getStatusBadge = (status: string, type: 'request' | 'delivery' | 'quality' | 'level') => {
    const colors = {
      request: {
        'Pending Review': 'bg-yellow-100 text-yellow-800',
        'Approved': 'bg-green-100 text-green-800',
        'Rejected': 'bg-red-100 text-red-800',
        'Remediation Required': 'bg-orange-100 text-orange-800'
      },
      delivery: {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Certificate Sent': 'bg-blue-100 text-blue-800',
        'Invoice Received': 'bg-purple-100 text-purple-800',
        'Forwarded to Finance': 'bg-indigo-100 text-indigo-800',
        'Processed': 'bg-green-100 text-green-800'
      },
      quality: {
        'Passed': 'bg-green-100 text-green-800',
        'Failed': 'bg-red-100 text-red-800'
      },
      level: {
        'Active': 'bg-green-100 text-green-800',
        'Needs Review': 'bg-orange-100 text-orange-800'
      }
    };

    return (
      <Badge className={colors[type][status as keyof typeof colors[typeof type]] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0">
      <div className="p-4 space-y-6 min-w-0">
      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">✅ {success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>❌ {error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight break-words">Utilities Management – Water Tanker Supply</h1>
          <p className="text-muted-foreground text-sm break-words">Monitor tank levels, manage replenishment requests, approvals, deliveries, and audits</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sites Monitored</p>
                <p className="text-2xl font-bold">{summaryStats.sitesMonitored}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Requests</p>
                <p className="text-2xl font-bold">{summaryStats.activeRequests}</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Emergency Requests</p>
                <p className="text-2xl font-bold">{summaryStats.emergencyRequests}</p>
              </div>
              <div className="rounded-lg bg-red-50 p-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Deliveries Completed</p>
                <p className="text-2xl font-bold">{summaryStats.completedDeliveries}</p>
              </div>
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <Truck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold">{summaryStats.pendingApprovals}</p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-2 text-yellow-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="levels" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="levels">Minimum Levels</TabsTrigger>
          <TabsTrigger value="monitoring">Tank Monitoring</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
        </TabsList>

        {/* Minimum Replenishment Level Register */}
        <TabsContent value="levels">
          <Card>
            <CardHeader className="bg-muted/50 p-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Minimum Replenishment Level Register</CardTitle>
              <Button onClick={() => setIsMinLevelModalOpen(true)} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Define Level
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Branch / Site</TableHead>
                      <TableHead>Tank Capacity (L)</TableHead>
                      <TableHead>Minimum Level (L)</TableHead>
                      <TableHead>Defined By</TableHead>
                      <TableHead>Approved By</TableHead>
                      <TableHead>Approval Date</TableHead>
                      <TableHead>Last Reviewed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {minimumLevels.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No minimum levels defined yet. Define levels to start monitoring.
                        </TableCell>
                      </TableRow>
                    ) : (
                      minimumLevels.map((level) => (
                        <TableRow key={level.id}>
                          <TableCell className="font-medium">{level.branchSite}</TableCell>
                          <TableCell>{level.tankCapacity.toLocaleString()}</TableCell>
                          <TableCell>{level.minimumLevel.toLocaleString()}</TableCell>
                          <TableCell>{level.definedBy}</TableCell>
                          <TableCell>{level.approvedBy}</TableCell>
                          <TableCell>{level.approvalDate}</TableCell>
                          <TableCell>{level.lastReviewDate}</TableCell>
                          <TableCell>{getStatusBadge(level.status, 'level')}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tank Level Monitoring Register */}
        <TabsContent value="monitoring">
          <Card>
            <CardHeader className="bg-muted/50 p-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Tank Level Monitoring Register</CardTitle>
              <Button onClick={() => setIsTankLogModalOpen(true)} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Log Reading
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Branch / Site</TableHead>
                      <TableHead>Recorded Level (L)</TableHead>
                      <TableHead>Recorded By</TableHead>
                      <TableHead>Below Minimum?</TableHead>
                      <TableHead>Countersigned By</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tankLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No tank readings logged yet. Start logging to monitor levels.
                        </TableCell>
                      </TableRow>
                    ) : (
                      tankLogs.map((log) => (
                        <TableRow key={log.id} className={log.belowMinimum ? "bg-red-50" : ""}>
                          <TableCell>{new Date(log.dateTime).toLocaleString()}</TableCell>
                          <TableCell>{log.branchSite}</TableCell>
                          <TableCell className="font-medium">{log.recordedLevel.toLocaleString()}</TableCell>
                          <TableCell>{log.recordedBy}</TableCell>
                          <TableCell>
                            {log.belowMinimum ? (
                              <Badge className="bg-red-100 text-red-800">Yes</Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800">No</Badge>
                            )}
                          </TableCell>
                          <TableCell>{log.countersignedBy || '-'}</TableCell>
                          <TableCell>{log.notes || '-'}</TableCell>
                          <TableCell>
                            {log.belowMinimum && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleCreateRequest(log.branchSite)}
                              >
                                Create Request
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Replenishment Requests */}
        <TabsContent value="requests">
          <Card>
            <CardHeader className="bg-muted/50 p-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Replenishment Requests</CardTitle>
              <Button onClick={() => handleCreateRequest()} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Request
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Branch / Site</TableHead>
                      <TableHead>Current Level</TableHead>
                      <TableHead>Request Type</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No replenishment requests yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      requests.map((request) => (
                        <TableRow key={request.id} className={request.requestType === 'Emergency' ? "bg-orange-50" : ""}>
                          <TableCell className="font-mono">{request.id}</TableCell>
                          <TableCell>{request.branchSite}</TableCell>
                          <TableCell>{request.currentLevel.toLocaleString()}L</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {request.requestType === 'Emergency' && <Flag className="h-4 w-4 text-red-500" />}
                              {request.requestType}
                            </div>
                          </TableCell>
                          <TableCell>{request.requestMethod}</TableCell>
                          <TableCell>{request.requestedBy}</TableCell>
                          <TableCell>{new Date(request.dateTime).toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(request.status, 'request')}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                              {request.status === 'Approved' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setIsDeliveryModalOpen(true);
                                  }}
                                >
                                  Log Delivery
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deliveries */}
        <TabsContent value="deliveries">
          <Card>
            <CardHeader className="bg-muted/50 p-4">
              <CardTitle className="text-base">Vendor Deliveries & Quality Checks</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Delivery ID</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Expected Vol.</TableHead>
                      <TableHead>Actual Vol.</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Invoice Status</TableHead>
                      <TableHead>Audit Flag</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No deliveries logged yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      deliveries.map((delivery) => (
                        <TableRow key={delivery.id}>
                          <TableCell className="font-mono">{delivery.id}</TableCell>
                          <TableCell>{delivery.vendorName}</TableCell>
                          <TableCell>{delivery.tankerVehicle}</TableCell>
                          <TableCell>{delivery.driverName}</TableCell>
                          <TableCell>{delivery.expectedVolume.toLocaleString()}L</TableCell>
                          <TableCell>{delivery.actualVolume.toLocaleString()}L</TableCell>
                          <TableCell>{getStatusBadge(delivery.qualityStatus, 'quality')}</TableCell>
                          <TableCell>{getStatusBadge(delivery.invoiceStatus, 'delivery')}</TableCell>
                          <TableCell>
                            {delivery.flaggedForAudit && (
                              <Badge className="bg-orange-100 text-orange-800">Flagged</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audits */}
        <TabsContent value="audits">
          <Card>
            <CardHeader className="bg-muted/50 p-4">
              <CardTitle className="text-base">Audit & Snap Checks (25% Random Selection)</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p>Audit system will automatically flag 25% of deliveries for review</p>
                <p className="text-xs mt-1">Flagged deliveries appear in the Deliveries tab</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      
      {/* Add Minimum Level Modal */}
      <Dialog open={isMinLevelModalOpen} onOpenChange={setIsMinLevelModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Define Minimum Replenishment Level</DialogTitle>
            <DialogDescription>Set the minimum water level for a branch/site</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Branch / Site *</Label>
                <CustomSelectDropdown
                  options={branches.map(branch => ({ 
                    value: branch.branchName || branch.name, 
                    label: branch.branchName || branch.name 
                  }))}
                  value={minLevelForm.branchSite}
                  onChange={(value) => setMinLevelForm(prev => ({ ...prev, branchSite: value }))}
                  placeholder="Select branch"
                />
              </div>
              <div className="space-y-2">
                <Label>Tank Capacity (Litres) *</Label>
                <Input
                  type="number"
                  value={minLevelForm.tankCapacity}
                  onChange={(e) => setMinLevelForm(prev => ({ ...prev, tankCapacity: e.target.value }))}
                  placeholder="e.g., 10000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum Level (Litres) *</Label>
                <Input
                  type="number"
                  value={minLevelForm.minimumLevel}
                  onChange={(e) => setMinLevelForm(prev => ({ ...prev, minimumLevel: e.target.value }))}
                  placeholder="e.g., 2000"
                />
              </div>
              <div className="space-y-2">
                <Label>Defined By</Label>
                <Input
                  value={minLevelForm.definedBy}
                  onChange={(e) => setMinLevelForm(prev => ({ ...prev, definedBy: e.target.value }))}
                  placeholder="Name of person defining level"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Approved By</Label>
              <Input
                value={minLevelForm.approvedBy}
                onChange={(e) => setMinLevelForm(prev => ({ ...prev, approvedBy: e.target.value }))}
                placeholder="Head of CRES / Facilities Manager"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMinLevelModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMinimumLevel}>Define Level</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tank Log Modal */}
      <Dialog open={isTankLogModalOpen} onOpenChange={setIsTankLogModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Log Tank Level Reading</DialogTitle>
            <DialogDescription>Record current water level for monitoring</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Branch / Site *</Label>
                <CustomSelectDropdown
                  options={minimumLevels.map(level => ({ 
                    value: level.branchSite, 
                    label: level.branchSite 
                  }))}
                  value={tankLogForm.branchSite}
                  onChange={(value) => setTankLogForm(prev => ({ ...prev, branchSite: value }))}
                  placeholder="Select branch"
                />
              </div>
              <div className="space-y-2">
                <Label>Recorded Level (Litres) *</Label>
                <Input
                  type="number"
                  value={tankLogForm.recordedLevel}
                  onChange={(e) => setTankLogForm(prev => ({ ...prev, recordedLevel: e.target.value }))}
                  placeholder="Current water level"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Recorded By *</Label>
                <Input
                  value={tankLogForm.recordedBy}
                  onChange={(e) => setTankLogForm(prev => ({ ...prev, recordedBy: e.target.value }))}
                  placeholder="Name of person recording"
                />
              </div>
              <div className="space-y-2">
                <Label>Countersigned By (Head of CRES)</Label>
                <Input
                  value={tankLogForm.countersignedBy}
                  onChange={(e) => setTankLogForm(prev => ({ ...prev, countersignedBy: e.target.value }))}
                  placeholder="Verification signature"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                value={tankLogForm.notes}
                onChange={(e) => setTankLogForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any observations or notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTankLogModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTankLog}>Log Reading</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Request Modal */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Replenishment Request</DialogTitle>
            <DialogDescription>Request water tanker delivery for low tank levels</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Branch / Site *</Label>
                <CustomSelectDropdown
                  options={minimumLevels.map(level => ({ 
                    value: level.branchSite, 
                    label: level.branchSite 
                  }))}
                  value={requestForm.branchSite}
                  onChange={(value) => setRequestForm(prev => ({ ...prev, branchSite: value }))}
                  placeholder="Select branch"
                />
              </div>
              <div className="space-y-2">
                <Label>Request Type</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "Non-Emergency", label: "Non-Emergency" },
                    { value: "Emergency", label: "Emergency" }
                  ]}
                  value={requestForm.requestType}
                  onChange={(value) => setRequestForm(prev => ({ ...prev, requestType: value as any }))}
                  placeholder="Select type"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Request Method</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "Call", label: "Phone Call" },
                    { value: "Text", label: "Text Message" },
                    { value: "Email", label: "Email" }
                  ]}
                  value={requestForm.requestMethod}
                  onChange={(value) => setRequestForm(prev => ({ ...prev, requestMethod: value as any }))}
                  placeholder="Select method"
                />
              </div>
              <div className="space-y-2">
                <Label>Requested By *</Label>
                <Input
                  value={requestForm.requestedBy}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, requestedBy: e.target.value }))}
                  placeholder="Name of requester"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddRequest}>Create Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Delivery Modal */}
      <Dialog open={isDeliveryModalOpen} onOpenChange={setIsDeliveryModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Log Vendor Delivery</DialogTitle>
            <DialogDescription>Record delivery details and quality check for {selectedRequest?.id}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vendor *</Label>
                <CustomSelectDropdown
                  options={vendors.map(vendor => ({ 
                    value: vendor.id, 
                    label: vendor.name 
                  }))}
                  value={deliveryForm.vendorId}
                  onChange={(value) => setDeliveryForm(prev => ({ ...prev, vendorId: value }))}
                  placeholder="Select vendor"
                />
              </div>
              <div className="space-y-2">
                <Label>Tanker Vehicle Number *</Label>
                <Input
                  value={deliveryForm.tankerVehicle}
                  onChange={(e) => setDeliveryForm(prev => ({ ...prev, tankerVehicle: e.target.value }))}
                  placeholder="e.g., GH-1234-20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Driver Name *</Label>
                <Input
                  value={deliveryForm.driverName}
                  onChange={(e) => setDeliveryForm(prev => ({ ...prev, driverName: e.target.value }))}
                  placeholder="Driver's full name"
                />
              </div>
              <div className="space-y-2">
                <Label>Expected Volume (Litres)</Label>
                <Input
                  type="number"
                  value={deliveryForm.expectedVolume}
                  onChange={(e) => setDeliveryForm(prev => ({ ...prev, expectedVolume: e.target.value }))}
                  placeholder="Expected delivery volume"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Actual Volume (Meter Reading)</Label>
                <Input
                  type="number"
                  value={deliveryForm.actualVolume}
                  onChange={(e) => setDeliveryForm(prev => ({ ...prev, actualVolume: e.target.value }))}
                  placeholder="Actual delivered volume"
                />
              </div>
              <div className="space-y-2">
                <Label>Volume Agreed?</Label>
                <div className="flex items-center space-x-4 pt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={deliveryForm.volumeAgreed === true}
                      onChange={() => setDeliveryForm(prev => ({ ...prev, volumeAgreed: true }))}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={deliveryForm.volumeAgreed === false}
                      onChange={() => setDeliveryForm(prev => ({ ...prev, volumeAgreed: false }))}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Water Quality Status</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "Passed", label: "Passed" },
                    { value: "Failed", label: "Failed" }
                  ]}
                  value={deliveryForm.qualityStatus}
                  onChange={(value) => setDeliveryForm(prev => ({ ...prev, qualityStatus: value as any }))}
                  placeholder="Quality check result"
                />
              </div>
              <div className="space-y-2">
                <Label>Quality Notes</Label>
                <Input
                  value={deliveryForm.qualityNotes}
                  onChange={(e) => setDeliveryForm(prev => ({ ...prev, qualityNotes: e.target.value }))}
                  placeholder="Quality check observations"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Signed by On-site Officer</Label>
                <Input
                  value={deliveryForm.signedByOfficer}
                  onChange={(e) => setDeliveryForm(prev => ({ ...prev, signedByOfficer: e.target.value }))}
                  placeholder="Officer name"
                />
              </div>
              <div className="space-y-2">
                <Label>Countersigned by Head of Facilities</Label>
                <Input
                  value={deliveryForm.countersignedBy}
                  onChange={(e) => setDeliveryForm(prev => ({ ...prev, countersignedBy: e.target.value }))}
                  placeholder="Head of Facilities name"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeliveryModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDelivery}>Log Delivery</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
};

export default WaterTankerManagement;