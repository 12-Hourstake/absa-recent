import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Users,
  Package,
  ArrowLeft,
  Save,
  X,
} from "lucide-react";

interface Branch {
  id: string;
  name: string;
  code: string;
  location: string;
  address: string;
  city: string;
  region: string;
  phone: string;
  email: string;
  manager: string;
  managerEmail: string;
  managerPhone: string;
  status: "Active" | "Inactive" | "Under Maintenance";
  establishedDate: string;
  description: string;
  assets: number;
  employees: number;
}

const ManageBranches = () => {
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [branches, setBranches] = useState<Branch[]>([
    {
      id: "1",
      name: "Accra Main Branch",
      code: "ACC001",
      location: "Independence Avenue, Accra",
      address: "123 Independence Avenue",
      city: "Accra",
      region: "Greater Accra",
      phone: "+233 30 123 4567",
      email: "accra.main@absa.com.gh",
      manager: "Kwame Asante",
      managerEmail: "kwame.asante@absa.com.gh",
      managerPhone: "+233 24 123 4567",
      status: "Active",
      establishedDate: "2020-01-15",
      description: "Main administrative branch for Greater Accra region",
      assets: 245,
      employees: 89,
    },
    {
      id: "2",
      name: "Kumasi Branch",
      code: "KUM001",
      location: "Prempeh II Street, Kumasi",
      address: "456 Prempeh II Street",
      city: "Kumasi",
      region: "Ashanti",
      phone: "+233 32 234 5678",
      email: "kumasi@absa.com.gh",
      manager: "Ama Serwaa",
      managerEmail: "ama.serwaa@absa.com.gh",
      managerPhone: "+233 24 234 5678",
      status: "Active",
      establishedDate: "2021-03-20",
      description: "Regional branch serving Ashanti region",
      assets: 189,
      employees: 67,
    },
    {
      id: "3",
      name: "Takoradi Branch",
      code: "TAK001",
      location: "Harbour Road, Takoradi",
      address: "789 Harbour Road",
      city: "Takoradi",
      region: "Western",
      phone: "+233 31 345 6789",
      email: "takoradi@absa.com.gh",
      manager: "Kofi Mensah",
      managerEmail: "kofi.mensah@absa.com.gh",
      managerPhone: "+233 24 345 6789",
      status: "Active",
      establishedDate: "2022-06-10",
      description: "Coastal branch serving Western region",
      assets: 156,
      employees: 45,
    },
    {
      id: "4",
      name: "Tamale Branch",
      code: "TAM001",
      location: "Central Market, Tamale",
      address: "321 Central Market Road",
      city: "Tamale",
      region: "Northern",
      phone: "+233 37 456 7890",
      email: "tamale@absa.com.gh",
      manager: "Fatima Alhassan",
      managerEmail: "fatima.alhassan@absa.com.gh",
      managerPhone: "+233 24 456 7890",
      status: "Under Maintenance",
      establishedDate: "2023-01-05",
      description: "Northern region branch currently under renovation",
      assets: 98,
      employees: 32,
    },
  ]);

  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    address: string;
    city: string;
    region: string;
    phone: string;
    email: string;
    manager: string;
    managerEmail: string;
    managerPhone: string;
    status: "Active" | "Inactive" | "Under Maintenance";
    establishedDate: string;
    description: string;
  }>({
    name: "",
    code: "",
    address: "",
    city: "",
    region: "",
    phone: "",
    email: "",
    manager: "",
    managerEmail: "",
    managerPhone: "",
    status: "Active",
    establishedDate: "",
    description: "",
  });

  const regions = [
    "Greater Accra",
    "Ashanti",
    "Western",
    "Eastern",
    "Central",
    "Volta",
    "Northern",
    "Upper East",
    "Upper West",
    "Brong-Ahafo",
    "Western North",
    "Ahafo",
    "Bono",
    "Bono East",
    "Oti",
    "Savannah",
    "North East",
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        className: string;
        label: string;
      }
    > = {
      Active: {
        className: "bg-green-100 text-green-800 border-green-200",
        label: "Active",
      },
      Inactive: {
        className: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Inactive",
      },
      "Under Maintenance": {
        className: "bg-orange-100 text-orange-800 border-orange-200",
        label: "Under Maintenance",
      },
    };
    const config = variants[status] || variants.Active;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddBranch = () => {
    if (!formData.name || !formData.code || !formData.address) {
      setError("Please fill in all required fields");
      return;
    }

    const newBranch: Branch = {
      id: (branches.length + 1).toString(),
      ...formData,
      location: `${formData.address}, ${formData.city}`,
      assets: 0,
      employees: 0,
    };

    setBranches([...branches, newBranch]);
    setSuccess(`Branch "${formData.name}" added successfully!`);
    setIsAddDialogOpen(false);
    setFormData({
      name: "",
      code: "",
      address: "",
      city: "",
      region: "",
      phone: "",
      email: "",
      manager: "",
      managerEmail: "",
      managerPhone: "",
      status: "Active",
      establishedDate: "",
      description: "",
    });
  };

  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setFormData({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      city: branch.city,
      region: branch.region,
      phone: branch.phone,
      email: branch.email,
      manager: branch.manager,
      managerEmail: branch.managerEmail,
      managerPhone: branch.managerPhone,
      status: branch.status,
      establishedDate: branch.establishedDate,
      description: branch.description,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedBranch) return;

    const updatedBranches = branches.map((branch) =>
      branch.id === selectedBranch.id
        ? {
            ...branch,
            ...formData,
            location: `${formData.address}, ${formData.city}`,
          }
        : branch
    );

    setBranches(updatedBranches);
    setSuccess(`Branch "${formData.name}" updated successfully!`);
    setIsEditDialogOpen(false);
    setSelectedBranch(null);
  };

  const handleDeleteBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedBranch) return;

    const updatedBranches = branches.filter(
      (branch) => branch.id !== selectedBranch.id
    );
    setBranches(updatedBranches);
    setSuccess(`Branch "${selectedBranch.name}" deleted successfully!`);
    setIsDeleteDialogOpen(false);
    setSelectedBranch(null);
  };

  return (
    <div className="p-6 space-y-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            ✅ {success}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">❌ {error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Branch Management
          </h1>
          <p className="text-muted-foreground">
            Manage ABSA Bank branches and locations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/settings")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </Button>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Branch
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch) => (
          <Card key={branch.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{branch.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {branch.code}
                    </p>
                  </div>
                </div>
                {getStatusBadge(branch.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{branch.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{branch.manager}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>{branch.assets} assets • {branch.employees} employees</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditBranch(branch)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteBranch(branch)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Branch Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Branch</DialogTitle>
            <DialogDescription>
              Create a new ABSA Bank branch with all required details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Branch Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Accra Main Branch"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Branch Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  placeholder="e.g., ACC001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Street address"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="e.g., Accra"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region *</Label>
                <Select
                  value={formData.region}
                  onValueChange={(value) => handleInputChange("region", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+233 30 123 4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="branch@absa.com.gh"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manager">Branch Manager</Label>
              <Input
                id="manager"
                value={formData.manager}
                onChange={(e) => handleInputChange("manager", e.target.value)}
                placeholder="Manager's full name"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="managerEmail">Manager Email</Label>
                <Input
                  id="managerEmail"
                  type="email"
                  value={formData.managerEmail}
                  onChange={(e) =>
                    handleInputChange("managerEmail", e.target.value)
                  }
                  placeholder="manager@absa.com.gh"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="managerPhone">Manager Phone</Label>
                <Input
                  id="managerPhone"
                  value={formData.managerPhone}
                  onChange={(e) =>
                    handleInputChange("managerPhone", e.target.value)
                  }
                  placeholder="+233 24 123 4567"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleInputChange("status", value as "Active" | "Inactive" | "Under Maintenance")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="establishedDate">Established Date</Label>
                <Input
                  id="establishedDate"
                  type="date"
                  value={formData.establishedDate}
                  onChange={(e) =>
                    handleInputChange("establishedDate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Branch description and additional notes"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleAddBranch}>
              <Save className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Branch Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
            <DialogDescription>
              Update branch information and details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Branch Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code">Branch Code *</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Address *</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-city">City *</Label>
                <Input
                  id="edit-city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-region">Region *</Label>
                <Select
                  value={formData.region}
                  onValueChange={(value) => handleInputChange("region", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-manager">Branch Manager</Label>
              <Input
                id="edit-manager"
                value={formData.manager}
                onChange={(e) => handleInputChange("manager", e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-managerEmail">Manager Email</Label>
                <Input
                  id="edit-managerEmail"
                  type="email"
                  value={formData.managerEmail}
                  onChange={(e) =>
                    handleInputChange("managerEmail", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-managerPhone">Manager Phone</Label>
                <Input
                  id="edit-managerPhone"
                  value={formData.managerPhone}
                  onChange={(e) =>
                    handleInputChange("managerPhone", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleInputChange("status", value as "Active" | "Inactive" | "Under Maintenance")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-establishedDate">Established Date</Label>
                <Input
                  id="edit-establishedDate"
                  type="date"
                  value={formData.establishedDate}
                  onChange={(e) =>
                    handleInputChange("establishedDate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
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
            <AlertDialogTitle>Delete Branch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedBranch?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageBranches;
