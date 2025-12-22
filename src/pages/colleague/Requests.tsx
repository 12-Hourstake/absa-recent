import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Eye, Trash2, ClipboardList, Clock, CheckCircle, XCircle } from "lucide-react";

interface Request {
  requestId: string;
  requestType: string;
  name: string;
  assetName: string;
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

const Requests = () => {
  const { session } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [assets, setAssets] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    assetName: "",
    customAsset: "",
    description: "",
    quantity: "",
    createdBy: "",
    customCreatedBy: "",
  });

  useEffect(() => {
    loadRequests();
    loadAssets();
  }, []);

  const loadRequests = () => {
    const cached = localStorage.getItem("REQUESTS_CACHE_V1");
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
        localStorage.setItem("REQUESTS_CACHE_V1", JSON.stringify(allRequests));
      }
      
      const userRequests = allRequests.filter((req: Request) => req.userId === session?.userId);
      setRequests(userRequests);
    }
  };

  const loadAssets = () => {
    const cached = localStorage.getItem("ASSETS_CACHE_V1");
    if (cached) {
      setAssets(JSON.parse(cached));
    }
  };

  const handleCreateRequest = () => {
    if (!session) return;

    const newRequest: Request = {
      requestId: `REQ-${Date.now()}`,
      requestType: "FUEL",
      name: formData.name,
      assetName: formData.assetName === "other" ? formData.customAsset : formData.assetName,
      description: formData.description,
      quantity: formData.quantity,
      mode: "Card and PIN",
      createdBy: formData.createdBy === "other" ? formData.customCreatedBy : formData.createdBy,
      createdOn: new Date().toISOString(),
      status: "PENDING",
      userId: session.userId,
    };

    const cached = localStorage.getItem("REQUESTS_CACHE_V1");
    const allRequests = cached ? JSON.parse(cached) : [];
    const updatedRequests = [...allRequests, newRequest];
    
    localStorage.setItem("REQUESTS_CACHE_V1", JSON.stringify(updatedRequests));
    setRequests([...requests, newRequest]);
    
    // Reset form
    setFormData({
      name: "",
      assetName: "",
      customAsset: "",
      description: "",
      quantity: "",
      createdBy: "",
      customCreatedBy: "",
    });
    setShowCreateModal(false);
  };

  const handleDeleteRequest = (requestId: string) => {
    const cached = localStorage.getItem("REQUESTS_CACHE_V1");
    if (cached) {
      const allRequests = JSON.parse(cached);
      const updatedRequests = allRequests.filter((req: Request) => req.requestId !== requestId);
      localStorage.setItem("REQUESTS_CACHE_V1", JSON.stringify(updatedRequests));
      setRequests(requests.filter(req => req.id !== requestId));
    }
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

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "PENDING").length,
    approved: requests.filter(r => r.status === "APPROVED").length,
    denied: requests.filter(r => r.status === "DENIED").length,
    attention: requests.filter(r => r.status === "ATTENTION_NEEDED").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Requests</h1>
          <p className="text-gray-600">Create and manage your maintenance requests</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-xl">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="text-xl font-bold">Create New Request</DialogTitle>
              <p className="text-sm text-muted-foreground">Submit a new maintenance request for approval</p>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Request Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Request Type</Label>
                    <div className="mt-1">
                      <span className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">FUEL</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">
                      <span className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium">PENDING</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="text-sm font-medium">Request Name *</Label>
                  <Input
                    className="mt-1 font-semibold"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter descriptive request name"
                    required
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Asset Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Asset Name</Label>
                    <Select value={formData.assetName} onValueChange={(value) => setFormData({...formData, assetName: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent>
                        {assets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.name}>{asset.name}</SelectItem>
                        ))}
                        <SelectItem value="other">Other / Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.assetName === "other" && (
                      <Input
                        className="mt-2"
                        placeholder="Enter custom asset name"
                        value={formData.customAsset}
                        onChange={(e) => setFormData({...formData, customAsset: e.target.value})}
                      />
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Quantity / Volume *</Label>
                    <Input
                      className="mt-1 font-semibold"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      placeholder="e.g., 500 Litres"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="text-sm font-medium">Description / Reason</Label>
                  <Textarea
                    className="mt-1"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Optional: Explain why this request is needed"
                    rows={3}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-4">Approval Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-blue-600">Mode</Label>
                    <p className="font-medium text-blue-800">Card and PIN</p>
                  </div>
                  <div>
                    <Label className="text-xs text-blue-600">Created By</Label>
                    <Select value={formData.createdBy} onValueChange={(value) => setFormData({...formData, createdBy: value})}>
                      <SelectTrigger className="mt-1 bg-white">
                        <SelectValue placeholder="Select creator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Facility Manager">Facility Manager</SelectItem>
                        <SelectItem value="Head of Facilities Manager">Head of Facilities Manager</SelectItem>
                        <SelectItem value="other">Other / Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.createdBy === "other" && (
                      <Input
                        className="mt-2 bg-white"
                        placeholder="Enter custom creator"
                        value={formData.customCreatedBy}
                        onChange={(e) => setFormData({...formData, customCreatedBy: e.target.value})}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateRequest} 
                  disabled={!formData.name || !formData.quantity}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denied</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.denied}</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No requests yet. Create your first request to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Request Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.requestId}>
                    <TableCell className="font-mono text-sm">{request.requestId}</TableCell>
                    <TableCell>{request.requestType}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.assetName}</TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell>{request.mode}</TableCell>
                    <TableCell>{new Date(request.createdOn).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowViewModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === "PENDING" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRequest(request.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Request Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl rounded-xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold">Request Details</DialogTitle>
            <p className="text-sm text-muted-foreground">View complete request information</p>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">General Information</h3>
                    <div className="space-y-2">
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
                        <p className="font-medium">{selectedRequest.assetName}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Quantity / Volume</Label>
                        <p className="font-semibold text-blue-600">{selectedRequest.quantity}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Metadata</h3>
                    <div className="space-y-2">
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
                            <Label className="text-xs text-gray-500">Approved By</Label>
                            <p className="font-medium">{selectedRequest.approvedBy}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Approved On</Label>
                            <p className="text-sm">{new Date(selectedRequest.approvedOn!).toLocaleString()}</p>
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
                  <p className="text-sm text-blue-800 mt-1">{selectedRequest.description}</p>
                </div>
              )}
              
              {selectedRequest.adminComment && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <Label className="text-xs text-orange-600 font-medium">Admin Comment</Label>
                  <p className="text-sm text-orange-800 mt-1">{selectedRequest.adminComment}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Requests;