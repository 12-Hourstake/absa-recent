import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Check, X, ClipboardList, AlertTriangle, Plus, Fuel, Droplets, Save } from "lucide-react";
import { FuelWaterRequest, FuelWaterRequestType, CreateFuelWaterRequestData } from "@/types/request";

interface Request {
  requestId: string;
  requestType: string;
  name: string;
  assetName: string;
  customAssetName?: string;
  description?: string;
  quantity: string;
  mode: string;
  createdBy: string;
  approvedBy?: string;
  createdOn: string;
  approvedOn?: string;
  status: "PENDING" | "APPROVED" | "DENIED" | "ATTENTION_NEEDED";
  adminComment?: string;
  userId: string;
}

const REQUESTS_CACHE_KEY = "REQUESTS_CACHE_V1";

const Requests = () => {
  const { session } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [adminComment, setAdminComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  // Add Request Form Data
  const [formData, setFormData] = useState<CreateFuelWaterRequestData>({
    requestType: "GEN_FUEL",
    name: "",
    assetName: "",
    customAssetName: "",
    description: "",
    quantity: "",
    createdBy: "Admin"
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    try {
      const cached = localStorage.getItem(REQUESTS_CACHE_KEY);
      if (cached) {
        let allRequests = JSON.parse(cached);
        
        // Migrate old requests to new format
        let needsUpdate = false;
        allRequests = allRequests.map((req: any) => {
          if (!req.requestId && req.id) {
            needsUpdate = true;
            return { ...req, requestId: req.id, requestType: req.type || "FUEL" };
          }
          if (!req.requestId) {
            needsUpdate = true;
            return { ...req, requestId: `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, requestType: req.type || "FUEL" };
          }
          return req;
        });
        
        if (needsUpdate) {
          localStorage.setItem(REQUESTS_CACHE_KEY, JSON.stringify(allRequests));
        }
        
        setRequests(allRequests);
      } else {
        localStorage.setItem(REQUESTS_CACHE_KEY, JSON.stringify([]));
      }
    } catch (error) {
      console.error("Error loading requests:", error);
      setRequests([]);
    }
  };

  const saveRequests = (updatedRequests: Request[]) => {
    try {
      localStorage.setItem(REQUESTS_CACHE_KEY, JSON.stringify(updatedRequests));
      setRequests(updatedRequests);
    } catch (error) {
      console.error("Error saving requests:", error);
    }
  };

  const requestTypes = [
    { value: "GEN_FUEL" as FuelWaterRequestType, label: "Generator Fuel", icon: Fuel },
    { value: "CAR_FUEL" as FuelWaterRequestType, label: "Car Fuel", icon: Fuel },
    { value: "WATER" as FuelWaterRequestType, label: "Water", icon: Droplets }
  ];

  const assetOptions = [
    "Generator 1", "Generator 2", "Generator 3",
    "Company Car 1", "Company Car 2", "Company Car 3",
    "Water Tank 1", "Water Tank 2", "Custom Asset"
  ];

  const createdByOptions = [
    "Admin",
    "Facility Manager",
    "Head of Facilities", 
    "Custom"
  ];

  const handleAddRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Name is required");
      }
      if (!formData.quantity.trim()) {
        throw new Error("Quantity is required");
      }
      if (formData.assetName === "Custom Asset" && !formData.customAssetName?.trim()) {
        throw new Error("Custom asset name is required");
      }

      // Create new request
      const newRequest: Request = {
        requestId: `REQ-${Date.now()}`,
        requestType: formData.requestType,
        name: formData.name,
        assetName: formData.assetName === "Custom Asset" ? undefined : formData.assetName,
        customAssetName: formData.assetName === "Custom Asset" ? formData.customAssetName : undefined,
        description: formData.description,
        quantity: formData.quantity,
        mode: "CARD_AND_PIN",
        createdBy: formData.createdBy,
        createdOn: new Date().toISOString(),
        status: "PENDING",
        userId: session?.userId || "admin"
      };

      // Add to existing requests
      const updatedRequests = [...requests, newRequest];
      saveRequests(updatedRequests);

      setSuccess("Request added successfully!");
      setShowAddModal(false);
      resetAddForm();
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add request';
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAddForm = () => {
    setFormData({
      requestType: "GEN_FUEL",
      name: "",
      assetName: "",
      customAssetName: "",
      description: "",
      quantity: "",
      createdBy: "Admin"
    });
    setFormError(null);
  };

  const handleInputChange = (field: keyof CreateFuelWaterRequestData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };



  const handleApproveRequest = (requestId: string) => {
    const updatedRequests = requests.map(req => 
      req.requestId === requestId 
        ? { 
            ...req, 
            status: "APPROVED" as const,
            approvedBy: session?.fullName || "Admin",
            approvedOn: new Date().toISOString(),
            adminComment: adminComment || "Request approved"
          }
        : req
    );
    saveRequests(updatedRequests);
    setAdminComment("");
    setShowDetails(false);
  };

  const handleRejectRequest = (requestId: string) => {
    if (!adminComment.trim()) {
      alert("Comment is required when rejecting a request");
      return;
    }

    const updatedRequests = requests.map(req => 
      req.requestId === requestId 
        ? { 
            ...req, 
            status: "DENIED" as const,
            approvedBy: session?.fullName || "Admin",
            approvedOn: new Date().toISOString(),
            adminComment: adminComment
          }
        : req
    );
    saveRequests(updatedRequests);
    setAdminComment("");
    setShowDetails(false);
  };

  const handleAttentionNeeded = (requestId: string) => {
    if (!adminComment.trim()) {
      alert("Comment is required when marking for attention");
      return;
    }

    const updatedRequests = requests.map(req => 
      req.requestId === requestId 
        ? { 
            ...req, 
            status: "ATTENTION_NEEDED" as const,
            approvedBy: session?.fullName || "Admin",
            approvedOn: new Date().toISOString(),
            adminComment: adminComment
          }
        : req
    );
    saveRequests(updatedRequests);
    setAdminComment("");
    setShowDetails(false);
  };

  const getFilteredRequests = () => {
    if (activeFilter === "all") return requests;
    if (activeFilter === "FUEL") return requests.filter(r => r.requestType === "FUEL");
    if (activeFilter === "PENDING") return requests.filter(r => r.status === "PENDING");
    if (activeFilter === "APPROVED") return requests.filter(r => r.status === "APPROVED");
    return requests;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case "APPROVED":
        return <Badge variant="outline" className="text-green-600 border-green-600">Approved</Badge>;
      case "DENIED":
        return <Badge variant="outline" className="text-red-600 border-red-600">Denied</Badge>;
      case "ATTENTION_NEEDED":
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Attention Needed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };



  return (
    <div className="space-y-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">✅ {success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Requests - Admin Review</h1>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Request
          </Button>
        </div>
        <p className="text-muted-foreground">
          Review and approve fuel and water requests submitted by colleagues
        </p>
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ClipboardList className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">Admin Review Portal</h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Requests are submitted by colleagues through the Colleague Requester portal. 
                  Review each request and take appropriate action: approve, reject, or mark for attention.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incoming Requests ({requests.length})</CardTitle>
          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="FUEL">Fuel Requests</TabsTrigger>
              <TabsTrigger value="PENDING">Pending</TabsTrigger>
              <TabsTrigger value="APPROVED">Approved</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Request Type</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredRequests().length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    <div className="space-y-2">
                      <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto" />
                      <h3 className="text-lg font-medium">No requests found</h3>
                      <p>Requests will appear here when submitted by colleagues through the Colleague Requester portal.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                getFilteredRequests().map((request) => (
                  <TableRow key={request.requestId}>
                    <TableCell className="font-mono text-sm">{request.requestId}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.requestType}</TableCell>
                    <TableCell>{request.assetName || request.customAssetName || "-"}</TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell>{request.createdBy}</TableCell>
                    <TableCell>{new Date(request.createdOn).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Request Details Modal - Admin View Only */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl rounded-xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold">Request Details - Review & Approval</DialogTitle>
            <p className="text-sm text-muted-foreground">Review request information and take action</p>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedRequest.requestType === 'FUEL' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedRequest.requestType}
                </span>
                {getStatusBadge(selectedRequest.status)}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Request Information</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-gray-500">Request ID</Label>
                        <p className="font-mono text-sm">{selectedRequest.requestId}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Request Name</Label>
                        <p className="font-semibold text-lg">{selectedRequest.name}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Asset Name</Label>
                        <p className="font-medium">{selectedRequest.assetName || selectedRequest.customAssetName || "-"}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Quantity / Volume</Label>
                        <p className="font-semibold text-blue-600 text-lg">{selectedRequest.quantity}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Submission Details</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-gray-500">Mode</Label>
                        <p className="font-medium">{selectedRequest.mode}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Created By</Label>
                        <p className="font-medium">{selectedRequest.createdBy}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Created On</Label>
                        <p className="text-sm">{new Date(selectedRequest.createdOn).toLocaleString()}</p>
                      </div>
                      {selectedRequest.approvedBy && (
                        <>
                          <div>
                            <Label className="text-xs text-gray-500">Approved/Rejected By</Label>
                            <p className="font-medium">{selectedRequest.approvedBy}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Decision Date</Label>
                            <p className="text-sm">{selectedRequest.approvedOn ? new Date(selectedRequest.approvedOn).toLocaleString() : "-"}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedRequest.description && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <Label className="text-xs text-blue-600 font-medium">Description / Reason</Label>
                  <p className="text-sm text-blue-800 mt-2 leading-relaxed">{selectedRequest.description}</p>
                </div>
              )}

              {selectedRequest.adminComment && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <Label className="text-xs text-orange-600 font-medium">Previous Admin Comment</Label>
                  <p className="text-sm text-orange-800 mt-2 leading-relaxed">{selectedRequest.adminComment}</p>
                </div>
              )}

              {selectedRequest.status === "PENDING" && (
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Admin Actions</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Admin Comment</Label>
                      <Textarea
                        className="mt-2"
                        value={adminComment}
                        onChange={(e) => setAdminComment(e.target.value)}
                        placeholder="Add a comment (optional for approval, required for rejection/attention)"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button 
                        onClick={() => handleApproveRequest(selectedRequest.requestId)}
                        className="bg-green-600 hover:bg-green-700 flex-1"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve Request
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleRejectRequest(selectedRequest.requestId)}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject Request
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleAttentionNeeded(selectedRequest.requestId)}
                        className="border-orange-600 text-orange-600 hover:bg-orange-50 flex-1"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Needs Attention
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Request Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Request
            </DialogTitle>
          </DialogHeader>

          {formError && (
            <Alert variant="destructive">
              <AlertDescription>❌ {formError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAddRequest} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Request Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fuel className="h-5 w-5" />
                    Request Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestType">Request Type *</Label>
                    <Select 
                      value={formData.requestType} 
                      onValueChange={(value) => handleInputChange('requestType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectContent>
                        {requestTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter requester name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assetName">Asset Name</Label>
                    <Select 
                      value={formData.assetName} 
                      onValueChange={(value) => handleInputChange('assetName', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent>
                        {assetOptions.map((asset) => (
                          <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.assetName === "Custom Asset" && (
                    <div className="space-y-2">
                      <Label htmlFor="customAssetName">Custom Asset Name *</Label>
                      <Input
                        id="customAssetName"
                        placeholder="Enter custom asset name"
                        value={formData.customAssetName}
                        onChange={(e) => handleInputChange('customAssetName', e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity / Volume *</Label>
                    <Input
                      id="quantity"
                      placeholder="e.g., 100 liters, 50 gallons"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="createdBy">Created By *</Label>
                    <Select 
                      value={formData.createdBy} 
                      onValueChange={(value) => handleInputChange('createdBy', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {createdByOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description / Reason</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide additional details about the request..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Mode</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium">Card & PIN</p>
                      <p className="text-xs text-muted-foreground">Default payment method</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowAddModal(false);
                  resetAddForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Adding Request...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Add Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Requests;