import { useState } from "react";
import { Search, Download, Plus, TrendingUp, ChevronLeft, ChevronRight, MoreVertical, X, Info, Receipt, Eye, Edit, Trash2 } from "lucide-react";

const Billing = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [includeLate, setIncludeLate] = useState(false);
  const [sendEmails, setSendEmails] = useState(true);
  const [selectedProperties, setSelectedProperties] = useState<string>("");
  const [invoiceMonth, setInvoiceMonth] = useState<string>("2023-11");

  const handleGenerateInvoices = () => {
    console.log('Generating invoices');
    setIsGenerateModalOpen(false);
  };

  const invoices = [
    {
      id: "INV-2023-001",
      tenant: "Kwame Mensah",
      property: "Unit 4B, East Legon Apts",
      amount: "2,500",
      dueDate: "Oct 01, 2023",
      status: "paid",
      avatar: "https://www.bing.com/th?id=OIP.MRFqLe-Djizc2XkHWgYRzQHaHa"
    },
    {
      id: "INV-2023-002",
      tenant: "Abena Osei",
      property: "Hse 12, Cantonments",
      amount: "4,200",
      dueDate: "Sep 28, 2023",
      status: "overdue",
      avatar: "https://www.bing.com/th?id=OIP.MRFqLe-Djizc2XkHWgYRzQHaHa"
    },
    {
      id: "INV-2023-005",
      tenant: "Kojo Antwi",
      property: "Shop 5, Osu Mall",
      amount: "1,800",
      dueDate: "Oct 05, 2023",
      status: "pending",
      avatar: "https://www.bing.com/th?id=OIP.MRFqLe-Djizc2XkHWgYRzQHaHa"
    },
    {
      id: "INV-2023-008",
      tenant: "Ama Darko",
      property: "Unit 10, Spintex Heights",
      amount: "3,000",
      dueDate: "Oct 02, 2023",
      status: "paid",
      avatar: "https://www.bing.com/th?id=OIP.MRFqLe-Djizc2XkHWgYRzQHaHa"
    },
    {
      id: "INV-2023-012",
      tenant: "Esi Doe",
      property: "Apt 2, Airport Residential",
      amount: "5,500",
      dueDate: "Sep 30, 2023",
      status: "paid",
      avatar: "https://www.bing.com/th?id=OIP.MRFqLe-Djizc2XkHWgYRzQHaHa"
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 scroll-smooth">
      <div className="flex flex-col gap-6">
        {/* Page Heading & Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Rent Billing & Payments
            </h1>
            <p className="text-slate-500 text-base">
              Manage all rent invoices and track collections.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 h-12 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm transition-all shadow-sm">
              <Download className="h-5 w-5" />
              Export Ledger
            </button>
            <button 
              className="flex items-center gap-2 px-5 h-12 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all shadow-md"
              onClick={() => setIsGenerateModalOpen(true)}
            >
              <Plus className="h-5 w-5" />
              Generate Monthly Invoices
            </button>
          </div>
        </div>

        {/* Enhanced KPI Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Metrics Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-slate-500 text-sm font-medium">Total Rent Due</p>
                  <h3 className="text-2xl font-bold text-slate-900">GHS 85,000</h3>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <svg className="h-6 w-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-4 w-4" />
                <span>+12% from last month</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-slate-500 text-sm font-medium">Collected This Month</p>
                  <h3 className="text-2xl font-bold text-slate-900">GHS 45,000</h3>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                <div className="bg-slate-600 h-1.5 rounded-full" style={{width: '53%'}}></div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-slate-500 text-sm font-medium">Overdue Amount</p>
                  <h3 className="text-2xl font-bold text-red-600">GHS 12,500</h3>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-slate-500">Requires immediate attention</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-slate-500 text-sm font-medium">Overdue Invoices</p>
                  <h3 className="text-2xl font-bold text-slate-900">3</h3>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <svg className="h-6 w-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex -space-x-2 overflow-hidden">
                <div className="h-6 w-6 rounded-full bg-gray-200 border border-white" style={{backgroundImage: 'url(https://images.unsplas.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face)', backgroundSize: 'cover'}}></div>
                <div className="h-6 w-6 rounded-full bg-gray-300 border border-white" style={{backgroundImage: 'url(https://images.unspash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face)', backgroundSize: 'cover'}}></div>
                <div className="h-6 w-6 rounded-full bg-slate-600 border border-white flex items-center justify-center text-[10px] font-bold text-white">+1</div>
              </div>
            </div>
          </div>

          {/* Right: Visualizations */}
          <div className="lg:col-span-1 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col gap-6">
            {/* Gauge Chart Section */}
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-slate-500 w-full text-left mb-2">Collection Rate</p>
              <div className="relative h-32 w-48">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                  <path className="fill-none stroke-slate-200 stroke-[10]" d="M 10 50 A 40 40 0 0 1 90 50"></path>
                  <path className="fill-none stroke-slate-600 stroke-[10] stroke-linecap-round transition-all duration-500" d="M 10 50 A 40 40 0 0 1 90 50" strokeDasharray="66, 1000"></path>
                </svg>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900">53%</span>
                </div>
              </div>
            </div>
            <hr className="border-slate-200" />
            {/* Bar Chart Section */}
            <div className="flex flex-col flex-1 justify-end">
              <div className="flex justify-between items-end mb-2">
                <p className="text-sm font-medium text-slate-500">Projected vs Actual</p>
              </div>
              <div className="flex items-end gap-4 h-24 w-full">
                <div className="flex-1 flex flex-col justify-end gap-1 group">
                  <div className="text-xs text-slate-500 text-center opacity-0 group-hover:opacity-100 transition-opacity">85k</div>
                  <div className="w-full bg-gray-200 rounded-t-sm hover:bg-gray-300 transition-colors h-full"></div>
                  <p className="text-xs text-center font-medium text-slate-500">Projected</p>
                </div>
                <div className="flex-1 flex flex-col justify-end gap-1 group">
                  <div className="text-xs text-slate-600 text-center opacity-0 group-hover:opacity-100 transition-opacity font-bold">45k</div>
                  <div className="w-full bg-slate-600 rounded-t-sm hover:bg-slate-700 transition-colors" style={{height: '53%'}}></div>
                  <p className="text-xs text-center font-medium text-slate-900">Actual</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all" 
              placeholder="Search by tenant, invoice ID, or property..." 
              type="text" 
            />
          </div>
          <div className="flex gap-2">
            <button 
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                statusFilter === "all" ? "bg-red-600 text-white border-red-600" : "border-slate-300 hover:bg-slate-50"
              }`}
              onClick={() => setStatusFilter("all")}
            >
              All
            </button>
            <button 
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                statusFilter === "paid" ? "bg-red-600 text-white border-red-600" : "border-slate-300 hover:bg-slate-50"
              }`}
              onClick={() => setStatusFilter("paid")}
            >
              Paid
            </button>
            <button 
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                statusFilter === "overdue" ? "bg-red-600 text-white border-red-600" : "border-slate-300 hover:bg-slate-50"
              }`}
              onClick={() => setStatusFilter("overdue")}
            >
              Overdue
            </button>
            <button 
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                statusFilter === "pending" ? "bg-red-600 text-white border-red-600" : "border-slate-300 hover:bg-slate-50"
              }`}
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </button>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">Tenant Name</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">Property Unit</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">Amount Due</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">Due Date</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-9 w-9 rounded-full bg-cover bg-center"
                          style={{backgroundImage: `url(${invoice.avatar})`}}
                        ></div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{invoice.tenant}</p>
                          <p className="text-xs text-slate-500">#{invoice.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{invoice.property}</td>
                    <td className="p-4 text-sm font-bold text-slate-900">GHS {invoice.amount}</td>
                    <td className={`p-4 text-sm ${
                      invoice.status === "overdue" ? "text-red-500 font-medium" : "text-muted-foreground"
                    }`}>
                      {invoice.dueDate}
                    </td>
                    <td className="p-4">
                      {invoice.status === "paid" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      )}
                      {invoice.status === "overdue" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Overdue
                        </span>
                      )}
                      {invoice.status === "pending" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-slate-200">
            <p className="text-sm text-muted-foreground">
              Showing 1 to 5 of 24 results
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Rows per page:
                </span>
                <select className="w-[70px] h-8 px-2 rounded border border-slate-300 text-sm">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded border border-slate-300 text-sm font-medium hover:bg-slate-50 disabled:opacity-50" disabled>
                  Previous
                </button>
                <span className="text-sm">1 / 5</span>
                <button className="px-3 py-1.5 rounded border border-slate-300 text-sm font-medium hover:bg-slate-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Monthly Invoices Modal */}
        {isGenerateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 transition-opacity duration-300">
            {/* Modal Container */}
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">
                  Generate Monthly Rent Invoices
                </h3>
                <button 
                  className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none rounded-full p-1 hover:bg-slate-100"
                  onClick={() => setIsGenerateModalOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 flex flex-col gap-6 overflow-y-auto">
                {/* Property Select */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-900" htmlFor="properties">
                    Properties to Invoice
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm focus:border-slate-500 focus:ring-slate-500 shadow-sm text-slate-900"
                      id="properties"
                      value={selectedProperties}
                      onChange={(e) => setSelectedProperties(e.target.value)}
                    >
                      <option value="">Select properties...</option>
                      <option value="all">All Properties</option>
                      <option value="osu">Osu Heights (12 Tenants)</option>
                      <option value="labone">Labone Apartments (8 Tenants)</option>
                      <option value="spintex">Spintex Commercials (5 Tenants)</option>
                      <option value="cantonments">Cantonments Residency (15 Tenants)</option>
                    </select>
                  </div>
                  <p className="text-xs text-slate-500">
                    Invoices will be generated for all active tenants in selected properties.
                  </p>
                </div>

                {/* Date Picker */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-900" htmlFor="invoice-month">
                    Invoice Month
                  </label>
                  <div className="relative">
                    <input 
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm focus:border-slate-500 focus:ring-slate-500 shadow-sm text-slate-900 placeholder:text-slate-400"
                      id="invoice-month"
                      type="month"
                      value={invoiceMonth}
                      onChange={(e) => setInvoiceMonth(e.target.value)}
                    />
                  </div>
                </div>

                {/* Options */}
                <div className="flex flex-col gap-3 pt-2">
                  <label className="inline-flex items-start gap-3 cursor-pointer group">
                    <input 
                      className="size-5 rounded text-red-500 border-slate-300 focus:ring-red-500 focus:ring-offset-0 mt-0.5 transition-colors"
                      type="checkbox"
                      checked={includeLate}
                      onChange={(e) => setIncludeLate(e.target.checked)}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">
                        Include automated late fees
                      </span>
                      <span className="text-xs text-slate-500">
                        Applies a standard penalty of GHS 50.00 for previous overdue balances.
                      </span>
                    </div>
                  </label>
                  <label className="inline-flex items-center gap-3 cursor-pointer group mt-2">
                    <input 
                      className="size-5 rounded text-red-500 border-slate-300 focus:ring-red-500 focus:ring-offset-0 transition-colors"
                      type="checkbox"
                      checked={sendEmails}
                      onChange={(e) => setSendEmails(e.target.checked)}
                    />
                    <span className="text-sm font-medium text-slate-900">
                      Send email notifications immediately
                    </span>
                  </label>
                </div>

                {/* Summary Info Box */}
                <div className="bg-slate-50 rounded-lg p-4 flex gap-3 items-start border border-slate-200">
                  <Info className="text-slate-500 h-5 w-5 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-slate-900">Summary</p>
                    <p className="text-sm text-slate-700">
                      Approximately <span className="font-bold">20 invoices</span> will be generated for November 2023. 
                      Total estimated value: <span className="font-bold">GHS 42,500.00</span>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  className="px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-colors"
                  onClick={() => setIsGenerateModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-red-500 focus:outline-none transition-all flex items-center gap-2"
                  onClick={handleGenerateInvoices}
                >
                  <Receipt className="h-4 w-4" />
                  Generate Invoices
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;