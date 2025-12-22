import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Zap,
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBackButtonText } from "@/hooks/useBackButtonText";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const UtilityReports = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();

  const electricityData = [
    { month: "Jan", consumption: 45000, cost: 22500 },
    { month: "Feb", consumption: 42000, cost: 21000 },
    { month: "Mar", consumption: 48000, cost: 24000 },
    { month: "Apr", consumption: 46000, cost: 23000 },
    { month: "May", consumption: 44000, cost: 22000 },
    { month: "Jun", consumption: 41000, cost: 20500 },
  ];

  const waterData = [
    { month: "Jan", consumption: 12000, cost: 3600 },
    { month: "Feb", consumption: 11500, cost: 3450 },
    { month: "Mar", consumption: 13000, cost: 3900 },
    { month: "Apr", consumption: 12500, cost: 3750 },
    { month: "May", consumption: 11800, cost: 3540 },
    { month: "Jun", consumption: 11000, cost: 3300 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              Utility Reports
            </h1>
          </div>
          <p className="text-muted-foreground">
            View consumption data and utility cost analysis.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backButtonText}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Electricity Cost
            </CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">GH₵ 135,000</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">-5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Cost</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">GH₵ 19,500</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">-3%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solar Generation
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">35%</div>
            <p className="text-xs text-muted-foreground">
              of total consumption
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
            <BarChart3 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">GH₵ 45,230</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Electricity Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={electricityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar
                  dataKey="consumption"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Water Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={waterData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="consumption"
                  stroke="hsl(var(--blue))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Branch-wise Consumption</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h3 className="font-semibold">Accra Main Branch</h3>
                <p className="text-sm text-muted-foreground">
                  Electricity: 45,000 kWh | Water: 12,000 L
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">GH₵ 26,100</p>
                <p className="text-sm text-muted-foreground">Total Cost</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h3 className="font-semibold">Kumasi Branch</h3>
                <p className="text-sm text-muted-foreground">
                  Electricity: 38,000 kWh | Water: 9,500 L
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">GH₵ 22,050</p>
                <p className="text-sm text-muted-foreground">Total Cost</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h3 className="font-semibold">Takoradi Branch</h3>
                <p className="text-sm text-muted-foreground">
                  Electricity: 32,000 kWh | Water: 8,200 L
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">GH₵ 18,640</p>
                <p className="text-sm text-muted-foreground">Total Cost</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UtilityReports;
