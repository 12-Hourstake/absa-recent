import { useState, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Package, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useAssets } from "@/contexts/AssetContext";
import { Asset, AssetStatus, AssetType, AssetCategory, CreateAssetData } from "@/types/asset";
import { getBranchNames } from "@/data/mockBranches";
import { getActiveVendors } from "@/data/mockVendors";

const ITEMS_PER_PAGE = 10;

const Assets = () => {
  const { assets, isLoading, error: contextError, addAsset, updateAsset, deleteAsset } = useAssets();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateAssetData>({
    name: "",
    type: AssetType.EQUIPMENT,
    category: AssetCategory.CRITICAL_INFRASTRUCTURE,
    description: "",
    location: {
      branch: "",
      floor: "",
      room: "",
      specificLocation: ""
    },
    technicalDetails: {
      serialNumber: "",
      model: "",
      manufacturer: "",
      supplier: ""
    },
    financialDetails: {
      purchaseDate: undefined,
      purchasePrice: undefined,
      currentValue: undefined,
      depreciationRate: undefined
    },
    status: AssetStatus.ACTIVE,
    priority: undefined,
    warrantyExpiry: undefined,
    lastMaintenanceDate: undefined,
    nextMaintenanceDate: undefined
  });

  const branches = getBranchNames();
  const vendors = getActiveVendors();

  // Filter and paginate
  const filteredAssets = useMemo(() => {
    if (!searchTerm) return assets;
    
    const term = searchTerm.toLowerCase();
    return assets.filter(asset =>
      asset.name.toLowerCase().includes(term) ||
      asset.location.branch.toLowerCase().includes(term) ||
      asset.technicalDetails.serialNumber?.toLowerCase().includes(term) ||
      asset.technicalDetails.manufacturer?.toLowerCase().includes(term)
    );
  }, [assets, searchTerm]);

  const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAdd = async () => {
    try {
      if (!formData.name || !formData.location.branch) {
        setError("Please fill in all required fields");
        return;
      }

      await addAsset(formData);
      setSuccess("Asset added successfully!");
      setIsAddModalOpen(false);
      resetForm();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add asset");
    }
  };

  const handleEdit = async () => {
    try {
      if (!selectedAsset) return;
      
      await updateAsset(selectedAsset.id, formData);
      setSuccess("Asset updated successfully!");
      setIsEditModalOpen(false);
      setSelectedAsset(null);
      resetForm();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update asset");
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedAsset) return;
      
      await deleteAsset(selectedAsset.id);
      setSuccess("Asset deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedAsset(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete asset");
    }
  };

  const openEditModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormData({
      name: asset.name,
      type: asset.type,
      category: asset.category,
      description: asset.description,
      location: asset.location,
      technicalDetails: asset.technicalDetails,
      financialDetails: asset.financialDetails,
      status: asset.status,
      priority: asset.priority,
      warrantyExpiry: asset.warrantyExpiry,
      lastMaintenanceDate: asset.lastMaintenanceDate,
      nextMaintenanceDate: asset.nextMaintenanceDate
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: AssetType.EQUIPMENT,
      category: AssetCategory.CRITICAL_INFRASTRUCTURE,
      description: "",
      location: { branch: "", floor: "", room: "", specificLocation: "" },
      technicalDetails: { serialNumber: "", model: "", manufacturer: "", supplier: "" },
      financialDetails: {},
      status: AssetStatus.ACTIVE,
      priority: undefined,
      warrantyExpiry: undefined,
      lastMaintenanceDate: undefined,
      nextMaintenanceDate: undefined
    });
  };

  const getStatusBadge = (status: AssetStatus) => {
    const config = {
      [AssetStatus.ACTIVE]: "bg-green-100 text-green-800",
      [AssetStatus.INACTIVE]: "bg-gray-100 text-gray-800",
      [AssetStatus.UNDER_MAINTENANCE]: "bg-yellow-100 text-yellow-800",
      [AssetStatus.DISPOSED]: "bg-red-100 text-red-800",
      [AssetStatus.RESERVED]: "bg-blue-100 text-blue-800"
    };
    return <Badge className={config[status]}>{formatEnumValue(status)}</Badge>;
  };

  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-GB');
  };

  const formatEnumValue = (value: string) => {
    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="p-4 space-y-6">
      {/* Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">✅ {success}</AlertDescription>
        </Alert>
      )}
      {(error || contextError) && (
        <Alert variant="destructive">
          <AlertDescription>❌ {error || contextError}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">Manage facility assets across branches</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Asset
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assets.filter(a => a.status === AssetStatus.ACTIVE).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Under Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {assets.filter(a => a.status === AssetStatus.UNDER_MAINTENANCE).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {assets.filter(a => a.status === AssetStatus.INACTIVE).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets by name, location, serial number..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="bg-muted/50 p-4">
          <CardTitle className="text-base">Assets ({filteredAssets.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Maintenance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No assets found matching your search." : "No assets available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAssets.map((asset) => (
                    <TableRow key={asset.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell><Badge variant="outline">{formatEnumValue(asset.type)}</Badge></TableCell>
                      <TableCell>{asset.location.branch}</TableCell>
                      <TableCell className="font-mono text-sm">{asset.technicalDetails.serialNumber || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                      <TableCell>{formatDate(asset.lastMaintenanceDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openViewModal(asset)} title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(asset)} title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteModal(asset)} title="Delete" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAssets.length)} of {filteredAssets.length} assets
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Add New Asset
            </DialogTitle>
            <DialogDescription>Add a new asset to the system</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter asset name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as AssetType }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AssetType).map(type => (
                      <SelectItem key={type} value={type}>{formatEnumValue(type)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as AssetCategory }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AssetCategory).map(cat => (
                      <SelectItem key={cat} value={cat}>{formatEnumValue(cat)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">Branch *</Label>
              <Select value={formData.location.branch} onValueChange={(value) => setFormData(prev => ({ ...prev, location: { ...prev.location, branch: value } }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={formData.technicalDetails.serialNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, technicalDetails: { ...prev.technicalDetails, serialNumber: e.target.value } }))}
                  placeholder="Enter serial number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.technicalDetails.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, technicalDetails: { ...prev.technicalDetails, model: e.target.value } }))}
                  placeholder="Enter model"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                value={formData.technicalDetails.manufacturer}
                onChange={(e) => setFormData(prev => ({ ...prev, technicalDetails: { ...prev.technicalDetails, manufacturer: e.target.value } }))}
                placeholder="Enter manufacturer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as AssetStatus }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AssetStatus).map(status => (
                    <SelectItem key={status} value={status}>{formatEnumValue(status)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Asset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>Update asset information</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Asset Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as AssetType }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AssetType).map(type => (
                      <SelectItem key={type} value={type}>{formatEnumValue(type)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as AssetStatus }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AssetStatus).map(status => (
                      <SelectItem key={status} value={status}>{formatEnumValue(status)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Branch</Label>
              <Select value={formData.location.branch} onValueChange={(value) => setFormData(prev => ({ ...prev, location: { ...prev.location, branch: value } }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setSelectedAsset(null); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Asset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Asset Name</Label>
                  <p className="font-medium">{selectedAsset.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium">{formatEnumValue(selectedAsset.type)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="font-medium">{formatEnumValue(selectedAsset.category)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedAsset.status)}</div>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Branch</Label>
                <p className="font-medium">{selectedAsset.location.branch}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Serial Number</Label>
                  <p className="font-medium font-mono">{selectedAsset.technicalDetails.serialNumber || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Model</Label>
                  <p className="font-medium">{selectedAsset.technicalDetails.model || "N/A"}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="font-medium">{selectedAsset.description || "N/A"}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => { setIsViewModalOpen(false); setSelectedAsset(null); }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Asset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedAsset?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setSelectedAsset(null); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assets;
