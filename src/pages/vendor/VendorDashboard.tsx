import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProgressClass } from "@/lib/progress-utils";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FileText,
  Wrench,
  Calendar,
  DollarSign,
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
  },
];

const VendorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
      cancelled: { variant: "destructive", label: "Cancelled" },
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
      on_track: {
        className: "bg-success text-success-foreground",
        label: "On Track",
      },
      at_risk: {
        className: "bg-warning text-warning-foreground",
        label: "At Risk",
      },
      breached: {
        className: "bg-destructive text-destructive-foreground",
        label: "Breached",
      },
      met: { className: "bg-success text-success-foreground", label: "Met" },
    };
    const config = variants[slaStatus] || variants.on_track;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage work orders and track your performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Work Orders
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">
              {mockWorkOrders.filter((wo) => wo.status !== "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently assigned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed This Month
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">
              {mockWorkOrders.filter((wo) => wo.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              SLA Compliance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">95%</div>
            <Progress value={95} className={`mt-2 ${getProgressClass(95)}`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Performance Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">92</div>
            <p className="text-xs text-success">+3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Assigned Work Orders</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/vendor/work-orders")}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockWorkOrders.map((workOrder) => (
              <div
                key={workOrder.id}
                className="flex items-start gap-4 p-4 rounded-lg border"
              >
                <div className="mt-1">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">
                          {workOrder.id}
                        </span>
                        {getStatusBadge(workOrder.status)}
                        {getPriorityBadge(workOrder.priority)}
                        {getSlaBadge(workOrder.slaStatus)}
                      </div>
                      <h4 className="font-medium">{workOrder.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {workOrder.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {workOrder.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Est: {workOrder.estimatedHours}h</span>
                    </div>
                    {workOrder.actualHours > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Actual: {workOrder.actualHours}h</span>
                      </div>
                    )}
                  </div>

                  {workOrder.status === "in_progress" && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {workOrder.progress}%
                        </span>
                      </div>
                      <Progress 
                        value={workOrder.progress} 
                        className={`h-2 ${getProgressClass(workOrder.progress)}`}
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {workOrder.status === "assigned" && (
                      <Button size="sm">Start Work</Button>
                    )}
                    {workOrder.status === "in_progress" && (
                      <>
                        <Button size="sm" variant="outline">
                          Update Progress
                        </Button>
                        <Button size="sm">Complete</Button>
                      </>
                    )}
                    {workOrder.status === "completed" && (
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate("/vendor/reports")}
        >
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Response Time</span>
                <span className="text-sm text-muted-foreground">2.3 hours</span>
              </div>
              <Progress value={85} className={getProgressClass(85)} />

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm text-muted-foreground">98%</span>
              </div>
              <Progress value={98} className={getProgressClass(98)} />

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Customer Satisfaction
                </span>
                <span className="text-sm text-muted-foreground">4.8/5</span>
              </div>
              <Progress value={96} className={getProgressClass(96)} />
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate("/vendor/contracts")}
        >
          <CardHeader>
            <CardTitle>Contract Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Contract Value</span>
                <span className="text-sm font-medium">GH₵ 245,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Contract Period</span>
                <span className="text-sm text-muted-foreground">
                  Jan 2024 - Dec 2024
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Renewal Date</span>
                <span className="text-sm text-muted-foreground">
                  Dec 31, 2024
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">SLA Target</span>
                <span className="text-sm text-success">95%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => navigate("/vendor/work-orders")}
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">View All Work Orders</p>
                <p className="text-sm text-muted-foreground">
                  Complete work order list
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => navigate("/vendor/contracts")}
            >
              <div className="h-10 w-10 rounded-lg bg-[#F5E6D3] flex items-center justify-center">
                <FileText className="h-5 w-5 text-[#AF144B]" />
              </div>
              <div>
                <p className="font-medium">Contract Details</p>
                <p className="text-sm text-muted-foreground">
                  View contract terms
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => navigate("/vendor/reports")}
            >
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium">Performance Report</p>
                <p className="text-sm text-muted-foreground">
                  View detailed metrics
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tools Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tools & Utilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => navigate("/vendor/tools")}
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Vendor Tools</p>
                <p className="text-sm text-muted-foreground">
                  Time tracking, cost calculator, and more
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => navigate("/vendor/work-orders")}
            >
              <div className="h-10 w-10 rounded-lg bg-[#F5E6D3] flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-[#AF144B]" />
              </div>
              <div>
                <p className="font-medium">Work Order Management</p>
                <p className="text-sm text-muted-foreground">
                  Manage and track all work orders
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDashboard;
