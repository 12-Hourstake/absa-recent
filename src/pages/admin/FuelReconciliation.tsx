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
import { Search, Download, CheckCircle, AlertTriangle, Edit, Eye } from "lucide-react";
import ResponsiveTable from "@/components/ui/ResponsiveTable";
import { FuelTabs } from "@/components/ui/FuelTabs";
import { FuelType, getFuelContext, setFuelContext } from "@/utils/fuelContext";
import { FuelDataManager, MonthlyReconciliation } from "@/utils/fuelDataManager";

const FuelReconciliation = () => {
  // Fuel context state
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType>(() => 
    getFuelContext("reconciliation")
  );
  
  const [reconciliations, setReconciliations] = useState<MonthlyReconciliation[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);
  const [isFlagIssueModalOpen, setIsFlagIssueModalOpen] = useState(false);
  const [selectedReconciliation, setSelectedReconciliation] = useState<MonthlyReconciliation | null>(null);
  const [reconcileNotes, setReconcileNotes] = useState("");
  const [flagIssueData, setFlagIssueData] = useState({ issue: "", resolution: "" });

  useEffect(() => {
    loadReconciliations();
  }, [selectedFuelType]);

  // Handle fuel type change
  const handleFuelTypeChange = (fuelType: FuelType) => {
    setSelectedFuelType(fuelType);
    setFuelContext("reconciliation", fuelType);
  };

  const loadReconciliations = () => {
    setReconciliations(FuelDataManager.getReconciliations(selectedFuelType));
  };

  const getStatusBadge = (status: MonthlyReconciliation["status"]) => {
    switch (status) {
      case "balanced":
        return <Badge className="bg-green-100 text-green-800">Balanced</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "discrepancy":
        return <Badge className="bg-red-100 text-red-800">Discrepancy</Badge>;
      case "resolved":
        return <Badge className="bg-blue-100 text-blue-800">Resolved</Badge>;
    }
  };

  const handleReconcile = () => {
    if (selectedReconciliation) {
      const updated = reconciliations.map(rec =>
        rec.id === selectedReconciliation.id
          ? { ...rec, status: "balanced" as const, verifiedBy: "Current User", dateVerified: new Date().toISOString().split('T')[0], notes: reconcileNotes }
          : rec
      );
      setReconciliations(updated);
      FuelDataManager.saveReconciliations(selectedFuelType, updated);
      setIsReconcileModalOpen(false);
      setReconcileNotes("");
    }
  };

  const handleFlagIssue = () => {
    if (selectedReconciliation) {
      const updated = reconciliations.map(rec =>
        rec.id === selectedReconciliation.id
          ? { ...rec, status: "discrepancy" as const, notes: `Issue: ${flagIssueData.issue} | Resolution: ${flagIssueData.resolution}` }
          : rec
      );
      setReconciliations(updated);
      FuelDataManager.saveReconciliations(selectedFuelType, updated);
      setIsFlagIssueModalOpen(false);
      setFlagIssueData({ issue: "", resolution: "" });
    }
  };

  const filteredReconciliations = reconciliations.filter(rec => {
    const matchesStatus = statusFilter === "all" || rec.status === statusFilter;
    return matchesStatus;
  });

  const stats = {
    total: reconciliations.length,
    balanced: reconciliations.filter(r => r.status === "balanced").length,
    pending: reconciliations.filter(r => r.status === "pending").length,
    discrepancies: reconciliations.filter(r => r.status === "discrepancy").length
  };

  return (
    <div className="flex-1 px-4 py-8 md:px-8 lg:px-12 w-full max-w-[1920px] mx-auto space-y-6">
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Fuel Reconciliation
          </h1>
          <p className="text-muted-foreground mt-1">
            Monthly reconciliation of OMC statements against internal {selectedFuelType.toLowerCase()} fuel records
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Fuel Type Tabs */}
      <FuelTabs selectedType={selectedFuelType} onTypeChange={handleFuelTypeChange} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Total Reconciliations
          </p>
          <p className="text-2xl font-bold mt-2">{stats.total}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Balanced
          </p>
          <p className="text-2xl font-bold mt-2 text-green-600">{stats.balanced}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Pending
          </p>
          <p className="text-2xl font-bold mt-2 text-yellow-600">{stats.pending}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Discrepancies
          </p>
          <p className="text-2xl font-bold mt-2 text-red-600">{stats.discrepancies}</p>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <Input
              type="text"
              value="01 Jan, 2024 - 31 Jan, 2024"
              placeholder="Select date range"
              readOnly
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Branch</label>
            <select className="rounded-lg border-slate-200 bg-white py-2 px-3 text-sm focus:border-red-500 focus:ring-red-500 w-full">
              <option value="all">All Branches</option>
              <option value="accra">Accra Main Branch</option>
              <option value="kumasi">Kumasi Branch</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border-slate-200 bg-white py-2 px-3 text-sm focus:border-red-500 focus:ring-red-500 w-full"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="balanced">Balanced</option>
              <option value="discrepancy">Discrepancy</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <Button className="w-full bg-red-600 hover:bg-red-700">Apply Filters</Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <ResponsiveTable>
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  Branch/Site
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">
                  Approved (L)
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">
                  Delivered (L)
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">
                  OMC Statement (L)
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">
                  Variance (L)
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                  Verified By
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredReconciliations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-muted-foreground">
                    No {selectedFuelType.toLowerCase()} fuel reconciliation data available.
                  </td>
                </tr>
              ) : (
                filteredReconciliations.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 font-medium">{item.month}</td>
                    <td className="px-6 py-4">{item.branchSite}</td>
                    <td className="px-6 py-4 text-right">{item.totalApproved.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">{item.totalDelivered.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">{item.omcStatement.toLocaleString()}</td>
                    <td className={`px-6 py-4 text-right font-bold ${
                      item.variance !== 0 ? "text-red-600" : "text-green-600"
                    }`}>
                      {item.variance > 0 ? '+' : ''}{item.variance}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4">{item.verifiedBy || "-"}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" title="View" onClick={() => {
                          setSelectedReconciliation(item);
                          setIsViewModalOpen(true);
                        }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {item.status === "balanced" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Reconcile"
                            onClick={() => {
                              setSelectedReconciliation(item);
                              setIsReconcileModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {item.status === "discrepancy" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Flag Issue"
                            onClick={() => {
                              setSelectedReconciliation(item);
                              setIsFlagIssueModalOpen(true);
                            }}
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </ResponsiveTable>
      </Card>

      {/* View Reconciliation Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reconciliation Details - {selectedReconciliation?.id}</DialogTitle>
            <DialogDescription>
              Monthly fuel reconciliation information
            </DialogDescription>
          </DialogHeader>
          {selectedReconciliation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Month</label>
                  <p className="font-semibold">{selectedReconciliation.month}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Branch/Site</label>
                  <p>{selectedReconciliation.branchSite}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p>{getStatusBadge(selectedReconciliation.status)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Verified By</label>
                  <p>{selectedReconciliation.verifiedBy || "Pending"}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Fuel Quantities (Liters)</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Approved:</span>
                    <span className="font-semibold">{selectedReconciliation.totalApproved.toLocaleString()} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Delivered:</span>
                    <span className="font-semibold">{selectedReconciliation.totalDelivered.toLocaleString()} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">OMC Statement:</span>
                    <span className="font-semibold">{selectedReconciliation.omcStatement.toLocaleString()} L</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Variance:</span>
                    <span className={`font-bold ${selectedReconciliation.variance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedReconciliation.variance > 0 ? '+' : ''}{selectedReconciliation.variance.toLocaleString()} L
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground">{selectedReconciliation.notes}</p>
              </div>

              {selectedReconciliation.dateVerified && (
                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-muted-foreground">Date Verified</label>
                  <p>{selectedReconciliation.dateVerified}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reconcile Modal */}
      <Dialog open={isReconcileModalOpen} onOpenChange={setIsReconcileModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reconcile Record - {selectedReconciliation?.id}</DialogTitle>
            <DialogDescription>
              Mark this reconciliation as balanced and add verification notes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Verification Notes</label>
              <textarea
                value={reconcileNotes}
                onChange={(e) => setReconcileNotes(e.target.value)}
                placeholder="Enter verification notes..."
                className="w-full min-h-[100px] rounded-lg border border-slate-200 p-3 text-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReconcileModalOpen(false)}>Cancel</Button>
            <Button onClick={handleReconcile} className="bg-green-600 hover:bg-green-700">
              Mark as Balanced
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flag Issue Modal */}
      <Dialog open={isFlagIssueModalOpen} onOpenChange={setIsFlagIssueModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Discrepancy Issue - {selectedReconciliation?.id}</DialogTitle>
            <DialogDescription>
              Document the issue and proposed resolution
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Issue Description</label>
              <textarea
                value={flagIssueData.issue}
                onChange={(e) => setFlagIssueData({ ...flagIssueData, issue: e.target.value })}
                placeholder="Describe the discrepancy issue..."
                className="w-full min-h-[80px] rounded-lg border border-slate-200 p-3 text-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Proposed Resolution</label>
              <textarea
                value={flagIssueData.resolution}
                onChange={(e) => setFlagIssueData({ ...flagIssueData, resolution: e.target.value })}
                placeholder="Describe how to resolve this issue..."
                className="w-full min-h-[80px] rounded-lg border border-slate-200 p-3 text-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFlagIssueModalOpen(false)}>Cancel</Button>
            <Button onClick={handleFlagIssue} className="bg-red-600 hover:bg-red-700">
              Flag Issue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FuelReconciliation;