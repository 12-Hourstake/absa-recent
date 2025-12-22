import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Eye, CheckCircle, AlertTriangle, Clock, Edit, Trash2 } from "lucide-react";
import ResponsiveTable from "@/components/ui/ResponsiveTable";
import { FuelTabs } from "@/components/ui/FuelTabs";
import { FuelType, getFuelContext, setFuelContext } from "@/utils/fuelContext";

interface FuelAudit {
  id: string;
  deliveryId: string;
  branchSite: string;
  auditType: "snap-check" | "emergency-review";
  approvalTrailVerified: boolean;
  deliveryAccuracyVerified: boolean;
  documentationComplete: boolean;
  findings: string;
  actionRequired: string;
  status: "open" | "addressed" | "closed";
  auditDate: string;
  auditorName: string;
  createdAt: string;
}

const FuelAudits = () => {
  // Fuel context state
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType>(() => 
    getFuelContext("audits")
  );
  
  const [audits, setAudits] = useState<FuelAudit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<FuelAudit | null>(null);

  useEffect(() => {
    loadAudits();
  }, [selectedFuelType]);

  // Handle fuel type change
  const handleFuelTypeChange = (fuelType: FuelType) => {
    setSelectedFuelType(fuelType);
    setFuelContext("audits", fuelType);
  };

  const loadAudits = () => {
    const cached = localStorage.getItem("FUEL_AUDIT_CACHE_V1");
    if (cached) {
      setAudits(JSON.parse(cached));
    } else {
      // Initialize with sample data
      const sampleAudits: FuelAudit[] = [
        {
          id: "AUD001",
          deliveryId: "FD001",
          branchSite: "Accra Main Branch",
          auditType: "snap-check",
          approvalTrailVerified: true,
          deliveryAccuracyVerified: true,
          documentationComplete: true,
          findings: "All procedures followed correctly",
          actionRequired: "None",
          status: "closed",
          auditDate: "2024-01-16",
          auditorName: "Sarah Johnson",
          createdAt: "2024-01-16"
        },
        {
          id: "AUD002",
          deliveryId: "FD002",
          branchSite: "Kumasi Branch",
          auditType: "emergency-review",
          approvalTrailVerified: true,
          deliveryAccuracyVerified: false,
          documentationComplete: true,
          findings: "Short delivery not properly documented",
          actionRequired: "Update delivery documentation procedures",
          status: "addressed",
          auditDate: "2024-01-15",
          auditorName: "Michael Brown",
          createdAt: "2024-01-15"
        },
        {
          id: "AUD003",
          deliveryId: "FD003",
          branchSite: "Tema Branch",
          auditType: "snap-check",
          approvalTrailVerified: false,
          deliveryAccuracyVerified: true,
          documentationComplete: false,
          findings: "Missing approval signatures, incomplete documentation",
          actionRequired: "Retrain staff on approval procedures",
          status: "open",
          auditDate: "2024-01-14",
          auditorName: "David Wilson",
          createdAt: "2024-01-14"
        }
      ];
      setAudits(sampleAudits);
      localStorage.setItem("FUEL_AUDIT_CACHE_V1", JSON.stringify(sampleAudits));
    }
  };

  const getStatusBadge = (status: FuelAudit["status"]) => {
    switch (status) {
      case "open":
        return <Badge className="bg-red-100 text-red-800">Open</Badge>;
      case "addressed":
        return <Badge className="bg-yellow-100 text-yellow-800">Addressed</Badge>;
      case "closed":
        return <Badge className="bg-green-100 text-green-800">Closed</Badge>;
    }
  };

  const getAuditTypeBadge = (type: FuelAudit["auditType"]) => {
    switch (type) {
      case "snap-check":
        return <Badge variant="secondary">Snap Check</Badge>;
      case "emergency-review":
        return <Badge className="bg-orange-100 text-orange-800">Emergency Review</Badge>;
    }
  };

  const getComplianceScore = (audit: FuelAudit) => {
    const checks = [
      audit.approvalTrailVerified,
      audit.deliveryAccuracyVerified,
      audit.documentationComplete
    ];
    const passed = checks.filter(Boolean).length;
    return `${passed}/3`;
  };

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.deliveryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audit.branchSite.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audit.auditorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || audit.status === statusFilter;
    const matchesType = typeFilter === "all" || audit.auditType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: audits.length,
    open: audits.filter(a => a.status === "open").length,
    addressed: audits.filter(a => a.status === "addressed").length,
    closed: audits.filter(a => a.status === "closed").length,
    snapChecks: audits.filter(a => a.auditType === "snap-check").length,
    emergencyReviews: audits.filter(a => a.auditType === "emergency-review").length
  };

  return (
    <div className="flex-1 px-4 py-8 md:px-8 lg:px-12 w-full max-w-[1920px] mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fuel Audits</h1>
          <p className="text-muted-foreground mt-1">
            Audit and control {selectedFuelType.toLowerCase()} fuel through snap checks and emergency reviews
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Generate Audit
          </Button>
        </div>
      </div>

      {/* Fuel Type Tabs */}
      <FuelTabs selectedType={selectedFuelType} onTypeChange={handleFuelTypeChange} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Audits</p>
          <p className="text-xl font-bold mt-1">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Open</p>
          <p className="text-xl font-bold mt-1 text-red-600">{stats.open}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Addressed</p>
          <p className="text-xl font-bold mt-1 text-yellow-600">{stats.addressed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Closed</p>
          <p className="text-xl font-bold mt-1 text-green-600">{stats.closed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Snap Checks</p>
          <p className="text-xl font-bold mt-1">{stats.snapChecks}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Emergency</p>
          <p className="text-xl font-bold mt-1">{stats.emergencyReviews}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Search Audits</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by delivery ID, branch, or auditor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Audit Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border-slate-200 bg-white py-2 px-3 text-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value="all">All Types</option>
              <option value="snap-check">Snap Check</option>
              <option value="emergency-review">Emergency Review</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border-slate-200 bg-white py-2 px-3 text-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="addressed">Addressed</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <ResponsiveTable>
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Audit ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Delivery ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Branch/Site</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Compliance</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Auditor</th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredAudits.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-muted-foreground">
                    No {selectedFuelType.toLowerCase()} fuel audit data available.
                  </td>
                </tr>
              ) : (
                filteredAudits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 font-mono text-sm">{audit.id}</td>
                    <td className="px-6 py-4 font-mono text-sm">{audit.deliveryId}</td>
                    <td className="px-6 py-4">{audit.branchSite}</td>
                    <td className="px-6 py-4">{getAuditTypeBadge(audit.auditType)}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`font-bold ${
                          getComplianceScore(audit) === "3/3" ? "text-green-600" : "text-red-600"
                        }`}>
                          {getComplianceScore(audit)}
                        </span>
                        {getComplianceScore(audit) === "3/3" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(audit.status)}</td>
                    <td className="px-6 py-4">{audit.auditorName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" title="View" onClick={() => {
                          setSelectedAudit(audit);
                          setIsViewModalOpen(true);
                        }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </ResponsiveTable>
      </Card>

      {/* View Audit Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Details - {selectedAudit?.id}</DialogTitle>
            <DialogDescription>
              Complete audit information and compliance checks
            </DialogDescription>
          </DialogHeader>
          {selectedAudit && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Delivery ID</label>
                  <p className="font-mono">{selectedAudit.deliveryId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Branch/Site</label>
                  <p>{selectedAudit.branchSite}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Audit Type</label>
                  <p>{getAuditTypeBadge(selectedAudit.auditType)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p>{getStatusBadge(selectedAudit.status)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Audit Date</label>
                  <p>{selectedAudit.auditDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Auditor</label>
                  <p>{selectedAudit.auditorName}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Compliance Checks</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {selectedAudit.approvalTrailVerified ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <span>Approval Trail Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedAudit.deliveryAccuracyVerified ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <span>Delivery Accuracy Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedAudit.documentationComplete ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <span>Documentation Complete</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Findings</h4>
                <p className="text-sm text-muted-foreground">{selectedAudit.findings}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Action Required</h4>
                <p className="text-sm text-muted-foreground">{selectedAudit.actionRequired}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FuelAudits;