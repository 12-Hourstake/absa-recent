import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBackButtonText } from "@/hooks/useBackButtonText";
import { useInventory } from "@/contexts/InventoryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Package2,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Save,
  X,
  ArrowLeft,
} from "lucide-react";

const InventoryList = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();
  const { items } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [success, setSuccess] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    currentStock: 0,
    unitPrice: 0,
    supplier: "",
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        className: string;
        label: string;
        icon: React.ReactNode;
      }
    > = {
      "In Stock": {
        className: "bg-green-100 text-green-800 border-green-200",
        label: "In Stock",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      "Low Stock": {
        className: "bg-orange-100 text-orange-800 border-orange-200",
        label: "Low Stock",
        icon: <AlertTriangle className="h-3 w-3" />,
      },
      "Out of Stock": {
        className: "bg-red-100 text-red-800 border-red-200",
        label: "Out of Stock",
        icon: <XCircle className="h-3 w-3" />,
      },
    };
    const config = variants[status] || variants["In Stock"];
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ["all", ...new Set(items.map((item) => item.category))];
  const statuses = ["all", "In Stock", "Low Stock", "Out of Stock"];

  const handleViewItem = (item: any) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setEditForm({
      name: item.name,
      category: item.category,
      currentStock: item.currentStock,
      unitPrice: item.unitPrice,
      supplier: item.supplier,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setSuccess(`Item "${editForm.name}" updated successfully!`);
    setIsEditDialogOpen(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDeleteItem = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setSuccess(`Item "${selectedItem.name}" deleted successfully!`);
    setIsDeleteDialogOpen(false);
    setTimeout(() => setSuccess(""), 3000);
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

      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Inventory Management
          </h1>
          <p className="text-muted-foreground">
            Manage and track all inventory items
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> {backButtonText}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package2 className="h-5 w-5" />
            Inventory Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600 h-4 w-4 z-10" />
                <Input
                  placeholder="Search items, categories, or suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Status" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => navigate("/admin/inventory/add")}
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.currentStock}</p>
                        <p className="text-sm text-muted-foreground">
                          Min: {item.minStock} | Max: {item.maxStock}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>₵{item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewItem(item)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditItem(item)}
                          title="Edit Item"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteItem(item)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete Item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <Package2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No inventory items found matching your criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about this inventory item.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Item ID
                  </Label>
                  <div className="font-medium">{selectedItem.id}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  <div className="font-medium">{selectedItem.name}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Category
                  </Label>
                  <div className="font-medium">{selectedItem.category}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Status
                  </Label>
                  <div>{getStatusBadge(selectedItem.status)}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Current Stock
                  </Label>
                  <div className="font-medium">{selectedItem.currentStock}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Unit Price
                  </Label>
                  <div className="font-medium">
                    ₵{selectedItem.unitPrice.toFixed(2)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Supplier
                  </Label>
                  <div className="font-medium">{selectedItem.supplier}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Location
                  </Label>
                  <div className="font-medium">{selectedItem.location}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              Update inventory item information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Item Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={editForm.category}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, category: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Current Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={editForm.currentStock}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      currentStock: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Unit Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={editForm.unitPrice}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      unitPrice: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-supplier">Supplier</Label>
              <Input
                id="edit-supplier"
                value={editForm.supplier}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, supplier: e.target.value }))
                }
              />
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
            <Button onClick={handleSaveEdit} className="bg-red-600 hover:bg-red-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              item "{selectedItem?.name}" from the inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InventoryList;
