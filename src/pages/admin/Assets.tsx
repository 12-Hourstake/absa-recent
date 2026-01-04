import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
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

// Asset category field mappings
const ASSET_CATEGORIES = {
  AIR_CONDITIONER: 'AIR_CONDITIONER',
  GENERATOR: 'GENERATOR',
  UPS: 'UPS',
  AVR: 'AVR',
  PHASE_ROTATION_CORRECTOR: 'PHASE_ROTATION_CORRECTOR',
  AIR_PURIFIER: 'AIR_PURIFIER'
} as const;

type AssetCategoryType = keyof typeof ASSET_CATEGORIES;

const CATEGORY_FIELDS: Record<AssetCategoryType, string[]> = {
  AIR_CONDITIONER: [
    'branch', 'locationOfAC', 'unitType', 'capacity', 'acType', 'bbgNumber', 'dateOfInstallation'
  ],
  GENERATOR: [
    'branch', 'location', 'brand', 'capacity', 'serialNumber', 'dateOfInstallation', 'engineModel'
  ],
  UPS: [
    'branch', 'location', 'upsModel', 'serialNumber', 'kva', 'dateInstalled', 'status',
    'batteryLastReplacement', 'batteryStatus', 'endOfLifeStatus', 'inUse', 'batterySpecs',
    'quantity', 'vendor', 'comments'
  ],
  AVR: [
    'location', 'avrModel', 'serialNumber', 'kva', 'dateInstalled', 'avrStatus',
    'endOfLifeStatus', 'inUse', 'quantity', 'vendor', 'comments'
  ],
  PHASE_ROTATION_CORRECTOR: [
    'branch', 'phaseCorrectorModel', 'dateInstalled', 'vendor'
  ],
  AIR_PURIFIER: [
    'branch', 'locationOfAirPurifier', 'brand', 'capacity', 'type', 'absaNumber', 'dateOfInstallation'
  ]
};

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
  const [selectedCategory, setSelectedCategory] = useState<AssetCategoryType | ''>('');
  const [dynamicFields, setDynamicFields] = useState<Record<string, any>>({});
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
        setError("Please fill in Asset Name and Branch");
        return;
      }

      // Validate category-specific required fields if category is selected
      if (selectedCategory) {
        const requiredFields = CATEGORY_FIELDS[selectedCategory];
        const missingFields = requiredFields.filter(field => {
          const isRequired = ['locationOfAC', 'unitType', 'capacity', 'acType', 'bbgNumber', 
                             'location', 'brand', 'engineModel', 'upsModel', 'kva', 
                             'batteryStatus', 'avrModel', 'avrStatus', 'quantity',
                             'phaseCorrectorModel', 'locationOfAirPurifier', 'type', 'absaNumber', 
                             'dateOfInstallation', 'dateInstalled'].includes(field);
          return isRequired && !dynamicFields[field];
        });

        if (missingFields.length > 0) {
          setError(`Please fill in required category fields: ${missingFields.join(', ')}`);
          return;
        }
      }

      // Create asset with category-specific data in description
      const assetData: CreateAssetData = {
        ...formData,
        description: selectedCategory ? JSON.stringify(dynamicFields) : formData.description
      };

      await addAsset(assetData);
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
    setSelectedCategory('');
    setDynamicFields({});
  };

  const handleCategoryChange = (category: AssetCategoryType) => {
    setSelectedCategory(category);
    setDynamicFields({});
  };

  const updateDynamicField = (fieldName: string, value: any) => {
    setDynamicFields(prev => ({ ...prev, [fieldName]: value }));
  };

  const renderDynamicField = (fieldName: string) => {
    const value = dynamicFields[fieldName] || '';
    
    switch (fieldName) {
      case 'branch':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldName}>Branch *</Label>
            <Select value={value} onValueChange={(val) => updateDynamicField(fieldName, val)}>
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
        );
      
      case 'unitType':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldName}>Unit Type *</Label>
            <Select value={value} onValueChange={(val) => updateDynamicField(fieldName, val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Indoor">Indoor</SelectItem>
                <SelectItem value="Outdoor">Outdoor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      
      case 'endOfLifeStatus':
      case 'inUse':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldName}>{fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} *</Label>
            <Select value={value} onValueChange={(val) => updateDynamicField(fieldName, val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      
      case 'vendor':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldName}>Vendor</Label>
            <Select value={value} onValueChange={(val) => updateDynamicField(fieldName, val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map(vendor => (
                  <SelectItem key={vendor.id} value={vendor.name}>{vendor.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case 'comments':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldName}>Comments</Label>
            <Textarea
              id={fieldName}
              value={value}
              onChange={(e) => updateDynamicField(fieldName, e.target.value)}
              placeholder="Enter comments"
              rows={3}
            />
          </div>
        );
      
      case 'dateOfInstallation':
      case 'dateInstalled':
      case 'batteryLastReplacement':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldName}>{fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} *</Label>
            <Input
              id={fieldName}
              type="date"
              value={value}
              onChange={(e) => updateDynamicField(fieldName, e.target.value)}
            />
          </div>
        );
      
      default:
        const isRequired = ['branch', 'locationOfAC', 'unitType', 'capacity', 'acType', 'bbgNumber', 
                           'location', 'brand', 'serialNumber', 'engineModel', 'upsModel', 'kva', 
                           'status', 'batteryStatus', 'avrModel', 'avrStatus', 'quantity',
                           'phaseCorrectorModel', 'locationOfAirPurifier', 'type', 'absaNumber'].includes(fieldName);
        
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldName}>
              {fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              {isRequired && ' *'}
            </Label>
            <Input
              id={fieldName}
              value={value}
              onChange={(e) => updateDynamicField(fieldName, e.target.value)}
              placeholder={`Enter ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
            />
          </div>
        );
    }
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
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6 min-w-0">
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate">Assets</h1>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base truncate">Manage facility assets across branches</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 w-full sm:w-auto flex-shrink-0">
            <Plus className="h-4 w-4" />
            <span className="truncate">Add Asset</span>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          <Card className="min-w-0">
            <CardHeader className="pb-1 sm:pb-2 px-2 sm:px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground truncate">Total Assets</CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-4">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{assets.length}</div>
            </CardContent>
          </Card>
          <Card className="min-w-0">
            <CardHeader className="pb-1 sm:pb-2 px-2 sm:px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground truncate">Active</CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-4">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                {assets.filter(a => a.status === AssetStatus.ACTIVE).length}
              </div>
            </CardContent>
          </Card>
          <Card className="min-w-0">
            <CardHeader className="pb-1 sm:pb-2 px-2 sm:px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground truncate">Under Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-4">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">
                {assets.filter(a => a.status === AssetStatus.UNDER_MAINTENANCE).length}
              </div>
            </CardContent>
          </Card>
          <Card className="min-w-0">
            <CardHeader className="pb-1 sm:pb-2 px-2 sm:px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground truncate">Inactive</CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-4">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-600">
                {assets.filter(a => a.status === AssetStatus.INACTIVE).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="w-full">
          <CardContent className="p-2 sm:p-3 lg:p-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 text-sm w-full min-w-0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Assets List */}
        <Card className="w-full">
          <CardHeader className="bg-muted/50 p-2 sm:p-3 lg:p-4">
            <CardTitle className="text-sm lg:text-base truncate">Assets ({filteredAssets.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0 w-full">
            {/* Desktop/Tablet Table View */}
            <div className="hidden lg:block w-full">
              <div className="w-full overflow-x-auto">
                <Table className="w-full table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[20%] min-w-[120px]">Asset Name</TableHead>
                      <TableHead className="w-[12%] min-w-[80px]">Type</TableHead>
                      <TableHead className="w-[15%] min-w-[100px]">Branch</TableHead>
                      <TableHead className="w-[15%] min-w-[100px]">Serial Number</TableHead>
                      <TableHead className="w-[12%] min-w-[80px]">Status</TableHead>
                      <TableHead className="w-[13%] min-w-[100px]">Last Maintenance</TableHead>
                      <TableHead className="w-[13%] min-w-[100px] text-right">Actions</TableHead>
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
                          <TableCell className="font-medium truncate" title={asset.name}>{asset.name}</TableCell>
                          <TableCell><Badge variant="outline" className="text-xs truncate">{formatEnumValue(asset.type)}</Badge></TableCell>
                          <TableCell className="truncate" title={asset.location.branch}>{asset.location.branch}</TableCell>
                          <TableCell className="font-mono text-sm truncate" title={asset.technicalDetails.serialNumber || "N/A"}>{asset.technicalDetails.serialNumber || "N/A"}</TableCell>
                          <TableCell>{getStatusBadge(asset.status)}</TableCell>
                          <TableCell className="text-sm truncate">{formatDate(asset.lastMaintenanceDate)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openViewModal(asset)} title="View" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openEditModal(asset)} title="Edit" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openDeleteModal(asset)} title="Delete" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
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
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden w-full">
              {paginatedAssets.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground px-3">
                  <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-base font-medium">No Assets Found</h3>
                  <p className="text-sm break-words">
                    {searchTerm ? "No assets found matching your search." : "No assets available."}
                  </p>
                </div>
              ) : (
                <div className="divide-y w-full">
                  {paginatedAssets.map((asset) => (
                    <div key={asset.id} className="p-3 space-y-3 w-full min-w-0">
                      <div className="flex items-start justify-between gap-2 w-full">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm sm:text-base break-words">{asset.name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{asset.location.branch}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button variant="ghost" size="sm" onClick={() => openViewModal(asset)} className="h-8 w-8 p-0">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(asset)} className="h-8 w-8 p-0">
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openDeleteModal(asset)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm w-full">
                        <div className="min-w-0">
                          <span className="text-muted-foreground block">Type:</span>
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs truncate max-w-full">{formatEnumValue(asset.type)}</Badge>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <span className="text-muted-foreground block">Status:</span>
                          <div className="mt-1">
                            {getStatusBadge(asset.status)}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <span className="text-muted-foreground block">Serial:</span>
                          <p className="font-mono text-xs mt-1 break-all">{asset.technicalDetails.serialNumber || "N/A"}</p>
                        </div>
                        <div className="min-w-0">
                          <span className="text-muted-foreground block">Last Maintenance:</span>
                          <p className="text-xs mt-1 break-words">{formatDate(asset.lastMaintenanceDate)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-3 lg:px-4 py-3 border-t gap-2 w-full">
                <div className="text-xs text-muted-foreground text-center sm:text-left break-words">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAssets.length)} of {filteredAssets.length} assets
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-8 px-2 text-xs"
                  >
                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline ml-1 text-xs">Previous</span>
                  </Button>
                  <div className="text-xs px-1 sm:px-2 whitespace-nowrap">
                    {currentPage} / {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="h-8 px-2 text-xs"
                  >
                    <span className="hidden sm:inline mr-1 text-xs">Next</span>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">Add New Asset</span>
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">Add a new asset to the system</DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 sm:gap-4 py-4 w-full min-w-0">
              {/* Core Asset Fields - Always Visible */}
              <div className="space-y-2 w-full">
                <Label htmlFor="name" className="text-xs sm:text-sm font-medium">Asset Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter asset name"
                  className="text-xs sm:text-sm w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                <div className="space-y-2 min-w-0">
                  <Label htmlFor="type" className="text-xs sm:text-sm font-medium">Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as AssetType }))}>
                    <SelectTrigger className="text-xs sm:text-sm w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AssetType).map(type => (
                        <SelectItem key={type} value={type} className="text-xs sm:text-sm">{formatEnumValue(type)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 min-w-0">
                  <Label htmlFor="status" className="text-xs sm:text-sm font-medium">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as AssetStatus }))}>
                    <SelectTrigger className="text-xs sm:text-sm w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AssetStatus).map(status => (
                        <SelectItem key={status} value={status} className="text-xs sm:text-sm">{formatEnumValue(status)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="branch" className="text-xs sm:text-sm font-medium">Branch *</Label>
                <Select value={formData.location.branch} onValueChange={(value) => setFormData(prev => ({ ...prev, location: { ...prev.location, branch: value } }))}>
                  <SelectTrigger className="text-xs sm:text-sm w-full">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch} value={branch} className="text-xs sm:text-sm">{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                <div className="space-y-2 min-w-0">
                  <Label htmlFor="serialNumber" className="text-xs sm:text-sm font-medium">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={formData.technicalDetails.serialNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, technicalDetails: { ...prev.technicalDetails, serialNumber: e.target.value } }))}
                    placeholder="Enter serial number"
                    className="text-xs sm:text-sm w-full"
                  />
                </div>

                <div className="space-y-2 min-w-0">
                  <Label htmlFor="lastMaintenanceDate" className="text-xs sm:text-sm font-medium">Last Maintenance Date</Label>
                  <Input
                    id="lastMaintenanceDate"
                    type="date"
                    value={formData.lastMaintenanceDate ? new Date(formData.lastMaintenanceDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastMaintenanceDate: e.target.value ? new Date(e.target.value) : undefined }))}
                    className="text-xs sm:text-sm w-full"
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-2 w-full">
                <Label htmlFor="category" className="text-xs sm:text-sm font-medium">Asset Category</Label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="text-xs sm:text-sm w-full">
                    <SelectValue placeholder="Select asset category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AIR_CONDITIONER" className="text-xs sm:text-sm">Air Conditioner (AC)</SelectItem>
                    <SelectItem value="GENERATOR" className="text-xs sm:text-sm">Generator</SelectItem>
                    <SelectItem value="UPS" className="text-xs sm:text-sm">UPS</SelectItem>
                    <SelectItem value="AVR" className="text-xs sm:text-sm">AVR</SelectItem>
                    <SelectItem value="PHASE_ROTATION_CORRECTOR" className="text-xs sm:text-sm">Phase Rotation Corrector</SelectItem>
                    <SelectItem value="AIR_PURIFIER" className="text-xs sm:text-sm">Air Purifier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category-Specific Fields */}
              {selectedCategory && (
                <div className="border-t pt-3 sm:pt-4 w-full">
                  <h4 className="font-medium mb-2 sm:mb-3 text-xs sm:text-sm">Category-Specific Information</h4>
                  <div className="grid gap-3 sm:gap-4 w-full">
                    {CATEGORY_FIELDS[selectedCategory].map((fieldName) => (
                      <div key={fieldName} className={`${fieldName === 'comments' ? 'col-span-full' : ''} w-full min-w-0`}>
                        {renderDynamicField(fieldName)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 w-full">
              <Button variant="outline" onClick={() => { setIsAddModalOpen(false); resetForm(); }} className="w-full sm:w-auto order-2 sm:order-1">
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={isLoading} className="w-full sm:w-auto order-1 sm:order-2">
                {isLoading ? "Adding..." : "Add Asset"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto mx-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg lg:text-xl truncate">Edit Asset</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">Update asset information</DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 sm:gap-4 py-4 w-full min-w-0">
              <div className="space-y-2 w-full">
                <Label htmlFor="edit-name" className="text-xs sm:text-sm font-medium">Asset Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="text-xs sm:text-sm w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                <div className="space-y-2 min-w-0">
                  <Label className="text-xs sm:text-sm font-medium">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as AssetType }))}>
                    <SelectTrigger className="text-xs sm:text-sm w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AssetType).map(type => (
                        <SelectItem key={type} value={type} className="text-xs sm:text-sm">{formatEnumValue(type)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 min-w-0">
                  <Label className="text-xs sm:text-sm font-medium">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as AssetStatus }))}>
                    <SelectTrigger className="text-xs sm:text-sm w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AssetStatus).map(status => (
                        <SelectItem key={status} value={status} className="text-xs sm:text-sm">{formatEnumValue(status)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 w-full">
                <Label className="text-xs sm:text-sm font-medium">Branch</Label>
                <Select value={formData.location.branch} onValueChange={(value) => setFormData(prev => ({ ...prev, location: { ...prev.location, branch: value } }))}>
                  <SelectTrigger className="text-xs sm:text-sm w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch} value={branch} className="text-xs sm:text-sm">{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
          </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 w-full">
              <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setSelectedAsset(null); resetForm(); }} className="w-full sm:w-auto order-2 sm:order-1">
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={isLoading} className="w-full sm:w-auto order-1 sm:order-2">
                {isLoading ? "Updating..." : "Update Asset"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto mx-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg lg:text-xl truncate">Asset Details</DialogTitle>
            </DialogHeader>
            {selectedAsset && (
              <div className="grid gap-3 sm:gap-4 py-4 w-full min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                  <div className="min-w-0">
                    <Label className="text-xs sm:text-sm text-muted-foreground">Asset Name</Label>
                    <p className="font-medium text-xs sm:text-sm lg:text-base break-words">{selectedAsset.name}</p>
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs sm:text-sm text-muted-foreground">Type</Label>
                    <p className="font-medium text-xs sm:text-sm lg:text-base break-words">{formatEnumValue(selectedAsset.type)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                  <div className="min-w-0">
                    <Label className="text-xs sm:text-sm text-muted-foreground">Category</Label>
                    <p className="font-medium text-xs sm:text-sm lg:text-base break-words">{formatEnumValue(selectedAsset.category)}</p>
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs sm:text-sm text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedAsset.status)}</div>
                  </div>
                </div>
                <div className="w-full">
                  <Label className="text-xs sm:text-sm text-muted-foreground">Branch</Label>
                  <p className="font-medium text-xs sm:text-sm lg:text-base break-words">{selectedAsset.location.branch}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                  <div className="min-w-0">
                    <Label className="text-xs sm:text-sm text-muted-foreground">Serial Number</Label>
                    <p className="font-medium font-mono text-xs sm:text-sm break-all">{selectedAsset.technicalDetails.serialNumber || "N/A"}</p>
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs sm:text-sm text-muted-foreground">Model</Label>
                    <p className="font-medium text-xs sm:text-sm lg:text-base break-words">{selectedAsset.technicalDetails.model || "N/A"}</p>
                  </div>
                </div>
                <div className="w-full">
                  <Label className="text-xs sm:text-sm text-muted-foreground">Description</Label>
                  <p className="font-medium text-xs sm:text-sm lg:text-base break-words">{selectedAsset.description || "N/A"}</p>
                </div>
            </div>
              )}
            <DialogFooter className="w-full">
              <Button onClick={() => { setIsViewModalOpen(false); setSelectedAsset(null); }} className="w-full sm:w-auto">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="w-[95vw] max-w-[400px] mx-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg lg:text-xl truncate">Delete Asset</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm break-words">
                Are you sure you want to delete "{selectedAsset?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 w-full">
              <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setSelectedAsset(null); }} className="w-full sm:w-auto order-2 sm:order-1">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isLoading} className="w-full sm:w-auto order-1 sm:order-2">
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Assets;
