import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Edit, XCircle, X, Building, Droplets, Calendar, User, Phone, Send } from "lucide-react";
import { mockBranches, getBranchNames } from "@/data/mockBranches";

const TankerRequests = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddRequest = () => {
    console.log('Adding new tanker request');
    setShowAddModal(false);
  };

  const requests = [
    {
      id: "WT-00128",
      branch: "Polo Heights",
      volume: "10,000",
      deliveryDate: "28-Oct-2024",
      status: "scheduled",
      cost: "12,500",
    },
    {
      id: "WT-00127",
      branch: "The Villagio Apartments",
      volume: "5,000",
      deliveryDate: "26-Oct-2024",
      status: "completed",
      cost: "6,250",
    },
    {
      id: "WT-00126",
      branch: "Trassaco Valley",
      volume: "15,000",
      deliveryDate: "25-Oct-2024",
      status: "completed",
      cost: "18,750",
    },
    {
      id: "WT-00125",
      branch: "Airport Residential",
      volume: "5,000",
      deliveryDate: "25-Oct-2024",
      status: "cancelled",
      cost: "0",
    },
    {
      id: "WT-00124",
      branch: "Villagio Vista",
      volume: "7,500",
      deliveryDate: "24-Oct-2024",
      status: "pending",
      cost: "9,375",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string, label: string }> = {
      scheduled: { className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300", label: "Scheduled" },
      completed: { className: "bg-success/20 text-success", label: "Completed" },
      cancelled: { className: "bg-destructive/20 text-destructive", label: "Cancelled" },
      pending: { className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300", label: "Pending" },
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const filterButtons = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "scheduled", label: "Scheduled" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Water Tanker Requests</h1>
          <p className="text-muted-foreground">
            Submit and manage requests for water tanker services.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>New Tanker Request</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Requests</CardDescription>
            <CardTitle className="text-3xl">128</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">8</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-3xl">45</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">320,000 liters total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Cost</CardDescription>
            <CardTitle className="text-3xl">GHS 400K</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Recent Requests</CardTitle>
          <CardDescription>View and manage all water tanker requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Request ID or Branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto">
              {filterButtons.map((filter) => (
                <Button
                  key={filter.value}
                  variant={statusFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Request ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Branch</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Volume (Liters)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Delivery Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Cost (GHS)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-muted/50">
                      <td className="px-4 py-4 font-medium text-primary">{request.id}</td>
                      <td className="px-4 py-4">{request.branch}</td>
                      <td className="px-4 py-4 text-muted-foreground">{request.volume}</td>
                      <td className="px-4 py-4 text-muted-foreground">{request.deliveryDate}</td>
                      <td className="px-4 py-4 text-muted-foreground">{request.cost}</td>
                      <td className="px-4 py-4">{getStatusBadge(request.status)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {request.status !== "completed" && request.status !== "cancelled" && (
                            <>
                              <Button variant="ghost" size="icon" title="Edit Request">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Cancel Request">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Tanker Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          
          {/* Modal Panel */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Add Tanker Request
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Submit a new water delivery request for a branch.
                </p>
              </div>
              <button 
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() => setShowAddModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <form className="flex flex-col gap-6">
                {/* Property / Location */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-white" htmlFor="branch">
                    Branch / Location
                  </label>
                  <Select>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockBranches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name} - {branch.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Row: Volume & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-white" htmlFor="volume">
                      Water Volume
                    </label>
                    <div className="relative">
                      <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                      <input 
                        className="w-full h-12 pl-11 pr-12 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-slate-500 focus:ring-1 focus:ring-slate-200 dark:focus:ring-slate-700 focus:outline-none text-base transition-all"
                        id="volume"
                        name="volume"
                        placeholder="e.g. 10,000"
                        type="text"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Liters
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-white" htmlFor="date">
                      Desired Delivery Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                      <input 
                        className="w-full h-12 pl-11 pr-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-slate-500 focus:ring-1 focus:ring-slate-200 dark:focus:ring-slate-700 focus:outline-none text-base transition-all"
                        id="date"
                        name="date"
                        type="date"
                      />
                    </div>
                  </div>
                </div>

                {/* Row: Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-white" htmlFor="contact-name">
                      Contact Person
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                      <input 
                        className="w-full h-12 pl-11 pr-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-slate-500 focus:ring-1 focus:ring-slate-200 dark:focus:ring-slate-700 focus:outline-none text-base transition-all"
                        id="contact-name"
                        name="contact-name"
                        type="text"
                        defaultValue="Kwame Asante"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-white" htmlFor="contact-phone">
                      Contact Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                      <input 
                        className="w-full h-12 pl-11 pr-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-slate-500 focus:ring-1 focus:ring-slate-200 dark:focus:ring-slate-700 focus:outline-none text-base transition-all"
                        id="contact-phone"
                        name="contact-phone"
                        type="tel"
                        defaultValue="+233 24 456 7890"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-white" htmlFor="instructions">
                    Special Instructions <span className="text-slate-500 dark:text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea 
                    className="w-full min-h-[100px] p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-slate-500 focus:ring-1 focus:ring-slate-200 dark:focus:ring-slate-700 focus:outline-none text-base resize-y transition-all leading-relaxed"
                    id="instructions"
                    name="instructions"
                    placeholder="Enter gate code or specific directions (e.g. Use the back gate entrance near the generator)..."
                  />
                </div>

                {/* Cost Estimate Block */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 shadow-sm">
                      <span className="block w-5 h-5">💰</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Estimated Cost
                      </span>
                      <span className="text-sm text-slate-900 dark:text-white">
                        Based on volume and location
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      GHS 850.00
                    </span>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer / Actions */}
            <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button 
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-white dark:hover:bg-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 transition-all text-sm shadow-sm"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all text-sm shadow-md flex items-center justify-center gap-2"
                onClick={handleAddRequest}
              >
                <Send className="h-4 w-4" />
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TankerRequests;
