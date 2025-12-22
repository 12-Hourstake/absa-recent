import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, Plus, Calendar, Building, X, Eye, Edit, Trash2, Search } from "lucide-react";
import { useState } from "react";
import CustomSelectDropdown from "@/components/ui/CustomSelectDropdown";

const SLADashboard = () => {
  const [showCreateSLAModal, setShowCreateSLAModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [timeFilter, setTimeFilter] = useState("30");
  const [branchFilter, setBranchFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const tickets = [
    { id: "SLA-24-051", branch: "Polo Heights", type: "Power Outage", remaining: "2 hours 15 mins", status: "Urgent", color: "destructive" },
    { id: "SLA-24-049", branch: "Villaggio Vista", type: "Water Leakage", remaining: "1 day 4 hours", status: "High", color: "secondary" },
    { id: "SLA-24-052", branch: "The Lennox", type: "Elevator Fault", remaining: "2 days 8 hours", status: "High", color: "secondary" },
    { id: "SLA-24-045", branch: "Adomi Apartments", type: "AC Repair", remaining: "3 days 1 hour", status: "Medium", color: "default" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SLA Dashboard</h1>
          <p className="text-muted-foreground">High-level overview of SLA performance and metrics.</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowCreateSLAModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />Create New SLA
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          <CustomSelectDropdown
            options={[
              { value: "7", label: "Last 7 Days" },
              { value: "30", label: "Last 30 Days" },
              { value: "90", label: "Last 90 Days" },
              { value: "365", label: "Last Year" }
            ]}
            value={timeFilter}
            onChange={setTimeFilter}
            placeholder="Select time period"
            className="w-40"
          />
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-slate-500" />
          <CustomSelectDropdown
            options={[
              { value: "all", label: "All Branches" },
              { value: "polo-heights", label: "Polo Heights" },
              { value: "villaggio-vista", label: "Villaggio Vista" },
              { value: "the-lennox", label: "The Lennox" },
              { value: "adomi-apartments", label: "Adomi Apartments" }
            ]}
            value={branchFilter}
            onChange={setBranchFilter}
            placeholder="Select branch"
            className="w-40"
          />
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 pl-10 text-sm placeholder-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Overall SLA Compliance</p>
              <CheckCircle className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold">98.2%</p>
            <p className="text-sm text-red-800 flex items-center gap-1 mt-1">↑ +2.5% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Open SLA Tickets</p>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold">8</p>
            <p className="text-sm text-muted-foreground">2 Urgent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Upcoming SLA Deadlines</p>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold">4</p>
            <p className="text-sm text-muted-foreground">Within next 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Compliance Trend (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-4">
              {[{ month: "May", height: "20%" }, { month: "Jun", height: "82%" }, { month: "Jul", height: "67%" }, { month: "Aug", height: "0%" }, { month: "Sep", height: "95%" }, { month: "Oct", height: "88%" }].map((data, i) => (
                <div key={i} className="flex flex-col items-center gap-2 h-full w-full">
                  <div className="w-full h-full flex items-end bg-muted rounded-t-md">
                    <div className={`w-full rounded-t-md ${i >= 4 ? "bg-red-500" : "bg-teal-300"}`} style={{ height: data.height }} />
                  </div>
                  <p className={`text-xs ${i === 5 ? "font-bold" : "text-muted-foreground"}`}>{data.month}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tickets by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center min-h-[160px]">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle className="stroke-muted" cx="18" cy="18" fill="none" r="15.915" strokeWidth="3.8" />
                  <circle className="stroke-teal-500" cx="18" cy="18" fill="none" r="15.915" strokeDasharray="60, 100" strokeLinecap="round" strokeWidth="3.8" />
                  <circle className="stroke-teal-300" cx="18" cy="18" fill="none" r="15.915" strokeDasharray="25, 100" strokeDashoffset="-60" strokeLinecap="round" strokeWidth="3.8" />
                  <circle className="stroke-red-400" cx="18" cy="18" fill="none" r="15.915" strokeDasharray="15, 100" strokeDashoffset="-85" strokeLinecap="round" strokeWidth="3.8" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">24</span>
                  <span className="text-sm text-muted-foreground">Total Tickets</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mt-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-teal-500" /><span>Resolved (60%)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-teal-300" /><span>In Progress (25%)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-400" /><span>Open (15%)</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>High Priority SLA Tickets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Ticket ID</th>
                  <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Branch</th>
                  <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">SLA Type</th>
                  <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Time Remaining</th>
                  <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Status</th>
                  <th className="p-4 text-right text-xs font-medium uppercase tracking-wider text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-muted/50">
                    <td className="p-4 font-medium text-sm">{ticket.id}</td>
                    <td className="p-4 text-sm">{ticket.branch}</td>
                    <td className="p-4 text-sm">{ticket.type}</td>
                    <td className={`p-4 text-sm ${ticket.status === "Urgent" ? "text-red-600 font-medium" : ""}`}>{ticket.remaining}</td>
                    <td className="p-4">
                      <Badge 
                        className={`${
                          ticket.status === "Urgent" ? "bg-red-100 text-red-700 hover:bg-red-100" :
                          ticket.status === "High" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" :
                          "bg-green-100 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          onClick={() => { setSelectedTicket(ticket); setShowViewModal(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          onClick={() => { setSelectedTicket(ticket); setShowEditModal(true); }}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create New SLA Modal */}
      {showCreateSLAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 transition-opacity duration-300">
          <div className="relative w-full max-w-[600px] transform flex flex-col rounded-xl bg-white shadow-2xl transition-all max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Create New SLA
                </h2>
                <p className="text-sm font-normal text-slate-600">
                  Define service level agreement parameters
                </p>
              </div>
              <button 
                className="group rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                onClick={() => setShowCreateSLAModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <form className="space-y-6">
                {/* Row 1: SLA Name and Priority */}
                <div className="flex flex-col gap-6 sm:flex-row">
                  <label className="flex flex-col flex-1 gap-2">
                    <span className="text-sm font-medium text-slate-900">SLA Name</span>
                    <input 
                      className="w-full h-12 rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-shadow"
                      type="text"
                      placeholder="e.g., Emergency Response SLA"
                    />
                  </label>
                  <label className="flex flex-col flex-1 gap-2">
                    <span className="text-sm font-medium text-slate-900">Priority Level</span>
                    <select className="w-full h-12 appearance-none rounded-lg border border-slate-300 bg-white px-4 py-3 pr-10 text-base text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-shadow cursor-pointer">
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </label>
                </div>

                {/* Row 2: Service Type and Response Time */}
                <div className="flex flex-col gap-6 sm:flex-row">
                  <label className="flex flex-col flex-1 gap-2">
                    <span className="text-sm font-medium text-slate-900">Service Type</span>
                    <select className="w-full h-12 appearance-none rounded-lg border border-slate-300 bg-white px-4 py-3 pr-10 text-base text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-shadow cursor-pointer">
                      <option value="maintenance">Maintenance</option>
                      <option value="emergency">Emergency Response</option>
                      <option value="inspection">Inspection</option>
                      <option value="repair">Repair Services</option>
                    </select>
                  </label>
                  <label className="flex flex-col flex-1 gap-2">
                    <span className="text-sm font-medium text-slate-900">Response Time (Hours)</span>
                    <input 
                      className="w-full h-12 rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-shadow"
                      type="number"
                      placeholder="24"
                      min="1"
                    />
                  </label>
                </div>

                {/* Row 3: Resolution Time and Property */}
                <div className="flex flex-col gap-6 sm:flex-row">
                  <label className="flex flex-col flex-1 gap-2">
                    <span className="text-sm font-medium text-slate-900">Resolution Time (Hours)</span>
                    <input 
                      className="w-full h-12 rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-shadow"
                      type="number"
                      placeholder="72"
                      min="1"
                    />
                  </label>
                  <label className="flex flex-col flex-1 gap-2">
                    <span className="text-sm font-medium text-slate-900">Apply to Branch</span>
                    <select className="w-full h-12 appearance-none rounded-lg border border-slate-300 bg-white px-4 py-3 pr-10 text-base text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-shadow cursor-pointer">
                      <option value="all">All Branches</option>
                      <option value="polo-heights">Polo Heights</option>
                      <option value="villaggio-vista">Villaggio Vista</option>
                      <option value="the-lennox">The Lennox</option>
                      <option value="adomi-apartments">Adomi Apartments</option>
                    </select>
                  </label>
                </div>

                {/* Row 4: Description */}
                <label className="flex flex-col gap-2">
                  <span className="flex justify-between text-sm font-medium text-slate-900">
                    SLA Description
                    <span className="text-xs font-normal text-slate-500">Optional</span>
                  </span>
                  <textarea 
                    className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-shadow"
                    placeholder="Describe the service level agreement terms and conditions..."
                    rows={4}
                  />
                </label>

                {/* Row 5: Confirmation Checkbox */}
                <div className="relative flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                  <div className="flex h-6 items-center">
                    <input 
                      className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer"
                      id="confirm-sla"
                      type="checkbox"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label className="font-medium text-slate-900 cursor-pointer select-none" htmlFor="confirm-sla">
                      I confirm the SLA parameters are accurate
                    </label>
                    <p className="text-slate-500 text-xs mt-0.5">
                      This SLA will be applied to all matching service requests and cannot be easily modified once active.
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end sm:gap-4">
              <button 
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
                onClick={() => setShowCreateSLAModal(false)}
              >
                Cancel
              </button>
              <button 
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={() => setShowCreateSLAModal(false)}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Create SLA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Ticket Modal */}
      {showViewModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-[500px] rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">Ticket Details</h2>
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
                  <p className="text-slate-900">{selectedTicket.id}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Branch:</span>
                  <p className="text-slate-900">{selectedTicket.branch}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Type:</span>
                  <p className="text-slate-900">{selectedTicket.type}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-600">Status:</span>
                  <Badge className={selectedTicket.status === "Urgent" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}>
                    {selectedTicket.status}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="font-medium text-slate-600">Time Remaining:</span>
                <p className={`text-lg font-bold ${selectedTicket.status === "Urgent" ? "text-red-600" : "text-slate-900"}`}>
                  {selectedTicket.remaining}
                </p>
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

      {/* Edit Ticket Modal */}
      {showEditModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-[600px] rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">Edit Ticket</h2>
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
                      defaultValue={selectedTicket.branch}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                    <input 
                      className="w-full h-11 rounded-lg border border-slate-300 px-3 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                      defaultValue={selectedTicket.type}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <CustomSelectDropdown
                    options={[
                      { value: "urgent", label: "Urgent" },
                      { value: "high", label: "High" },
                      { value: "medium", label: "Medium" },
                      { value: "low", label: "Low" }
                    ]}
                    value={selectedTicket.status.toLowerCase()}
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
    </div>
  );
};

export default SLADashboard;
