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
import { Plus, Search, Package, Eye, Edit, Trash2, AlertTriangle } from "lucide-react";

// Asset interface (same as Assets page)
interface Asset {
  id: string;
  location: string;
  avrModel: string;
  serialNumber: string;
  kva: string;
  dateInstalled: string;
  avrStatus: string;
  endOfLife: string;
  inUse: string;
  quantity: number;
  vendor: string;
  comments: string;
  category: string;
  branch: string;
}

// Work Order interface
// Vendor interface
interface Vendor {
  id: string;
  name: string;
  contact: string;
  category: string;
  createdDate: string;
}

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

const ASSETS_STORAGE_KEY = "ASSETS_CACHE_V1";
const WORK_ORDERS_STORAGE_KEY = "WORK_ORDERS_CACHE_V1";
const VENDORS_STORAGE_KEY = "VENDORS_CACHE_V1";
const SLA_STORAGE_KEY = "SLA_CACHE_V1";

// SLA Interface
interface SLA {
  id: string;
  slaName: string;
  priorityLevel: string;
  priorityDefinition: string;
  responseTime: string;
  resolutionTime: string;
  appliedBranches: string[];
  createdDate: string;
}

// SLA Resolution time to hours mapping
const RESOLUTION_TIME_HOURS: { [key: string]: number } = {
  "24 Hours": 24,
  "48 – 96 Hours": 72,
  "167 Hours": 167,
  "14 – 30 Days": 528
};

// Seed vendors data
const SEED_VENDORS: Vendor[] = [
  {
    id: "VEN-001",
    name: "Adom Electrical Services",
    contact: "kwame@adomelectrical.com",
    category: "Electrical",
    createdDate: "2023-01-15"
  },
  {
    id: "VEN-002",
    name: "Osei & Sons Plumbing",
    contact: "osei@oseiplumbing.com",
    category: "Plumbing",
    createdDate: "2023-02-20"
  },
  {
    id: "VEN-003",
    name: "Accra Security Services",
    contact: "info@accrasecurity.com",
    category: "Security",
    createdDate: "2023-03-10"
  }
];

// Seed data for assets (same as Assets page)
const SEED_ASSETS: Asset[] = [
  {
    id: "AST-001",
    location: "Osu",
    avrModel: "Schneider APC Smart-UPS 3000VA",
    serialNumber: "SN123456789",
    kva: "3.0",
    dateInstalled: "2023-01-15",
    avrStatus: "Good",
    endOfLife: "N",
    inUse: "Y",
    quantity: 1,
    vendor: "Schneider Electric",
    comments: "Primary UPS for server room",
    category: "UPS",
    branch: "Osu Branch"
  },
  {
    id: "AST-002", 
    location: "Head Office- Lifts",
    avrModel: "Caterpillar C15 Generator",
    serialNumber: "CAT987654321",
    kva: "500",
    dateInstalled: "2022-08-20",
    avrStatus: "Good",
    endOfLife: "N",
    inUse: "Y",
    quantity: 1,
    vendor: "Mantrac Ghana",
    comments: "Backup power for entire building",
    category: "GENERATORS",
    branch: "Head Office"
  },
  {
    id: "AST-003",
    location: "Achimota",
    avrModel: "Honeywell Air Purifier H13",
    serialNumber: "HON456789123",
    kva: "0.5",
    dateInstalled: "2023-03-10",
    avrStatus: "Good",
    endOfLife: "N",
    inUse: "Y",
    quantity: 2,
    vendor: "Honeywell Ghana",
    comments: "Air quality management system",
    category: "AIR PURIFIERS",
    branch: "Achimota Branch"
  }
];

const WorkOrders = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteWorkOrderId, setDeleteWorkOrderId] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    assetId: "",
    title: "",
    description: "",
    workOrderType: "Open Work Order",
    status: "Open",
    vendorType: "RFQ",
    priority: "Priority 3 – Standard Service",
    dueDate: "",
    estimatedCost: "",
    vendorId: ""
  });

  // Load assets, vendors, and work orders on component mount
  useEffect(() => {
    loadAssets();
    loadVendors();
    loadWorkOrders();
  }, []);

  const loadAssets = () => {
    try {
      const cachedAssets = localStorage.getItem(ASSETS_STORAGE_KEY);
      const cached = cachedAssets ? JSON.parse(cachedAssets) : [];
      
      // Merge seed data with cached data (avoid duplicates)
      const existingIds = cached.map((asset: Asset) => asset.id);
      const newSeedAssets = SEED_ASSETS.filter(asset => !existingIds.includes(asset.id));
      
      const allAssets = [...cached, ...newSeedAssets];
      setAssets(allAssets);
    } catch (err) {
      console.error("Error loading assets:", err);
      setAssets(SEED_ASSETS);
    }
  };

  const loadVendors = () => {
    try {
      const cachedVendors = localStorage.getItem(VENDORS_STORAGE_KEY);
      const cached = cachedVendors ? JSON.parse(cachedVendors) : [];
      
      // Merge seed data with cached data (avoid duplicates)
      const existingIds = cached.map((vendor: Vendor) => vendor.id);
      const newSeedVendors = SEED_VENDORS.filter(vendor => !existingIds.includes(vendor.id));
      
      const allVendors = [...cached, ...newSeedVendors];
      setVendors(allVendors);
    } catch (err) {
      console.error("Error loading vendors:", err);
      setVendors(SEED_VENDORS);
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

  const saveWorkOrders = (newWorkOrders: WorkOrder[]) => {
    try {
      localStorage.setItem(WORK_ORDERS_STORAGE_KEY, JSON.stringify(newWorkOrders));
    } catch (err) {
      console.error("Error saving work orders:", err);
    }
  };

  // Get selected asset and vendor details
  const selectedAsset = useMemo(() => {
    return assets.find(asset => asset.id === formData.assetId);
  }, [assets, formData.assetId]);

  const selectedVendor = useMemo(() => {
    return vendors.find(vendor => vendor.id === formData.vendorId);
  }, [vendors, formData.vendorId]);

  // Calculate overdue work orders
  const overdueWorkOrders = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return workOrders.filter(wo => {
      if (wo.status === "Closed" || !wo.dueDate) return false;
      const dueDate = new Date(wo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    });
  }, [workOrders]);

  // Filter work orders based on search
  const filteredWorkOrders = useMemo(() => {
    if (!searchTerm) return workOrders;
    
    return workOrders.filter(workOrder =>
      workOrder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workOrder.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [workOrders, searchTerm]);

  const handleCreateWorkOrder = () => {
    try {
      // Validation
      if (!formData.assetId || !formData.title || !formData.vendorId) {
        setError("Please fill in all required fields");
        return;
      }

      if (!selectedAsset) {
        setError("Selected asset not found");
        return;
      }

      if (!selectedVendor) {
        setError("Selected vendor not found");
        return;
      }

      // Generate new work order ID
      const newId = `WO-${String(workOrders.length + 1).padStart(3, '0')}`;
      
      const newWorkOrder: WorkOrder = {
        id: newId,
        assetId: formData.assetId,
        assetName: selectedAsset.avrModel,
        category: selectedAsset.category,
        location: selectedAsset.location,
        workOrderType: formData.workOrderType,
        status: formData.status,
        vendorType: formData.vendorType,
        createdDate: new Date().toISOString().split('T')[0],
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate,
        estimatedCost: formData.estimatedCost,
        vendorId: formData.vendorId,
        vendorName: selectedVendor.name
      };

      const updatedWorkOrders = [...workOrders, newWorkOrder];
      setWorkOrders(updatedWorkOrders);
      saveWorkOrders(updatedWorkOrders);

      // Reset form
      setFormData({
        assetId: "",
        title: "",
        description: "",
        workOrderType: "Open Work Order",
        status: "Open",
        vendorType: "RFQ",
        priority: "Medium",
        dueDate: "",
        estimatedCost: "",
        vendorId: ""
      });

      setIsCreateModalOpen(false);
      setSuccess("Work order created successfully!");
      setError("");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to create work order");
      console.error("Error creating work order:", err);
    }
  };

  const handleDeleteWorkOrder = (workOrderId: string) => {
    try {
      const updatedWorkOrders = workOrders.filter(wo => wo.id !== workOrderId);
      setWorkOrders(updatedWorkOrders);
      saveWorkOrders(updatedWorkOrders);
      setDeleteWorkOrderId(null);
      setSuccess("Work order deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete work order");
      console.error("Error deleting work order:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "Open") return <Badge variant="secondary">Open</Badge>;
    if (status === "Closed") return <Badge className="bg-green-100 text-green-800">Closed</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    if (type === "PPM") return <Badge className="bg-blue-100 text-blue-800">PPM</Badge>;
    return <Badge variant="outline">Open Work Order</Badge>;
  };

  const getVendorTypeBadge = (type: string) => {
    if (type === "RFQ") return <Badge className="bg-orange-100 text-orange-800">RFQ</Badge>;
    return <Badge className="bg-purple-100 text-purple-800">Direct</Badge>;
  };

  return (
    <div className="p-4 space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            ✅ {success}
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>❌ {error}</AlertDescription>
        </Alert>
      )}

      {/* Overdue Alerts */}
      {overdueWorkOrders.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center gap-2">
            🔴 <strong>{overdueWorkOrders.length}</strong> Work Order{overdueWorkOrders.length > 1 ? 's are' : ' is'} Past Due
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Work Orders</h1>
          <p className="text-muted-foreground">Manage maintenance work orders for assets</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Work Order
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search work orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Work Orders Table */}
      <Card>
        <CardHeader className="bg-muted/50 p-4">
          <CardTitle className="text-base">Work Orders ({filteredWorkOrders.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead className="text-sm">Work Order ID</TableHead>
                  <TableHead className="text-sm">Asset Name</TableHead>
                  <TableHead className="text-sm">Vendor</TableHead>
                  <TableHead className="text-sm">Status</TableHead>
                  <TableHead className="text-sm">Due Date</TableHead>
                  <TableHead className="text-sm">Type</TableHead>
                  <TableHead className="text-sm">Created Date</TableHead>
                  <TableHead className="text-sm text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No work orders found matching your search." : "No work orders created yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWorkOrders.map((workOrder) => {
                    const isOverdue = overdueWorkOrders.some(owo => owo.id === workOrder.id);
                    
                    return (
                      <TableRow key={workOrder.id} className={`hover:bg-muted/50 ${isOverdue ? 'bg-red-50' : ''}`}>
                        <TableCell className="text-sm font-mono">{workOrder.id}</TableCell>
                        <TableCell className="text-sm">{workOrder.assetName}</TableCell>
                        <TableCell className="text-sm">{workOrder.vendorName || 'Unassigned'}</TableCell>
                        <TableCell>{getStatusBadge(workOrder.status)}</TableCell>
                        <TableCell className="text-sm">
                          {workOrder.dueDate ? (
                            <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                              {workOrder.dueDate}
                              {isOverdue && ' (OVERDUE)'}
                            </span>
                          ) : (
                            'No due date'
                          )}
                        </TableCell>
                        <TableCell>{getTypeBadge(workOrder.workOrderType)}</TableCell>
                        <TableCell className="text-sm">{workOrder.createdDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" title="View Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Edit Work Order">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="Delete Work Order" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setDeleteWorkOrderId(workOrder.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Work Order Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Create Work Order
            </DialogTitle>
            <DialogDescription>
              Create a new work order for an existing asset
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Asset *</Label>
              <CustomSelectDropdown
                options={assets.map(asset => ({ 
                  value: asset.id, 
                  label: `${asset.avrModel} - ${asset.location}` 
                }))}
                value={formData.assetId}
                onChange={(value) => setFormData(prev => ({ ...prev, assetId: value }))}
                placeholder="Select asset"
              />
            </div>

            {selectedAsset && (
              <div className="space-y-2">
                <Label htmlFor="category">Category (Auto-filled)</Label>
                <Input
                  id="category"
                  value={selectedAsset.category}
                  disabled
                  className="bg-muted"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor *</Label>
              <CustomSelectDropdown
                options={vendors.map(vendor => ({ 
                  value: vendor.id, 
                  label: `${vendor.name} - ${vendor.category}` 
                }))}
                value={formData.vendorId}
                onChange={(value) => setFormData(prev => ({ ...prev, vendorId: value }))}
                placeholder="Select vendor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Work Order Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter work order title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the work to be done"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workOrderType">Work Order Type</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "Open Work Order", label: "Open Work Order" },
                    { value: "PPM", label: "PPM (Planned Preventive Maintenance)" }
                  ]}
                  value={formData.workOrderType}
                  onChange={(value) => setFormData(prev => ({ ...prev, workOrderType: value }))}
                  placeholder="Select type"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "Open", label: "Open" },
                    { value: "Closed", label: "Closed" }
                  ]}
                  value={formData.status}
                  onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  placeholder="Select status"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendorType">Vendor Engagement Type</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "RFQ", label: "RFQ (Request for Quotation)" },
                    { value: "Direct", label: "Direct" }
                  ]}
                  value={formData.vendorType}
                  onChange={(value) => setFormData(prev => ({ ...prev, vendorType: value }))}
                  placeholder="Select vendor type"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "Low", label: "Low" },
                    { value: "Medium", label: "Medium" },
                    { value: "High", label: "High" },
                    { value: "Critical", label: "Critical" }
                  ]}
                  value={formData.priority}
                  onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                  placeholder="Select priority"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedCost">Estimated Cost (GHS)</Label>
                <Input
                  id="estimatedCost"
                  type="number"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkOrder}>
              Create Work Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteWorkOrderId} onOpenChange={() => setDeleteWorkOrderId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Work Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this work order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteWorkOrderId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteWorkOrderId && handleDeleteWorkOrder(deleteWorkOrderId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkOrders;