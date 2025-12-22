import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBackButtonText } from "@/hooks/useBackButtonText";
import { getProgressClass } from "@/lib/progress-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  MapPin,
  Save,
} from "lucide-react";

const mockMaintenanceTasks = [
  {
    id: "PM-2024-089",
    title: "HVAC Filter Replacement",
    type: "preventive",
    asset: "HVAC Unit - Floor 3",
    location: "Accra Main Branch",
    frequency: "monthly",
    nextDue: "2025-03-25",
    status: "scheduled",
    priority: "medium",
    assignee: "John Mensah",
    description:
      "Replace air filters and clean HVAC unit components for optimal performance.",
    createdAt: "2025-03-15",
    estimatedHours: 2,
    actualHours: 0,
    progress: 0,
  },
  {
    id: "RM-2024-034",
    title: "Generator Repair",
    type: "reactive",
    asset: "Generator - Backup Power",
    location: "Kumasi Branch",
    frequency: "once",
    nextDue: "2025-03-22",
    status: "in_progress",
    priority: "high",
    assignee: "Electrical Services Ltd",
    description: "Repair generator engine and replace faulty components.",
    createdAt: "2025-03-16",
    estimatedHours: 4,
    actualHours: 2.5,
    progress: 65,
  },
  {
    id: "PM-2024-090",
    title: "Fire System Inspection",
    type: "preventive",
    asset: "Fire Suppression System",
    location: "Takoradi Branch",
    frequency: "quarterly",
    nextDue: "2025-03-28",
    status: "scheduled",
    priority: "high",
    assignee: "Fire Safety Systems",
    description:
      "Quarterly inspection of fire suppression system and safety equipment.",
    createdAt: "2025-03-17",
    estimatedHours: 3,
    actualHours: 0,
    progress: 0,
  },
];

const MaintenanceDetails = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();
  const { maintenanceId } = useParams();

  // Modal states
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [addProgressOpen, setAddProgressOpen] = useState(false);

  // Form states
  const [newStatus, setNewStatus] = useState("");
  const [progressEntry, setProgressEntry] = useState({ hours: "", notes: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const maintenanceTask = useMemo(
    () => mockMaintenanceTasks.find((task) => task.id === maintenanceId),
    [maintenanceId]
  );

  const statusOptions = [
    { value: "scheduled", label: "Scheduled" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "overdue", label: "Overdue" },
  ];

  const getTypeBadge = (type: string) => {
    return type === "preventive" ? (
      <Badge className="bg-primary text-primary-foreground">Preventive</Badge>
    ) : (
      <Badge className="bg-warning text-warning-foreground">Reactive</Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: "default" | "secondary" | "outline" | "destructive";
        label: string;
      }
    > = {
      scheduled: { variant: "outline", label: "Scheduled" },
      in_progress: { variant: "default", label: "In Progress" },
      completed: { variant: "secondary", label: "Completed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
      overdue: { variant: "destructive", label: "Overdue" },
    };
    const config = variants[status] || variants.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      low: { className: "bg-muted text-muted-foreground", label: "Low" },
      medium: { className: "bg-blue-100 text-blue-800", label: "Medium" },
      high: { className: "bg-orange-100 text-orange-800", label: "High" },
      critical: { className: "bg-red-100 text-red-800", label: "Critical" },
    };
    const config = variants[priority] || variants.medium;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

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

    setTimeout(() => setSuccess(""), 3000);
  };

  const handleAddProgress = () => {
    if (!progressEntry.hours || !progressEntry.notes) {
      setError("Please fill in all fields");
      return;
    }

    setSuccess(
      `Progress updated: ${progressEntry.hours} hours - ${progressEntry.notes}`
    );
    setAddProgressOpen(false);
    setProgressEntry({ hours: "", notes: "" });
    setError("");

    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-icon-brand text-white flex items-center justify-center">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Maintenance Details
            </h1>
            <p className="text-muted-foreground">ID: {maintenanceId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> {backButtonText}
          </Button>
          <Button
            onClick={() => navigate(`/admin/maintenance/${maintenanceId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Task
          </Button>
        </div>
      </div>

      {maintenanceTask ? (
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
                  <span>Task Information</span>
                  <div className="flex gap-2">
                    {getTypeBadge(maintenanceTask.type)}
                    {getStatusBadge(maintenanceTask.status)}
                    {getPriorityBadge(maintenanceTask.priority)}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {maintenanceTask.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {maintenanceTask.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{maintenanceTask.asset}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{maintenanceTask.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{maintenanceTask.assignee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Due: {maintenanceTask.nextDue}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {maintenanceTask.progress}%
                    </span>
                  </div>
                  <Progress 
                    value={maintenanceTask.progress} 
                    className={`h-2 ${getProgressClass(maintenanceTask.progress)}`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Actual: {maintenanceTask.actualHours}h</span>
                    <span>Estimated: {maintenanceTask.estimatedHours}h</span>
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
                      <p className="text-sm font-medium">
                        Maintenance task created
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {maintenanceTask.createdAt}
                      </p>
                    </div>
                  </div>
                  {maintenanceTask.status === "in_progress" && (
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
                  {maintenanceTask.status === "completed" && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Task completed</p>
                        <p className="text-xs text-muted-foreground">
                          {maintenanceTask.nextDue}
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
                      <DialogTitle>Update Task Status</DialogTitle>
                      <DialogDescription>
                        Change the current status of this maintenance task.
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
                      <Button onClick={handleUpdateStatus}>
                        <Save className="h-4 w-4 mr-2" />
                        Update Status
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Add Progress Modal */}
                <Dialog
                  open={addProgressOpen}
                  onOpenChange={setAddProgressOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="h-4 w-4 mr-2" />
                      Add Progress
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Progress Update</DialogTitle>
                      <DialogDescription>
                        Record progress made on this maintenance task.
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
                        onClick={() => setAddProgressOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddProgress}>
                        <Save className="h-4 w-4 mr-2" />
                        Add Progress
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Type</span>
                  {getTypeBadge(maintenanceTask.type)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Frequency</span>
                  <span className="text-sm font-medium capitalize">
                    {maintenanceTask.frequency}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Priority</span>
                  {getPriorityBadge(maintenanceTask.priority)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  {getStatusBadge(maintenanceTask.status)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>Maintenance task not found.</p>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/maintenance")}
                className="mt-4"
              >
                Back to Maintenance
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MaintenanceDetails;
