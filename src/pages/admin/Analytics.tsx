import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  Banknote,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

const revenueData = [
  { week: "Wk 1", collected: 650000, billed: 720000 },
  { week: "Wk 2", collected: 780000, billed: 800000 },
  { week: "Wk 3", collected: 720000, billed: 750000 },
  { week: "Wk 4", collected: 850000, billed: 880000 },
];

const maintenanceCosts = [
  { property: "The Odoi Residence", cost: 12000, percentage: 30 },
  { property: "East Legon Heights", cost: 16000, percentage: 40 },
  { property: "Cantonments Plaza", cost: 40000, percentage: 100 },
  { property: "Airport Residential", cost: 20000, percentage: 50 },
  { property: "Labone Luxury Lofts", cost: 36000, percentage: 90 },
];

const slaBreaches = [
  {
    vendor: "CleanCo Ghana Ltd",
    issue: "Response time exceeded by 2 hours on #MNT-0123",
  },
  {
    vendor: "SecureAll Security",
    issue: "Missed patrol check at Cantonments Plaza",
  },
  {
    vendor: "FixIt Maintenance",
    issue: "Incorrect parts used for plumbing repair #MNT-0119",
  },
  {
    vendor: "CleanCo Ghana Ltd",
    issue: "Incomplete cleaning at East Legon Heights",
  },
];

const propertyTypeData = [
  { name: "Residential", value: 78, color: "#3b82f6" },
  { name: "Commercial", value: 32, color: "#10b981" },
  { name: "Mixed-Use", value: 18, color: "#f59e0b" },
];

const maintenanceTypeData = [
  { name: "Plumbing", value: 35, color: "#8b5cf6" },
  { name: "Electrical", value: 28, color: "#ec4899" },
  { name: "HVAC", value: 22, color: "#06b6d4" },
  { name: "General", value: 15, color: "#f97316" },
];

const Analytics = () => {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [region, setRegion] = useState("Greater Accra");

  const stats = [
    {
      title: "Total Properties",
      value: "128",
      change: "+2.1%",
      trend: "up",
      icon: Building2,
    },
    {
      title: "Overall Occupancy Rate",
      value: "92%",
      change: "-0.5%",
      trend: "down",
      icon: Users,
    },
    {
      title: "Total Monthly Revenue",
      value: "GHS 1.25M",
      change: "+5.8%",
      trend: "up",
      icon: Banknote,
    },
    {
      title: "Open Maintenance",
      value: "14",
      change: "+12%",
      trend: "up",
      icon: Wrench,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Insights across properties, tenants, financials, and more.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="gap-2">
          {dateRange}
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="gap-2">
          Region: {region}
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="gap-2">
          Property: All
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Rent Collection vs. Billed
            </CardTitle>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold">GHS 850,000</p>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Last 30 Days</p>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`GHS ${value.toLocaleString()}`, ""]}
                  />
                  <Line
                    type="monotone"
                    dataKey="collected"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="billed"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lease Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Lease Status Breakdown</CardTitle>
            <p className="text-3xl font-bold">128 Total Units</p>
            <p className="text-sm text-muted-foreground">As of today</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-8">
              {/* Donut Chart Visualization */}
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="stroke-muted"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="4"
                  />
                  <path
                    className="stroke-primary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeDasharray="92, 100"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">92%</span>
                  <span className="text-sm text-muted-foreground">Occupied</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm font-medium">Occupied (118)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary/50" />
                  <span className="text-sm font-medium">Vacant (6)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <span className="text-sm font-medium">Maintenance (4)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pie Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Property Type Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Total: 128 Properties</p>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Maintenance by Category</CardTitle>
            <p className="text-sm text-muted-foreground">Last 30 Days</p>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={maintenanceTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {maintenanceTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Maintenance Costs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Maintenance Costs by Property
            </CardTitle>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold">GHS 75,000</p>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                <TrendingDown className="h-3 w-3 mr-1" />
                -3.1%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Last 30 Days</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {maintenanceCosts.map((item, index) => (
              <div key={index} className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                <p className="text-sm font-medium text-muted-foreground truncate">
                  {item.property}
                </p>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SLA Breaches */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Recent SLA Breaches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {slaBreaches.map((breach, index) => (
                <div key={index} className="py-3 first:pt-0 last:pb-0">
                  <p className="font-semibold text-sm">{breach.vendor}</p>
                  <p className="text-sm text-muted-foreground mt-1">{breach.issue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
