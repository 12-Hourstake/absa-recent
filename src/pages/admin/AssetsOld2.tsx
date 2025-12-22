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
import { Plus, Search, Package, Eye, Edit, Trash2 } from "lucide-react";
import { useAssets } from "@/contexts/AssetContext";
import { useNavigate } from "react-router-dom";
import { Asset as AssetType, AssetStatus } from "@/types/asset";

// Asset interface
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

// Seed data
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

// Location options (as specified)
const LOCATION_OPTIONS = [
  "Osu", "Hohoe", "Berekum", "Head Office- Lifts", "Achimota", "Ahodwo", 
  "Kejetia", "Krofrom", "Bantama", "BCM Motorway Ext.", "ITSM Data Centre", 
  "Comms Room", "KNUST", "Madina", "Nkawkaw", "Knustford", "Thigh", 
  "Tema Fishing Harbour", "Suame", "Asafo", "Tanoso", "Wa", 
  "L & D - Ridge Branch", "L & D - Osu", "KPST- Kumasi", "Ashiaman", 
  "Dansoman Main", "Maamobi", "Circle", "Tarkwa", "Talib", "DARKUMAN", 
  "HO, SUNYANI"
];

// Category options (as specified)
const CATEGORY_OPTIONS = [
  "AC NEW", "GENERATORS", "UPS", "AVR", "AIR PURIFIERS", "PHASE ROTATION CORRECTORS"
];

// Branch options (static for now)
const BRANCH_OPTIONS = [
  "Osu Branch", "Head Office", "Achimota Branch", "Ahodwo Branch", 
  "Kejetia Branch", "Kumasi Branch", "Tamale Branch", "Takoradi Branch"
];

const STORAGE_KEY = "ASSETS_CACHE_V1";

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    location: "",
    avrModel: "",
    serialNumber: "",
    kva: "",
    dateInstalled: "",
    avrStatus: "Good",
    endOfLife: "N",
    inUse: "Y",
    quantity: "1",
    vendor: "",
    comments: "",
    category: "",
    branch: ""
  });

  // Load assets on component mount
  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = () => {
    try {
      const cachedAssets = localStorage.getItem(STORAGE_KEY);
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

  const saveAssets = (newAssets: Asset[]) => {
    try {
      // Only save user-added assets (not seed data)
      const userAssets = newAssets.filter(asset => !SEED_ASSETS.some(seed => seed.id === asset.id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userAssets));
    } catch (err) {
      console.error("Error saving assets:", err);
    }
  };

  // Filter assets based on search

  // Filter assets based on search
  const filteredAssets = useMemo(() => {
    if (!searchTerm) return assets;
    
    return assets.filter(asset =>
      asset.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.avrModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [assets, searchTerm]);

  const handleAddAsset = () => {
    try {
      // Validation
      if (!formData.location || !formData.avrModel || !formData.category || !formData.branch) {
        setError("Please fill in all required fields");
        return;
      }

      // Generate new asset ID
      const newId = `AST-${String(assets.length + 1).padStart(3, '0')}`;
      
      const newAsset: Asset = {
        id: newId,
        location: formData.location,
        avrModel: formData.avrModel,
        serialNumber: formData.serialNumber,
        kva: formData.kva,
        dateInstalled: formData.dateInstalled,
        avrStatus: formData.avrStatus,
        endOfLife: formData.endOfLife,
        inUse: formData.inUse,
        quantity: parseInt(formData.quantity) || 1,
        vendor: formData.vendor,
        comments: formData.comments,
        category: formData.category,
        branch: formData.branch
      };

      const updatedAssets = [...assets, newAsset];
      setAssets(updatedAssets);
      saveAssets(updatedAssets);

      // Reset form
      setFormData({
        location: "",
        avrModel: "",
        serialNumber: "",
        kva: "",
        dateInstalled: "",
        avrStatus: "Good",
        endOfLife: "N",
        inUse: "Y",
        quantity: "1",
        vendor: "",
        comments: "",
        category: "",
        branch: ""
      });

      setIsAddModalOpen(false);
      setSuccess("Asset added successfully!");
      setError("");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to add asset");
      console.error("Error adding asset:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "Good") return <Badge className="bg-green-100 text-green-800">Good</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  const getEndOfLifeBadge = (endOfLife: string) => {
    if (endOfLife === "Y") return <Badge variant="destructive">Y</Badge>;
    return <Badge className="bg-green-100 text-green-800">N</Badge>;
  };

  const getInUseBadge = (inUse: string) => {
    if (inUse === "Y") return <Badge className="bg-green-100 text-green-800">Y</Badge>;
    return <Badge variant="secondary">N</Badge>;
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

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader className="bg-muted/50 p-4">
          <CardTitle className="text-base">Assets ({filteredAssets.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead className="text-sm">Location</TableHead>
                  <TableHead className="text-sm">AVR Model</TableHead>
                  <TableHead className="text-sm">Serial Number</TableHead>
                  <TableHead className="text-sm">KVA</TableHead>
                  <TableHead className="text-sm">Date Installed</TableHead>
                  <TableHead className="text-sm">AVR Status</TableHead>
                  <TableHead className="text-sm">End of Life</TableHead>
                  <TableHead className="text-sm">In Use</TableHead>
                  <TableHead className="text-sm">Quantity</TableHead>
                  <TableHead className="text-sm">Vendor</TableHead>
                  <TableHead className="text-sm">Comments</TableHead>
                  <TableHead className="text-sm text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No assets found matching your search." : "No assets available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssets.map((asset) => (
                    <TableRow key={asset.id} className="hover:bg-muted/50">
                      <TableCell className="text-sm">{asset.location}</TableCell>
                      <TableCell className="text-sm">{asset.avrModel}</TableCell>
                      <TableCell className="text-sm font-mono">{asset.serialNumber}</TableCell>
                      <TableCell className="text-sm">{asset.kva}</TableCell>
                      <TableCell className="text-sm">{asset.dateInstalled}</TableCell>
                      <TableCell>{getStatusBadge(asset.avrStatus)}</TableCell>
                      <TableCell>{getEndOfLifeBadge(asset.endOfLife)}</TableCell>
                      <TableCell>{getInUseBadge(asset.inUse)}</TableCell>
                      <TableCell className="text-sm">{asset.quantity}</TableCell>
                      <TableCell className="text-sm">{asset.vendor}</TableCell>
                      <TableCell className="text-sm max-w-xs truncate">{asset.comments}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit Asset">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete Asset" className="text-red-600 hover:text-red-700 hover:bg-red-50">
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
        </CardContent>
      </Card>

      {/* Add Asset Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Add New Asset
            </DialogTitle>
            <DialogDescription>
              Add a new asset to the system
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <CustomSelectDropdown
                  options={LOCATION_OPTIONS.map(loc => ({ value: loc, label: loc }))}
                  value={formData.location}
                  onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                  placeholder="Select location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch *</Label>
                <CustomSelectDropdown
                  options={BRANCH_OPTIONS.map(branch => ({ value: branch, label: branch }))}
                  value={formData.branch}
                  onChange={(value) => setFormData(prev => ({ ...prev, branch: value }))}
                  placeholder="Select branch"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <CustomSelectDropdown
                options={CATEGORY_OPTIONS.map(cat => ({ value: cat, label: cat }))}
                value={formData.category}
                onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                placeholder="Select category"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avrModel">AVR Model *</Label>
              <Input
                id="avrModel"
                value={formData.avrModel}
                onChange={(e) => setFormData(prev => ({ ...prev, avrModel: e.target.value }))}
                placeholder="Enter AVR model"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                  placeholder="Enter serial number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kva">KVA</Label>
                <Input
                  id="kva"
                  value={formData.kva}
                  onChange={(e) => setFormData(prev => ({ ...prev, kva: e.target.value }))}
                  placeholder="Enter KVA rating"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateInstalled">Date Installed</Label>
                <Input
                  id="dateInstalled"
                  type="date"
                  value={formData.dateInstalled}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateInstalled: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="avrStatus">AVR Status</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "Good", label: "Good" },
                    { value: "Fair", label: "Fair" },
                    { value: "Poor", label: "Poor" }
                  ]}
                  value={formData.avrStatus}
                  onChange={(value) => setFormData(prev => ({ ...prev, avrStatus: value }))}
                  placeholder="Select status"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endOfLife">End of Life</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "N", label: "N" },
                    { value: "Y", label: "Y" }
                  ]}
                  value={formData.endOfLife}
                  onChange={(value) => setFormData(prev => ({ ...prev, endOfLife: value }))}
                  placeholder="Select"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inUse">In Use</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "Y", label: "Y" },
                    { value: "N", label: "N" }
                  ]}
                  value={formData.inUse}
                  onChange={(value) => setFormData(prev => ({ ...prev, inUse: value }))}
                  placeholder="Select"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                value={formData.vendor}
                onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                placeholder="Enter vendor name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Input
                id="comments"
                value={formData.comments}
                onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                placeholder="Additional comments"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAsset}>
              Add Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assets;