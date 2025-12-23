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
  AlertTriangle,
  DollarSign,
  Clock,
  FileText,
} from "lucide-react";

const mockPenalties = [
  {
    id: "PEN-2024-001",
    workOrderId: "WO-2024-0335",
    slaType: "Response Time",
    breachDuration: "4.5 hrs",
    penaltyAmount: 750,
    status: "Pending Payment",
    invoiceReference: "-",
    breachDate: "2025-03-10",
  },
  {
    id: "PEN-2024-002",
    workOrderId: "WO-2024-0328",
    slaType: "Completion Time",
    breachDuration: "2.0 hrs",
    penaltyAmount: 500,
    status: "Paid",
    invoiceReference: "INV-2024-045",
    breachDate: "2025-03-05",
  },
  {
    id: "PEN-2024-003",
    workOrderId: "WO-2024-0320",
    slaType: "Response Time",
    breachDuration: "6.0 hrs",
    penaltyAmount: 1000,
    status: "Pending Payment",
    penaltyAmount: 1000,
    invoiceReference: "-",
    breachDate: "2025-02-28",
  },
];

const VendorSLAPenalties = () => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      "Pending Payment": { className: "bg-red-100 text-red-800", label: "Pending Payment" },
      "Paid": { className: "bg-green-100 text-green-800", label: "Paid" },
      "Disputed": { className: "bg-yellow-100 text-yellow-800", label: "Disputed" },
    };
    const config = variants[status] || variants["Pending Payment"];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const totalPenalties = mockPenalties.reduce((sum, penalty) => sum + penalty.penaltyAmount, 0);
  const pendingPenalties = mockPenalties
    .filter(p => p.status === "Pending Payment")
    .reduce((sum, penalty) => sum + penalty.penaltyAmount, 0);
  const paidPenalties = mockPenalties
    .filter(p => p.status === "Paid")
    .reduce((sum, penalty) => sum + penalty.penaltyAmount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">SLA Penalties</h1>
        <p className="text-muted-foreground">
          View your SLA penalty history and payment status
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penalties</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#870A3C]">
              GH₵ {totalPenalties.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time penalties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              GH₵ {pendingPenalties.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Outstanding amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Penalties</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              GH₵ {paidPenalties.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Settled penalties</p>
          </CardContent>
        </Card>
      </div>

      {/* Penalties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Penalty History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Penalty ID</TableHead>
                  <TableHead>Work Order ID</TableHead>
                  <TableHead>SLA Type</TableHead>
                  <TableHead>Breach Duration</TableHead>
                  <TableHead>Penalty Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invoice Reference</TableHead>
                  <TableHead>Breach Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPenalties.map((penalty) => (
                  <TableRow key={penalty.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">{penalty.id}</TableCell>
                    <TableCell className="font-mono text-sm">{penalty.workOrderId}</TableCell>
                    <TableCell>{penalty.slaType}</TableCell>
                    <TableCell>{penalty.breachDuration}</TableCell>
                    <TableCell className="font-medium">
                      GH₵ {penalty.penaltyAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(penalty.status)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {penalty.invoiceReference || "-"}
                    </TableCell>
                    <TableCell>{penalty.breachDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {mockPenalties.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No SLA Penalties</h3>
              <p className="text-sm text-muted-foreground">
                Great job! You don't have any SLA penalties.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <AlertTriangle className="h-5 w-5" />
            SLA Penalty Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• SLA penalties are automatically calculated based on response and completion time breaches</p>
            <p>• Penalties will be deducted from your next invoice payment</p>
            <p>• For questions about penalties, please contact support</p>
            <p>• Maintain good performance to avoid future penalties</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorSLAPenalties;