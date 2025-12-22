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
import { useAssets } from "@/contexts/AssetContext";
import { Asset } from "@/types/asset";

// Vendor interface
interface Vendor {
  id: string;
  name: string;
  contact: string;
  category: string;
  createdDate: string;
}

// SLA interface
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

// Work Order interface (updated for KPI tracking)
interface WorkOrder {
  id: string;
  assetId: string;
  assetName: string;
  category: string;
  location: string;
  workOrderType: string; // PPM or Open Work Order
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
  slaStatus?: 'Met' | 'Breached'; // For KPI calculation
  completionDate?: string; // For KPI calculation
}

const ASSETS_STORAGE_KEY = "ASSETS_CACHE_V1";
const WORK_ORDERS_STORAGE_KEY = "WORK_ORDERS_CACHE_V1";
const VENDORS_STORAGE_KEY = "VENDORS_CACHE_V1";
const SLA_STORAGE_KEY = "SLA_CACHE_V1";

// Seed vendors data (matching Vendors page)
const SEED_VENDORS: Vendor[] = [
  { id: "VEN-001", name: "JANITOR", contact: "janitor@services.com", category: "Cleaning", createdDate: "2023-01-15" },
  { id: "VEN-002", name: "POWER", contact: "power@electrical.com", category: "Electrical", createdDate: "2023-01-20" },
  { id: "VEN-003", name: "AC", contact: "ac@hvac.com", category: "HVAC", createdDate: "2023-02-01" },
  { id: "VEN-004", name: "ELEVATOR", contact: "elevator@lifts.com", category: "Elevator", createdDate: "2023-02-10" },
  { id: "VEN-005", name: "NSROMA", contact: "nsroma@services.com", category: "General", createdDate: "2023-02-15" },
  { id: "VEN-006", name: "GYM", contact: "gym@equipment.com", category: "Fitness", createdDate: "2023-03-01" },
  { id: "VEN-007", name: "MID ATLANTICS", contact: "midatlantic@marine.com", category: "Marine", createdDate: "2023-03-10" },
  { id: "VEN-008", name: "AIR PURIFIERS", contact: "air@purifiers.com", category: "Air Quality", createdDate: "2023-03-15" },
  { id: "VEN-009", name: "OUTDOOR", contact: "outdoor@landscaping.com", category: "Landscaping", createdDate: "2023-04-01" },
  { id: "VEN-010", name: "TINO", contact: "tino@maintenance.com", category: "Maintenance", createdDate: "2023-04-10" },
  { id: "VEN-011", name: "FUMIGATION", contact: "fumigation@pest.com", category: "Pest Control", createdDate: "2023-04-15" }
];

const WorkOrders = () => {
  const { assets: contextAssets } = useAssets();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [slas, setSlas] = useState<SLA[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [deleteWorkOrderId, setDeleteWorkOrderId] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [slaWarning, setSlaWarning] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    assetId: "",
    title: "",
    description: "",
    workOrderType: "Open Work Order",
    status: "Open",
    vendorType: "RFQ",
    priority: "Medium",
    dueDate: "",
    estimatedCost: "",
    vendorId: "",
    slaStatus: "Met" as 'Met' | 'Breached'
  });

  // Load vendors, SLAs, and work orders on component mount
  useEffect(() => {
    loadVendors();
    loadSLAs();
    loadWorkOrders();
  }, []);

  const loadVendors = () => {
    try {
      const cachedVendors = localStorage.getItem(VENDORS_STORAGE_KEY);
      const cached = cachedVendors ? JSON.parse(cachedVendors) : [];
      
      // Use seed vendors as base, merge with any additional cached vendors
      const existingIds = SEED_VENDORS.map(vendor => vendor.id);
      const additionalVendors = cached.filter((vendor: Vendor) => !existingIds.includes(vendor.id));
      
      const allVendors = [...SEED_VENDORS, ...additionalVendors];
      setVendors(allVendors);
    } catch (err) {
      console.error("Error loading vendors:", err);
      setVendors(SEED_VENDORS);
    }
  };

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

  const saveWorkOrders = (newWorkOrders: WorkOrder[]) => {
    try {
      localStorage.setItem(WORK_ORDERS_STORAGE_KEY, JSON.stringify(newWorkOrders));
    } catch (err) {
      console.error("Error saving work orders:", err);
    }
  };

  // Get selected asset and vendor details
  const selectedAsset = useMemo(() => {
    return contextAssets.find(asset => asset.id === formData.assetId);
  }, [contextAssets, formData.assetId]);

  const selectedVendor = useMemo(() => {
    return vendors.find(vendor => vendor.id === formData.vendorId);
  }, [vendors, formData.vendorId]);

  // Find applicable SLA based on priority and vendor
  const applicableSLA = useMemo(() => {
    if (!formData.priority || !formData.vendorId) return null;
    
    // Map priority to SLA priority levels
    const priorityMapping: { [key: string]: string } = {
      "Critical": "Priority 1 – Emergency Service",
      "High": "Priority 2 – Critical Service", 
      "Medium": "Priority 3 – Standard Service",
      "Low": "Priority 4 – Minor Service"
    };
    
    const slaPriority = priorityMapping[formData.priority];
    if (!slaPriority) return null;
    
    // Find SLA that matches priority and is assigned to the selected vendor
    const matchingSLA = slas.find(sla => 
      sla.priorityLevel === slaPriority && 
      sla.assignedVendorIds.includes(formData.vendorId)
    );
    
    if (matchingSLA) {
      setSlaWarning("");
      return matchingSLA;
    }
    
    // Fallback: Find general SLA for priority (not vendor-specific)
    const generalSLA = slas.find(sla => sla.priorityLevel === slaPriority);
    if (generalSLA) {
      setSlaWarning(`No vendor-specific SLA found. Using general SLA: ${generalSLA.slaName}`);
      return generalSLA;
    }
    
    setSlaWarning(`No SLA found for ${formData.priority} priority and selected vendor`);
    return null;
  }, [formData.priority, formData.vendorId, slas]);

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
        assetName: selectedAsset.name,
        category: selectedAsset.category,
        location: selectedAsset.location || selectedAsset.branchName || '',
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
        vendorName: selectedVendor.name,
        slaId: applicableSLA?.id,
        slaName: applicableSLA?.slaName,
        priorityLevel: applicableSLA?.priorityLevel,
        responseTime: applicableSLA?.responseTime,
        resolutionTime: applicableSLA?.resolutionTime,
        slaStatus: formData.slaStatus,
        completionDate: formData.status === "Closed" ? new Date().toISOString().split('T')[0] : undefined
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
        vendorId: "",
        slaStatus: "Met"
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

  const handleViewWorkOrder = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setIsViewModalOpen(true);
  };

  const handleEditWorkOrder = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setFormData({
      assetId: workOrder.assetId,
      title: workOrder.title,
      description: workOrder.description,
      workOrderType: workOrder.workOrderType,
      status: workOrder.status,
      vendorType: workOrder.vendorType,
      priority: workOrder.priority,
      dueDate: workOrder.dueDate,
      estimatedCost: workOrder.estimatedCost,
      vendorId: workOrder.vendorId,
      slaStatus: workOrder.slaStatus || "Met"
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateWorkOrder = () => {
    try {
      if (!selectedWorkOrder) return;

      // Validation
      if (!formData.assetId || !formData.title || !formData.vendorId) {
        setError("Please fill in all required fields");
        return;
      }

      const selectedAssetForUpdate = contextAssets.find(asset => asset.id === formData.assetId);
      const selectedVendorForUpdate = vendors.find(vendor => vendor.id === formData.vendorId);

      if (!selectedAssetForUpdate || !selectedVendorForUpdate) {
        setError("Selected asset or vendor not found");
        return;
      }

      const updatedWorkOrder: WorkOrder = {
        ...selectedWorkOrder,
        assetId: formData.assetId,
        assetName: selectedAssetForUpdate.name,
        category: selectedAssetForUpdate.category,
        location: selectedAssetForUpdate.location || selectedAssetForUpdate.branchName || '',
        workOrderType: formData.workOrderType,
        status: formData.status,
        vendorType: formData.vendorType,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate,
        estimatedCost: formData.estimatedCost,
        vendorId: formData.vendorId,
        vendorName: selectedVendorForUpdate.name,
        slaId: applicableSLA?.id,
        slaName: applicableSLA?.slaName,
        priorityLevel: applicableSLA?.priorityLevel,
        responseTime: applicableSLA?.responseTime,
        resolutionTime: applicableSLA?.resolutionTime,
        slaStatus: formData.slaStatus,
        completionDate: formData.status === "Closed" ? new Date().toISOString().split('T')[0] : undefined
      };

      const updatedWorkOrders = workOrders.map(wo => 
        wo.id === selectedWorkOrder.id ? updatedWorkOrder : wo
      );
      
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
        vendorId: "",
        slaStatus: "Met"
      });

      setIsEditModalOpen(false);
      setSelectedWorkOrder(null);
      setSuccess("Work order updated successfully!");
      setError("");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update work order");
      console.error("Error updating work order:", err);
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

  const getSLABadge = (slaStatus?: string) => {
    if (slaStatus === "Met") return <Badge className="bg-green-100 text-green-800">SLA Met</Badge>;
    if (slaStatus === "Breached") return <Badge className="bg-red-100 text-red-800">SLA Breached</Badge>;
    return <Badge variant="outline">No SLA</Badge>;
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
      {slaWarning && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertDescription className="text-orange-800">⚠️ {slaWarning}</AlertDescription>
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
          <p className="text-muted-foreground">Manage maintenance work orders for assets (KPI Data Source)</p>
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
          <CardTitle className="text-base">Work Orders ({filteredWorkOrders.length}) - Vendor KPI Source</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead className="text-sm">Work Order ID</TableHead>
                  <TableHead className="text-sm">Asset Name</TableHead>
                  <TableHead className="text-sm">Vendor</TableHead>
                  <TableHead className="text-sm">Type</TableHead>
                  <TableHead className="text-sm">Status</TableHead>
                  <TableHead className="text-sm">SLA</TableHead>
                  <TableHead className="text-sm">SLA Status</TableHead>
                  <TableHead className="text-sm">Due Date</TableHead>
                  <TableHead className="text-sm">Created Date</TableHead>
                  <TableHead className="text-sm text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
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
                        <TableCell>{getTypeBadge(workOrder.workOrderType)}</TableCell>
                        <TableCell>{getStatusBadge(workOrder.status)}</TableCell>
                        <TableCell className="text-sm">
                          {workOrder.slaName ? (
                            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded" title={workOrder.priorityLevel}>
                              {workOrder.slaName}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">No SLA</span>
                          )}
                        </TableCell>
                        <TableCell>{getSLABadge(workOrder.slaStatus)}</TableCell>
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
                        <TableCell className="text-sm">{workOrder.createdDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" title="View Details" onClick={() => handleViewWorkOrder(workOrder)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Edit Work Order" onClick={() => handleEditWorkOrder(workOrder)}>
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
              Create a new work order for an existing asset (feeds vendor KPI data)
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Asset *</Label>
              <CustomSelectDropdown
                options={contextAssets.map(asset => ({ 
                  value: asset.id, 
                  label: `${asset.name} - ${asset.location || asset.branchName || 'N/A'}` 
                }))}
                value={formData.assetId}
                onChange={(value) => setFormData(prev => ({ ...prev, assetId: value }))}
                placeholder="Select asset"
              />
            </div>

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

            {/* SLA Information Display */}
            {applicableSLA && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Auto-Assigned SLA
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Automatic</span>
                </Label>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  <div className="font-medium">{applicableSLA.slaName}</div>
                  <div className="text-muted-foreground mt-1">
                    Response: {applicableSLA.responseTime} | Resolution: {applicableSLA.resolutionTime}
                  </div>
                </div>
              </div>
            )}

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
                <Label htmlFor="slaStatus">SLA Status (KPI Data)</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "Met", label: "SLA Met" },
                    { value: "Breached", label: "SLA Breached" }
                  ]}
                  value={formData.slaStatus}
                  onChange={(value) => setFormData(prev => ({ ...prev, slaStatus: value as 'Met' | 'Breached' }))}
                  placeholder="Select SLA status"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority (Determines SLA)</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "Low", label: "Low (Priority 4 - Minor Service)" },
                    { value: "Medium", label: "Medium (Priority 3 - Standard Service)" },
                    { value: "High", label: "High (Priority 2 - Critical Service)" },
                    { value: "Critical", label: "Critical (Priority 1 - Emergency Service)" }
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
              Are you sure you want to delete this work order? This will affect vendor KPI calculations.
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

      {/* View Work Order Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Work Order Details
            </DialogTitle>
            <DialogDescription>
              View complete details of work order {selectedWorkOrder?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedWorkOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Work Order ID</Label>
                  <div className="font-mono font-semibold">{selectedWorkOrder.id}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Created Date</Label>
                  <div>{selectedWorkOrder.createdDate}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Title</Label>
                <div className="font-semibold">{selectedWorkOrder.title}</div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Description</Label>
                <div className="text-sm">{selectedWorkOrder.description || "No description provided"}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Asset</Label>
                  <div>{selectedWorkOrder.assetName}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Location</Label>
                  <div>{selectedWorkOrder.location}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Category</Label>
                  <div>{selectedWorkOrder.category}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Vendor</Label>
                  <div>{selectedWorkOrder.vendorName}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Type</Label>
                  <div>{getTypeBadge(selectedWorkOrder.workOrderType)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Status</Label>
                  <div>{getStatusBadge(selectedWorkOrder.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Priority</Label>
                  <div>
                    <Badge variant={selectedWorkOrder.priority === "Critical" ? "destructive" : "outline"}>
                      {selectedWorkOrder.priority}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Vendor Type</Label>
                  <div>{selectedWorkOrder.vendorType}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Due Date</Label>
                  <div>{selectedWorkOrder.dueDate || "Not set"}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Estimated Cost</Label>
                  <div>GHS {selectedWorkOrder.estimatedCost || "0.00"}</div>
                </div>
              </div>

              {selectedWorkOrder.slaName && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Service Level Agreement (SLA)</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="font-medium">{selectedWorkOrder.slaName}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {selectedWorkOrder.priorityLevel}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Response Time: {selectedWorkOrder.responseTime} | Resolution Time: {selectedWorkOrder.resolutionTime}
                    </div>
                    <div className="mt-2">
                      {getSLABadge(selectedWorkOrder.slaStatus)}
                    </div>
                  </div>
                </div>
              )}

              {selectedWorkOrder.completionDate && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Completion Date</Label>
                  <div>{selectedWorkOrder.completionDate}</div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewModalOpen(false);
              if (selectedWorkOrder) handleEditWorkOrder(selectedWorkOrder);
            }}>
              Edit Work Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Work Order Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Work Order
            </DialogTitle>
            <DialogDescription>
              Update work order {selectedWorkOrder?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-asset">Asset *</Label>
              <CustomSelectDropdown
                options={contextAssets.map(asset => ({ 
                  value: asset.id, 
                  label: `${asset.name} - ${asset.location || asset.branchName || 'N/A'}` 
                }))}
                value={formData.assetId}
                onChange={(value) => setFormData(prev => ({ ...prev, assetId: value }))}
                placeholder="Select asset"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-vendor">Vendor *</Label>
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

            {/* SLA Information Display */}
            {applicableSLA && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Auto-Assigned SLA
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Automatic</span>
                </Label>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  <div className="font-medium">{applicableSLA.slaName}</div>
                  <div className="text-muted-foreground mt-1">
                    Response: {applicableSLA.responseTime} | Resolution: {applicableSLA.resolutionTime}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-title">Work Order Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter work order title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the work to be done"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-workOrderType">Work Order Type</Label>
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
                <Label htmlFor="edit-status">Status</Label>
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
                <Label htmlFor="edit-slaStatus">SLA Status (KPI Data)</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "Met", label: "SLA Met" },
                    { value: "Breached", label: "SLA Breached" }
                  ]}
                  value={formData.slaStatus}
                  onChange={(value) => setFormData(prev => ({ ...prev, slaStatus: value as 'Met' | 'Breached' }))}
                  placeholder="Select SLA status"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority (Determines SLA)</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "Low", label: "Low (Priority 4 - Minor Service)" },
                    { value: "Medium", label: "Medium (Priority 3 - Standard Service)" },
                    { value: "High", label: "High (Priority 2 - Critical Service)" },
                    { value: "Critical", label: "Critical (Priority 1 - Emergency Service)" }
                  ]}
                  value={formData.priority}
                  onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                  placeholder="Select priority"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-dueDate">Due Date</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-estimatedCost">Estimated Cost (GHS)</Label>
                <Input
                  id="edit-estimatedCost"
                  type="number"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditModalOpen(false);
              setSelectedWorkOrder(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateWorkOrder}>
              Update Work Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkOrders;