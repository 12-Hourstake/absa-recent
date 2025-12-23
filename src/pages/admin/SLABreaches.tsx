import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Search, Eye, FileText, X } from "lucide-react";
import { useState } from "react";
import CustomSelectDropdown from "@/components/ui/CustomSelectDropdown";
import { useSLA } from "@/contexts/SLAContext";

const SLABreaches = () => {
  const { breaches } = useSLA();
  const [branchFilter, setBranchFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedBreach, setSelectedBreach] = useState<any>(null);
  const filteredBreaches = breaches.filter(breach => {
    const matchesSearch = breach.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         breach.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === "all" || breach.branch.toLowerCase().includes(branchFilter);
    const matchesType = typeFilter === "all" || breach.slaType.toLowerCase().includes(typeFilter);
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "resolved" && breach.status === "Resolved") ||
                         (statusFilter === "pending" && breach.status === "Pending Action");
    return matchesSearch && matchesBranch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SLA Breaches</h1>
          <p className="text-muted-foreground mt-1">Manage all Service Level Agreement violations.</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700"><Download className="h-4 w-4 mr-2" />Export Breaches (CSV)</Button>
      </header>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              <Button 
                variant={statusFilter === "all" ? "default" : "outline"}
                className={statusFilter === "all" ? "bg-red-600 hover:bg-red-700" : ""}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button 
                variant={statusFilter === "resolved" ? "default" : "outline"}
                className={statusFilter === "resolved" ? "bg-red-600 hover:bg-red-700" : ""}
                size="sm"
                onClick={() => setStatusFilter("resolved")}
              >
                Resolved
              </Button>
              <Button 
                variant={statusFilter === "pending" ? "default" : "outline"}
                className={statusFilter === "pending" ? "bg-red-600 hover:bg-red-700" : ""}
                size="sm"
                onClick={() => setStatusFilter("pending")}
              >
                Pending
              </Button>
            </div>
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 pl-10 text-sm placeholder-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all"
                  placeholder="Search by Ticket ID, Branch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <CustomSelectDropdown
                options={[
                  { value: "all", label: "All Branches" },
                  { value: "villaggio", label: "Villaggio Vista" },
                  { value: "trassaco", label: "Trassaco Valley Homes" },
                  { value: "osu", label: "Osu Apartments" }
                ]}
                value={branchFilter}
                onChange={setBranchFilter}
                placeholder="All Branches"
                className="w-40"
              />
              <CustomSelectDropdown
                options={[
                  { value: "all", label: "All SLA Types" },
                  { value: "plumbing", label: "Plumbing Emergency" },
                  { value: "electrical", label: "Electrical Fault" },
                  { value: "hvac", label: "HVAC Repair" }
                ]}
                value={typeFilter}
                onChange={setTypeFilter}
                placeholder="All SLA Types"
                className="w-40"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Ticket ID</th>
                  <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Branch</th>
                  <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">SLA Type</th>
                  <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Breach Date</th>
                  <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Resolution Date</th>
                  <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Status</th>
                  <th className="p-4 text-right text-xs font-medium uppercase tracking-wider text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBreaches.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <p className="text-lg font-medium text-muted-foreground">No SLA breaches recorded</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            All active SLAs are currently within limits
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBreaches.map((breach) => (
                    <tr key={breach.id} className="hover:bg-muted/50">
                      <td className="p-4 font-medium text-sm">{breach.ticketId}</td>
                      <td className="p-4 text-sm font-medium">{breach.branch}</td>
                      <td className="p-4 text-sm">{breach.slaType}</td>
                      <td className="p-4 text-sm">{breach.breachDate.toLocaleDateString()}</td>
                      <td className="p-4 text-sm">{breach.resolutionDate ? breach.resolutionDate.toLocaleDateString() : "-"}</td>
                      <td className="p-4">
                        <Badge 
                          className={breach.status === "Resolved" 
                            ? "bg-green-100 text-green-700 hover:bg-green-100" 
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                          }
                        >
                          {breach.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            onClick={() => { setSelectedBreach(breach); setShowViewModal(true); }}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between p-4">
        <div className="hidden sm:block">
          <p className="text-sm text-slate-600">
            Showing <span className="font-medium">{Math.min(filteredBreaches.length, 10)}</span> of <span className="font-medium">{filteredBreaches.length}</span> results
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>

      {/* View Breach Modal */}
      {showViewModal && selectedBreach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-[600px] rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">Breach Details</h2>
              <button 
                className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100"
                onClick={() => setShowViewModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-600">Ticket ID:</span>
                  <p className="text-slate-900">{selectedBreach.ticketId}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Branch:</span>
                  <p className="text-slate-900">{selectedBreach.branch}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-600">SLA Type:</span>
                  <p className="text-slate-900">{selectedBreach.slaType}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Breach Date:</span>
                  <p className="text-slate-900">{selectedBreach.breachDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Resolution Date:</span>
                  <p className="text-slate-900">{selectedBreach.resolutionDate ? selectedBreach.resolutionDate.toLocaleDateString() : "Not resolved"}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Related Entity:</span>
                  <p className="text-slate-900">{selectedBreach.relatedEntity}</p>
                </div>
              </div>
              <div>
                <span className="font-medium text-slate-600">Status:</span>
                <Badge className={selectedBreach.status === "Resolved" ? "bg-green-100 text-green-700 ml-2" : "bg-yellow-100 text-yellow-700 ml-2"}>
                  {selectedBreach.status}
                </Badge>
              </div>
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex justify-end">
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Breach Modal */}
      {showEditModal && selectedBreach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-[600px] rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">Edit Breach</h2>
              <button 
                className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100"
                onClick={() => setShowEditModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Branch</label>
                    <input 
                      className="w-full h-11 rounded-lg border border-slate-300 px-3 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                      defaultValue={selectedBreach.branch}
                    />
                  </div>

                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <CustomSelectDropdown
                    options={[
                      { value: "resolved", label: "Resolved" },
                      { value: "pending", label: "Pending Action" }
                    ]}
                    value={selectedBreach.status === "Resolved" ? "resolved" : "pending"}
                    onChange={() => {}}
                    placeholder="Select status"
                  />
                </div>
              </form>
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
              <button 
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={() => setShowEditModal(false)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showReportModal && selectedBreach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-[500px] rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">Generate Breach Report</h2>
              <button 
                className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100"
                onClick={() => setShowReportModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-4">
                Generate a detailed report for breach {selectedBreach.id}?
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Report will include:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Breach timeline and details</li>
                  <li>• Resolution actions taken</li>
                  <li>• Impact assessment</li>
                  <li>• Recommendations</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
              <button 
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                onClick={() => setShowReportModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                onClick={() => setShowReportModal(false)}
              >
                <Download className="h-4 w-4" />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SLABreaches;
