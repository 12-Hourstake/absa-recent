import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Plus, 
  Eye,
  BarChart3,
  FileSpreadsheet,
  FileImage,
  Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Cache keys for data sources
const CACHE_KEYS = {
  ASSETS: "ASSETS_CACHE_V1",
  WORK_ORDERS: "WORK_ORDERS_CACHE_V1", 
  MAINTENANCE: "MAINTENANCE_CACHE_V1",
  REQUESTS: "REQUESTS_CACHE_V1",
  VENDORS: "VENDORS_CACHE_V1",
  LOGS: "LOGS_CACHE_V1",
  FUEL: "FUEL_CARDS_CACHE_V1",
  WATER_TANKER: "WATER_TANKER_CACHE_V1",
  SLA: "SLA_CACHE_V1",
  AUDIT_LOGS: "AUDIT_LOGS_CACHE_V1",
  DOCUMENTS: "DOCUMENTS_CACHE_V1",
  REPORTS: "REPORTS_CACHE_V1",
  SCHEDULED_REPORTS: "SCHEDULED_REPORTS_CACHE_V1"
};

interface GeneratedReport {
  reportId: string;
  reportName: string;
  generatedAt: string;
  generatedBy: string;
  format: string;
  size: string;
}

interface ScheduledReport {
  id: string;
  name: string;
  frequency: string;
  nextRun: string;
  format: string;
  enabled: boolean;
}

const Reports = () => {
  const { session } = useAuth();
  const [recentReports, setRecentReports] = useState<GeneratedReport[]>([]);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Custom report form
  const [customReport, setCustomReport] = useState({
    name: "",
    category: "",
    dateFrom: "",
    dateTo: "",
    format: "pdf",
    location: "all",
    status: "all"
  });

  // Schedule report form
  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    template: "",
    frequency: "weekly",
    format: "pdf",
    enabled: true
  });

  useEffect(() => {
    loadRecentReports();
    loadScheduledReports();
  }, []);

  const loadRecentReports = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEYS.REPORTS);
      if (cached) {
        setRecentReports(JSON.parse(cached));
      }
    } catch (error) {
      console.error("Error loading recent reports:", error);
    }
  };

  const loadScheduledReports = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEYS.SCHEDULED_REPORTS);
      if (cached) {
        setScheduledReports(JSON.parse(cached));
      }
    } catch (error) {
      console.error("Error loading scheduled reports:", error);
    }
  };

  const saveRecentReport = (report: GeneratedReport) => {
    const updated = [report, ...recentReports].slice(0, 10); // Keep last 10
    setRecentReports(updated);
    localStorage.setItem(CACHE_KEYS.REPORTS, JSON.stringify(updated));
  };

  const saveScheduledReport = (report: ScheduledReport) => {
    const updated = [...scheduledReports, report];
    setScheduledReports(updated);
    localStorage.setItem(CACHE_KEYS.SCHEDULED_REPORTS, JSON.stringify(updated));
  };

  // Data loading functions
  const loadCachedData = (cacheKey: string) => {
    try {
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error(`Error loading ${cacheKey}:`, error);
      return [];
    }
  };

  // Export functions
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      setError("No data available for export");
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(header => `"${row[header] || ""}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = (data: any[], title: string, filename: string) => {
    // Simple PDF generation - in production, use jsPDF or similar
    const content = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>Total Records: ${data.length}</p>
          ${data.length > 0 ? `
            <table>
              <thead>
                <tr>${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${data.map(row => `<tr>${Object.values(row).map(val => `<td>${val}</td>`).join('')}</tr>`).join('')}
              </tbody>
            </table>
          ` : '<p>No data available</p>'}
        </body>
      </html>
    `;

    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Standard report generators
  const generateAssetInventoryReport = (format: string) => {
    const assets = loadCachedData(CACHE_KEYS.ASSETS);
    const reportData = assets.map((asset: any) => ({
      "Asset Name": asset.name || asset.assetName,
      "Category": asset.category,
      "Branch": asset.branch || asset.location,
      "Status": asset.status,
      "Purchase Date": asset.purchaseDate || asset.createdAt,
      "Cost": asset.cost || asset.value || "N/A"
    }));

    const reportName = "Asset Inventory Report";
    if (format === "csv") {
      exportToCSV(reportData, "Asset_Inventory_Report");
    } else {
      exportToPDF(reportData, reportName, "Asset_Inventory_Report");
    }

    saveRecentReport({
      reportId: `RPT-${Date.now()}`,
      reportName,
      generatedAt: new Date().toISOString(),
      generatedBy: session?.fullName || "Admin",
      format: format.toUpperCase(),
      size: `${Math.round(JSON.stringify(reportData).length / 1024)}KB`
    });

    setSuccess(`${reportName} exported successfully as ${format.toUpperCase()}`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const generateMaintenanceComplianceReport = (format: string) => {
    const maintenance = loadCachedData(CACHE_KEYS.MAINTENANCE);
    const reportData = maintenance.map((task: any) => ({
      "Task Name": task.name || task.taskName,
      "Branch": task.branch || task.location,
      "Type": task.type,
      "Due Date": task.dueDate,
      "Completion Status": task.status
    }));

    const reportName = "Maintenance Compliance Report";
    if (format === "csv") {
      exportToCSV(reportData, "Maintenance_Compliance_Report");
    } else {
      exportToPDF(reportData, reportName, "Maintenance_Compliance_Report");
    }

    saveRecentReport({
      reportId: `RPT-${Date.now()}`,
      reportName,
      generatedAt: new Date().toISOString(),
      generatedBy: session?.fullName || "Admin",
      format: format.toUpperCase(),
      size: `${Math.round(JSON.stringify(reportData).length / 1024)}KB`
    });

    setSuccess(`${reportName} exported successfully as ${format.toUpperCase()}`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const generateSLAPenaltyReport = (format: string) => {
    const penalties = loadCachedData(CACHE_KEYS.SLA).penalties || [];
    const reportData = penalties.map((penalty: any) => ({
      "Penalty ID": penalty.id.split('-').slice(-2).join('-'),
      "SLA Type": penalty.slaType,
      "Vendor": penalty.vendor,
      "Severity": penalty.severityLevel,
      "Amount (GHS)": penalty.calculatedAmount.toFixed(2),
      "Status": penalty.status,
      "Created Date": penalty.createdAt ? new Date(penalty.createdAt).toLocaleDateString() : "N/A",
      "Breach Duration (hrs)": penalty.breachDuration
    }));

    const reportName = "SLA Penalty Report";
    if (format === "csv") {
      exportToCSV(reportData, "SLA_Penalty_Report");
    } else {
      exportToPDF(reportData, reportName, "SLA_Penalty_Report");
    }

    saveRecentReport({
      reportId: `RPT-${Date.now()}`,
      reportName,
      generatedAt: new Date().toISOString(),
      generatedBy: session?.fullName || "Admin",
      format: format.toUpperCase(),
      size: `${Math.round(JSON.stringify(reportData).length / 1024)}KB`
    });

    setSuccess(`${reportName} exported successfully as ${format.toUpperCase()}`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const generateCustomReport = () => {
    if (!customReport.name || !customReport.category) {
      setError("Please fill in all required fields");
      return;
    }

    let data: any[] = [];
    let reportData: any[] = [];

    switch (customReport.category) {
      case "assets":
        data = loadCachedData(CACHE_KEYS.ASSETS);
        reportData = data.map(item => ({
          "Name": item.name || item.assetName,
          "Category": item.category,
          "Status": item.status,
          "Location": item.branch || item.location
        }));
        break;
      case "requests":
        data = loadCachedData(CACHE_KEYS.REQUESTS);
        reportData = data.map(item => ({
          "Request ID": item.requestId,
          "Type": item.requestType,
          "Status": item.status,
          "Created By": item.createdBy,
          "Created On": item.createdOn
        }));
        break;
      case "vendors":
        data = loadCachedData(CACHE_KEYS.VENDORS);
        reportData = data.map(item => ({
          "Vendor Name": item.name,
          "Category": item.category,
          "Status": item.status,
          "Contact": item.contact
        }));
        break;
      default:
        setError("Invalid category selected");
        return;
    }

    if (customReport.format === "csv") {
      exportToCSV(reportData, customReport.name.replace(/\s+/g, "_"));
    } else {
      exportToPDF(reportData, customReport.name, customReport.name.replace(/\s+/g, "_"));
    }

    saveRecentReport({
      reportId: `RPT-${Date.now()}`,
      reportName: customReport.name,
      generatedAt: new Date().toISOString(),
      generatedBy: session?.fullName || "Admin",
      format: customReport.format.toUpperCase(),
      size: `${Math.round(JSON.stringify(reportData).length / 1024)}KB`
    });

    setSuccess(`Custom report "${customReport.name}" generated successfully`);
    setShowCustomReportModal(false);
    setCustomReport({
      name: "",
      category: "",
      dateFrom: "",
      dateTo: "",
      format: "pdf",
      location: "all",
      status: "all"
    });
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleScheduleReport = () => {
    if (!scheduleForm.name || !scheduleForm.template) {
      setError("Please fill in all required fields");
      return;
    }

    const newSchedule: ScheduledReport = {
      id: `SCH-${Date.now()}`,
      name: scheduleForm.name,
      frequency: scheduleForm.frequency,
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next week
      format: scheduleForm.format.toUpperCase(),
      enabled: scheduleForm.enabled
    };

    saveScheduledReport(newSchedule);
    setSuccess("Report scheduled successfully");
    setShowScheduleModal(false);
    setScheduleForm({
      name: "",
      template: "",
      frequency: "weekly",
      format: "pdf",
      enabled: true
    });
    setTimeout(() => setSuccess(""), 3000);
  };

  // Calculate stats
  const thisMonthReports = recentReports.filter(report => {
    const reportDate = new Date(report.generatedAt);
    const now = new Date();
    return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
  }).length;

  const nextScheduled = scheduledReports
    .filter(report => report.enabled)
    .sort((a, b) => new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime())[0];

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">✅ {success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>❌ {error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and manage facility management reports</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCustomReportModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Custom Report
          </Button>
          <Button variant="outline" onClick={() => setShowScheduleModal(true)} className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reports This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledReports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {nextScheduled ? new Date(nextScheduled.nextRun).toLocaleDateString() : "None"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Standard Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Standard Report Templates</CardTitle>
          <p className="text-sm text-muted-foreground">Pre-built reports using real system data</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Asset Inventory Report</h3>
              </div>
              <p className="text-sm text-muted-foreground">Complete asset listing with categories, status, and locations</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => generateAssetInventoryReport("pdf")}>
                  <FileImage className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => generateAssetInventoryReport("csv")}>
                  <FileSpreadsheet className="h-4 w-4 mr-1" />
                  CSV
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Maintenance Compliance</h3>
              </div>
              <p className="text-sm text-muted-foreground">PPM and reactive maintenance task completion status</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => generateMaintenanceComplianceReport("pdf")}>
                  <FileImage className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => generateMaintenanceComplianceReport("csv")}>
                  <FileSpreadsheet className="h-4 w-4 mr-1" />
                  CSV
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold">Utility Purchase Report</h3>
              </div>
              <p className="text-sm text-muted-foreground">ECG, Ghana Water, and fuel purchase logs</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => generateUtilityPurchaseReport("pdf")}>
                  <FileImage className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => generateUtilityPurchaseReport("csv")}>
                  <FileSpreadsheet className="h-4 w-4 mr-1" />
                  CSV
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold">SLA Penalty Report</h3>
              </div>
              <p className="text-sm text-muted-foreground">Vendor penalties, breach tracking, and compliance status</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => generateSLAPenaltyReport("pdf")}>
                  <FileImage className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => generateSLAPenaltyReport("csv")}>
                  <FileSpreadsheet className="h-4 w-4 mr-1" />
                  CSV
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Generated At</TableHead>
                <TableHead>Generated By</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No reports generated yet
                  </TableCell>
                </TableRow>
              ) : (
                recentReports.map((report) => (
                  <TableRow key={report.reportId}>
                    <TableCell className="font-medium">{report.reportName}</TableCell>
                    <TableCell>{new Date(report.generatedAt).toLocaleString()}</TableCell>
                    <TableCell>{report.generatedBy}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.format}</Badge>
                    </TableCell>
                    <TableCell>{report.size}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Custom Report Modal */}
      <Dialog open={showCustomReportModal} onOpenChange={setShowCustomReportModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Build Custom Report</DialogTitle>
            <DialogDescription>Create a custom report from system data</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Report Name *</Label>
                <Input
                  value={customReport.name}
                  onChange={(e) => setCustomReport({...customReport, name: e.target.value})}
                  placeholder="My Custom Report"
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={customReport.category} onValueChange={(value) => setCustomReport({...customReport, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assets">Assets</SelectItem>
                    <SelectItem value="requests">Requests</SelectItem>
                    <SelectItem value="vendors">Vendors</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date From</Label>
                <Input
                  type="date"
                  value={customReport.dateFrom}
                  onChange={(e) => setCustomReport({...customReport, dateFrom: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Date To</Label>
                <Input
                  type="date"
                  value={customReport.dateTo}
                  onChange={(e) => setCustomReport({...customReport, dateTo: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={customReport.format} onValueChange={(value) => setCustomReport({...customReport, format: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomReportModal(false)}>Cancel</Button>
            <Button onClick={generateCustomReport}>Generate Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Report Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Report</DialogTitle>
            <DialogDescription>Set up automatic report generation</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Schedule Name *</Label>
              <Input
                value={scheduleForm.name}
                onChange={(e) => setScheduleForm({...scheduleForm, name: e.target.value})}
                placeholder="Weekly Asset Report"
              />
            </div>
            <div className="space-y-2">
              <Label>Report Template *</Label>
              <Select value={scheduleForm.template} onValueChange={(value) => setScheduleForm({...scheduleForm, template: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asset-inventory">Asset Inventory</SelectItem>
                  <SelectItem value="maintenance-compliance">Maintenance Compliance</SelectItem>
                  <SelectItem value="utility-purchase">Utility Purchase</SelectItem>
                  <SelectItem value="sla-penalty">SLA Penalty Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={scheduleForm.frequency} onValueChange={(value) => setScheduleForm({...scheduleForm, frequency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Format</Label>
                <Select value={scheduleForm.format} onValueChange={(value) => setScheduleForm({...scheduleForm, format: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
            <Button onClick={handleScheduleReport}>Schedule Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;