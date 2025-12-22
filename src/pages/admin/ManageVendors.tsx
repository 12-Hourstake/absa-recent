import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Edit, Trash2, Eye, Save, X, Search, Filter, Download, Star, TrendingUp, AlertCircle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBackButtonText } from "@/hooks/useBackButtonText";

const ManageVendors = () => {
  const navigate = useNavigate();
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);

  const vendorFields = [
    { name: 'name', label: 'Vendor Name', type: 'text' as const, required: true, placeholder: 'Enter vendor name' },
    { name: 'contact', label: 'Contact Person', type: 'text' as const, required: true, placeholder: 'Contact person name' },
    { name: 'email', label: 'Email', type: 'email' as const, required: true, placeholder: 'vendor@example.com' },
    { name: 'phone', label: 'Phone', type: 'text' as const, required: true, placeholder: '+233 XX XXX XXXX' },
    { name: 'category', label: 'Service Category', type: 'select' as const, required: true, options: [
      { value: 'electrical', label: 'Electrical' },
      { value: 'plumbing', label: 'Plumbing' },
      { value: 'hvac', label: 'HVAC' },
      { value: 'security', label: 'Security' },
      { value: 'cleaning', label: 'Cleaning' },
      { value: 'landscaping', label: 'Landscaping' }
    ]},
    { name: 'address', label: 'Address', type: 'textarea' as const, placeholder: 'Vendor address' },
    { name: 'contractStart', label: 'Contract Start Date', type: 'date' as const },
    { name: 'contractEnd', label: 'Contract End Date', type: 'date' as const }
  ];

  const handleAddVendor = (data: Record<string, string>) => {
    console.log('Adding vendor:', data);
  };

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [success, setSuccess] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    rating: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const vendors = [
    {
      id: "1",
      name: "Electrical Services Ltd",
      contact: "John Doe",
      email: "john@electrical.com",
      phone: "+233 24 123 4567",
      rating: 92,
      status: "active",
      contractExpiry: "2025-12-31",
      category: "Electrical",
      completedJobs: 45,
      totalRevenue: "GH₵ 125,000",
    },
    {
      id: "2",
      name: "HVAC Solutions",
      contact: "Sarah Asante",
      email: "sarah@hvac.com",
      phone: "+233 24 234 5678",
      rating: 88,
      status: "active",
      contractExpiry: "2025-06-30",
      category: "HVAC",
      completedJobs: 38,
      totalRevenue: "GH₵ 98,500",
    },
    {
      id: "3",
      name: "Plumbing Pro",
      contact: "Mike Osei",
      email: "mike@plumbing.com",
      phone: "+233 24 345 6789",
      rating: 75,
      status: "active",
      contractExpiry: "2025-03-15",
      category: "Plumbing",
      completedJobs: 28,
      totalRevenue: "GH₵ 67,200",
    },
    {
      id: "4",
      name: "Security Systems Ghana",
      contact: "Kwame Mensah",
      email: "kwame@security.com",
      phone: "+233 24 456 7890",
      rating: 95,
      status: "active",
      contractExpiry: "2026-01-15",
      category: "Security",
      completedJobs: 52,
      totalRevenue: "GH₵ 145,800",
    },
    {
      id: "5",
      name: "Green Landscaping",
      contact: "Ama Boateng",
      email: "ama@greenscape.com",
      phone: "+233 24 567 8901",
      rating: 68,
      status: "inactive",
      contractExpiry: "2024-11-30",
      category: "Landscaping",
      completedJobs: 15,
      totalRevenue: "GH₵ 32,400",
    },
  ];

  const handleViewVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setIsViewDialogOpen(true);
  };

  const handleEditVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setEditForm({
      name: vendor.name,
      contact: vendor.contact,
      email: vendor.email,
      phone: vendor.phone,
      rating: vendor.rating,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setSuccess(`Vendor "${editForm.name}" updated successfully!`);
    setIsEditDialogOpen(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDeleteVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setSuccess(`Vendor "${selectedVendor.name}" deleted successfully!`);
    setIsDeleteDialogOpen(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 90) return "text-green-600";
    if (rating >= 75) return "text-yellow-600";
    return "text-red-600";
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
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              Vendor Management
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage vendor contracts, performance, and relationships.
          </p>
        </div>
        <Button onClick={() => setShowAddVendorModal(true)} className="bg-red-600 hover:bg-red-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Vendors</p>
                <p className="text-3xl font-bold mt-1">{vendors.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Vendors</p>
                <p className="text-3xl font-bold mt-1">{vendors.filter(v => v.status === "active").length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-3xl font-bold mt-1">{(vendors.reduce((a, v) => a + v.rating, 0) / vendors.length).toFixed(1)}%</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-3xl font-bold mt-1">2</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors by name, contact, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Directory ({vendors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-5 border rounded-lg hover:shadow-md transition-shadow bg-card"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{vendor.name}</h3>
                      {getStatusBadge(vendor.status)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <p>👤 {vendor.contact}</p>
                      <p>📧 {vendor.email}</p>
                      <p>📞 {vendor.phone}</p>
                      <p>🏷️ {vendor.category}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4 md:mt-0">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <p className={`text-lg font-bold ${getRatingColor(vendor.rating)}`}>{vendor.rating}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Jobs</p>
                      <p className="text-lg font-bold">{vendor.completedJobs}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-sm font-bold">{vendor.totalRevenue}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewVendor(vendor)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditVendor(vendor)}
                      title="Edit Vendor"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteVendor(vendor)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete Vendor"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
            <DialogDescription>
              Complete information about this vendor.
            </DialogDescription>
          </DialogHeader>
          {selectedVendor && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Vendor ID</Label>
                  <div className="font-medium">{selectedVendor.id}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  <div className="font-medium">{selectedVendor.name}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Contact Person</Label>
                  <div className="font-medium">{selectedVendor.contact}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <div className="font-medium">{selectedVendor.email}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Phone</Label>
                  <div className="font-medium">{selectedVendor.phone}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Rating</Label>
                  <div className="font-medium">{selectedVendor.rating}%</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Contract Expiry</Label>
                  <div className="font-medium">{selectedVendor.contractExpiry}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <div className="font-medium capitalize">{selectedVendor.status}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
            <DialogDescription>
              Update vendor information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Vendor Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-contact">Contact Person</Label>
              <Input
                id="edit-contact"
                value={editForm.contact}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, contact: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
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

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vendor
              "{selectedVendor?.name}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Vendor
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Vendor Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 bg-white">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Add New Vendor</h2>
                <p className="text-slate-600 text-sm mt-1">Enter details to onboard a new service provider.</p>
              </div>
              <button 
                onClick={() => setShowAddVendorModal(false)}
                className="p-2 rounded-full hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <span className="text-slate-400 hover:text-slate-900 text-2xl">×</span>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto p-8 bg-slate-50/30">
              <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                {/* Left Column: Primary Details */}
                <div className="space-y-6">
                  <div className="flex flex-col w-full">
                    <span className="text-slate-900 text-sm font-semibold mb-2">Vendor Name <span className="text-red-500">*</span></span>
                    <input 
                      className="w-full h-12 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all"
                      placeholder="e.g., Osei & Sons Plumbing"
                      type="text"
                    />
                  </div>
                  
                  <div className="flex flex-col w-full">
                    <span className="text-slate-900 text-sm font-semibold mb-2">Contact Person <span className="text-red-500">*</span></span>
                    <input 
                      className="w-full h-12 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all"
                      placeholder="e.g., Kwame Osei"
                      type="text"
                    />
                  </div>
                  
                  <div className="flex flex-col w-full">
                    <span className="text-slate-900 text-sm font-semibold mb-2">Email Address <span className="text-red-500">*</span></span>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">✉</span>
                      <input 
                        className="w-full h-12 pl-12 pr-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all"
                        placeholder="e.g., kwame@oseisons.com.gh"
                        type="email"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col w-full">
                    <span className="text-slate-900 text-sm font-semibold mb-2">Phone Number <span className="text-red-500">*</span></span>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">📞</span>
                      <input 
                        className="w-full h-12 pl-12 pr-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all"
                        placeholder="e.g., +233 24 456 7890"
                        type="tel"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right Column: Business Details */}
                <div className="space-y-6">
                  {/* Multi-Select Simulation */}
                  <div className="flex flex-col w-full">
                    <span className="text-slate-900 text-sm font-semibold mb-2">Service Categories</span>
                    <div className="w-full min-h-[48px] px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400 transition-all flex flex-wrap gap-2 items-center cursor-text">
                      {/* Selected Chip */}
                      <div className="flex items-center bg-slate-100 text-slate-600 px-2 py-1 rounded text-sm font-medium border border-slate-200">
                        <span>Plumbing</span>
                        <button className="ml-1 hover:text-slate-500 focus:outline-none" type="button">
                          <span className="text-sm">×</span>
                        </button>
                      </div>
                      <input 
                        className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm placeholder:text-slate-400 min-w-[120px]"
                        placeholder="Add category..."
                        type="text"
                      />
                      <ChevronRight className="text-slate-400 rotate-90 h-4 w-4" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col w-full">
                    <span className="text-slate-900 text-sm font-semibold mb-2">Business Address</span>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">📍</span>
                      <input 
                        className="w-full h-12 pl-12 pr-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all"
                        placeholder="e.g., 12 Independence Ave, Accra"
                        type="text"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col w-full">
                      <span className="text-slate-900 text-sm font-semibold mb-2">Payment Terms</span>
                      <div className="relative">
                        <select className="w-full h-12 pl-4 pr-10 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none appearance-none cursor-pointer">
                          <option>Net 30 Days</option>
                          <option>Net 15 Days</option>
                          <option>Due on Receipt</option>
                          <option>Prepaid</option>
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90 h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col w-full">
                      <span className="text-slate-900 text-sm font-semibold mb-2">Tax ID <span className="text-slate-400 font-normal">(Optional)</span></span>
                      <input 
                        className="w-full h-12 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none transition-all"
                        placeholder="e.g., V001234567"
                        type="text"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col w-full">
                    <span className="text-slate-900 text-sm font-semibold mb-2">Notes <span className="text-slate-400 font-normal">(Optional)</span></span>
                    <textarea 
                      className="w-full h-24 px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 focus:outline-none resize-none transition-all"
                      placeholder="Add any additional notes about this vendor..."
                    />
                  </div>
                </div>
              </form>
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-8 py-5 bg-slate-50 border-t border-slate-200">
              <button 
                className="h-11 px-6 rounded-lg border border-slate-200 bg-white text-slate-900 font-medium hover:bg-slate-100 hover:border-slate-300 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-colors"
                onClick={() => setShowAddVendorModal(false)}
              >
                Cancel
              </button>
              <button 
                className="h-11 px-6 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 shadow-sm focus:ring-2 focus:ring-red-500/50 focus:ring-offset-1 focus:outline-none transition-all flex items-center gap-2"
                onClick={() => {
                  handleAddVendor({});
                  setShowAddVendorModal(false);
                }}
              >
                <Plus className="h-5 w-5" />
                Add Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVendors;
