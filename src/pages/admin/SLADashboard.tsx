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
import CustomSelectDropdown from "@/components/ui/CustomSelectDropdown";
import { Plus, CheckCircle, Clock, AlertTriangle, Info } from "lucide-react";

// SLA Interface
interface SLA {
  id: string;
  slaName: string;
  priorityLevel: string;
  priorityDefinition: string;
  responseTime: string;
  resolutionTime: string;
  appliedBranches: string[];
  assignedVendorIds: string[];
  assignedVendorNames: string[];
  createdDate: string;
}

// Work Order Interface (for SLA calculations)
interface WorkOrder {
  id: string;
  assetId: string;
  assetName: string;
  category: string;
  location: string;
  workOrderType: string;
  status: string;
  vendorType: string;
  createdDate: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  estimatedCost: string;
  vendorId: string;
  vendorName: string;
  slaId?: string;
  slaName?: string;
  priorityLevel?: string;
  responseTime?: string;
  resolutionTime?: string;
}

const SLA_STORAGE_KEY = "SLA_CACHE_V1";
const WORK_ORDERS_STORAGE_KEY = "WORK_ORDERS_CACHE_V1";
const VENDORS_STORAGE_KEY = "VENDORS_CACHE_V1";

// Priority definitions (EXACT as specified)
const PRIORITY_DEFINITIONS = {
  "Priority 1 – Emergency Service": "Any event that creates Health & Safety and Business-critical hazard such as power failure, burst water pipe, roof leakage, air-conditioning breakdown, roof drain blockage, etc.",
  "Priority 2 – Critical Service": "Any work that is disruptive to operations but does not present immediate threat to health and safety.",
  "Priority 3 – Standard Service": "Works that do not qualify as emergency or urgent service.",
  "Priority 4 – Minor Service": "A minor condition requiring intervention with negligible or no immediate business impact."
};

// SLA Timings (EXACT as specified)
const SLA_TIMINGS = {
  "Priority 1 – Emergency Service": { response: "Immediate", resolution: "24 Hours" },
  "Priority 2 – Critical Service": { response: "1 Day", resolution: "48 – 96 Hours" },
  "Priority 3 – Standard Service": { response: "1 Day", resolution: "167 Hours" },
  "Priority 4 – Minor Service": { response: "1 Day", resolution: "14 – 30 Days" }
};

// Branch options (EXACT as specified)
const BRANCH_OPTIONS = [
  "Osu", "Hohoe", "Berekum", "Head Office- Lifts", "Achimota", "Ahodwo", 
  "Kejetia", "Krofrom", "Bantama", "BCM Motorway Ext.", "ITSM Data Centre", 
  "Comms Room", "KNUST", "Madina", "Nkawkaw", "Knustford", "Thigh", 
  "Tema Fishing Harbour", "Suame", "Asafo", "Tanoso", "Wa", 
  "L & D - Ridge Branch", "L & D - Osu", "KPST- Kumasi", "Ashiaman", 
  "Dansoman Main", "Maamobi", "Circle", "Tarkwa", "Talib", "DARKUMAN", 
  "HO, SUNYANI"
];

// Vendor Interface
interface Vendor {
  id: string;
  name: string;
  contact: string;
  category: string;
  createdDate: string;
}

const SLADashboard = () => {
  const [slas, setSlas] = useState<SLA[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    slaName: "",
    priorityLevel: "",
    appliedBranches: [] as string[],
    assignedVendorIds: [] as string[]
  });

  // Load data on component mount
  useEffect(() => {
    loadSLAs();
    loadWorkOrders();
    loadVendors();
  }, []);

  const loadSLAs = () => {
    try {
      const cachedSLAs = localStorage.getItem(SLA_STORAGE_KEY);
      const slas = cachedSLAs ? JSON.parse(cachedSLAs) : [];
      setSlas(slas);
    } catch (err) {
      console.error("Error loading SLAs:", err);
      setSlas([]);
    }
  };

  const loadWorkOrders = () => {
    try {
      const cachedWorkOrders = localStorage.getItem(WORK_ORDERS_STORAGE_KEY);
      const workOrders = cachedWorkOrders ? JSON.parse(cachedWorkOrders) : [];
      setWorkOrders(workOrders);
    } catch (err) {
      console.error("Error loading work orders:", err);
      setWorkOrders([]);
    }
  };

  const loadVendors = () => {
    try {
      const cachedVendors = localStorage.getItem(VENDORS_STORAGE_KEY);
      const vendors = cachedVendors ? JSON.parse(cachedVendors) : [];
      setVendors(vendors);
    } catch (err) {
      console.error("Error loading vendors:", err);
      setVendors([]);
    }
  };

  const saveSLAs = (newSLAs: SLA[]) => {
    try {
      localStorage.setItem(SLA_STORAGE_KEY, JSON.stringify(newSLAs));
    } catch (err) {
      console.error("Error saving SLAs:", err);
    }
  };

  // Calculate SLA breach statistics
  const slaStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const breachedWorkOrders = workOrders.filter(wo => {
      if (wo.status === "Closed" || !wo.dueDate) return false;
      const dueDate = new Date(wo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    });

    const nearBreachWorkOrders = workOrders.filter(wo => {
      if (wo.status === "Closed" || !wo.dueDate) return false;
      const dueDate = new Date(wo.dueDate);
      const timeDiff = dueDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff <= 1 && daysDiff >= 0;
    });

    const totalActiveWorkOrders = workOrders.filter(wo => wo.status !== "Closed").length;
    const complianceRate = totalActiveWorkOrders > 0 
      ? Math.round(((totalActiveWorkOrders - breachedWorkOrders.length) / totalActiveWorkOrders) * 100)
      : 100;

    return {
      breachedCount: breachedWorkOrders.length,
      nearBreachCount: nearBreachWorkOrders.length,
      complianceRate,
      totalActive: totalActiveWorkOrders
    };
  }, [workOrders]);

  const handleCreateSLA = () => {
    try {
      // Validation
      if (!formData.slaName || !formData.priorityLevel || formData.appliedBranches.length === 0 || formData.assignedVendorIds.length === 0) {
        setError("Please fill in all required fields including vendor assignment");
        return;
      }

      // Generate new SLA ID
      const newId = `SLA-${String(slas.length + 1).padStart(3, '0')}`;
      
      // Get vendor names for snapshot
      const assignedVendorNames = formData.assignedVendorIds.map(vendorId => {
        const vendor = vendors.find(v => v.id === vendorId);
        return vendor ? vendor.name : vendorId;
      });
      
      const newSLA: SLA = {
        id: newId,
        slaName: formData.slaName,
        priorityLevel: formData.priorityLevel,
        priorityDefinition: PRIORITY_DEFINITIONS[formData.priorityLevel as keyof typeof PRIORITY_DEFINITIONS],
        responseTime: SLA_TIMINGS[formData.priorityLevel as keyof typeof SLA_TIMINGS].response,
        resolutionTime: SLA_TIMINGS[formData.priorityLevel as keyof typeof SLA_TIMINGS].resolution,
        appliedBranches: formData.appliedBranches,
        assignedVendorIds: formData.assignedVendorIds,
        assignedVendorNames: assignedVendorNames,
        createdDate: new Date().toISOString().split('T')[0]
      };

      const updatedSLAs = [...slas, newSLA];
      setSlas(updatedSLAs);
      saveSLAs(updatedSLAs);

      // Reset form
      setFormData({
        slaName: "",
        priorityLevel: "",
        appliedBranches: [],
        assignedVendorIds: []
      });

      setIsCreateModalOpen(false);
      setSuccess("SLA created successfully!");
      setError("");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to create SLA");
      console.error("Error creating SLA:", err);
    }
  };

  const handleBranchSelection = (branchValue: string) => {
    if (formData.appliedBranches.includes(branchValue)) {
      setFormData(prev => ({
        ...prev,
        appliedBranches: prev.appliedBranches.filter(b => b !== branchValue)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        appliedBranches: [...prev.appliedBranches, branchValue]
      }));
    }
  };

  const handleVendorSelection = (vendorId: string) => {
    if (formData.assignedVendorIds.includes(vendorId)) {
      setFormData(prev => ({
        ...prev,
        assignedVendorIds: prev.assignedVendorIds.filter(id => id !== vendorId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        assignedVendorIds: [...prev.assignedVendorIds, vendorId]
      }));
    }
  };

  const selectedPriorityTimings = formData.priorityLevel 
    ? SLA_TIMINGS[formData.priorityLevel as keyof typeof SLA_TIMINGS]
    : null;

  const selectedPriorityDefinition = formData.priorityLevel 
    ? PRIORITY_DEFINITIONS[formData.priorityLevel as keyof typeof PRIORITY_DEFINITIONS]
    : "";

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

      {/* SLA Breach Alerts */}
      {slaStats.breachedCount > 0 && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center gap-2">
            🔴 <strong>{slaStats.breachedCount}</strong> Work Order{slaStats.breachedCount > 1 ? 's have' : ' has'} breached SLA
          </AlertDescription>
        </Alert>
      )}

      {slaStats.nearBreachCount > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertDescription className="flex items-center gap-2 text-orange-800">
            ⚠️ <strong>{slaStats.nearBreachCount}</strong> Work Order{slaStats.nearBreachCount > 1 ? 's are' : ' is'} near SLA breach (within 24 hours)
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SLA Dashboard</h1>
          <p className="text-muted-foreground">Service Level Agreement management and monitoring</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New SLA
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">SLA Compliance</p>
                <p className="text-2xl font-bold">{slaStats.complianceRate}%</p>
              </div>
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Work Orders</p>
                <p className="text-2xl font-bold">{slaStats.totalActive}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">SLA Breaches</p>
                <p className="text-2xl font-bold text-red-600">{slaStats.breachedCount}</p>
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
                <p className="text-sm text-muted-foreground">Total SLAs</p>
                <p className="text-2xl font-bold">{slas.length}</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                <Plus className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SLA List */}
      <Card>
        <CardHeader className="bg-muted/50 p-4">
          <CardTitle className="text-base">Service Level Agreements ({slas.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead className="text-sm">SLA Name</TableHead>
                  <TableHead className="text-sm">Priority Level</TableHead>
                  <TableHead className="text-sm">Response Time</TableHead>
                  <TableHead className="text-sm">Resolution Time</TableHead>
                  <TableHead className="text-sm">Applied Branches</TableHead>
                  <TableHead className="text-sm">Assigned Vendors</TableHead>
                  <TableHead className="text-sm">Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No SLAs created yet. Create your first SLA to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  slas.map((sla) => (
                    <TableRow key={sla.id} className="hover:bg-muted/50">
                      <TableCell className="text-sm font-medium">{sla.slaName}</TableCell>
                      <TableCell className="text-sm">
                        <Badge variant={
                          sla.priorityLevel.includes("Priority 1") ? "destructive" :
                          sla.priorityLevel.includes("Priority 2") ? "secondary" :
                          "outline"
                        }>
                          {sla.priorityLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{sla.responseTime}</TableCell>
                      <TableCell className="text-sm">{sla.resolutionTime}</TableCell>
                      <TableCell className="text-sm">
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {sla.appliedBranches.length} branch{sla.appliedBranches.length > 1 ? 'es' : ''}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {sla.assignedVendorNames?.length || 0} vendor{(sla.assignedVendorNames?.length || 0) !== 1 ? 's' : ''}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{sla.createdDate}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create SLA Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New SLA
            </DialogTitle>
            <DialogDescription>
              Define service level agreement based on Excel SLA & Escalation Matrix
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* SLA Name */}
            <div className="space-y-2">
              <Label htmlFor="slaName">SLA Name *</Label>
              <Input
                id="slaName"
                value={formData.slaName}
                onChange={(e) => setFormData(prev => ({ ...prev, slaName: e.target.value }))}
                placeholder="e.g., CRES Facilities SLA"
              />
            </div>

            {/* Priority Level */}
            <div className="space-y-2">
              <Label htmlFor="priorityLevel">Priority Level *</Label>
              <CustomSelectDropdown
                options={[
                  { value: "Priority 1 – Emergency Service", label: "Priority 1 – Emergency Service" },
                  { value: "Priority 2 – Critical Service", label: "Priority 2 – Critical Service" },
                  { value: "Priority 3 – Standard Service", label: "Priority 3 – Standard Service" },
                  { value: "Priority 4 – Minor Service", label: "Priority 4 – Minor Service" }
                ]}
                value={formData.priorityLevel}
                onChange={(value) => setFormData(prev => ({ ...prev, priorityLevel: value }))}
                placeholder="Select priority level"
              />
            </div>

            {/* Priority Definition (Read-Only) */}
            {formData.priorityLevel && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Priority Definition
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Label>
                <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                  {selectedPriorityDefinition}
                </div>
              </div>
            )}

            {/* SLA Timings (Auto-filled & Locked) */}
            {selectedPriorityTimings && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Response Time (CRES)</Label>
                  <Input
                    value={selectedPriorityTimings.response}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Resolution Time (CRES)</Label>
                  <Input
                    value={selectedPriorityTimings.resolution}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            )}

            {/* Escalation Levels (Read-Only Display) */}
            {formData.priorityLevel && (
              <div className="space-y-2">
                <Label>Escalation Levels (Informational)</Label>
                <div className="p-3 bg-muted rounded-lg space-y-1 text-sm">
                  <div><strong>Level 2:</strong> Head of Unit / Department (48 hrs)</div>
                  <div><strong>Level 3:</strong> Functional Head (72 hrs)</div>
                </div>
              </div>
            )}

            {/* Apply to Branch (Multi-Select) */}
            <div className="space-y-2">
              <Label>Apply to Branch *</Label>
              <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {BRANCH_OPTIONS.map((branch) => (
                    <label key={branch} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.appliedBranches.includes(branch)}
                        onChange={() => handleBranchSelection(branch)}
                        className="rounded border-gray-300"
                      />
                      <span>{branch}</span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Selected: {formData.appliedBranches.length} branch{formData.appliedBranches.length !== 1 ? 'es' : ''}
              </p>
            </div>

            {/* Assign to Vendors (Multi-Select) */}
            <div className="space-y-2">
              <Label>Assign to Vendors *</Label>
              <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                {vendors.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No vendors available. Please add vendors first.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {vendors.map((vendor) => (
                      <label key={vendor.id} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.assignedVendorIds.includes(vendor.id)}
                          onChange={() => handleVendorSelection(vendor.id)}
                          className="rounded border-gray-300"
                        />
                        <span>{vendor.name}</span>
                        <span className="text-xs text-muted-foreground">({vendor.category})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Selected: {formData.assignedVendorIds.length} vendor{formData.assignedVendorIds.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSLA}
              disabled={!formData.slaName || !formData.priorityLevel || formData.appliedBranches.length === 0 || formData.assignedVendorIds.length === 0}
            >
              Create SLA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SLADashboard;