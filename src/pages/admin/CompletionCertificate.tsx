import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Upload, Search, MoreVertical, Eye, Download, CheckCircle, X, ChevronDown, Calendar, Tag, ShieldCheck } from "lucide-react";

const CompletionCertificate = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [serviceType, setServiceType] = useState("plumbing");
  const [provider, setProvider] = useState("kwame");
  const [property, setProperty] = useState("Unit 4B, Osu Heights Apartments");
  const [workOrder, setWorkOrder] = useState("#WO-2023-894 (Leak Repair)");
  const [completionDate, setCompletionDate] = useState("2023-10-24");
  const [notes, setNotes] = useState("");
  const [approverName, setApproverName] = useState("Ama Osei");
  const [isConfirmed, setIsConfirmed] = useState(true);

  const handleGenerateCertificate = () => {
    console.log('Generating certificate');
    setShowGenerateModal(false);
  };

  const certificates = [
    {
      id: "ABSA-WC-2024-001",
      serviceType: "Water Delivery",
      property: "Adom Apartments, Osu",
      date: "2024-07-25",
      status: "approved",
      provider: "Ghana Water Co.",
    },
    {
      id: "ABSA-WC-2024-002",
      serviceType: "Plumbing Repair",
      property: "The Pearl, Cantonments",
      date: "2024-07-22",
      status: "pending",
      provider: "Kwame Plumbing Services",
    },
    {
      id: "ABSA-WC-2024-003",
      serviceType: "Water Delivery",
      property: "Mawuena Heights, East Legon",
      date: "2024-07-20",
      status: "issued",
      provider: "Accra Water Suppliers",
    },
    {
      id: "ABSA-WC-2024-004",
      serviceType: "Electrical Maintenance",
      property: "Adom Apartments, Osu",
      date: "2024-07-18",
      status: "approved",
      provider: "Voltage Solutions Ghana",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      approved: { variant: "default", label: "Approved" },
      pending: { variant: "secondary", label: "Pending" },
      issued: { variant: "outline", label: "Issued" },
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} className="bg-success/20 text-success hover:bg-success/30">
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Manage Completion Certificates</h1>
          <p className="text-muted-foreground">
            Generate, view, and manage all service completion certificates.
          </p>
        </div>
        <Button 
          className="gap-2 bg-red-600 hover:bg-red-700"
          onClick={() => setShowGenerateModal(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Generate New Certificate
        </Button>
      </div>



      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Generated Certificates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Certificate ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="issued">Issued</SelectItem>
                </SelectContent>
              </Select>
              <Input type="month" className="w-[180px]" />
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Certificate ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Service Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{cert.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{cert.serviceType}</td>
                      <td className="px-6 py-4">{cert.property}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{cert.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(cert.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                            {cert.status === "pending" && (
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate New Certificate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Modal Container */}
          <div className="bg-white w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl ring-1 ring-black/5">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Add Completion Certificate
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Create a new certificate for completed maintenance work.
                </p>
              </div>
              <button 
                className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() => setShowGenerateModal(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
              {/* Section 1: Core Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-900" htmlFor="service-type">
                    Service Type
                  </label>
                  <div className="relative group">
                    <select 
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 text-slate-900 h-12 pl-4 pr-10 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 appearance-none cursor-pointer font-normal shadow-sm transition-all"
                      id="service-type"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                    >
                      <option value="">Select type...</option>
                      <option value="plumbing">Plumbing Maintenance</option>
                      <option value="electrical">Electrical Repair</option>
                      <option value="hvac">HVAC Service</option>
                      <option value="general">General Cleaning</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none h-5 w-5" />
                  </div>
                </div>
                {/* Service Provider */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-900" htmlFor="provider">
                    Service Provider
                  </label>
                  <div className="relative group">
                    <select 
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 text-slate-900 h-12 pl-4 pr-10 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 appearance-none cursor-pointer font-normal shadow-sm transition-all"
                      id="provider"
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                    >
                      <option value="">Select provider...</option>
                      <option value="kwame">Kwame Mensah Services Ltd.</option>
                      <option value="osu">Osu Facility Mgmt</option>
                      <option value="accra">Accra Rapid Fix</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Section 2: Property & Work Order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property/Unit Search */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-900" htmlFor="property">
                    Property/Unit
                  </label>
                  <div className="relative flex items-center group">
                    <input 
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 text-slate-900 h-12 pl-4 pr-10 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 placeholder:text-slate-400 font-normal shadow-sm transition-all"
                      id="property"
                      placeholder="Search property..."
                      type="text"
                      value={property}
                      onChange={(e) => setProperty(e.target.value)}
                    />
                    <Search className="absolute right-3 text-slate-400 group-focus-within:text-slate-500 pointer-events-none h-5 w-5" />
                  </div>
                </div>
                {/* Work Order Search (Optional) */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-900" htmlFor="work-order">
                      Associated Work Order
                    </label>
                    <span className="text-xs text-slate-500 font-normal bg-slate-100 px-2 py-0.5 rounded">
                      Optional
                    </span>
                  </div>
                  <div className="relative flex items-center group">
                    <input 
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 text-slate-900 h-12 pl-4 pr-10 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 placeholder:text-slate-400 font-normal shadow-sm transition-all"
                      id="work-order"
                      placeholder="Search ID or Keyword..."
                      type="text"
                      value={workOrder}
                      onChange={(e) => setWorkOrder(e.target.value)}
                    />
                    <Tag className="absolute right-3 text-slate-400 group-focus-within:text-slate-500 pointer-events-none h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Section 3: Date & Notes */}
              <div className="flex flex-col gap-6">
                <div className="w-full md:w-1/2 pr-0 md:pr-3">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-900" htmlFor="completion-date">
                      Date of Completion
                    </label>
                    <div className="relative group">
                      <input 
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 text-slate-900 h-12 pl-4 pr-4 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 shadow-sm transition-all"
                        id="completion-date"
                        type="date"
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-900" htmlFor="notes">
                    Completion Notes
                  </label>
                  <div className="relative">
                    <textarea 
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 text-slate-900 min-h-[120px] p-4 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 shadow-sm resize-y transition-all placeholder:text-slate-400"
                      id="notes"
                      placeholder="Describe the work completed. E.g. Replaced main valve in bathroom, total cost GHS 450.00..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-slate-400 pointer-events-none">
                      {notes.length}/500
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Digital Sign-off */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-slate-100 rounded-md">
                    <ShieldCheck className="text-slate-600 h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Digital Sign-off
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-900" htmlFor="approver-name">
                      Approver Name
                    </label>
                    <input 
                      className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 h-12 px-4 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 shadow-sm transition-all"
                      id="approver-name"
                      type="text"
                      value={approverName}
                      onChange={(e) => setApproverName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 opacity-75">
                    <label className="text-sm font-medium text-slate-900" htmlFor="approval-date">
                      Date
                    </label>
                    <div className="relative">
                      <input 
                        className="w-full rounded-lg border border-slate-200 bg-slate-100 text-slate-500 h-12 px-4 cursor-not-allowed select-none"
                        id="approval-date"
                        readOnly
                        type="text"
                        value="24 Oct, 2023"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <label className="flex items-start gap-3 p-3 -ml-3 rounded-lg hover:bg-white/50 transition-colors cursor-pointer group select-none">
                    <div className="flex items-center h-5 mt-0.5">
                      <input 
                        className="w-5 h-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 bg-white cursor-pointer transition-colors"
                        type="checkbox"
                        checked={isConfirmed}
                        onChange={(e) => setIsConfirmed(e.target.checked)}
                      />
                    </div>
                    <div className="text-sm">
                      <span className="font-bold text-slate-900 block">
                        I confirm this work is complete
                      </span>
                      <span className="text-slate-500 font-normal">
                        By checking this box, you certify that the services have been rendered satisfactorily for the specified property.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Action Bar */}
            <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-xl shrink-0">
              <button 
                className="px-6 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1 transition-colors"
                onClick={() => setShowGenerateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-8 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all flex items-center justify-center gap-2"
                onClick={handleGenerateCertificate}
              >
                <CheckCircle className="h-5 w-5" />
                Generate Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletionCertificate;
