import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Play,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  Search,
  ArrowUpRight,
  X,
  ChevronDown,
} from "lucide-react";
import CustomSelectDropdown from "../components/ui/CustomSelectDropdown";

const reportTemplates = [
  {
    id: "RPT-001",
    name: "Asset Inventory Report",
    description: "Complete asset listing for properties in Accra with lifecycle and cost details.",
    category: "Assets",
    format: ["PDF", "Excel", "CSV"],
    frequency: "Monthly",
  },
  {
    id: "RPT-002",
    name: "Maintenance Compliance",
    description: "Tracks scheduled vs. completed maintenance tasks for properties in Kumasi.",
    category: "Maintenance",
    format: ["PDF", "Excel"],
    frequency: "Weekly",
  },
  {
    id: "RPT-003",
    name: "Work Order SLA Report",
    description: "Measures response and resolution times against service level agreements.",
    category: "Maintenance",
    format: ["PDF", "CSV"],
    frequency: "Daily",
  },
  {
    id: "RPT-004",
    name: "Vendor Performance Report",
    description: "Analysis of vendor contracts, costs, and job completion rates across Tema.",
    category: "Vendors",
    format: ["PDF", "Excel"],
    frequency: "Quarterly",
  },
  {
    id: "RPT-005",
    name: "Utility Consumption Report",
    description: "Detailed overview of water and electricity usage, with cost in GHS.",
    category: "Utilities",
    format: ["PDF", "Excel", "CSV"],
    frequency: "Monthly",
  },
  {
    id: "RPT-006",
    name: "Budget vs Actual Report",
    description: "Compares budgeted expenses with actual spending for financial quarters.",
    category: "Finance",
    format: ["PDF", "Excel"],
    frequency: "Monthly",
  },
];

const recentReports = [
  {
    id: "GEN-2025-0089",
    name: "Asset Inventory Report - March 2025",
    generatedAt: "2025-03-18 14:35",
    generatedBy: "Admin User",
    format: "PDF",
    size: "2.4 MB",
    status: "completed",
  },
  {
    id: "GEN-2025-0088",
    name: "Maintenance Compliance Report - Week 11",
    generatedAt: "2025-03-17 06:00",
    generatedBy: "System (Scheduled)",
    format: "Excel",
    size: "1.8 MB",
    status: "completed",
  },
  {
    id: "GEN-2025-0087",
    name: "Work Order SLA Report - March 17",
    generatedAt: "2025-03-17 06:00",
    generatedBy: "System (Scheduled)",
    format: "PDF",
    size: "945 KB",
    status: "completed",
  },
  {
    id: "GEN-2025-0086",
    name: "Vendor Performance Report - February 2025",
    generatedAt: "2025-03-01 08:15",
    generatedBy: "John Mensah",
    format: "Excel",
    size: "3.1 MB",
    status: "completed",
  },
];

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("templates");
  const [success, setSuccess] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [recipients, setRecipients] = useState(["kwame.mensah@absa.com.gh", "adwoa.boateng@absa.gh"]);
  const [reportTemplate, setReportTemplate] = useState("accra-yields");
  const [frequency, setFrequency] = useState("weekly");
  const [deliveryMethod, setDeliveryMethod] = useState("email");
  const [outputFormat, setOutputFormat] = useState("pdf");
  const [customCategory, setCustomCategory] = useState("");
  const [customDateRange, setCustomDateRange] = useState("");
  const [customFormat, setCustomFormat] = useState("");
  
  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      Assets: "bg-blue-100 text-blue-800",
      Maintenance: "bg-green-100 text-green-800",
      "Work Orders": "bg-yellow-100 text-yellow-800",
      Vendors: "bg-purple-100 text-purple-800",
      Utilities: "bg-cyan-100 text-cyan-800",
      Safety: "bg-red-100 text-red-800",
      Finance: "bg-indigo-100 text-indigo-800",
    };
    return <Badge className={colors[category] || "bg-gray-100 text-gray-800"}>{category}</Badge>;
  };

  const filteredTemplates = reportTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-[1600px] flex flex-col gap-6 p-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-wrap justify-between gap-4 items-center">
        <div className="flex min-w-72 flex-col gap-2">
          <h1 className="text-4xl font-black leading-tight tracking-[-0.033em]">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground text-base font-normal leading-normal">
            Generate comprehensive reports and schedule automated delivery.
          </p>
        </div>
        <button 
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2"
          onClick={() => setShowScheduleModal(true)}
        >
          <Calendar className="h-4 w-4" />
          Schedule Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
            <span className="text-[18px]">⋮⋮</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Report Templates</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-900">{reportTemplates.length}</h4>
            </div>
            <div className="rounded-lg bg-red-50 p-2 text-red-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Available templates</span>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
            <span className="text-[18px]">⋮⋮</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Reports This Month</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-900">47</h4>
            </div>
            <div className="rounded-lg bg-green-50 p-2 text-green-600">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center text-xs font-bold text-green-900 bg-green-100 px-1.5 py-0.5 rounded border border-green-200">
              <ArrowUpRight className="text-[14px] mr-0.5 h-3 w-3" /> +12%
            </span>
            <span className="text-xs text-slate-500">vs last month</span>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
            <span className="text-[18px]">⋮⋮</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Scheduled Reports</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-900">12</h4>
            </div>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Active schedules</span>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
            <span className="text-[18px]">⋮⋮</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Next Scheduled</p>
              <h4 className="mt-2 text-2xl font-bold text-slate-900">Tomorrow at 6:00 AM</h4>
            </div>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="pb-3">
          <div className="flex border-b gap-8">
            <button 
              onClick={() => setActiveTab("templates")}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                activeTab === "templates" 
                  ? "border-b-primary text-foreground" 
                  : "border-b-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">Report Templates</p>
            </button>
            <button 
              onClick={() => setActiveTab("recent")}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                activeTab === "recent" 
                  ? "border-b-primary text-foreground" 
                  : "border-b-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">Recent Reports</p>
            </button>
            <button 
              onClick={() => setActiveTab("custom")}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                activeTab === "custom" 
                  ? "border-b-primary text-foreground" 
                  : "border-b-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">Custom Report</p>
            </button>
          </div>
        </div>

        {activeTab === "templates" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Standard Report Templates ({filteredTemplates.length})</h3>
              <div className="flex items-center gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="assets">Assets</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="vendors">Vendors</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="border shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold text-primary">{template.category}</p>
                        <h4 className="text-lg font-bold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      <div className="flex-1"></div>
                      <div className="flex flex-col gap-3 text-sm font-medium text-muted-foreground">
                        <p><span className="mr-2">📄</span> {template.format.join(", ")}</p>
                        <p><span className="mr-2">🔄</span> {template.frequency}</p>
                      </div>
                      <button className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg transition-colors">
                        Generate Now
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "recent" && (
          <Card>
            <CardHeader>
              <CardTitle>Recently Generated Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Generated At</TableHead>
                      <TableHead>Generated By</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.id}
                        </TableCell>
                        <TableCell>{report.name}</TableCell>
                        <TableCell className="text-xs">
                          {report.generatedAt}
                        </TableCell>
                        <TableCell className="text-xs">
                          {report.generatedBy}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.format}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{report.size}</TableCell>
                        <TableCell className="text-right">
                          <button 
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            onClick={() => {
                              setSelectedReport(report);
                              setShowDownloadModal(true);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "custom" && (
          <Card>
            <CardHeader>
              <CardTitle>Build Custom Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="report-name">Report Name</Label>
                  <Input id="report-name" placeholder="Enter report name..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <CustomSelectDropdown
                    options={[
                      { value: "assets", label: "Assets" },
                      { value: "maintenance", label: "Maintenance" },
                      { value: "workorders", label: "Work Orders" },
                      { value: "vendors", label: "Vendors" },
                      { value: "utilities", label: "Utilities" }
                    ]}
                    value={customCategory}
                    onChange={setCustomCategory}
                    placeholder="Select category"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <CustomSelectDropdown
                    options={[
                      { value: "today", label: "Today" },
                      { value: "week", label: "Last 7 Days" },
                      { value: "month", label: "Last 30 Days" },
                      { value: "quarter", label: "Last Quarter" },
                      { value: "custom", label: "Custom Range" }
                    ]}
                    value={customDateRange}
                    onChange={setCustomDateRange}
                    placeholder="Select date range"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Export Format</Label>
                  <CustomSelectDropdown
                    options={[
                      { value: "pdf", label: "PDF" },
                      { value: "excel", label: "Excel" },
                      { value: "csv", label: "CSV" }
                    ]}
                    value={customFormat}
                    onChange={setCustomFormat}
                    placeholder="Select format"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Filters</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-3 w-3" />
                    Add Location Filter
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-3 w-3" />
                    Add Status Filter
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-3 w-3" />
                    Add Category Filter
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors">
                  Save as Template
                </button>
                <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Generate Report
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Schedule Report Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">Schedule Report</h2>
                <p className="text-slate-500 text-sm mt-1">Set up automated delivery for your property performance data.</p>
              </div>
              <button 
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
                onClick={() => setShowScheduleModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <form className="flex flex-col gap-5">
                {/* Report Template */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-900 text-sm font-medium">Report Template</label>
                  <CustomSelectDropdown
                    options={[
                      { value: "accra-yields", label: "Accra Commercial Rental Yields" },
                      { value: "kumasi-occupancy", label: "Kumasi Residential Occupancy" },
                      { value: "takoradi-leases", label: "Takoradi Industrial Lease Expiry" },
                      { value: "ghs-revenue", label: "GHS Revenue Summary (Q3)" }
                    ]}
                    value={reportTemplate}
                    onChange={setReportTemplate}
                    placeholder="Select a template"
                  />
                </div>
                
                {/* Frequency & Start Date */}
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-slate-900 text-sm font-medium">Frequency</label>
                    <CustomSelectDropdown
                      options={[
                        { value: "daily", label: "Daily" },
                        { value: "weekly", label: "Weekly" },
                        { value: "monthly", label: "Monthly" },
                        { value: "quarterly", label: "Quarterly" }
                      ]}
                      value={frequency}
                      onChange={setFrequency}
                      placeholder="Select frequency"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-slate-900 text-sm font-medium">Start Date</label>
                    <div className="relative">
                      <input 
                        className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all text-base placeholder:text-slate-400"
                        type="date"
                        defaultValue="2023-11-12"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Delivery Method */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-900 text-sm font-medium">Delivery Method</label>
                  <CustomSelectDropdown
                    options={[
                      { value: "email", label: "Email" },
                      { value: "sharepoint", label: "SharePoint" },
                      { value: "ftp", label: "FTP / SFTP" }
                    ]}
                    value={deliveryMethod}
                    onChange={setDeliveryMethod}
                    placeholder="Select delivery method"
                  />
                </div>
                
                {/* Recipients */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-900 text-sm font-medium">Recipients</label>
                  <div className="min-h-[56px] w-full px-2 py-2 rounded-lg border border-slate-300 bg-white flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-slate-500 focus-within:border-slate-500 transition-all">
                    {recipients.map((email, index) => (
                      <div key={index} className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1.5 rounded text-sm font-medium border border-red-200">
                        <span>{email}</span>
                        <button 
                          className="hover:bg-red-100 rounded-full p-0.5 flex items-center justify-center transition-colors"
                          type="button"
                          onClick={() => setRecipients(recipients.filter((_, i) => i !== index))}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <input 
                      className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-base text-slate-900 placeholder:text-slate-400 min-w-[100px] h-8 p-1"
                      placeholder="Add email..."
                      type="email"
                    />
                  </div>
                  <p className="text-xs text-slate-400">Press Enter to add recipients</p>
                </div>
                
                {/* Output Format */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-900 text-sm font-medium">Output Format</label>
                  <CustomSelectDropdown
                    options={[
                      { value: "pdf", label: "PDF Document (.pdf)" },
                      { value: "excel", label: "Excel Spreadsheet (.xlsx)" },
                      { value: "csv", label: "CSV (.csv)" }
                    ]}
                    value={outputFormat}
                    onChange={setOutputFormat}
                    placeholder="Select output format"
                  />
                </div>
              </form>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-5 border-t border-slate-200 bg-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button 
                className="w-full sm:w-auto px-6 h-11 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
                onClick={() => setShowScheduleModal(false)}
              >
                Cancel
              </button>
              <button 
                className="w-full sm:w-auto px-6 h-11 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all flex items-center justify-center gap-2"
                onClick={() => setShowScheduleModal(false)}
              >
                <Calendar className="h-4 w-4" />
                Schedule Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Action Modal */}
      {showDownloadModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Download Report</h3>
                <p className="text-sm text-slate-600 mt-1">Confirm download details and proceed</p>
              </div>
              <button 
                onClick={() => setShowDownloadModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Report Name</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{selectedReport.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Format</label>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 bg-slate-100 text-slate-800">
                      {selectedReport.format}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">File Size</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedReport.size}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Generated At</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedReport.generatedAt}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Generated By</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedReport.generatedBy}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <p className="text-xs text-slate-600">
                    <strong>Report ID:</strong> {selectedReport.id}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
              <button 
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
                onClick={() => setShowDownloadModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors flex items-center gap-2"
                onClick={() => {
                  // Handle download logic here
                  setShowDownloadModal(false);
                }}
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;