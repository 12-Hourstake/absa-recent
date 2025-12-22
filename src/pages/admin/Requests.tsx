import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Check, X, ClipboardList, AlertTriangle } from "lucide-react";

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
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [adminComment, setAdminComment] = useState("");

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
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Requests - Admin Review</h1>
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
    </div>
  );
};

export default Requests;