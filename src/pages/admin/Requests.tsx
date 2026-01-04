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
  workOrderId?: string;
  invoice?: {
    id: string;
    vendorId: string;
    workOrderId: string;
    invoiceNumber: string;
    amount: number;
    invoiceDate: string;
    notes: string;
    fileName: string;
    status: "Pending" | "Approved" | "Rejected" | "Paid";
    submittedDate: string;
    createdDate: string;
  };
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
    createdBy: session?.fullName || "Admin"
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
      createdBy: session?.fullName || "Admin"
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

  const handlePayInvoice = (requestId: string) => {
    const updatedRequests = requests.map(req => {
      if (req.requestId === requestId && req.invoice) {
        const updatedInvoice = { ...req.invoice, status: "Paid" as const };
        
        // Update invoice in vendor cache
        const invoicesCache = JSON.parse(localStorage.getItem("INVOICES_CACHE_V1") || "[]");
        const updatedInvoicesCache = invoicesCache.map((inv: any) => 
          inv.id === req.invoice?.id ? updatedInvoice : inv
        );
        localStorage.setItem("INVOICES_CACHE_V1", JSON.stringify(updatedInvoicesCache));
        
        return { ...req, invoice: updatedInvoice };
      }
      return req;
    });
    saveRequests(updatedRequests);
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
    if (activeFilter === "GEN_FUEL") return requests.filter(r => r.requestType === "GEN_FUEL");
    if (activeFilter === "CAR_FUEL") return requests.filter(r => r.requestType === "CAR_FUEL");
    if (activeFilter === "WATER") return requests.filter(r => r.requestType === "WATER");
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
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6 min-w-0">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">✅ {success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate">Requests - Admin Review</h1>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="gap-2 w-full sm:w-auto flex-shrink-0">
            <Plus className="h-4 w-4" />
            <span className="truncate">Add Request</span>
          </Button>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm lg:text-base truncate">
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

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm lg:text-base truncate">Incoming Requests ({requests.length})</CardTitle>
          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
              <TabsTrigger value="GEN_FUEL" className="text-xs sm:text-sm">Gen Fuel</TabsTrigger>
              <TabsTrigger value="CAR_FUEL" className="text-xs sm:text-sm">Car Fuel</TabsTrigger>
              <TabsTrigger value="WATER" className="text-xs sm:text-sm">Water</TabsTrigger>
              <TabsTrigger value="PENDING" className="text-xs sm:text-sm">Pending</TabsTrigger>
              <TabsTrigger value="APPROVED" className="text-xs sm:text-sm">Approved</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0 w-full">
          {/* Desktop Table View */}
          <div className="hidden lg:block w-full">
            <div className="w-full overflow-x-auto">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[12%] min-w-[100px] text-xs">Request ID</TableHead>
                    <TableHead className="w-[12%] min-w-[100px] text-xs">Name</TableHead>
                    <TableHead className="w-[12%] min-w-[100px] text-xs">Request Type</TableHead>
                    <TableHead className="w-[12%] min-w-[100px] text-xs">Asset Name</TableHead>
                    <TableHead className="w-[10%] min-w-[80px] text-xs">Quantity</TableHead>
                    <TableHead className="w-[12%] min-w-[100px] text-xs">Created By</TableHead>
                    <TableHead className="w-[12%] min-w-[100px] text-xs">Created On</TableHead>
                    <TableHead className="w-[10%] min-w-[80px] text-xs">Status</TableHead>
                    <TableHead className="w-[10%] min-w-[80px] text-xs">Invoice</TableHead>
                    <TableHead className="w-[8%] min-w-[80px] text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredRequests().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        <div className="space-y-2">
                          <ClipboardList className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto" />
                          <h3 className="text-base sm:text-lg font-medium">No requests found</h3>
                          <p className="text-sm break-words">Requests will appear here when submitted by colleagues through the Colleague Requester portal.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    getFilteredRequests().map((request) => (
                      <TableRow key={request.requestId}>
                        <TableCell className="font-mono text-xs truncate" title={request.requestId}>{request.requestId}</TableCell>
                        <TableCell className="text-xs truncate" title={request.name}>{request.name}</TableCell>
                        <TableCell className="text-xs truncate">{request.requestType}</TableCell>
                        <TableCell className="text-xs truncate" title={request.assetName || request.customAssetName || "-"}>{request.assetName || request.customAssetName || "-"}</TableCell>
                        <TableCell className="text-xs truncate">{request.quantity}</TableCell>
                        <TableCell className="text-xs truncate" title={request.createdBy}>{request.createdBy}</TableCell>
                        <TableCell className="text-xs truncate">{new Date(request.createdOn).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {request.invoice ? (
                            <Badge className={`text-xs ${
                              request.invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                              request.invoice.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.invoice.status}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">No Invoice</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDetails(true);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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
            {getFilteredRequests().length === 0 ? (
              <div className="text-center py-6 text-muted-foreground px-3">
                <ClipboardList className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-base font-medium">No requests found</h3>
                <p className="text-sm break-words">Requests will appear here when submitted by colleagues through the Colleague Requester portal.</p>
              </div>
            ) : (
              <div className="divide-y w-full">
                {getFilteredRequests().map((request) => (
                  <div key={request.requestId} className="p-3 space-y-3 w-full min-w-0">
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm sm:text-base break-words">{request.requestId}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{request.name}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetails(true);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm w-full">
                      <div className="min-w-0">
                        <span className="text-muted-foreground block">Type:</span>
                        <p className="break-words mt-1">{request.requestType}</p>
                      </div>
                      <div className="min-w-0">
                        <span className="text-muted-foreground block">Asset:</span>
                        <p className="break-words mt-1">{request.assetName || request.customAssetName || "-"}</p>
                      </div>
                      <div className="min-w-0">
                        <span className="text-muted-foreground block">Quantity:</span>
                        <p className="break-words mt-1">{request.quantity}</p>
                      </div>
                      <div className="min-w-0">
                        <span className="text-muted-foreground block">Status:</span>
                        <div className="mt-1">
                          {getStatusBadge(request.status)}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <span className="text-muted-foreground block">Created By:</span>
                        <p className="text-xs mt-1 break-words">{request.createdBy}</p>
                      </div>
                      <div className="min-w-0">
                        <span className="text-muted-foreground block">Created On:</span>
                        <p className="text-xs mt-1 break-words">{new Date(request.createdOn).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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

              {selectedRequest.invoice && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-xs text-green-600 font-medium">Invoice Submitted</Label>
                    <Badge className={`${
                      selectedRequest.invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                      selectedRequest.invoice.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedRequest.invoice.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-600 font-medium">Invoice #:</span>
                      <p className="text-green-800">{selectedRequest.invoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Amount:</span>
                      <p className="text-green-800 font-semibold">GHS {selectedRequest.invoice.amount?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Invoice Date:</span>
                      <p className="text-green-800">{selectedRequest.invoice.invoiceDate}</p>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Submitted:</span>
                      <p className="text-green-800">{selectedRequest.invoice.submittedDate}</p>
                    </div>
                  </div>
                  {selectedRequest.invoice.notes && (
                    <div className="mt-3">
                      <span className="text-green-600 font-medium text-sm">Notes:</span>
                      <p className="text-green-800 text-sm mt-1">{selectedRequest.invoice.notes}</p>
                    </div>
                  )}
                  {selectedRequest.invoice.files && selectedRequest.invoice.files.length > 0 && (
                    <div className="mt-3">
                      <span className="text-green-600 font-medium text-sm">Attached Files:</span>
                      <div className="mt-2 space-y-1">
                        {selectedRequest.invoice.files.map((file: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-green-800">
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedRequest.invoice.status === 'Pending' && (
                    <div className="mt-4">
                      <Button 
                        onClick={() => handlePayInvoice(selectedRequest.requestId)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark Invoice as Paid
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {selectedRequest.status === "PENDING" && (session?.role === "MAIN_ADMIN" || session?.role === "HEAD_OF_FACILITIES") && (
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
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">Add New Request</span>
            </DialogTitle>
          </DialogHeader>

          {formError && (
            <Alert variant="destructive">
              <AlertDescription>❌ {formError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAddRequest} className="space-y-4 sm:space-y-6 w-full min-w-0">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 w-full">
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
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium">{session?.fullName || "Admin"}</p>
                      <p className="text-xs text-muted-foreground">Auto-detected from logged-in user</p>
                    </div>
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
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4 border-t w-full">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowAddModal(false);
                  resetAddForm();
                }}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto order-1 sm:order-2">
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
    </div>
  );
};

export default Requests;