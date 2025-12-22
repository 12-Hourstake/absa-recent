import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DismissibleAlert } from "@/components/ui/dismissible-alert";
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
  ArrowLeft,
  Filter,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useBackButtonText } from "@/hooks/useBackButtonText";
import { getProgressClass } from "@/lib/progress-utils";
import { getWorkOrderStatusBadge, getPriorityBadge, getSLABadge } from "@/lib/badge-utils";

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
  {
    id: "WO-2024-0340",
    title: "Plumbing Repair - Restroom",
    location: "Takoradi Branch",
    priority: "high",
    status: "assigned",
    dueDate: "2025-03-21",
    slaStatus: "at_risk",
    estimatedHours: 3,
    actualHours: 0,
    progress: 0,
  },
];

const VendorWorkOrders = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();
  const [showAtRiskAlert, setShowAtRiskAlert] = useState(true);
  
  // Count work orders at risk or missed SLA
  const atRiskOrders = mockWorkOrders.filter(wo => wo.slaStatus === "at_risk" || wo.slaStatus === "missed").length;


  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all assigned work orders.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backButtonText}
        </Button>
      </div>

      {/* At Risk Work Orders Alert */}
      <DismissibleAlert
        variant="warning"
        show={atRiskOrders > 0 && showAtRiskAlert}
        title={`${atRiskOrders} Work ${atRiskOrders === 1 ? 'Order' : 'Orders'} At Risk`}
        description={`You have ${atRiskOrders} work ${atRiskOrders === 1 ? 'order' : 'orders'} approaching or past SLA deadlines. Please prioritize these to avoid service delays and maintain your performance rating.`}
        onDismiss={() => setShowAtRiskAlert(false)}
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Work Orders
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">{mockWorkOrders.length}</div>
            <p className="text-xs text-muted-foreground">All assigned orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">
              {
                mockWorkOrders.filter((wo) => wo.status === "in_progress")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">
              {mockWorkOrders.filter((wo) => wo.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully finished
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">
              {mockWorkOrders.filter((wo) => wo.slaStatus === "at_risk").length}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Work Order ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SLA Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWorkOrders.map((workOrder) => (
                <TableRow
                  key={workOrder.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    navigate(`/vendor/work-orders/${workOrder.id}`)
                  }
                >
                  <TableCell className="font-medium">{workOrder.id}</TableCell>
                  <TableCell>{workOrder.title}</TableCell>
                  <TableCell>{workOrder.location}</TableCell>
                  <TableCell>{getPriorityBadge(workOrder.priority as any)}</TableCell>
                  <TableCell>{getWorkOrderStatusBadge(workOrder.status as any)}</TableCell>
                  <TableCell>{getSLABadge(workOrder.slaStatus as any)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={workOrder.progress} 
                        className={`w-16 ${getProgressClass(workOrder.progress)}`}
                      />
                      <span className="text-sm">{workOrder.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{workOrder.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorWorkOrders;
