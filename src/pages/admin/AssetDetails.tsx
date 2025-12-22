import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBackButtonText } from "@/hooks/useBackButtonText";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Edit, 
  Package, 
  Trash2, 
  Save, 
  X, 
  Calendar,
  MapPin,
  DollarSign,
  Wrench,
  History,
  FileText
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// TODO: Replace with API calls to fetch asset data
const mockAssets: any[] = [];
const mockMaintenanceHistory: any[] = [];

const AssetDetails = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();
  const { assetId } = useParams();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // TODO: Replace with API call to fetch asset by ID
  const asset = useMemo(
    () => mockAssets.find((a) => a.id === assetId),
    [assetId]
  );

  const [editForm, setEditForm] = useState({
    name: asset?.name || "",
    description: asset?.description || "",
    status: asset?.status || "active",
    location: asset?.location || "",
    floor: asset?.floor || "",
    room: asset?.room || "",
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    type: "preventive",
    technician: "",
    notes: "",
    cost: "",
  });

  useMemo(() => {
    if (asset) {
      setEditForm({
        name: asset.name,
        description: asset.description || "",
        status: asset.status,
        location: asset.location,
        floor: asset.floor || "",
        room: asset.room || "",
      });
    }
  }, [asset]);

  const handleEditAsset = () => {
    // Simulate save
    setSuccess("Asset updated successfully!");
    setIsEditDialogOpen(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDeleteAsset = () => {
    // Simulate delete
    setSuccess("Asset deleted successfully!");
    setIsDeleteDialogOpen(false);
    setTimeout(() => {
      navigate("/admin/assets");
    }, 1500);
  };

  const handleAddMaintenance = () => {
    // Simulate adding maintenance record
    setSuccess("Maintenance record added successfully!");
    setIsMaintenanceDialogOpen(false);
    setMaintenanceForm({
      type: "preventive",
      technician: "",
      notes: "",
      cost: "",
    });
    setTimeout(() => setSuccess(""), 3000);
  };

  if (!asset) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>
            No asset data available. Please ensure the backend API is connected.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-icon-brand text-white flex items-center justify-center">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Asset Details</h1>
            <p className="text-muted-foreground">ID: {assetId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> {backButtonText}
          </Button>
          <Button onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" /> Edit Asset
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            ✅ {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>❌ {error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical Details</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Asset Name</div>
                  <div className="font-medium">{asset.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Category</div>
                  <Badge variant="outline">{asset.category}</Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <Badge
                    variant={
                      asset.status === "inactive" ? "secondary" : "default"
                    }
                  >
                    {asset.status === "inactive" ? "Inactive" : "Active"}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Asset ID</div>
                  <div className="font-mono text-sm">{asset.id}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-muted-foreground mb-1">Description</div>
                  <div className="text-sm">{asset.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Branch</div>
                  <div className="font-medium">{asset.location}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Floor</div>
                  <div className="font-medium">{asset.floor}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Room</div>
                  <div className="font-medium">{asset.room}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Details Tab */}
        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Technical Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Serial Number</div>
                  <div className="font-mono text-sm">{asset.serialNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Model</div>
                  <div className="font-medium">{asset.model}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Manufacturer</div>
                  <div className="font-medium">{asset.manufacturer}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Category</div>
                  <Badge variant="outline">{asset.category}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Purchase Date</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(asset.purchaseDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Purchase Price</div>
                  <div className="font-bold text-lg">
                    GH₵ {asset.purchasePrice.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Warranty Expiry</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(asset.warrantyExpiry).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Warranty Status</div>
                  <Badge
                    variant={
                      new Date(asset.warrantyExpiry) > new Date()
                        ? "default"
                        : "destructive"
                    }
                  >
                    {new Date(asset.warrantyExpiry) > new Date()
                      ? "Active"
                      : "Expired"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance History Tab */}
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Maintenance Schedule
                </CardTitle>
                <Button onClick={() => setIsMaintenanceDialogOpen(true)}>
                  <History className="h-4 w-4 mr-2" />
                  Add Maintenance Record
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Last Maintenance
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(asset.lastMaintenance).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Next Scheduled Maintenance
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      {new Date(asset.nextMaintenance).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Technician</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMaintenanceHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No maintenance history available. Records will appear here once backend is connected.
                        </TableCell>
                      </TableRow>
                    ) : (
                      mockMaintenanceHistory.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            {new Date(record.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.type}</Badge>
                          </TableCell>
                          <TableCell>{record.technician}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {record.notes}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {record.cost}
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
      </Tabs>

      {/* Edit Asset Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>
              Update asset information and details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Asset Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) =>
                  setEditForm((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="disposed">Disposed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Branch</Label>
                <Input
                  id="edit-location"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, location: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-floor">Floor</Label>
                <Input
                  id="edit-floor"
                  value={editForm.floor}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, floor: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleEditAsset}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the asset
              "{asset.name}" and remove all associated data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAsset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Asset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Maintenance Record Dialog */}
      <Dialog
        open={isMaintenanceDialogOpen}
        onOpenChange={setIsMaintenanceDialogOpen}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add Maintenance Record</DialogTitle>
            <DialogDescription>
              Record a new maintenance activity for this asset.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="maintenance-type">Maintenance Type</Label>
              <Select
                value={maintenanceForm.type}
                onValueChange={(value) =>
                  setMaintenanceForm((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventive">Preventive Maintenance</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="upgrade">Upgrade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maintenance-technician">Technician/Vendor</Label>
              <Input
                id="maintenance-technician"
                value={maintenanceForm.technician}
                onChange={(e) =>
                  setMaintenanceForm((prev) => ({
                    ...prev,
                    technician: e.target.value,
                  }))
                }
                placeholder="Enter technician or vendor name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maintenance-notes">Notes</Label>
              <Textarea
                id="maintenance-notes"
                value={maintenanceForm.notes}
                onChange={(e) =>
                  setMaintenanceForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Describe the maintenance work performed..."
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maintenance-cost">Cost (GH₵)</Label>
              <Input
                id="maintenance-cost"
                type="number"
                value={maintenanceForm.cost}
                onChange={(e) =>
                  setMaintenanceForm((prev) => ({ ...prev, cost: e.target.value }))
                }
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMaintenanceDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddMaintenance}>
              <Save className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssetDetails;
