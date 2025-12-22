import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBackButtonText } from "@/hooks/useBackButtonText";
import { getProgressClass } from "@/lib/progress-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Edit,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  User,
  Calendar,
  MapPin,
  Save,
  X,
} from "lucide-react";

const mockWorkOrders = [
  {
    id: "WO-2024-0342",
    title: "HVAC Maintenance - Floor 3",
    location: "Accra Main Branch",
    priority: "high",
    status: "in_progress",
    assignee: "John Mensah",
    dueDate: "2025-03-20",
    slaStatus: "breached",
    description:
      "Routine maintenance of HVAC unit on floor 3 including filter replacement and system check.",
    createdAt: "2025-03-15",
    estimatedHours: 4,
    actualHours: 2.5,
    progress: 65,
  },
  {
    id: "WO-2024-0341",
    title: "Generator Oil Change",
    location: "Kumasi Branch",
    priority: "medium",
    status: "assigned",
    assignee: "Electrical Services Ltd",
    dueDate: "2025-03-22",
    slaStatus: "on_track",
    description: "Scheduled oil change for backup generator system.",
    createdAt: "2025-03-16",
    estimatedHours: 2,
    actualHours: 0,
    progress: 0,
  },
  {
    id: "WO-2024-0340",
    title: "Fire Alarm Testing",
    location: "Takoradi Branch",
    priority: "high",
    status: "new",
    assignee: "Unassigned",
    dueDate: "2025-03-21",
    slaStatus: "on_track",
    description: "Monthly fire alarm system testing and inspection.",
    createdAt: "2025-03-17",
    estimatedHours: 3,
    actualHours: 0,
    progress: 0,
  },
  {
    id: "WO-2024-0339",
    title: "Elevator Inspection",
    location: "Accra Main Branch",
    priority: "low",
    status: "completed",
    assignee: "Building Services Co",
    dueDate: "2025-03-18",
    slaStatus: "met",
    description: "Annual elevator safety inspection and maintenance.",
    createdAt: "2025-03-10",
    estimatedHours: 3,
    actualHours: 2.8,
    progress: 100,
  },
];

const WorkOrderDetails = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();
  const { workOrderId } = useParams();

  // Modal states
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [timeEntryOpen, setTimeEntryOpen] = useState(false);
  const [editWorkOrderOpen, setEditWorkOrderOpen] = useState(false);

  // Form states
  const [newStatus, setNewStatus] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [timeEntry, setTimeEntry] = useState({ hours: "", description: "" });
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "",
    assignee: "",
    dueDate: "",
    location: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const workOrder = useMemo(
    () => mockWorkOrders.find((wo) => wo.id === workOrderId),
    [workOrderId]
  );

  const mockAssignees = [
    "John Mensah",
    "Electrical Services Ltd",
    "Building Services Co",
    "HVAC Solutions",
    "Fire Safety Systems",
    "Unassigned",
  ];

  const statusOptions = [
    { value: "new", label: "New" },
    { value: "assigned", label: "Assigned" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const mockLocations = [
    "Accra Main Branch",
    "Kumasi Branch",
    "Takoradi Branch",
    "Tema Branch",
    "Tamale Branch",
  ];

  // Initialize edit form when work order is loaded
  useMemo(() => {
    if (workOrder) {
      setEditForm({
        title: workOrder.title,
        description: workOrder.description,
        priority: workOrder.priority,
        assignee: workOrder.assignee,
        dueDate: workOrder.dueDate,
        location: workOrder.location,
      });
    }
  }, [workOrder]);

  const handleUpdateStatus = () => {
    if (!newStatus) {
      setError("Please select a status");
      return;
    }

    setSuccess(
      `Status updated to ${
        statusOptions.find((s) => s.value === newStatus)?.label
      }`
    );
    setUpdateStatusOpen(false);
    setNewStatus("");
    setError("");

    // In a real app, this would make an API call
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleReassign = () => {
    if (!newAssignee) {
      setError("Please select an assignee");
      return;
    }

    setSuccess(`Work order reassigned to ${newAssignee}`);
    setReassignOpen(false);
    setNewAssignee("");
    setError("");

    // In a real app, this would make an API call
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleAddTimeEntry = () => {
    if (!timeEntry.hours || !timeEntry.description) {
      setError("Please fill in all fields");
      return;
    }

    setSuccess(
      `Time entry added: ${timeEntry.hours} hours - ${timeEntry.description}`
    );
    setTimeEntryOpen(false);
    setTimeEntry({ hours: "", description: "" });
    setError("");

    // In a real app, this would make an API call
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleEditWorkOrder = () => {
    if (
      !editForm.title ||
      !editForm.description ||
      !editForm.priority ||
      !editForm.assignee ||
      !editForm.dueDate ||
      !editForm.location
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setSuccess("Work order updated successfully");
    setEditWorkOrderOpen(false);
    setError("");

    // In a real app, this would make an API call
    setTimeout(() => setSuccess(""), 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Circle className="h-4 w-4 text-muted-foreground" />;
      case "assigned":
        return <Clock className="h-4 w-4 text-primary" />;
      case "in_progress":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      high: {
        className: "bg-destructive text-destructive-foreground",
        label: "High",
      },
      medium: {
        className: "bg-warning text-warning-foreground",
        label: "Medium",
      },
      low: { className: "bg-muted text-muted-foreground", label: "Low" },
    };
    const config = variants[priority] || variants.low;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getSlaBadge = (slaStatus: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      met: { className: "bg-green-100 text-green-800", label: "SLA Met" },
      on_track: { className: "bg-blue-100 text-blue-800", label: "On Track" },
      at_risk: { className: "bg-yellow-100 text-yellow-800", label: "At Risk" },
      breached: { className: "bg-red-100 text-red-800", label: "SLA Breached" },
    };
    const config = variants[slaStatus] || variants.on_track;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-icon-brand text-white flex items-center justify-center">
            {workOrder && getStatusIcon(workOrder.status)}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Work Order Details
            </h1>
            <p className="text-muted-foreground">ID: {workOrderId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> {backButtonText}
          </Button>
          <Button onClick={() => setEditWorkOrderOpen(true)}>
            <Edit className="h-4 w-4 mr-2" /> Edit Work Order
          </Button>
        </div>
      </div>

      {workOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Success/Error Messages */}
          {success && (
            <div className="lg:col-span-3">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            </div>
          )}
          {error && (
            <div className="lg:col-span-3">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Work Order Information</span>
                  {getPriorityBadge(workOrder.priority)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {workOrder.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {workOrder.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{workOrder.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{workOrder.assignee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Due: {workOrder.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      Created: {workOrder.createdAt}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {workOrder.progress}%
                    </span>
                  </div>
                  <Progress 
                    value={workOrder.progress} 
                    className={`h-2 ${getProgressClass(workOrder.progress)}`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Actual: {workOrder.actualHours}h</span>
                    <span>Estimated: {workOrder.estimatedHours}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Work order created</p>
                      <p className="text-xs text-muted-foreground">
                        {workOrder.createdAt}
                      </p>
                    </div>
                  </div>
                  {workOrder.status === "assigned" && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Assigned to {workOrder.assignee}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2025-03-16
                        </p>
                      </div>
                    </div>
                  )}
                  {workOrder.status === "in_progress" && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Work started</p>
                        <p className="text-xs text-muted-foreground">
                          2025-03-18
                        </p>
                      </div>
                    </div>
                  )}
                  {workOrder.status === "completed" && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Work completed</p>
                        <p className="text-xs text-muted-foreground">
                          {workOrder.dueDate}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Status</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(workOrder.status)}
                    <span className="text-sm font-medium capitalize">
                      {workOrder.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SLA Status</span>
                  {getSlaBadge(workOrder.slaStatus)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Update Status Modal */}
                <Dialog
                  open={updateStatusOpen}
                  onOpenChange={setUpdateStatusOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="h-4 w-4 mr-2" />
                      Update Status
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Work Order Status</DialogTitle>
                      <DialogDescription>
                        Change the current status of this work order.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">New Status</Label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setUpdateStatusOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateStatus} className="bg-red-600 hover:bg-red-700 text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Update Status
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Reassign Modal */}
                <Dialog open={reassignOpen} onOpenChange={setReassignOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Reassign
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reassign Work Order</DialogTitle>
                      <DialogDescription>
                        Assign this work order to a different person or vendor.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="assignee">Assign To</Label>
                        <Select
                          value={newAssignee}
                          onValueChange={setNewAssignee}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockAssignees.map((assignee) => (
                              <SelectItem key={assignee} value={assignee}>
                                {assignee}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setReassignOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleReassign} className="bg-red-600 hover:bg-red-700 text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Reassign
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Add Time Entry Modal */}
                <Dialog open={timeEntryOpen} onOpenChange={setTimeEntryOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="h-4 w-4 mr-2" />
                      Add Time Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Time Entry</DialogTitle>
                      <DialogDescription>
                        Record time spent on this work order.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="hours">Hours Worked</Label>
                        <Input
                          id="hours"
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder="e.g., 2.5"
                          value={timeEntry.hours}
                          onChange={(e) =>
                            setTimeEntry((prev) => ({
                              ...prev,
                              hours: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe the work performed..."
                          value={timeEntry.description}
                          onChange={(e) =>
                            setTimeEntry((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setTimeEntryOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddTimeEntry} className="bg-red-600 hover:bg-red-700 text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Add Entry
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Edit Work Order Modal */}
                <Dialog
                  open={editWorkOrderOpen}
                  onOpenChange={setEditWorkOrderOpen}
                >
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Work Order</DialogTitle>
                      <DialogDescription>
                        Update the details of this work order.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title">Title</Label>
                          <Input
                            id="edit-title"
                            placeholder="Work order title"
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-priority">Priority</Label>
                          <Select
                            value={editForm.priority}
                            onValueChange={(value) =>
                              setEditForm((prev) => ({
                                ...prev,
                                priority: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              {priorityOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          placeholder="Work order description"
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-assignee">Assignee</Label>
                          <Select
                            value={editForm.assignee}
                            onValueChange={(value) =>
                              setEditForm((prev) => ({
                                ...prev,
                                assignee: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockAssignees.map((assignee) => (
                                <SelectItem key={assignee} value={assignee}>
                                  {assignee}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-location">Location</Label>
                          <Select
                            value={editForm.location}
                            onValueChange={(value) =>
                              setEditForm((prev) => ({
                                ...prev,
                                location: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockLocations.map((location) => (
                                <SelectItem key={location} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-due-date">Due Date</Label>
                        <Input
                          id="edit-due-date"
                          type="date"
                          value={editForm.dueDate}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              dueDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setEditWorkOrderOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleEditWorkOrder} className="bg-red-600 hover:bg-red-700 text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>Work order not found.</p>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/work-orders")}
                className="mt-4"
              >
                Back to Work Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkOrderDetails;
