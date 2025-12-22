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
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Calendar,
  MapPin,
  Save,
  Upload,
  FileText,
} from "lucide-react";

const mockWorkOrders = [
  {
    id: "WO-2024-0342",
    title: "HVAC Maintenance - Floor 3",
    location: "Accra Main Branch",
    priority: "high",
    status: "in_progress",
    dueDate: "2025-03-20",
    slaStatus: "on_track",
    estimatedHours: 4,
    actualHours: 2.5,
    progress: 65,
    description:
      "Routine maintenance of HVAC unit on floor 3 including filter replacement and system check.",
    createdAt: "2025-03-15",
    assignee: "John Mensah",
    customerContact: "Sarah Johnson",
    customerPhone: "+233 24 123 4567",
  },
  {
    id: "WO-2024-0341",
    title: "Generator Oil Change",
    location: "Kumasi Branch",
    priority: "medium",
    status: "assigned",
    dueDate: "2025-03-22",
    slaStatus: "on_track",
    estimatedHours: 2,
    actualHours: 0,
    progress: 0,
    description: "Scheduled oil change for backup generator system.",
    createdAt: "2025-03-16",
    assignee: "Electrical Services Ltd",
    customerContact: "Michael Brown",
    customerPhone: "+233 24 234 5678",
  },
  {
    id: "WO-2024-0339",
    title: "Elevator Inspection",
    location: "Accra Main Branch",
    priority: "low",
    status: "completed",
    dueDate: "2025-03-18",
    slaStatus: "met",
    estimatedHours: 3,
    actualHours: 2.8,
    progress: 100,
    description: "Annual elevator safety inspection and maintenance.",
    createdAt: "2025-03-10",
    assignee: "Building Services Co",
    customerContact: "David Wilson",
    customerPhone: "+233 24 345 6789",
  },
];

const VendorWorkOrderDetails = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();
  const { workOrderId } = useParams();

  // Modal states
  const [updateProgressOpen, setUpdateProgressOpen] = useState(false);
  const [uploadDocumentOpen, setUploadDocumentOpen] = useState(false);

  // Form states
  const [progressEntry, setProgressEntry] = useState({
    hours: "",
    notes: "",
    status: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const workOrder = useMemo(
    () => mockWorkOrders.find((wo) => wo.id === workOrderId),
    [workOrderId]
  );

  const statusOptions = [
    { value: "assigned", label: "Assigned" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "on_hold", label: "On Hold" },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      assigned: { variant: "outline", label: "Assigned" },
      in_progress: { variant: "default", label: "In Progress" },
      completed: { variant: "secondary", label: "Completed" },
      on_hold: { variant: "destructive", label: "On Hold" },
    };
    const config = variants[status] || variants.assigned;
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
      on_track: { className: "bg-green-100 text-green-800", label: "On Track" },
      at_risk: { className: "bg-yellow-100 text-yellow-800", label: "At Risk" },
      met: { className: "bg-green-100 text-green-800", label: "SLA Met" },
      missed: { className: "bg-red-100 text-red-800", label: "SLA Missed" },
    };
    const config = variants[slaStatus] || variants.on_track;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleUpdateProgress = () => {
    if (!progressEntry.hours || !progressEntry.notes || !progressEntry.status) {
      setError("Please fill in all fields");
      return;
    }

    setSuccess(
      `Progress updated: ${progressEntry.hours} hours - Status: ${
        statusOptions.find((s) => s.value === progressEntry.status)?.label
      }`
    );
    setUpdateProgressOpen(false);
    setProgressEntry({ hours: "", notes: "", status: "" });
    setError("");

    setTimeout(() => setSuccess(""), 3000);
  };

  const handleUploadDocument = () => {
    setSuccess("Document uploaded successfully");
    setUploadDocumentOpen(false);
    setError("");

    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-icon-brand text-white flex items-center justify-center">
            <Clock className="h-5 w-5" />
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
                  <div className="flex gap-2">
                    {getPriorityBadge(workOrder.priority)}
                    {getStatusBadge(workOrder.status)}
                    {getSlaBadge(workOrder.slaStatus)}
                  </div>
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

            {/* Customer Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Contact Person
                  </p>
                  <p className="text-lg font-semibold">
                    {workOrder.customerContact}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-lg font-semibold">
                    {workOrder.customerPhone}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Update Progress Modal */}
                <Dialog
                  open={updateProgressOpen}
                  onOpenChange={setUpdateProgressOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="h-4 w-4 mr-2" />
                      Update Progress
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Work Order Progress</DialogTitle>
                      <DialogDescription>
                        Record progress and update status for this work order.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={progressEntry.status}
                          onValueChange={(value) =>
                            setProgressEntry((prev) => ({
                              ...prev,
                              status: value,
                            }))
                          }
                        >
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
                      <div className="space-y-2">
                        <Label htmlFor="hours">Hours Worked</Label>
                        <Input
                          id="hours"
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder="e.g., 2.5"
                          value={progressEntry.hours}
                          onChange={(e) =>
                            setProgressEntry((prev) => ({
                              ...prev,
                              hours: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Progress Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Describe the work completed..."
                          value={progressEntry.notes}
                          onChange={(e) =>
                            setProgressEntry((prev) => ({
                              ...prev,
                              notes: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setUpdateProgressOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateProgress}>
                        <Save className="h-4 w-4 mr-2" />
                        Update Progress
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Upload Document Modal */}
                <Dialog
                  open={uploadDocumentOpen}
                  onOpenChange={setUploadDocumentOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Work Order Document</DialogTitle>
                      <DialogDescription>
                        Upload photos, receipts, or completion certificates.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="document-type">Document Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="photo">Photo</SelectItem>
                            <SelectItem value="receipt">Receipt</SelectItem>
                            <SelectItem value="certificate">
                              Completion Certificate
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="file-upload">File</Label>
                        <Input
                          id="file-upload"
                          type="file"
                          accept="image/*,.pdf"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setUploadDocumentOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleUploadDocument}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Work Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Priority</span>
                  {getPriorityBadge(workOrder.priority)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  {getStatusBadge(workOrder.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SLA Status</span>
                  {getSlaBadge(workOrder.slaStatus)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Progress</span>
                  <span className="text-sm font-medium">
                    {workOrder.progress}%
                  </span>
                </div>
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
                onClick={() => navigate("/vendor/work-orders")}
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

export default VendorWorkOrderDetails;
