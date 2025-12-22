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
import { FuelTabs } from "@/components/ui/FuelTabs";
import { FuelType, loadFuelContext, saveFuelContext } from "@/utils/fuelContext";
import { 
  Plus, 
  Fuel, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Building2, 
  Eye, 
  Edit, 
  TrendingDown,
  TrendingUp,
  Zap
} from "lucide-react";

// Interfaces
interface FuelLevelLog {
  id: string;
  dateTime: string;
  branchSite: string;
  generatorId: string;
  generatorName: string;
  recordedFuelLevel: number;
  minimumRequiredLevel: number;
  reorderRequired: boolean;
  recordedBy: string;
  notes?: string;
  createdDate: string;
}

interface FuelReorderRequest {
  id: string;
  branchSite: string;
  generatorId: string;
  generatorName: string;
  currentFuelLevel: number;
  requestedQuantity: number;
  requestReason: string;
  requestDate: string;
  status: 'Pending Approval' | 'Approved' | 'Corrections Required' | 'Rejected';
  approvedBy?: string;
  approvalDate?: string;
  corrections?: string;
  createdDate: string;
}

interface FuelCard {
  id: string;
  cardId: string;
  assignedSite: string;
  status: 'In Safe' | 'In Use';
  lastUsedDate?: string;
  pinControlStatus: 'Secured' | 'Released';
  createdDate: string;
}

interface FuelDelivery {
  id: string;
  reorderReference: string;
  oilMarketingCompany: string;
  quantityApproved: number;
  quantityDelivered: number;
  tankLevelBefore: number;
  tankLevelAfter: number;
  discrepancy: boolean;
  escalationStatus?: string;
  deliveryDate: string;
  createdDate: string;
}

// Storage keys
const GENERATOR_FUEL_LEVEL_STORAGE_KEY = "GENERATOR_FUEL_LEVEL_CACHE_V1";
const FUEL_REORDER_STORAGE_KEY = "FUEL_REORDER_CACHE_V1";
const FUEL_CARDS_STORAGE_KEY = "FUEL_CARDS_CACHE_V1";
const FUEL_DELIVERY_STORAGE_KEY = "FUEL_DELIVERY_CACHE_V1";
const BRANCHES_STORAGE_KEY = "BRANCHES_CACHE_V1";

const FuelDashboard = () => {
  // Fuel context state
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType>(() => 
    loadFuelContext("dashboard")
  );
  
  // State
  const [fuelLogs, setFuelLogs] = useState<FuelLevelLog[]>([]);
  const [reorderRequests, setReorderRequests] = useState<FuelReorderRequest[]>([]);
  const [fuelCards, setFuelCards] = useState<FuelCard[]>([]);
  const [deliveries, setDeliveries] = useState<FuelDelivery[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  
  // Modal states
  const [isFuelLogModalOpen, setIsFuelLogModalOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<FuelLevelLog | null>(null);
  
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Form states
  const [fuelLogForm, setFuelLogForm] = useState({
    branchSite: "",
    generatorId: "",
    generatorName: "",
    recordedFuelLevel: "",
    minimumRequiredLevel: "",
    recordedBy: "",
    notes: ""
  });

  const [reorderForm, setReorderForm] = useState({
    branchSite: "",
    generatorId: "",
    generatorName: "",
    currentFuelLevel: "",
    requestedQuantity: "",
    requestReason: ""
  });

  // Load data on mount and when fuel type changes
  useEffect(() => {
    loadAllData();
  }, [selectedFuelType]);

  // Handle fuel type change
  const handleFuelTypeChange = (fuelType: FuelType) => {
    setSelectedFuelType(fuelType);
    saveFuelContext("dashboard", fuelType);
  };

  const loadAllData = () => {
    loadFuelLogs();
    loadReorderRequests();
    loadFuelCards();
    loadDeliveries();
    loadBranches();
  };

  const loadFuelLogs = () => {
    try {
      const cached = localStorage.getItem(GENERATOR_FUEL_LEVEL_STORAGE_KEY);
      setFuelLogs(cached ? JSON.parse(cached) : []);
    } catch (err) {
      console.error("Error loading fuel logs:", err);
      setFuelLogs([]);
    }
  };

  const loadReorderRequests = () => {
    try {
      const cached = localStorage.getItem(FUEL_REORDER_STORAGE_KEY);
      setReorderRequests(cached ? JSON.parse(cached) : []);
    } catch (err) {
      console.error("Error loading reorder requests:", err);
      setReorderRequests([]);
    }
  };

  const loadFuelCards = () => {
    try {
      const cached = localStorage.getItem(FUEL_CARDS_STORAGE_KEY);
      setFuelCards(cached ? JSON.parse(cached) : []);
    } catch (err) {
      console.error("Error loading fuel cards:", err);
      setFuelCards([]);
    }
  };

  const loadDeliveries = () => {
    try {
      const cached = localStorage.getItem(FUEL_DELIVERY_STORAGE_KEY);
      setDeliveries(cached ? JSON.parse(cached) : []);
    } catch (err) {
      console.error("Error loading deliveries:", err);
      setDeliveries([]);
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

  // Save functions
  const saveFuelLogs = (data: FuelLevelLog[]) => {
    localStorage.setItem(GENERATOR_FUEL_LEVEL_STORAGE_KEY, JSON.stringify(data));
    setFuelLogs(data);
  };

  const saveReorderRequests = (data: FuelReorderRequest[]) => {
    localStorage.setItem(FUEL_REORDER_STORAGE_KEY, JSON.stringify(data));
    setReorderRequests(data);
  };

  // Summary statistics
  const dashboardStats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Get unique sites from fuel logs
    const criticalSites = [...new Set(fuelLogs.map(log => log.branchSite))].length;
    
    // Sites below minimum fuel level (latest reading per site)
    const sitesBelowMinimum = fuelLogs.reduce((acc, log) => {
      const siteKey = `${log.branchSite}-${log.generatorId}`;
      if (!acc[siteKey] || new Date(log.dateTime) > new Date(acc[siteKey].dateTime)) {
        acc[siteKey] = log;
      }
      return acc;
    }, {} as Record<string, FuelLevelLog>);
    
    const belowMinimumCount = Object.values(sitesBelowMinimum).filter(log => 
      log.recordedFuelLevel < log.minimumRequiredLevel
    ).length;
    
    const pendingApprovals = reorderRequests.filter(req => req.status === 'Pending Approval').length;
    
    const thisMonthDeliveries = deliveries.filter(delivery => {
      const deliveryDate = new Date(delivery.deliveryDate);
      return deliveryDate.getMonth() === currentMonth && deliveryDate.getFullYear() === currentYear;
    }).length;
    
    const reconciliationIssues = deliveries.filter(delivery => delivery.discrepancy).length;

    return {
      criticalSites,
      belowMinimumCount,
      pendingApprovals,
      thisMonthDeliveries,
      reconciliationIssues
    };
  }, [fuelLogs, reorderRequests, deliveries]);

  // Handle form submissions
  const handleAddFuelLog = () => {
    try {
      if (!fuelLogForm.branchSite || !fuelLogForm.generatorId || !fuelLogForm.recordedFuelLevel || !fuelLogForm.recordedBy) {
        setError("Please fill in all required fields");
        return;
      }

      const recordedLevel = parseFloat(fuelLogForm.recordedFuelLevel);
      const minimumLevel = parseFloat(fuelLogForm.minimumRequiredLevel);
      const reorderRequired = recordedLevel < minimumLevel;

      const newId = `FLG-${String(fuelLogs.length + 1).padStart(3, '0')}`;
      const newLog: FuelLevelLog = {
        id: newId,
        dateTime: new Date().toISOString(),
        branchSite: fuelLogForm.branchSite,
        generatorId: fuelLogForm.generatorId,
        generatorName: fuelLogForm.generatorName,
        recordedFuelLevel: recordedLevel,
        minimumRequiredLevel: minimumLevel,
        reorderRequired: reorderRequired,
        recordedBy: fuelLogForm.recordedBy,
        notes: fuelLogForm.notes,
        createdDate: new Date().toISOString().split('T')[0]
      };

      saveFuelLogs([...fuelLogs, newLog]);
      setFuelLogForm({
        branchSite: "", generatorId: "", generatorName: "", recordedFuelLevel: "", 
        minimumRequiredLevel: "", recordedBy: "", notes: ""
      });
      setIsFuelLogModalOpen(false);
      setSuccess("Fuel level logged successfully!");
      
      if (reorderRequired) {
        setError("⚠️ Fuel level below minimum! You can now create a reorder request.");
      }
      
      setTimeout(() => { setSuccess(""); setError(""); }, 5000);
    } catch (err) {
      setError("Failed to log fuel level");
    }
  };

  const handleCreateReorder = (log?: FuelLevelLog) => {
    if (log) {
      setReorderForm({
        branchSite: log.branchSite,
        generatorId: log.generatorId,
        generatorName: log.generatorName,
        currentFuelLevel: log.recordedFuelLevel.toString(),
        requestedQuantity: "",
        requestReason: "Fuel level below minimum threshold"
      });
    }
    setIsReorderModalOpen(true);
  };

  const handleAddReorderRequest = () => {
    try {
      if (!reorderForm.branchSite || !reorderForm.generatorId || !reorderForm.requestedQuantity) {
        setError("Please fill in all required fields");
        return;
      }

      const newId = `FRQ-${String(reorderRequests.length + 1).padStart(3, '0')}`;
      const newRequest: FuelReorderRequest = {
        id: newId,
        branchSite: reorderForm.branchSite,
        generatorId: reorderForm.generatorId,
        generatorName: reorderForm.generatorName,
        currentFuelLevel: parseFloat(reorderForm.currentFuelLevel),
        requestedQuantity: parseFloat(reorderForm.requestedQuantity),
        requestReason: reorderForm.requestReason,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'Pending Approval',
        createdDate: new Date().toISOString().split('T')[0]
      };

      saveReorderRequests([...reorderRequests, newRequest]);
      setReorderForm({
        branchSite: "", generatorId: "", generatorName: "", 
        currentFuelLevel: "", requestedQuantity: "", requestReason: ""
      });
      setIsReorderModalOpen(false);
      setSuccess("Fuel reorder request created successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to create reorder request");
    }
  };

  const getStatusBadge = (status: string, type: 'reorder' | 'card') => {
    const colors = {
      reorder: {
        'Pending Approval': 'bg-yellow-100 text-yellow-800',
        'Approved': 'bg-green-100 text-green-800',
        'Corrections Required': 'bg-orange-100 text-orange-800',
        'Rejected': 'bg-red-100 text-red-800'
      },
      card: {
        'In Safe': 'bg-green-100 text-green-800',
        'In Use': 'bg-blue-100 text-blue-800'
      }
    };

    return (
      <Badge className={colors[type][status as keyof typeof colors[typeof type]] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-4 space-y-6">
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fuel Management Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor {selectedFuelType.toLowerCase()} fuel levels, approvals, purchases, and deliveries
          </p>
        </div>
      </div>

      {/* Fuel Type Tabs */}
      <FuelTabs selectedType={selectedFuelType} onTypeChange={handleFuelTypeChange} />

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Sites Monitored</p>
                <p className="text-2xl font-bold">{dashboardStats.criticalSites}</p>
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
                <p className="text-sm text-muted-foreground">Sites Below Minimum</p>
                <p className="text-2xl font-bold">{dashboardStats.belowMinimumCount}</p>
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
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold">{dashboardStats.pendingApprovals}</p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-2 text-yellow-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Deliveries This Month</p>
                <p className="text-2xl font-bold">{dashboardStats.thisMonthDeliveries}</p>
              </div>
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <Fuel className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reconciliation Issues</p>
                <p className="text-2xl font-bold">{dashboardStats.reconciliationIssues}</p>
              </div>
              <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {dashboardStats.belowMinimumCount > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            🔴 <strong>{dashboardStats.belowMinimumCount}</strong> generator{dashboardStats.belowMinimumCount > 1 ? 's are' : ' is'} below minimum fuel level. Immediate reorder required.
          </AlertDescription>
        </Alert>
      )}

      {dashboardStats.reconciliationIssues > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertDescription className="text-orange-800">
            ⚠️ <strong>{dashboardStats.reconciliationIssues}</strong> fuel deliver{dashboardStats.reconciliationIssues > 1 ? 'ies have' : 'y has'} discrepancies requiring reconciliation.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="fuel-levels" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fuel-levels">
            {selectedFuelType === "GENERATOR" ? "Daily Fuel Levels" : "Vehicle Fuel Logs"}
          </TabsTrigger>
          <TabsTrigger value="reorder-requests">Reorder Requests</TabsTrigger>
          <TabsTrigger value="recent-activity">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Daily Fuel Level Register */}
        <TabsContent value="fuel-levels">
          <Card>
            <CardHeader className="bg-muted/50 p-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                {selectedFuelType === "GENERATOR" ? "Daily Fuel Level Register" : "Vehicle Fuel Usage Log"}
              </CardTitle>
              <Button onClick={() => setIsFuelLogModalOpen(true)} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Log Fuel Level
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Branch / Site</TableHead>
                      <TableHead>Generator ID</TableHead>
                      <TableHead>Fuel Level (L)</TableHead>
                      <TableHead>Minimum Level (L)</TableHead>
                      <TableHead>Reorder Required?</TableHead>
                      <TableHead>Recorded By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fuelLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No {selectedFuelType.toLowerCase()} fuel data logged yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      fuelLogs.map((log) => (
                        <TableRow key={log.id} className={log.reorderRequired ? "bg-red-50" : ""}>
                          <TableCell>{new Date(log.dateTime).toLocaleString()}</TableCell>
                          <TableCell>{log.branchSite}</TableCell>
                          <TableCell className="font-mono">{log.generatorId}</TableCell>
                          <TableCell className="font-medium">{log.recordedFuelLevel.toLocaleString()}L</TableCell>
                          <TableCell>{log.minimumRequiredLevel.toLocaleString()}L</TableCell>
                          <TableCell>
                            {log.reorderRequired ? (
                              <Badge className="bg-red-100 text-red-800">Yes</Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800">No</Badge>
                            )}
                          </TableCell>
                          <TableCell>{log.recordedBy}</TableCell>
                          <TableCell>
                            {log.reorderRequired && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleCreateReorder(log)}
                              >
                                Create Reorder
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

        {/* Reorder Requests */}
        <TabsContent value="reorder-requests">
          <Card>
            <CardHeader className="bg-muted/50 p-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Fuel Reorder Requests</CardTitle>
              <Button onClick={() => handleCreateReorder()} size="sm" className="gap-2">
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
                      <TableHead>Generator</TableHead>
                      <TableHead>Current Level</TableHead>
                      <TableHead>Requested Qty</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reorderRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No reorder requests yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      reorderRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-mono">{request.id}</TableCell>
                          <TableCell>{request.branchSite}</TableCell>
                          <TableCell>{request.generatorName || request.generatorId}</TableCell>
                          <TableCell>{request.currentFuelLevel.toLocaleString()}L</TableCell>
                          <TableCell>{request.requestedQuantity.toLocaleString()}L</TableCell>
                          <TableCell>{request.requestDate}</TableCell>
                          <TableCell>{getStatusBadge(request.status, 'reorder')}</TableCell>
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

        {/* Recent Activity */}
        <TabsContent value="recent-activity">
          <Card>
            <CardHeader className="bg-muted/50 p-4">
              <CardTitle className="text-base">
                Recent {selectedFuelType === "GENERATOR" ? "Generator" : "Vehicle"} Fuel Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {fuelLogs.slice(-5).reverse().map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${log.reorderRequired ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      <div>
                        <p className="font-medium">{log.branchSite} - {log.generatorName || log.generatorId}</p>
                        <p className="text-sm text-muted-foreground">
                          Fuel level: {log.recordedFuelLevel}L | Recorded by: {log.recordedBy}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{new Date(log.dateTime).toLocaleDateString()}</p>
                      {log.reorderRequired && (
                        <Badge className="bg-red-100 text-red-800 text-xs">Reorder Required</Badge>
                      )}
                    </div>
                  </div>
                ))}
                {fuelLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Zap className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      
      {/* Log Fuel Level Modal */}
      <Dialog open={isFuelLogModalOpen} onOpenChange={setIsFuelLogModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Log Daily Fuel Level</DialogTitle>
            <DialogDescription>Record current fuel level for generator monitoring</DialogDescription>
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
                  value={fuelLogForm.branchSite}
                  onChange={(value) => setFuelLogForm(prev => ({ ...prev, branchSite: value }))}
                  placeholder="Select branch"
                />
              </div>
              <div className="space-y-2">
                <Label>Generator ID *</Label>
                <Input
                  value={fuelLogForm.generatorId}
                  onChange={(e) => setFuelLogForm(prev => ({ ...prev, generatorId: e.target.value }))}
                  placeholder="e.g., GEN-001"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Generator Name</Label>
              <Input
                value={fuelLogForm.generatorName}
                onChange={(e) => setFuelLogForm(prev => ({ ...prev, generatorName: e.target.value }))}
                placeholder="Generator description or name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Recorded Fuel Level (Litres) *</Label>
                <Input
                  type="number"
                  value={fuelLogForm.recordedFuelLevel}
                  onChange={(e) => setFuelLogForm(prev => ({ ...prev, recordedFuelLevel: e.target.value }))}
                  placeholder="Current fuel level"
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum Required Level (Litres) *</Label>
                <Input
                  type="number"
                  value={fuelLogForm.minimumRequiredLevel}
                  onChange={(e) => setFuelLogForm(prev => ({ ...prev, minimumRequiredLevel: e.target.value }))}
                  placeholder="Minimum threshold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Recorded By *</Label>
                <Input
                  value={fuelLogForm.recordedBy}
                  onChange={(e) => setFuelLogForm(prev => ({ ...prev, recordedBy: e.target.value }))}
                  placeholder="Security / Facilities staff name"
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={fuelLogForm.notes}
                  onChange={(e) => setFuelLogForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any observations"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFuelLogModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFuelLog}>Log Fuel Level</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Reorder Request Modal */}
      <Dialog open={isReorderModalOpen} onOpenChange={setIsReorderModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Fuel Reorder Request</DialogTitle>
            <DialogDescription>Request fuel purchase for generator with low fuel level</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Branch / Site *</Label>
                <Input
                  value={reorderForm.branchSite}
                  onChange={(e) => setReorderForm(prev => ({ ...prev, branchSite: e.target.value }))}
                  placeholder="Site location"
                />
              </div>
              <div className="space-y-2">
                <Label>Generator ID *</Label>
                <Input
                  value={reorderForm.generatorId}
                  onChange={(e) => setReorderForm(prev => ({ ...prev, generatorId: e.target.value }))}
                  placeholder="Generator identifier"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Generator Name</Label>
              <Input
                value={reorderForm.generatorName}
                onChange={(e) => setReorderForm(prev => ({ ...prev, generatorName: e.target.value }))}
                placeholder="Generator description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Fuel Level (Litres)</Label>
                <Input
                  type="number"
                  value={reorderForm.currentFuelLevel}
                  onChange={(e) => setReorderForm(prev => ({ ...prev, currentFuelLevel: e.target.value }))}
                  placeholder="Current level"
                />
              </div>
              <div className="space-y-2">
                <Label>Requested Quantity (Litres) *</Label>
                <Input
                  type="number"
                  value={reorderForm.requestedQuantity}
                  onChange={(e) => setReorderForm(prev => ({ ...prev, requestedQuantity: e.target.value }))}
                  placeholder="Fuel quantity needed"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Request Reason</Label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                value={reorderForm.requestReason}
                onChange={(e) => setReorderForm(prev => ({ ...prev, requestReason: e.target.value }))}
                placeholder="Reason for fuel reorder request..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReorderModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddReorderRequest}>Create Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FuelDashboard;