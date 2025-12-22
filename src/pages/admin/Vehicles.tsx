import { useState, useMemo, useEffect } from "react";
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
import { Plus, Search, Car, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Fuel, Calendar } from "lucide-react";
import { mockVehicles, Vehicle } from "@/data/mockVehicles";
import { mockBranches } from "@/data/mockBranches";

const ITEMS_PER_PAGE = 10;
const STORAGE_KEY = "vehicles_storage";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [formData, setFormData] = useState<Partial<Vehicle>>({
    registration: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    fuelType: "Petrol",
    color: "",
    assignedBranch: "",
    status: "active",
    odometer: 0,
    purchaseDate: "",
    insuranceExpiry: "",
    roadworthyExpiry: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setVehicles(parsed.length > 0 ? parsed : mockVehicles);
      } catch {
        setVehicles(mockVehicles);
      }
    } else {
      setVehicles(mockVehicles);
    }
  }, []);

  useEffect(() => {
    if (vehicles.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    }
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return vehicles;
    const term = searchTerm.toLowerCase();
    return vehicles.filter(v =>
      v.registration.toLowerCase().includes(term) ||
      v.make.toLowerCase().includes(term) ||
      v.model.toLowerCase().includes(term) ||
      v.assignedBranch.toLowerCase().includes(term) ||
      (v.assignedDriver && v.assignedDriver.toLowerCase().includes(term))
    );
  }, [vehicles, searchTerm]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAdd = () => {
    if (!formData.registration || !formData.make || !formData.model) {
      setError("Registration, Make, and Model are required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const newVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      registration: formData.registration!,
      make: formData.make!,
      model: formData.model!,
      year: formData.year || new Date().getFullYear(),
      fuelType: formData.fuelType as any || "Petrol",
      color: formData.color || "",
      vin: formData.vin,
      assignedDriver: formData.assignedDriver,
      assignedBranch: formData.assignedBranch || "",
      status: formData.status as any || "active",
      odometer: formData.odometer || 0,
      purchaseDate: formData.purchaseDate || "",
      insuranceExpiry: formData.insuranceExpiry || "",
      roadworthyExpiry: formData.roadworthyExpiry || "",
      lastServiceDate: formData.lastServiceDate,
      nextServiceDate: formData.nextServiceDate,
      fuelCardNumber: formData.fuelCardNumber,
      notes: formData.notes
    };

    setVehicles(prev => [...prev, newVehicle]);
    setSuccess("Vehicle added successfully!");
    setIsAddModalOpen(false);
    resetForm();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleEdit = () => {
    if (!selectedVehicle) return;
    
    setVehicles(prev => prev.map(v => 
      v.id === selectedVehicle.id ? { ...v, ...formData } : v
    ));
    setSuccess("Vehicle updated successfully!");
    setIsEditModalOpen(false);
    setSelectedVehicle(null);
    resetForm();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDelete = () => {
    if (!selectedVehicle) return;
    
    setVehicles(prev => prev.filter(v => v.id !== selectedVehicle.id));
    setSuccess("Vehicle deleted successfully!");
    setIsDeleteModalOpen(false);
    setSelectedVehicle(null);
    setTimeout(() => setSuccess(""), 3000);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData(vehicle);
    setIsEditModalOpen(true);
  };

  const openViewModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      registration: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      fuelType: "Petrol",
      color: "",
      assignedBranch: "",
      status: "active",
      odometer: 0,
      purchaseDate: "",
      insuranceExpiry: "",
      roadworthyExpiry: ""
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: "bg-green-100 text-green-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      inactive: "bg-gray-100 text-gray-800",
      unassigned: "bg-blue-100 text-blue-800"
    };
    return <Badge className={config[status] || ""}>{status}</Badge>;
  };

  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  const totalOdometer = vehicles.reduce((sum, v) => sum + v.odometer, 0);

  return (
    <div className="p-4 space-y-6">
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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-muted-foreground">Manage company vehicles and fleet</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeVehicles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{maintenanceVehicles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Mileage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOdometer.toLocaleString()} km</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by registration, make, model, driver..."
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

      <Card>
        <CardHeader className="bg-muted/50 p-4">
          <CardTitle className="text-base">Vehicles ({filteredVehicles.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Registration</TableHead>
                  <TableHead>Make & Model</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Odometer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No vehicles found." : "No vehicles available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium font-mono">{vehicle.registration}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                            <div className="text-xs text-muted-foreground">{vehicle.color}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell className="text-sm">{vehicle.assignedDriver || "Unassigned"}</TableCell>
                      <TableCell className="text-sm">{vehicle.assignedBranch}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{vehicle.odometer.toLocaleString()} km</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openViewModal(vehicle)} title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(vehicle)} title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteModal(vehicle)} title="Delete" className="text-red-600 hover:text-red-700 hover:bg-red-50">
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredVehicles.length)} of {filteredVehicles.length} vehicles
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
                <div className="text-sm">Page {currentPage} of {totalPages}</div>
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Add New Vehicle
            </DialogTitle>
            <DialogDescription>Add a new vehicle to the fleet</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Registration Number *</Label>
                <Input
                  value={formData.registration}
                  onChange={(e) => setFormData(prev => ({ ...prev, registration: e.target.value }))}
                  placeholder="GR-1234-23"
                />
              </div>
              <div className="space-y-2">
                <Label>VIN</Label>
                <Input
                  value={formData.vin}
                  onChange={(e) => setFormData(prev => ({ ...prev, vin: e.target.value }))}
                  placeholder="Vehicle Identification Number"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Make *</Label>
                <Input
                  value={formData.make}
                  onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                  placeholder="Toyota"
                />
              </div>
              <div className="space-y-2">
                <Label>Model *</Label>
                <Input
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="Corolla"
                />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  placeholder="2024"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fuel Type</Label>
                <Select value={formData.fuelType} onValueChange={(value) => setFormData(prev => ({ ...prev, fuelType: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="White"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assigned Driver</Label>
                <Input
                  value={formData.assignedDriver}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignedDriver: e.target.value }))}
                  placeholder="Driver name"
                />
              </div>
              <div className="space-y-2">
                <Label>Assigned Branch</Label>
                <Select value={formData.assignedBranch} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedBranch: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBranches.map(branch => (
                      <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Odometer (km)</Label>
                <Input
                  type="number"
                  value={formData.odometer}
                  onChange={(e) => setFormData(prev => ({ ...prev, odometer: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Purchase Date</Label>
                <Input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Insurance Expiry</Label>
                <Input
                  type="date"
                  value={formData.insuranceExpiry}
                  onChange={(e) => setFormData(prev => ({ ...prev, insuranceExpiry: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Roadworthy Expiry</Label>
                <Input
                  type="date"
                  value={formData.roadworthyExpiry}
                  onChange={(e) => setFormData(prev => ({ ...prev, roadworthyExpiry: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fuel Card Number</Label>
              <Input
                value={formData.fuelCardNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, fuelCardNumber: e.target.value }))}
                placeholder="FC-001-2345"
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>Update vehicle information</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Registration</Label>
                <Input
                  value={formData.registration}
                  onChange={(e) => setFormData(prev => ({ ...prev, registration: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Odometer (km)</Label>
                <Input
                  type="number"
                  value={formData.odometer}
                  onChange={(e) => setFormData(prev => ({ ...prev, odometer: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assigned Driver</Label>
                <Input
                  value={formData.assignedDriver}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignedDriver: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setSelectedVehicle(null); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Details
            </DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Registration</Label>
                  <p className="font-medium font-mono">{selectedVehicle.registration}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedVehicle.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Make & Model</Label>
                  <p className="font-medium">{selectedVehicle.make} {selectedVehicle.model}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Year</Label>
                  <p className="font-medium">{selectedVehicle.year}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Fuel Type</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Fuel className="h-4 w-4" />
                    {selectedVehicle.fuelType}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Color</Label>
                  <p className="font-medium">{selectedVehicle.color}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Assigned Driver</Label>
                  <p className="font-medium">{selectedVehicle.assignedDriver || "Unassigned"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Branch</Label>
                  <p className="font-medium">{selectedVehicle.assignedBranch}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Odometer</Label>
                  <p className="font-medium">{selectedVehicle.odometer.toLocaleString()} km</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Fuel Card</Label>
                  <p className="font-medium">{selectedVehicle.fuelCardNumber || "N/A"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Insurance Expiry
                  </Label>
                  <p className="font-medium">{selectedVehicle.insuranceExpiry}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Roadworthy Expiry
                  </Label>
                  <p className="font-medium">{selectedVehicle.roadworthyExpiry}</p>
                </div>
              </div>
              {selectedVehicle.notes && (
                <div>
                  <Label className="text-muted-foreground">Notes</Label>
                  <p className="font-medium">{selectedVehicle.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => { setIsViewModalOpen(false); setSelectedVehicle(null); }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Vehicle</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedVehicle?.registration}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setSelectedVehicle(null); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vehicles;
