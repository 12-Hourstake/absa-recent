import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Bell,
  Plus,
  AlertTriangle,
  Wrench,
  Clock,
  CreditCard,
  Star,
  TrendingUp,
  Activity,
  ArrowRight,
} from "lucide-react";

const VendorDashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [penalties, setPenalties] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    activeOrders: 0,
    overdueOrders: 0,
    pendingInvoiceAmount: 0,
    avgRating: 4.8,
    completedThisMonth: 0,
    responseTime: '2.4h'
  });

  useEffect(() => {
    loadDashboardData();
    
    // Listen for storage changes to sync with admin updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "WORK_ORDERS_CACHE_V1" || e.key === "INVOICES_CACHE_V1" || e.key === "SLA_PENALTIES_CACHE_V1") {
        loadDashboardData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-tab updates
    const handleCustomUpdate = () => {
      loadDashboardData();
    };
    
    window.addEventListener('work-orders-updated', handleCustomUpdate);
    window.addEventListener('invoices-updated', handleCustomUpdate);
    window.addEventListener('sla-penalties-updated', handleCustomUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('work-orders-updated', handleCustomUpdate);
      window.removeEventListener('invoices-updated', handleCustomUpdate);
      window.removeEventListener('sla-penalties-updated', handleCustomUpdate);
    };
  }, []);

  const loadDashboardData = () => {
    try {
      const currentVendorId = localStorage.getItem("AUTH_SESSION_V1") 
        ? JSON.parse(localStorage.getItem("AUTH_SESSION_V1") || "{}").vendorId 
        : "VEN-001";
      
      // Load work orders - check both assignedVendor and vendorId fields
      const workOrdersCache = JSON.parse(localStorage.getItem("WORK_ORDERS_CACHE_V1") || "[]");
      const vendorWorkOrders = workOrdersCache.filter((wo: any) => 
        wo.assignedVendor === currentVendorId || wo.vendorId === currentVendorId
      );
      setWorkOrders(vendorWorkOrders.slice(0, 4)); // Show latest 4
      
      // Load invoices
      const invoicesCache = JSON.parse(localStorage.getItem("INVOICES_CACHE_V1") || "[]");
      const vendorInvoices = invoicesCache.filter((inv: any) => inv.vendorId === currentVendorId);
      setInvoices(vendorInvoices);
      
      // Load penalties
      const penaltiesCache = JSON.parse(localStorage.getItem("SLA_PENALTIES_CACHE_V1") || "[]");
      const vendorPenalties = penaltiesCache.filter((p: any) => p.vendorId === currentVendorId);
      setPenalties(vendorPenalties);
      
      // Calculate stats
      const activeOrders = vendorWorkOrders.filter((wo: any) => wo.status !== "Completed").length;
      const overdueOrders = vendorWorkOrders.filter((wo: any) => {
        const dueDate = new Date(wo.dueDate);
        return wo.status !== "Completed" && dueDate < new Date();
      }).length;
      const pendingInvoiceAmount = vendorInvoices
        .filter((inv: any) => inv.status === "Pending")
        .reduce((sum: number, inv: any) => sum + inv.amount, 0);
      const completedThisMonth = vendorWorkOrders.filter((wo: any) => {
        const created = new Date(wo.createdDate);
        const now = new Date();
        return wo.status === "Completed" && created.getMonth() === now.getMonth();
      }).length;
      
      setDashboardStats({
        activeOrders,
        overdueOrders,
        pendingInvoiceAmount,
        avgRating: 4.8,
        completedThisMonth,
        responseTime: '2.4h'
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back, {session?.fullName || 'Vendor Partner'}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="relative border-gray-300">
                <Bell className="w-4 h-4" />
                {penalties.filter(p => p.status === 'Invoice Sent').length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Button>
              <Button onClick={() => navigate('/vendor/invoice-submission')} className="bg-gray-900 hover:bg-gray-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Submit Invoice
              </Button>
            </div>
          </div>
        </div>
        {/* Stats Grid */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Orders</p>
                    <p className="text-3xl font-semibold text-gray-900 mt-2">{dashboardStats.activeOrders}</p>
                    <p className="text-xs text-gray-500 mt-1">In progress</p>
                  </div>
                  <Wrench className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-3xl font-semibold text-gray-900 mt-2">{dashboardStats.completedThisMonth}</p>
                    <p className="text-xs text-gray-500 mt-1">This month</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Response Time</p>
                    <p className="text-3xl font-semibold text-gray-900 mt-2">{dashboardStats.responseTime}</p>
                    <p className="text-xs text-gray-500 mt-1">Average</p>
                  </div>
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rating</p>
                    <p className="text-3xl font-semibold text-gray-900 mt-2">{dashboardStats.avgRating}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`w-3 h-3 ${i <= Math.floor(dashboardStats.avgRating) ? 'text-gray-900 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <Star className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Recent Work Orders */}
            <div className="lg:col-span-3">
              <Card className="border border-gray-200">
                <CardHeader className="border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">Recent Work Orders</CardTitle>
                    <Button variant="outline" onClick={() => navigate('/vendor/work-orders')} className="text-sm">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {workOrders.slice(0, 8).map((order, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {order.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.dueDate}</td>
                          </tr>
                        ))}
                        {workOrders.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                              No work orders assigned yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <Card className="border border-gray-200">
                <CardHeader className="border-b border-gray-200 bg-gray-50">
                  <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Button onClick={() => navigate('/vendor/work-orders')} className="w-full justify-start bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Wrench className="w-4 h-4 mr-2" />
                      View All Orders
                    </Button>
                    <Button onClick={() => navigate('/vendor/invoice-submission')} className="w-full justify-start bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Plus className="w-4 h-4 mr-2" />
                      Submit Invoice
                    </Button>
                    <Button onClick={() => navigate('/vendor/penalties')} className="w-full justify-start bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      SLA Penalties
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
