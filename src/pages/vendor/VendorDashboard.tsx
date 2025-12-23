import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Plus,
  AlertTriangle,
  Wrench,
  Clock,
  CreditCard,
  Star,
  Download,
  FileText,
  Receipt,
  ChevronRight,
} from "lucide-react";

const mockWorkOrders = [
  {
    id: "#WO-8821",
    serviceType: "HVAC Repair",
    location: "Spintex Road Branch",
    status: "In Progress",
    statusColor: "bg-blue-50 text-blue-700 border-blue-100",
    dueDate: "Oct 24, 2024",
    action: "Update",
    actionStyle: "text-teal-600 hover:text-teal-700 border-teal-200 bg-teal-50",
  },
  {
    id: "#WO-8822",
    serviceType: "Generator Service",
    location: "Adum, Kumasi",
    status: "Scheduled",
    statusColor: "bg-slate-100 text-slate-600 border-slate-200",
    dueDate: "Oct 26, 2024",
    action: "Details",
    actionStyle: "text-slate-500 hover:text-slate-700 hover:bg-slate-100",
  },
  {
    id: "#WO-8823",
    serviceType: "Plumbing Fix",
    location: "Airport City HQ",
    status: "Completed",
    statusColor: "bg-green-50 text-green-700 border-green-100",
    dueDate: "Oct 20, 2024",
    action: "Invoice",
    actionStyle: "text-slate-500 hover:text-slate-700 hover:bg-slate-100",
  },
  {
    id: "#WO-8824",
    serviceType: "ATM Maintenance",
    location: "Cape Coast Branch",
    status: "Overdue",
    statusColor: "bg-red-50 text-red-700 border-red-100",
    dueDate: "Oct 18, 2024",
    action: "Resolve",
    actionStyle: "text-white bg-red-600 hover:bg-red-700",
  },
];

const documents = [
  {
    name: "2024 Vendor Contract",
    size: "2.4 MB • PDF",
    icon: "📄",
    bgColor: "bg-red-50",
    textColor: "text-red-500",
  },
  {
    name: "Safety Guidelines v2",
    size: "1.1 MB • DOCX",
    icon: "📋",
    bgColor: "bg-blue-50",
    textColor: "text-blue-500",
  },
  {
    name: "Invoice Template",
    size: "0.5 MB • XLS",
    icon: "🧾",
    bgColor: "bg-slate-100",
    textColor: "text-slate-500",
  },
];

const VendorDashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Vendor Dashboard</h2>
          <p className="text-sm text-slate-500">
            Welcome back, <span className="text-red-600 font-medium">{session?.fullName || 'Kwame Enterprises'}</span>
          </p>
        </div>
        
        <div className="w-1/3 min-w-[300px]">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <Input 
              className="pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-200 transition-all"
              placeholder="Search work orders, invoices, or docs..."
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="relative p-2 text-slate-500 hover:text-red-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white"></span>
          </Button>
          <Button 
            onClick={() => navigate('/vendor/invoice-submission')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium shadow-sm hover:bg-red-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Request
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          {/* SLA Risk Alert */}
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">SLA Risk Alert</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Warning: Response time for ticket <span className="font-mono font-medium text-slate-800">#WO-2992</span> at East Legon Branch is approaching breach limit (2 hours left).
                </p>
              </div>
            </div>
            <Button variant="outline" className="whitespace-nowrap px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors shadow-sm">
              View Ticket
            </Button>
          </div>

          {/* KPI Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active Orders */}
            <Card className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 text-sm font-medium">Active Work Orders</p>
                <Wrench className="w-5 h-5 text-slate-300 group-hover:text-red-600 transition-colors" />
              </div>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">12</p>
              <p className="text-xs text-slate-400 mt-1">3 due this week</p>
            </Card>

            {/* Overdue Orders */}
            <Card className="bg-white p-5 rounded-xl border border-red-100 shadow-sm hover:border-red-200 transition-colors group relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-1 bg-red-500"></div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-red-700 text-sm font-medium">Overdue Work Orders</p>
                <Clock className="w-5 h-5 text-red-300 group-hover:text-red-500 transition-colors" />
              </div>
              <p className="text-3xl font-bold text-red-600 tracking-tight">2</p>
              <p className="text-xs text-red-400 mt-1">Action required immediately</p>
            </Card>

            {/* Pending Invoices */}
            <Card className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 text-sm font-medium">Pending Invoices</p>
                <CreditCard className="w-5 h-5 text-slate-300 group-hover:text-red-600 transition-colors" />
              </div>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">
                <span className="text-sm font-normal text-slate-400 mr-1">GHS</span>45.2k
              </p>
              <p className="text-xs text-slate-400 mt-1">Last payment received: 2 days ago</p>
            </Card>

            {/* Average Rating */}
            <Card className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 text-sm font-medium">Avg Work Rating</p>
                <Star className="w-5 h-5 text-slate-300 group-hover:text-yellow-500 transition-colors" />
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-slate-900 tracking-tight">4.8</p>
                <p className="text-sm text-slate-400 mb-1 font-medium">/ 5.0</p>
              </div>
              <div className="flex gap-0.5 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <Star className="w-4 h-4 text-yellow-400 fill-current" style={{ clipPath: 'inset(0 50% 0 0)' }} />
              </div>
            </Card>
          </div>

          {/* Widgets Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Service Request Overview Widget */}
            <Card className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <CardTitle className="text-lg font-bold text-slate-900">Service Request Overview</CardTitle>
                <select className="text-xs border-slate-200 rounded-md py-1 px-2 focus:ring-teal-200 focus:border-teal-600 text-slate-600 bg-slate-50 cursor-pointer">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Quarter</option>
                </select>
              </div>
              <div className="flex flex-col gap-5">
                {/* Bar 1 */}
                <div className="w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">Repair & Maintenance</span>
                    <span className="font-semibold text-slate-900">65%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-red-600 h-3 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">High volume at Spintex Branch</p>
                </div>
                
                {/* Bar 2 */}
                <div className="w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">Safety Inspections</span>
                    <span className="font-semibold text-slate-900">25%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-slate-800 h-3 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                
                {/* Bar 3 */}
                <div className="w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">New Installations</span>
                    <span className="font-semibold text-slate-900">10%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-slate-400 h-3 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Document Quick Access Widget */}
            <Card className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg font-bold text-slate-900">Quick Documents</CardTitle>
                <Button variant="link" className="text-xs text-teal-600 hover:text-teal-700 font-medium p-0 h-auto">
                  View all
                </Button>
              </div>
              <div className="flex flex-col gap-3">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded ${doc.bgColor} flex items-center justify-center ${doc.textColor} flex-shrink-0`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-slate-800 truncate max-w-[140px]">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors">
                      <Download className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Latest Work Orders Table */}
          <Card className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-900">Latest Work Orders</CardTitle>
              <Button 
                variant="link" 
                onClick={() => navigate('/vendor/work-orders')}
                className="text-sm text-teal-600 font-medium hover:text-teal-700 p-0 h-auto"
              >
                View All Orders
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Service Type</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {mockWorkOrders.map((order, index) => (
                    <tr key={index} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                      <td className="px-6 py-4 text-slate-700">{order.serviceType}</td>
                      <td className="px-6 py-4 text-slate-600">{order.location}</td>
                      <td className="px-6 py-4">
                        <Badge className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${order.statusColor}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{order.dueDate}</td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          size="sm" 
                          className={`font-medium text-xs px-3 py-1.5 rounded transition-all ${order.actionStyle}`}
                        >
                          {order.action}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
