import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Upload,
} from "lucide-react";
import { useState } from "react";

const mockWorkOrders = [
  {
    id: "WO-2024-0342",
    requestType: "Maintenance",
    asset: "HVAC Unit - Floor 3",
    location: "Accra Main Branch",
    priority: "High",
    status: "In Progress",
    assignedDate: "2025-03-15",
    dueDate: "2025-03-20",
    description: "Regular maintenance of HVAC system on floor 3",
  },
  {
    id: "WO-2024-0341",
    requestType: "Fuel",
    asset: "Generator - Kumasi",
    location: "Kumasi Branch",
    priority: "Medium",
    status: "New",
    assignedDate: "2025-03-16",
    dueDate: "2025-03-22",
    description: "Fuel supply for backup generator",
  },
  {
    id: "WO-2024-0340",
    requestType: "Utilities",
    asset: "Plumbing - Restroom",
    location: "Takoradi Branch",
    priority: "High",
    status: "New",
    assignedDate: "2025-03-16",
    dueDate: "2025-03-21",
    description: "Repair leaking pipes in main restroom",
  },
  {
    id: "WO-2024-0339",
    requestType: "Maintenance",
    asset: "Elevator - Main Building",
    location: "Accra Main Branch",
    priority: "Low",
    status: "Completed",
    assignedDate: "2025-03-10",
    dueDate: "2025-03-18",
    description: "Monthly elevator inspection and maintenance",
  },
];

const VendorWorkOrders = () => {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [completionComment, setCompletionComment] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      "New": { variant: "outline", label: "New" },
      "In Progress": { variant: "default", label: "In Progress" },
      "Completed": { variant: "secondary", label: "Completed" },
    };
    const config = variants[status] || variants["New"];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      "Critical": { className: "bg-red-600 text-white", label: "Critical" },
      "High": { className: "bg-red-100 text-red-800", label: "High" },
      "Medium": { className: "bg-yellow-100 text-yellow-800", label: "Medium" },
      "Low": { className: "bg-green-100 text-green-800", label: "Low" },
    };
    const config = variants[priority] || variants["Low"];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleUpdateStatus = () => {
    // Update work order status logic here
    console.log("Updating status to:", newStatus);
    console.log("Comment:", completionComment);
    console.log("Evidence file:", evidenceFile);
    setSelectedWorkOrder(null);
    setNewStatus("");
    setCompletionComment("");
    setEvidenceFile(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
        <p className="text-muted-foreground">
          Manage and track all assigned work orders
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Work Orders</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#870A3C]">{mockWorkOrders.length}</div>
            <p className="text-xs text-muted-foreground">All assigned orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockWorkOrders.filter((wo) => wo.status === "New").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting start</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockWorkOrders.filter((wo) => wo.status === "In Progress").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockWorkOrders.filter((wo) => wo.status === "Completed").length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Order ID</TableHead>
                  <TableHead>Request Type</TableHead>
                  <TableHead>Asset / Location</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockWorkOrders.map((workOrder) => (
                  <TableRow key={workOrder.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">{workOrder.id}</TableCell>
                    <TableCell>{workOrder.requestType}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{workOrder.asset}</div>
                        <div className="text-sm text-muted-foreground">{workOrder.location}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(workOrder.priority)}</TableCell>
                    <TableCell>{getStatusBadge(workOrder.status)}</TableCell>
                    <TableCell>{workOrder.assignedDate}</TableCell>
                    <TableCell>{workOrder.dueDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setSelectedWorkOrder(workOrder)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Work Order Details - {selectedWorkOrder?.id}</DialogTitle>
                            </DialogHeader>
                            {selectedWorkOrder && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Request Type</Label>
                                    <p className="text-sm">{selectedWorkOrder.requestType}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Priority</Label>
                                    <div className="mt-1">{getPriorityBadge(selectedWorkOrder.priority)}</div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Asset</Label>
                                    <p className="text-sm">{selectedWorkOrder.asset}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Location</Label>
                                    <p className="text-sm">{selectedWorkOrder.location}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Assigned Date</Label>
                                    <p className="text-sm">{selectedWorkOrder.assignedDate}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Due Date</Label>
                                    <p className="text-sm">{selectedWorkOrder.dueDate}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Description</Label>
                                  <p className="text-sm mt-1">{selectedWorkOrder.description}</p>
                                </div>
                                
                                {selectedWorkOrder.status !== "Completed" && (
                                  <div className="border-t pt-4 space-y-4">
                                    <h4 className="font-medium">Update Status</h4>
                                    <div className="space-y-3">
                                      <div>
                                        <Label>New Status</Label>
                                        <Select value={newStatus} onValueChange={setNewStatus}>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select new status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {selectedWorkOrder.status === "New" && (
                                              <SelectItem value="In Progress">In Progress</SelectItem>
                                            )}
                                            {selectedWorkOrder.status === "In Progress" && (
                                              <SelectItem value="Completed">Completed</SelectItem>
                                            )}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <div>
                                        <Label>Completion Comment</Label>
                                        <Textarea 
                                          placeholder="Add notes about the work performed..."
                                          value={completionComment}
                                          onChange={(e) => setCompletionComment(e.target.value)}
                                        />
                                      </div>
                                      
                                      <div>
                                        <Label>Upload Evidence (Optional)</Label>
                                        <Input 
                                          type="file" 
                                          accept="image/*,.pdf"
                                          onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
                                        />
                                      </div>
                                      
                                      <Button 
                                        onClick={handleUpdateStatus}
                                        disabled={!newStatus}
                                        className="w-full"
                                      >
                                        Update Status
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {workOrder.status !== "Completed" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                onClick={() => setSelectedWorkOrder(workOrder)}
                              >
                                Update Status
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Update Work Order Status</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Work Order: {workOrder.id}</Label>
                                  <p className="text-sm text-muted-foreground">{workOrder.asset}</p>
                                </div>
                                
                                <div>
                                  <Label>New Status</Label>
                                  <Select value={newStatus} onValueChange={setNewStatus}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select new status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {workOrder.status === "New" && (
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                      )}
                                      {workOrder.status === "In Progress" && (
                                        <SelectItem value="Completed">Completed</SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div>
                                  <Label>Comment</Label>
                                  <Textarea 
                                    placeholder="Add notes about the work..."
                                    value={completionComment}
                                    onChange={(e) => setCompletionComment(e.target.value)}
                                  />
                                </div>
                                
                                <Button 
                                  onClick={handleUpdateStatus}
                                  disabled={!newStatus}
                                  className="w-full"
                                >
                                  Update Status
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {mockWorkOrders.length === 0 && (
            <div className="text-center py-8">
              <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No Work Orders</h3>
              <p className="text-sm text-muted-foreground">You don't have any assigned work orders at the moment.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorWorkOrders;
