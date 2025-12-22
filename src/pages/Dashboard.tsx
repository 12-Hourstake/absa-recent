import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getProgressClass, getScoreBadge } from "@/lib/progress-utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Package,
  ClipboardList,
  Wrench,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { mockDataSummary } from "@/data";
import { useAssets } from "@/contexts/AssetContext";
import { useRequests } from "@/contexts/RequestContext";

const workOrderData = [
  { name: "Mon", open: 12, completed: 18 },
  { name: "Tue", open: 15, completed: 20 },
  { name: "Wed", open: 10, completed: 22 },
  { name: "Thu", open: 18, completed: 16 },
  { name: "Fri", open: 14, completed: 25 },
  { name: "Sat", open: 8, completed: 12 },
  { name: "Sun", open: 5, completed: 8 },
];

const vendorPerformance = [
  { name: "Electrical Services Ltd", score: 92, rating: "Good" },
  { name: "HVAC Solutions", score: 88, rating: "Good" },
  { name: "Plumbing Pro", score: 75, rating: "Average" },
  { name: "Security Systems", score: 95, rating: "Good" },
  { name: "Cleaning Services", score: 68, rating: "Average" },
];

const Dashboard = () => {
  const { assets } = useAssets();
  const { requests } = useRequests();
  
  // Calculate asset statistics from actual data
  const assetStatusData = [
    { name: "Active", value: assets.filter(a => a.status === 'active').length, color: "hsl(var(--success))" },
    { name: "Inactive", value: assets.filter(a => a.status === 'inactive').length, color: "hsl(var(--warning))" },
    { name: "Under Maintenance", value: assets.filter(a => a.status === 'under-maintenance').length, color: "hsl(var(--primary))" },
    { name: "Disposed", value: assets.filter(a => a.status === 'disposed').length, color: "hsl(var(--muted-foreground))" },
  ];
  
  return (
    <div className="mx-auto max-w-[1600px] flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your facilities management.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
            <span className="text-[18px]">⋮⋮</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Assets</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-900">{assets.length}</h4>
            </div>
            <div className="rounded-lg bg-red-50 p-2 text-red-600">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center text-xs font-bold text-green-900 bg-green-100 px-1.5 py-0.5 rounded border border-green-200">
              <TrendingUp className="text-[14px] mr-0.5 h-3 w-3" /> +12%
            </span>
            <span className="text-xs text-slate-500">from last month</span>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
            <span className="text-[18px]">⋮⋮</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Open Requests</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-900">{requests.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length}</h4>
            </div>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center text-xs font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-200">
              {requests.filter(r => r.priority === 'urgent' && r.status !== 'completed').length} Urgent
            </span>
            <span className="text-xs text-slate-500">requires attention</span>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
            <span className="text-[18px]">⋮⋮</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">PPM Compliance</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-900">94%</h4>
            </div>
            <div className="rounded-lg bg-green-50 p-2 text-green-600">
              <Wrench className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-green-600">Target: 95%</span>
            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
            <span className="text-xs text-slate-500">On track</span>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
            <span className="text-[18px]">⋮⋮</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Monthly Savings</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-900">GH₵ 45,230</h4>
            </div>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">From utility optimization</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Work Orders Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Work Order Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workOrderData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="open" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Asset Status */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Asset Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Vendor Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendorPerformance.map((vendor) => (
                <div key={vendor.name} className="flex items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">{vendor.name}</p>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={vendor.score} 
                        className={`flex-1 ${getProgressClass(vendor.score)}`}
                      />
                      <span className="text-xs text-muted-foreground w-8">{vendor.score}%</span>
                    </div>
                  </div>
                  <Badge
                    className={`ml-4 ${getScoreBadge(vendor.score).className}`}
                  >
                    {getScoreBadge(vendor.score).label}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Critical Alerts & SLA Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">SLA Breach - WO-2024-0342</p>
                  <p className="text-xs text-muted-foreground">
                    HVAC maintenance at Accra Main Branch - 2 hours overdue
                  </p>
                </div>
                <Badge variant="destructive">High</Badge>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <Clock className="h-5 w-5 text-warning mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Warranty Expiring</p>
                  <p className="text-xs text-muted-foreground">
                    12 assets have warranties expiring within 30 days
                  </p>
                </div>
                <Badge className="bg-warning text-warning-foreground">Medium</Badge>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Monthly Target Achieved</p>
                  <p className="text-xs text-muted-foreground">
                    95% PPM compliance rate for March 2025
                  </p>
                </div>
                <Badge className="bg-success text-success-foreground">Info</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
