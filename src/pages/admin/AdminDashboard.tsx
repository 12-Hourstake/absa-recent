import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Modal from "@/components/ui/Modal";
import {
  Package,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Zap,
  Shield,
  Search,
  Bell,
  HelpCircle,
  Plus,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  Building2,
} from "lucide-react";

// Interfaces
interface Asset {
  id: string;
  location: string;
  avrModel: string;
  serialNumber: string;
  kva: string;
  dateInstalled: string;
  avrStatus: string;
  endOfLife: string;
  inUse: string;
  quantity: number;
  vendor: string;
  comments: string;
  category: string;
  branch: string;
}

interface WorkOrder {
  id: string;
  assetId: string;
  assetName: string;
  category: string;
  location: string;
  workOrderType: string;
  status: string;
  vendorType: string;
  createdDate: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  estimatedCost: string;
  vendorId: string;
  vendorName: string;
  slaStatus?: 'Met' | 'Breached';
  completionDate?: string;
}

interface Vendor {
  id: string;
  name: string;
  contact: string;
  category: string;
  createdDate: string;
}

const ASSETS_STORAGE_KEY = "ASSETS_CACHE_V1";
const WORK_ORDERS_STORAGE_KEY = "WORK_ORDERS_CACHE_V1";
const VENDORS_STORAGE_KEY = "VENDORS_CACHE_V1";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [showSLAAlert, setShowSLAAlert] = useState(true);
  const [showBreachModal, setShowBreachModal] = useState(false);
  const [timeRange, setTimeRange] = useState("7days");
  
  // State for cached data
  const [assets, setAssets] = useState<Asset[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // Load cached data
  useEffect(() => {
    loadAssets();
    loadWorkOrders();
    loadVendors();
  }, []);

  const loadAssets = () => {
    try {
      const cached = localStorage.getItem(ASSETS_STORAGE_KEY);
      setAssets(cached ? JSON.parse(cached) : []);
    } catch (err) {
      setAssets([]);
    }
  };

  const loadWorkOrders = () => {
    try {
      const cached = localStorage.getItem(WORK_ORDERS_STORAGE_KEY);
      setWorkOrders(cached ? JSON.parse(cached) : []);
    } catch (err) {
      setWorkOrders([]);
    }
  };

  const loadVendors = () => {
    try {
      const cached = localStorage.getItem(VENDORS_STORAGE_KEY);
      setVendors(cached ? JSON.parse(cached) : []);
    } catch (err) {
      setVendors([]);
    }
  };

  // Calculate dashboard metrics from cached data
  const dashboardMetrics = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Total Assets with trend
    const totalAssets = assets.length;
    const lastMonthAssets = assets.filter(asset => {
      const installDate = new Date(asset.dateInstalled);
      return installDate.getMonth() < currentMonth || installDate.getFullYear() < currentYear;
    }).length;
    const assetTrend = lastMonthAssets > 0 ? Math.round(((totalAssets - lastMonthAssets) / lastMonthAssets) * 100) : 0;

    // Open Work Orders
    const openWorkOrders = workOrders.filter(wo => wo.status !== "Closed").length;
    const breachedWorkOrders = workOrders.filter(wo => wo.slaStatus === "Breached" && wo.status !== "Closed");
    const slaBreachedCount = breachedWorkOrders.length;

    // PPM Compliance
    const ppmOrders = workOrders.filter(wo => wo.workOrderType === "PPM");
    const ppmCompliant = ppmOrders.filter(wo => wo.slaStatus === "Met");
    const ppmComplianceRate = ppmOrders.length > 0 ? Math.round((ppmCompliant.length / ppmOrders.length) * 100) : 0;

    // Monthly Savings
    const thisMonthOrders = workOrders.filter(wo => {
      const woDate = new Date(wo.createdDate);
      return woDate.getMonth() === currentMonth && woDate.getFullYear() === currentYear;
    });
    const lastMonthOrders = workOrders.filter(wo => {
      const woDate = new Date(wo.createdDate);
      return woDate.getMonth() === lastMonth && woDate.getFullYear() === lastMonthYear;
    });
    
    const thisMonthCost = thisMonthOrders.reduce((sum, wo) => sum + (parseFloat(wo.estimatedCost) || 0), 0);
    const lastMonthCost = lastMonthOrders.reduce((sum, wo) => sum + (parseFloat(wo.estimatedCost) || 0), 0);
    const costSavings = lastMonthCost - thisMonthCost;
    const savingsPercentage = lastMonthCost > 0 ? Math.round((costSavings / lastMonthCost) * 100) : 0;

    // Asset Distribution
    const assetDistribution = {
      active: assets.filter(a => a.inUse === "Y" && a.avrStatus === "Good").length,
      inactive: assets.filter(a => a.inUse === "N").length,
      maintenance: assets.filter(a => a.avrStatus === "Maintenance" || a.avrStatus === "Poor").length,
      disposed: assets.filter(a => a.endOfLife === "Y").length
    };

    // Work Order Activity
    const days = timeRange === "7days" ? 7 : 30;
    const cutoffDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
    const recentWorkOrders = workOrders.filter(wo => new Date(wo.createdDate) >= cutoffDate);
    
    const activityData = {
      created: recentWorkOrders.length,
      completed: recentWorkOrders.filter(wo => wo.status === "Closed").length,
      breached: recentWorkOrders.filter(wo => wo.slaStatus === "Breached").length
    };

    // Critical Alerts
    const overdueOrders = workOrders.filter(wo => {
      if (wo.status === "Closed" || !wo.dueDate) return false;
      const dueDate = new Date(wo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    });
    
    const highPriorityOpen = workOrders.filter(wo => 
      wo.status !== "Closed" && (wo.priority === "High" || wo.priority === "Critical")
    );

    return {
      totalAssets,
      assetTrend,
      openWorkOrders,
      slaBreachedCount,
      breachedWorkOrders,
      ppmComplianceRate,
      ppmOrders: ppmOrders.length,
      costSavings,
      savingsPercentage,
      assetDistribution,
      activityData,
      overdueOrders,
      highPriorityOpen
    };
  }, [assets, workOrders, timeRange]);

  // Vendor Performance calculation
  const vendorPerformance = useMemo(() => {
    return vendors.slice(0, 5).map(vendor => {
      const vendorWorkOrders = workOrders.filter(wo => wo.vendorId === vendor.id);
      const completed = vendorWorkOrders.filter(wo => wo.status === "Closed").length;
      const total = vendorWorkOrders.length;
      const score = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      let rating = "Poor";
      if (score >= 90) rating = "Excellent";
      else if (score >= 75) rating = "Good";
      
      return {
        name: vendor.name,
        score,
        rating
      };
    });
  }, [vendors, workOrders]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "add-asset":
        navigate("/admin/add-asset");
        break;
      case "create-work-order":
        navigate("/admin/create-work-order");
        break;
      case "manage-vendors":
        navigate("/admin/manage-vendors");
        break;
      case "utility-reports":
        navigate("/admin/utility-reports");
        break;
      case "role-management":
        navigate("/admin/user-permissions");
        break;
      default:
        break;
    }
  };



  return (
    <div className="mx-auto max-w-[1600px] flex flex-col gap-6 p-6">
            {/* Critical Alert */}
            {dashboardMetrics.slaBreachedCount > 0 && showSLAAlert && (
              <div className="flex w-full items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-700">CRITICAL ALERT: {dashboardMetrics.slaBreachedCount} Work Order{dashboardMetrics.slaBreachedCount > 1 ? 's' : ''} Breached SLA</h3>
                    <p className="text-sm text-red-600/80">Immediate action required. {dashboardMetrics.breachedWorkOrders.slice(0, 2).map(wo => wo.id).join(', ')} require attention.</p>
                  </div>
                </div>
                <button 
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-red-600/20 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                  onClick={() => setShowBreachModal(true)}
                >
                  View Breaches
                </button>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
                  <span className="text-[18px]">⋮⋮</span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Total Assets</p>
                    <h4 className="mt-2 text-3xl font-bold text-slate-900">{dashboardMetrics.totalAssets}</h4>
                  </div>
                  <div className="rounded-lg bg-red-50 p-2 text-red-600">
                    <Package className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded border ${
                    dashboardMetrics.assetTrend >= 0 ? 'text-green-900 bg-green-100 border-green-200' : 'text-red-900 bg-red-100 border-red-200'
                  }`}>
                    <TrendingUp className="text-[14px] mr-0.5 h-3 w-3" /> {dashboardMetrics.assetTrend >= 0 ? '+' : ''}{dashboardMetrics.assetTrend}%
                  </span>
                  <span className="text-xs text-slate-500">from last month</span>
                </div>
              </div>

              <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
                  <span className="text-[18px]">⋮⋮</span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Open Work Orders</p>
                    <h4 className="mt-2 text-3xl font-bold text-slate-900">{dashboardMetrics.openWorkOrders}</h4>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded border ${
                    dashboardMetrics.slaBreachedCount > 0 ? 'text-red-700 bg-red-100 border-red-200' : 'text-green-700 bg-green-100 border-green-200'
                  }`}>
                    {dashboardMetrics.slaBreachedCount} Breached
                  </span>
                  <span className="text-xs text-slate-500">{dashboardMetrics.slaBreachedCount > 0 ? 'requires attention' : 'all on track'}</span>
                </div>
              </div>

              <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
                  <span className="text-[18px]">⋮⋮</span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">PPM Compliance</p>
                    <h4 className="mt-2 text-3xl font-bold text-slate-900">{dashboardMetrics.ppmComplianceRate}%</h4>
                  </div>
                  <div className="rounded-lg bg-green-50 p-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`text-xs font-bold ${
                    dashboardMetrics.ppmOrders === 0 ? 'text-slate-500' :
                    dashboardMetrics.ppmComplianceRate >= 90 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {dashboardMetrics.ppmOrders === 0 ? 'No PPM Data' : dashboardMetrics.ppmComplianceRate >= 90 ? 'On Target' : 'Below Target'}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                  <span className="text-xs text-slate-500">Target: 90%</span>
                </div>
              </div>

              <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
                  <span className="text-[18px]">⋮⋮</span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Monthly Savings</p>
                    <h4 className="mt-2 text-3xl font-bold text-slate-900">GH₵ {Math.abs(dashboardMetrics.costSavings).toLocaleString()}</h4>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded border ${
                    dashboardMetrics.savingsPercentage >= 0 ? 'text-green-900 bg-green-100 border-green-200' : 'text-red-900 bg-red-100 border-red-200'
                  }`}>
                    {dashboardMetrics.savingsPercentage >= 0 ? '+' : ''}{dashboardMetrics.savingsPercentage}%
                  </span>
                  <span className="text-xs text-slate-500">{dashboardMetrics.savingsPercentage >= 0 ? 'Cost Reduction' : 'Cost Increase'}</span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Work Order Activity Chart */}
              <div className="group relative col-span-1 flex flex-col rounded-xl bg-white p-6 shadow-sm border border-slate-200 lg:col-span-2">
                <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
                  <span className="text-[18px]">⋮⋮</span>
                </div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Work Order Activity</h3>
                    <p className="text-sm text-slate-500">Weekly performance overview</p>
                  </div>
                  <select 
                    className="rounded-lg border-slate-200 bg-slate-50 py-1.5 pl-3 pr-8 text-sm text-slate-900 focus:border-red-500 focus:ring-red-500 shadow-sm cursor-pointer"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                  </select>
                </div>
                <div className="flex h-64 w-full items-center justify-center">
                  {dashboardMetrics.activityData.created === 0 ? (
                    <div className="text-center text-slate-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                      <p>No work order activity in selected period</p>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-end justify-center gap-8 px-8">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-xs font-semibold text-blue-600">{dashboardMetrics.activityData.created}</div>
                        <div className="w-16 bg-blue-500 rounded-t" style={{ height: `${Math.max((dashboardMetrics.activityData.created / Math.max(dashboardMetrics.activityData.created, 1)) * 200, 20)}px` }}></div>
                        <span className="text-xs text-slate-600">Created</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-xs font-semibold text-green-600">{dashboardMetrics.activityData.completed}</div>
                        <div className="w-16 bg-green-500 rounded-t" style={{ height: `${Math.max((dashboardMetrics.activityData.completed / Math.max(dashboardMetrics.activityData.created, 1)) * 200, 20)}px` }}></div>
                        <span className="text-xs text-slate-600">Completed</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-xs font-semibold text-red-600">{dashboardMetrics.activityData.breached}</div>
                        <div className="w-16 bg-red-500 rounded-t" style={{ height: `${Math.max((dashboardMetrics.activityData.breached / Math.max(dashboardMetrics.activityData.created, 1)) * 200, 20)}px` }}></div>
                        <span className="text-xs text-slate-600">Breached</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Asset Distribution */}
              <div className="group relative flex flex-col rounded-xl bg-white p-6 shadow-sm border border-slate-200">
                <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
                  <span className="text-[18px]">⋮⋮</span>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Asset Distribution</h3>
                  <p className="text-sm text-slate-500">Current status breakdown</p>
                </div>
                <div className="flex flex-1 items-center justify-center">
                  <div className="relative flex h-48 w-48 items-center justify-center rounded-full shadow-inner bg-slate-100">
                    <div className="absolute h-36 w-36 rounded-full bg-white flex items-center justify-center flex-col shadow-sm">
                      <span className="text-3xl font-bold text-slate-900">{dashboardMetrics.totalAssets}</span>
                      <span className="text-xs text-slate-500">Total</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-sm bg-teal-800"></div>
                    <span className="text-slate-900 font-medium">Active ({dashboardMetrics.totalAssets > 0 ? Math.round((dashboardMetrics.assetDistribution.active / dashboardMetrics.totalAssets) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-sm bg-slate-400"></div>
                    <span className="text-slate-900 font-medium">Inactive ({dashboardMetrics.totalAssets > 0 ? Math.round((dashboardMetrics.assetDistribution.inactive / dashboardMetrics.totalAssets) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-sm bg-amber-600"></div>
                    <span className="text-slate-900 font-medium">Maint. ({dashboardMetrics.totalAssets > 0 ? Math.round((dashboardMetrics.assetDistribution.maintenance / dashboardMetrics.totalAssets) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-sm bg-red-500"></div>
                    <span className="text-slate-900 font-medium">Disposed ({dashboardMetrics.totalAssets > 0 ? Math.round((dashboardMetrics.assetDistribution.disposed / dashboardMetrics.totalAssets) * 100) : 0}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Vendor Performance */}
              <div className="group relative flex flex-col rounded-xl bg-white p-6 shadow-sm border border-slate-200">
                <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
                  <span className="text-[18px]">⋮⋮</span>
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Vendor Performance</h3>
                  <button 
                    className="text-xs font-semibold text-red-800 hover:text-red-900 hover:underline"
                    onClick={() => navigate('/admin/vendors')}
                  >
                    View All
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {vendorPerformance.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                      <p>No vendors available</p>
                      <p className="text-xs mt-1">Add vendors to see performance metrics</p>
                    </div>
                  ) : (
                    vendorPerformance.map((vendor) => (
                      <div key={vendor.name} className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-900">{vendor.name}</span>
                          <span className={`font-bold ${vendor.score >= 90 ? 'text-green-600' : vendor.score >= 75 ? 'text-amber-600' : 'text-slate-500'}`}>
                            {vendor.score}% {vendor.rating}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100">
                          <div 
                            className={`h-2 rounded-full shadow-sm ${vendor.score >= 90 ? 'bg-green-500' : vendor.score >= 75 ? 'bg-amber-400' : 'bg-slate-400'}`}
                            style={{ width: `${vendor.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Critical Alerts */}
              <div className="group relative flex flex-col rounded-xl bg-white p-6 shadow-sm border border-slate-200">
                <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
                  <span className="text-[18px]">⋮⋮</span>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Critical Alerts & SLA</h3>
                  <p className="text-sm text-slate-500">Real-time system updates</p>
                </div>
                <div className="flex flex-col gap-3">
                  {dashboardMetrics.slaBreachedCount === 0 && dashboardMetrics.overdueOrders.length === 0 && dashboardMetrics.highPriorityOpen.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-300" />
                      <p className="text-green-600 font-medium">All systems operational</p>
                      <p className="text-xs mt-1">No critical alerts at this time</p>
                    </div>
                  ) : (
                    <>
                      {dashboardMetrics.slaBreachedCount > 0 && (
                        <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-800">SLA Breaches</span>
                          </div>
                          <span className="text-sm font-bold text-red-600">{dashboardMetrics.slaBreachedCount}</span>
                        </div>
                      )}
                      {dashboardMetrics.overdueOrders.length > 0 && (
                        <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-800">Overdue Tasks</span>
                          </div>
                          <span className="text-sm font-bold text-orange-600">{dashboardMetrics.overdueOrders.length}</span>
                        </div>
                      )}
                      {dashboardMetrics.highPriorityOpen.length > 0 && (
                        <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800">High Priority Open</span>
                          </div>
                          <span className="text-sm font-bold text-yellow-600">{dashboardMetrics.highPriorityOpen.length}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="group relative flex flex-col rounded-xl bg-white p-6 shadow-sm border border-slate-200">
                <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
                  <span className="text-[18px]">⋮⋮</span>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
                  <p className="text-sm text-slate-500">Common management tasks</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    className="flex flex-col items-center justify-center gap-2 rounded-lg bg-slate-50 border border-slate-200 p-4 text-center transition-all hover:bg-red-50 hover:border-red-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300"
                    onClick={() => handleQuickAction("add-asset")}
                  >
                    <Plus className="text-3xl text-red-600 h-8 w-8" />
                    <span className="text-xs font-semibold text-slate-900">Add New Asset</span>
                  </button>
                  <button 
                    className="flex flex-col items-center justify-center gap-2 rounded-lg bg-slate-50 border border-slate-200 p-4 text-center transition-all hover:bg-red-50 hover:border-red-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300"
                    onClick={() => handleQuickAction("create-work-order")}
                  >
                    <FileText className="text-3xl text-blue-600 h-8 w-8" />
                    <span className="text-xs font-semibold text-slate-900">Create WO</span>
                  </button>
                  <button 
                    className="flex flex-col items-center justify-center gap-2 rounded-lg bg-slate-50 border border-slate-200 p-4 text-center transition-all hover:bg-red-50 hover:border-red-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300"
                    onClick={() => handleQuickAction("manage-vendors")}
                  >
                    <Users className="text-3xl text-purple-600 h-8 w-8" />
                    <span className="text-xs font-semibold text-slate-900">Manage Vendors</span>
                  </button>
                  <button 
                    className="flex flex-col items-center justify-center gap-2 rounded-lg bg-slate-50 border border-slate-200 p-4 text-center transition-all hover:bg-red-50 hover:border-red-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300"
                    onClick={() => handleQuickAction("utility-reports")}
                  >
                    <Zap className="text-3xl text-amber-500 h-8 w-8" />
                    <span className="text-xs font-semibold text-slate-900">Utility Reports</span>
                  </button>
                  <button 
                    className="col-span-2 flex flex-row items-center justify-center gap-3 rounded-lg bg-slate-50 border border-slate-200 p-3 text-center transition-all hover:bg-red-50 hover:border-red-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300"
                    onClick={() => handleQuickAction("role-management")}
                  >
                    <Shield className="text-slate-500 h-5 w-5" />
                    <span className="text-sm font-semibold text-slate-900">Role Management</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-6 flex items-center justify-between border-t border-slate-200 pt-6 text-sm text-slate-500">
              <p>© 2026 ABSA Facility Management. All rights reserved.</p>
              <div className="flex gap-4">
                <a className="hover:text-red-900 transition-colors" href="#">Privacy Policy</a>
                <a className="hover:text-red-900 transition-colors" href="#">Terms of Service</a>
                <a className="hover:text-red-900 transition-colors" href="#">Help Center</a>
              </div>
            </footer>

            {/* Breach Details Modal */}
            <Modal isOpen={showBreachModal} onClose={() => setShowBreachModal(false)} title="SLA Breach Details" size="lg">
              <div className="space-y-4">
                {dashboardMetrics.breachedWorkOrders.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-300" />
                    <p>No SLA breaches found</p>
                    <p className="text-xs mt-1">All work orders are within SLA targets</p>
                  </div>
                ) : (
                  dashboardMetrics.breachedWorkOrders.map((breach) => (
                    <div key={breach.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-slate-900">{breach.id} - {breach.title}</h4>
                          <p className="text-sm text-slate-600">{breach.location}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          breach.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                          breach.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {breach.priority}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 mb-3">{breach.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Assigned to:</span>
                          <p className="font-medium">{breach.vendorName || 'Unassigned'}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Due Date:</span>
                          <p className="font-medium">{breach.dueDate ? new Date(breach.dueDate).toLocaleDateString() : 'No due date'}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Created:</span>
                          <p className="font-medium text-red-600">{new Date(breach.createdDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div className="flex justify-end gap-2 mt-6">
                  <button 
                    className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
                    onClick={() => setShowBreachModal(false)}
                  >
                    Close
                  </button>
                  <button 
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                    onClick={() => navigate('/admin/work-orders')}
                  >
                    View All Work Orders
                  </button>
                </div>
              </div>
            </Modal>
    </div>
  );
};

export default AdminDashboard;