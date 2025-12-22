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
import { Plus, Search, Building2, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Users, MapPin } from "lucide-react";
import { mockBranches, Branch } from "@/data/mockBranches";
import { GoogleAddressInput } from "@/components/GoogleAddressInput";

const ITEMS_PER_PAGE = 10;
const STORAGE_KEY = "branches_storage";

const Branches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const [formData, setFormData] = useState<Partial<Branch>>({
    name: "",
    code: "",
    address: "",
    city: "",
    region: "Greater Accra",
    country: "Ghana",
    manager: "",
    phone: "",
    email: "",
    status: "active",
    floorArea: 0,
    floors: 1,
    employees: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBranches(parsed.length > 0 ? parsed : mockBranches);
      } catch {
        setBranches(mockBranches);
      }
    } else {
      setBranches(mockBranches);
    }
  }, []);

  useEffect(() => {
    if (branches.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(branches));
    }
  }, [branches]);

  const filteredBranches = useMemo(() => {
    let filtered = branches;
    
    if (regionFilter !== "all") {
      filtered = filtered.filter(b => b.region === regionFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(term) ||
        b.code.toLowerCase().includes(term) ||
        b.city.toLowerCase().includes(term) ||
        b.manager.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [branches, searchTerm, regionFilter]);

  const totalPages = Math.ceil(filteredBranches.length / ITEMS_PER_PAGE);
  const paginatedBranches = filteredBranches.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAdd = () => {
    if (!formData.name || !formData.code || !formData.manager) {
      setError("Name, Code, and Manager are required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const newBranch: Branch = {
      id: `branch-${Date.now()}`,
      name: formData.name!,
      code: formData.code!,
      address: formData.address || "",
      city: formData.city || "",
      region: formData.region || "Greater Accra",
      country: formData.country || "Ghana",
      manager: formData.manager!,
      phone: formData.phone || "",
      email: formData.email || "",
      status: formData.status as any || "active",
      floorArea: formData.floorArea || 0,
      floors: formData.floors,
      employees: formData.employees
    };

    setBranches(prev => [...prev, newBranch]);
    setSuccess("Branch added successfully!");
    setIsAddModalOpen(false);
    resetForm();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleEdit = () => {
    if (!selectedBranch) return;
    
    setBranches(prev => prev.map(b => 
      b.id === selectedBranch.id ? { ...b, ...formData } : b
    ));
    setSuccess("Branch updated successfully!");
    setIsEditModalOpen(false);
    setSelectedBranch(null);
    resetForm();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDelete = () => {
    if (!selectedBranch) return;
    
    setBranches(prev => prev.filter(b => b.id !== selectedBranch.id));
    setSuccess("Branch deleted successfully!");
    setIsDeleteModalOpen(false);
    setSelectedBranch(null);
    setTimeout(() => setSuccess(""), 3000);
  };

  const openEditModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setFormData(branch);
    setIsEditModalOpen(true);
  };

  const openViewModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      address: "",
      city: "",
      region: "Greater Accra",
      country: "Ghana",
      manager: "",
      phone: "",
      email: "",
      status: "active",
      floorArea: 0,
      floors: 1,
      employees: 0
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800"
    };
    return <Badge className={config[status] || ""}>{status}</Badge>;
  };

  const regions = Array.from(new Set(branches.map(b => b.region))).sort();
  const activeBranches = branches.filter(b => b.status === 'active').length;
  const totalEmployees = branches.reduce((sum, b) => sum + (b.employees || 0), 0);
  const totalFloorArea = branches.reduce((sum, b) => sum + b.floorArea, 0);

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
          <h1 className="text-2xl font-bold tracking-tight">Branch Management</h1>
          <p className="text-muted-foreground">Manage company branches and locations</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Branch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeBranches}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Floor Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFloorArea.toLocaleString()} m²</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, code, city, manager..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select value={regionFilter} onValueChange={(value) => { setRegionFilter(value); setCurrentPage(1); }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-muted/50 p-4">
          <CardTitle className="text-base">Branches ({filteredBranches.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBranches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {searchTerm || regionFilter !== "all" ? "No branches found." : "No branches available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBranches.map((branch) => (
                    <TableRow key={branch.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {branch.name}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{branch.code}</TableCell>
                      <TableCell>{branch.city}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <MapPin className="h-3 w-3" />
                          {branch.region}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{branch.manager}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{branch.employees || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(branch.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openViewModal(branch)} title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(branch)} title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteModal(branch)} title="Delete" className="text-red-600 hover:text-red-700 hover:bg-red-50">
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
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredBranches.length)} of {filteredBranches.length} branches
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
              <Building2 className="h-5 w-5" />
              Add New Branch
            </DialogTitle>
            <DialogDescription>Add a new branch location</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Branch Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Branch name"
                />
              </div>
              <div className="space-y-2">
                <Label>Branch Code *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="ABC-123"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <GoogleAddressInput
                value={formData.address || ""}
                onChange={(address) => setFormData(prev => ({ ...prev, address }))}
                placeholder="Search for address"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label>Region</Label>
                <Select value={formData.region} onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Greater Accra">Greater Accra</SelectItem>
                    <SelectItem value="Ashanti">Ashanti</SelectItem>
                    <SelectItem value="Western">Western</SelectItem>
                    <SelectItem value="Eastern">Eastern</SelectItem>
                    <SelectItem value="Central">Central</SelectItem>
                    <SelectItem value="Northern">Northern</SelectItem>
                    <SelectItem value="Volta">Volta</SelectItem>
                    <SelectItem value="Upper East">Upper East</SelectItem>
                    <SelectItem value="Upper West">Upper West</SelectItem>
                    <SelectItem value="Brong-Ahafo">Brong-Ahafo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="Ghana"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Branch Manager *</Label>
                <Input
                  value={formData.manager}
                  onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                  placeholder="Manager name"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+233-XXX-XXXXXX"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="branch@absa.com.gh"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Floor Area (m²)</Label>
                <Input
                  type="number"
                  value={formData.floorArea}
                  onChange={(e) => setFormData(prev => ({ ...prev, floorArea: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Floors</Label>
                <Input
                  type="number"
                  value={formData.floors}
                  onChange={(e) => setFormData(prev => ({ ...prev, floors: parseInt(e.target.value) || 1 }))}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Employees</Label>
                <Input
                  type="number"
                  value={formData.employees}
                  onChange={(e) => setFormData(prev => ({ ...prev, employees: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add Branch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
            <DialogDescription>Update branch information</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Branch Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Branch Code</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Manager</Label>
                <Input
                  value={formData.manager}
                  onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setSelectedBranch(null); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update Branch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Branch Details
            </DialogTitle>
          </DialogHeader>
          {selectedBranch && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Branch Name</Label>
                  <p className="font-medium">{selectedBranch.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Code</Label>
                  <p className="font-medium font-mono">{selectedBranch.code}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Address</Label>
                <p className="font-medium">{selectedBranch.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">City</Label>
                  <p className="font-medium">{selectedBranch.city}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Region</Label>
                  <p className="font-medium">{selectedBranch.region}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Manager</Label>
                  <p className="font-medium">{selectedBranch.manager}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{selectedBranch.phone}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{selectedBranch.email}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Floor Area</Label>
                  <p className="font-medium">{selectedBranch.floorArea} m²</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Floors</Label>
                  <p className="font-medium">{selectedBranch.floors || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Employees</Label>
                  <p className="font-medium">{selectedBranch.employees || 0}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className="mt-1">{getStatusBadge(selectedBranch.status)}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => { setIsViewModalOpen(false); setSelectedBranch(null); }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Branch</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedBranch?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setSelectedBranch(null); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Branches;
