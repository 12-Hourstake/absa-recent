import { Plus, ArrowLeft, AlertTriangle, Calendar, TrendingUp, MapPin, User, Hash, RotateCcw, Shield, Clock, BarChart3, CheckCircle, Eye, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interfaces
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

interface Vendor {
  id: string;
  name: string;
  contact: string;
  category: string;
  createdDate: string;
}

const WORK_ORDERS_STORAGE_KEY = "WORK_ORDERS_CACHE_V1";
const ASSETS_STORAGE_KEY = "ASSETS_CACHE_V1";
const VENDORS_STORAGE_KEY = "VENDORS_CACHE_V1";
const SLA_STORAGE_KEY = "SLA_CACHE_V1";
const BRANCHES_STORAGE_KEY = "BRANCHES_CACHE_V1";
const MAINTENANCE_CACHE_KEY = "MAINTENANCE_CACHE_V1";

const Maintenance = () => {
  const navigate = useNavigate();
  const [showOverdueAlert, setShowOverdueAlert] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentViewMonth, setCurrentViewMonth] = useState<number>(new Date().getMonth());
  const [currentViewYear, setCurrentViewYear] = useState<number>(new Date().getFullYear());
  const [showMonthYearPicker, setShowMonthYearPicker] = useState<boolean>(false);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<any[]>([]);

  // Load cached data
  useEffect(() => {
    loadWorkOrders();
    loadAssets();
    loadVendors();
    loadMaintenanceTasks();
  }, []);

  const loadWorkOrders = () => {
    try {
      const cached = localStorage.getItem(WORK_ORDERS_STORAGE_KEY);
      setWorkOrders(cached ? JSON.parse(cached) : []);
    } catch (err) {
      console.error('Error loading work orders:', err);
      setWorkOrders([]);
    }
  };

  const loadAssets = () => {
    try {
      const cached = localStorage.getItem(ASSETS_STORAGE_KEY);
      setAssets(cached ? JSON.parse(cached) : []);
    } catch (err) {
      console.error('Error loading assets:', err);
      setAssets([]);
    }
  };

  const loadVendors = () => {
    try {
      const cached = localStorage.getItem(VENDORS_STORAGE_KEY);
      setVendors(cached ? JSON.parse(cached) : []);
    } catch (err) {
      console.error('Error loading vendors:', err);
      setVendors([]);
    }
  };

  const loadMaintenanceTasks = () => {
    try {
      const cached = localStorage.getItem(MAINTENANCE_CACHE_KEY);
      setMaintenanceTasks(cached ? JSON.parse(cached) : []);
    } catch (err) {
      console.error('Error loading maintenance tasks:', err);
      setMaintenanceTasks([]);
    }
  };

  const saveMaintenanceTask = (taskData: any) => {
    const newTask = {
      id: `maint_${Date.now()}`,
      ...taskData,
      status: "SCHEDULED",
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [...maintenanceTasks, newTask];
    setMaintenanceTasks(updatedTasks);
    localStorage.setItem(MAINTENANCE_CACHE_KEY, JSON.stringify(updatedTasks));
    return newTask;
  };

  const isPastDate = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateStr);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const handleCalendarDateClick = (day: number) => {
    const clickedDate = new Date(currentViewYear, currentViewMonth, day);
    const dateStr = clickedDate.toISOString().split('T')[0];
    
    if (isPastDate(dateStr)) {
      return; // Don't allow past date clicks
    }
    
    setSelectedDate(dateStr);
    setShowScheduleModal(true);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const today = new Date();
    const currentDate = new Date(currentViewYear, currentViewMonth, 1);
    
    if (direction === 'next') {
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      const maxDate = new Date(today.getFullYear(), today.getMonth() + 12, 1);
      
      if (nextMonth <= maxDate) {
        setCurrentViewMonth(nextMonth.getMonth());
        setCurrentViewYear(nextMonth.getFullYear());
      }
    } else {
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const minDate = new Date(today.getFullYear(), today.getMonth() - 12, 1);
      
      if (prevMonth >= minDate) {
        setCurrentViewMonth(prevMonth.getMonth());
        setCurrentViewYear(prevMonth.getFullYear());
      }
    }
  };

  const canNavigate = (direction: 'prev' | 'next') => {
    const today = new Date();
    const currentDate = new Date(currentViewYear, currentViewMonth, 1);
    
    if (direction === 'next') {
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      const maxDate = new Date(today.getFullYear(), today.getMonth() + 12, 1);
      return nextMonth <= maxDate;
    } else {
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const minDate = new Date(today.getFullYear(), today.getMonth() - 12, 1);
      return prevMonth >= minDate;
    }
  };

  const selectMonthYear = (month: number, year: number) => {
    const today = new Date();
    const selectedDate = new Date(year, month, 1);
    const minDate = new Date(today.getFullYear(), today.getMonth() - 12, 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 12, 1);
    
    if (selectedDate >= minDate && selectedDate <= maxDate) {
      setCurrentViewMonth(month);
      setCurrentViewYear(year);
      setShowMonthYearPicker(false);
    }
  };

  // Calculate dynamic metrics from cached data
  const metrics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueTasks = workOrders.filter(wo => {
      if (wo.status === "Closed" || !wo.dueDate) return false;
      const dueDate = new Date(wo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    });

    const ppmOrders = workOrders.filter(wo => wo.workOrderType === "PPM");
    const ppmCompliant = ppmOrders.filter(wo => wo.slaStatus === "Met");
    const ppmComplianceRate = ppmOrders.length > 0 ? Math.round((ppmCompliant.length / ppmOrders.length) * 100) : 0;

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const thisMonthTasks = workOrders.filter(wo => {
      const woDate = new Date(wo.createdDate);
      return woDate.getMonth() === currentMonth && woDate.getFullYear() === currentYear;
    });
    const completedThisMonth = thisMonthTasks.filter(wo => wo.status === "Closed");
    const monthlyCompletionRate = thisMonthTasks.length > 0 ? Math.round((completedThisMonth.length / thisMonthTasks.length) * 100) : 0;

    const closedOrders = workOrders.filter(wo => wo.status === "Closed" && wo.completionDate);
    let avgResolutionHours = 0;
    if (closedOrders.length > 0) {
      const totalHours = closedOrders.reduce((sum, wo) => {
        const created = new Date(wo.createdDate);
        const completed = new Date(wo.completionDate!);
        return sum + (completed.getTime() - created.getTime()) / (1000 * 60 * 60);
      }, 0);
      avgResolutionHours = Math.round(totalHours / closedOrders.length);
    }

    // Priority breakdown
    const priorityBreakdown = {
      Critical: workOrders.filter(wo => wo.priority === "Critical" && wo.status !== "Closed").length,
      High: workOrders.filter(wo => wo.priority === "High" && wo.status !== "Closed").length,
      Medium: workOrders.filter(wo => wo.priority === "Medium" && wo.status !== "Closed").length,
      Low: workOrders.filter(wo => wo.priority === "Low" && wo.status !== "Closed").length
    };

    return {
      overdueTasks: overdueTasks.length,
      ppmComplianceRate,
      thisMonthTasks: thisMonthTasks.length,
      monthlyCompletionRate,
      avgResolutionHours,
      priorityBreakdown
    };
  }, [workOrders]);

  // Get upcoming maintenance tasks (combining work orders and maintenance tasks)
  const upcomingTasks = useMemo(() => {
    const workOrderTasks = workOrders
      .filter(wo => wo.status !== "Closed")
      .map(wo => ({
        ...wo,
        source: 'workOrder'
      }));
    
    const maintenanceTasksFormatted = maintenanceTasks
      .filter(task => task.status === "SCHEDULED")
      .map(task => ({
        id: task.id,
        title: task.taskName,
        dueDate: task.dueDate,
        location: task.location,
        assetName: task.asset,
        priority: task.priority,
        workOrderType: task.type === 'PREVENTIVE' ? 'PPM' : 'Reactive',
        status: task.status,
        vendorName: task.assignee,
        estimatedCost: task.estimatedCost,
        source: 'maintenance'
      }));
    
    return [...workOrderTasks, ...maintenanceTasksFormatted]
      .sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
      .slice(0, 6);
  }, [workOrders, maintenanceTasks]);

  // Calendar events from work orders and maintenance tasks
  const calendarEvents = useMemo(() => {
    const events: { [key: number]: any[] } = {};
    
    // Add work orders
    workOrders.forEach(wo => {
      if (wo.dueDate) {
        const dueDate = new Date(wo.dueDate);
        // Only show events for current view month/year
        if (dueDate.getMonth() === currentViewMonth && dueDate.getFullYear() === currentViewYear) {
          const day = dueDate.getDate();
          
          if (!events[day]) events[day] = [];
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const isOverdue = wo.status !== "Closed" && dueDate < today;
          
          events[day].push({
            title: wo.title,
            type: wo.workOrderType === "PPM" ? "Preventive" : "Reactive",
            status: isOverdue ? "overdue" : wo.status === "Closed" ? "completed" : "scheduled",
            workOrder: wo
          });
        }
      }
    });
    
    // Add maintenance tasks
    maintenanceTasks.forEach(task => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        // Only show events for current view month/year
        if (dueDate.getMonth() === currentViewMonth && dueDate.getFullYear() === currentViewYear) {
          const day = dueDate.getDate();
          
          if (!events[day]) events[day] = [];
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const isOverdue = task.status !== "COMPLETED" && dueDate < today;
          
          events[day].push({
            title: task.taskName,
            type: task.type === "PREVENTIVE" ? "Preventive" : "Reactive",
            status: isOverdue ? "overdue" : task.status === "COMPLETED" ? "completed" : "scheduled",
            maintenanceTask: task
          });
        }
      }
    });
    
    return events;
  }, [workOrders, maintenanceTasks, currentViewMonth, currentViewYear]);

  const handleCalendarItemClick = (event: any) => {
    setSelectedTask({
      title: event.title,
      type: event.type,
      status: event.status,
      date: event.workOrder.dueDate,
      location: event.workOrder.location,
      assignee: event.workOrder.vendorName,
      priority: event.workOrder.priority
    });
    setShowPreviewModal(true);
  };

  const maintenanceFields = [
    { name: 'title', label: 'Task Title', type: 'text' as const, required: true, placeholder: 'Enter maintenance task title' },
    { name: 'type', label: 'Maintenance Type', type: 'select' as const, required: true, options: [
      { value: 'preventive', label: 'Preventive Maintenance' },
      { value: 'reactive', label: 'Reactive Maintenance' },
      { value: 'emergency', label: 'Emergency Repair' }
    ]},
    { name: 'asset', label: 'Asset/Equipment', type: 'text' as const, required: true, placeholder: 'Generator Set A, HVAC Unit, etc.' },
    { name: 'location', label: 'Location', type: 'text' as const, required: true, placeholder: 'Building/Floor/Room' },
    { name: 'priority', label: 'Priority', type: 'select' as const, required: true, options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' }
    ]},
    { name: 'frequency', label: 'Frequency', type: 'select' as const, options: [
      { value: 'once', label: 'One-time' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly' },
      { value: 'annually', label: 'Annually' }
    ]},
    { name: 'scheduledDate', label: 'Scheduled Date', type: 'date' as const, required: true },
    { name: 'estimatedCost', label: 'Estimated Cost (GHS)', type: 'number' as const, placeholder: '0.00' },
    { name: 'assignee', label: 'Assign To', type: 'select' as const, options: [
      { value: 'kofi', label: 'Kofi Osei' },
      { value: 'adwoa', label: 'Adwoa Boateng' },
      { value: 'kwame', label: 'Kwame Asante' },
      { value: 'ama', label: 'Ama Serwaa' }
    ]},
    { name: 'description', label: 'Task Description', type: 'textarea' as const, placeholder: 'Detailed description of maintenance task' }
  ];

  const handleScheduleMaintenance = (data: Record<string, string>) => {
    if (data.scheduledDate && isPastDate(data.scheduledDate)) {
      alert("Maintenance cannot be scheduled in the past.");
      return;
    }
    
    const taskData = {
      taskName: data.title || 'Untitled Task',
      type: data.type || 'PREVENTIVE',
      description: data.description || '',
      asset: data.asset || '',
      location: data.location || '',
      priority: data.priority || 'medium',
      frequency: data.frequency || 'once',
      startDate: data.scheduledDate || selectedDate,
      dueDate: data.scheduledDate || selectedDate,
      assignee: data.assignee || '',
      estimatedCost: data.estimatedCost || '0'
    };
    
    saveMaintenanceTask(taskData);
    setShowScheduleModal(false);
    setSelectedDate("");
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="mx-auto max-w-[1600px] flex flex-col gap-6 p-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Maintenance Management</h1>
              <p className="text-slate-500 text-base max-w-2xl">Track preventive and reactive maintenance schedules.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-600/20 transition-all active:scale-[0.98]"
              >
                <Plus className="w-5 h-5" />
                <span>Schedule Maintenance</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overdue Tasks Alert */}
        {metrics.overdueTasks > 0 && showOverdueAlert && (
          <div className="mb-8 rounded-xl border border-red-100 bg-red-50 p-4 md:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between shadow-sm relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
            <div className="flex items-start gap-4 z-10">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-red-600 border border-red-100">
<AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-red-950 font-bold text-lg leading-tight">{metrics.overdueTasks} Overdue Maintenance Task{metrics.overdueTasks > 1 ? 's' : ''}</h3>
                <p className="text-red-800/80 text-sm mt-1">Review critical overdue items requiring immediate attention.</p>
              </div>
            </div>
            <button 
              className="whitespace-nowrap px-4 py-2 bg-white border border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 font-bold rounded-lg text-sm shadow-sm transition-colors z-10 focus:ring-2 focus:ring-red-200 focus:outline-none"
              onClick={() => navigate('/admin/maintenance')}
            >
              Review Now
            </button>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-red-100/50 to-transparent pointer-events-none"></div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
              <span className="text-[18px]">⋮⋮</span>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">PPM Compliance Rate</p>
                <h4 className="mt-2 text-3xl font-bold text-slate-900">{metrics.ppmComplianceRate}%</h4>
              </div>
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <Shield className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-bold text-green-600">Target: 95%</span>
              <span className="h-1 w-1 rounded-full bg-slate-300"></span>
              <span className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded border ${
                metrics.ppmComplianceRate >= 95 ? 'text-green-900 bg-green-100 border-green-200' : 'text-yellow-900 bg-yellow-100 border-yellow-200'
              }`}>
                <TrendingUp className="text-[14px] mr-0.5 h-3 w-3" /> {metrics.ppmComplianceRate >= 95 ? 'On Target' : 'Below Target'}
              </span>
            </div>
          </div>

          <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
              <span className="text-[18px]">⋮⋮</span>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">Overdue Tasks</p>
                <h4 className="mt-2 text-3xl font-bold text-red-600">{metrics.overdueTasks}</h4>
              </div>
              <div className="rounded-lg bg-red-50 p-2 text-red-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="flex items-center text-xs font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-200">
                Immediate Action
              </span>
              <span className="text-xs text-slate-500">High Risk</span>
            </div>
          </div>

          <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
              <span className="text-[18px]">⋮⋮</span>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">Tasks This Month</p>
                <h4 className="mt-2 text-3xl font-bold text-slate-900">{metrics.thisMonthTasks}</h4>
              </div>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">{metrics.monthlyCompletionRate}%</span>
              <span className="text-xs text-slate-500">completion rate</span>
            </div>
          </div>
        </div>

        {/* Calendar and Performance Metrics */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
          <div className="xl:col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Maintenance Calendar
              </h2>
              <div className="flex gap-2 text-xs font-medium">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-slate-200 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-teal-600"></span> Preventive
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-slate-200 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span> Reactive
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-slate-200 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Completed
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-4">
                  <button 
                    className={`w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-full transition-all ${
                      canNavigate('prev') ? 'text-slate-500 hover:text-slate-700' : 'text-slate-300 cursor-not-allowed'
                    }`}
                    onClick={() => canNavigate('prev') && navigateMonth('prev')}
                    disabled={!canNavigate('prev')}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    className="font-bold text-slate-900 text-lg hover:text-teal-600 transition-colors cursor-pointer"
                    onClick={() => setShowMonthYearPicker(true)}
                  >
                    {new Date(currentViewYear, currentViewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </button>
                  <button 
                    className={`w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-full transition-all ${
                      canNavigate('next') ? 'text-slate-500 hover:text-slate-700' : 'text-slate-300 cursor-not-allowed'
                    }`}
                    onClick={() => canNavigate('next') && navigateMonth('next')}
                    disabled={!canNavigate('next')}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <button className="text-xs font-semibold text-teal-600 hover:bg-teal-100 px-3 py-1.5 rounded transition-colors">Today</button>
              </div>
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 auto-rows-[minmax(100px,1fr)] bg-white text-sm flex-1">
                {(() => {
                  const firstDay = new Date(currentViewYear, currentViewMonth, 1);
                  const lastDay = new Date(currentViewYear, currentViewMonth + 1, 0);
                  const startDate = new Date(firstDay);
                  startDate.setDate(startDate.getDate() - firstDay.getDay());
                  
                  const days = [];
                  const today = new Date();
                  
                  for (let i = 0; i < 42; i++) {
                    const currentDate = new Date(startDate);
                    currentDate.setDate(startDate.getDate() + i);
                    
                    const day = currentDate.getDate();
                    const isCurrentMonth = currentDate.getMonth() === currentViewMonth;
                    const isToday = currentDate.toDateString() === today.toDateString();
                    const dateStr = currentDate.toISOString().split('T')[0];
                    const isPast = isPastDate(dateStr);
                    
                    days.push(
                      <div 
                        key={i} 
                        className={`border-b border-r border-slate-200 p-2 transition-colors group relative ${
                          !isCurrentMonth ? 'bg-slate-50/30 text-slate-300 cursor-not-allowed' :
                          isPast ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                          isToday ? 'bg-blue-50/30 hover:bg-blue-50 cursor-pointer' : 
                          'hover:bg-slate-50 cursor-pointer'
                        }`} 
                        onClick={() => isCurrentMonth && !isPast && handleCalendarDateClick(day)}
                      >
                        <span className={`text-slate-500 font-medium ${
                          isToday ? 'w-6 h-6 flex items-center justify-center bg-teal-600 text-white rounded-full text-xs font-bold mb-1 shadow-sm' : 
                          !isCurrentMonth ? 'text-slate-300' :
                          isPast ? 'text-slate-400' : ''
                        }`}>
                          {day}
                        </span>
                        {isCurrentMonth && calendarEvents[day] && (
                          <div className="mt-1 space-y-1">
                            {calendarEvents[day].slice(0, 2).map((event, idx) => (
                              <div 
                                key={idx}
                                className={`text-[10px] px-1.5 py-0.5 rounded border-l-2 truncate font-semibold cursor-pointer hover:shadow-md transition-shadow ${
                                  event.status === 'completed' ? 'bg-green-100 text-green-800 border-green-500' :
                                  event.status === 'overdue' ? 'bg-red-100 text-red-800 border-red-500 ring-1 ring-red-200' :
                                  'bg-teal-50 text-teal-800 border-teal-500'
                                } ${event.status === 'overdue' ? 'font-bold' : ''}`}
                                tabIndex={0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCalendarItemClick(event);
                                }}
                              >
                                {event.status === 'overdue' ? '! ' : ''}{event.title.length > 10 ? event.title.substring(0, 10) + '...' : event.title}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  return days;
                })()}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              Performance Metrics
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col h-1/2">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Work Order Backlog by Priority</h3>
              <div className="flex items-end justify-between flex-1 gap-3 px-2">
                {Object.entries(metrics.priorityBreakdown).map(([priority, count]) => {
                  const maxCount = Math.max(...Object.values(metrics.priorityBreakdown));
                  const height = maxCount > 0 ? Math.max((count / maxCount) * 100, 5) : 5;
                  const colors = {
                    Critical: { bg: 'bg-red-500', text: 'text-red-600' },
                    High: { bg: 'bg-orange-400', text: 'text-orange-500' },
                    Medium: { bg: 'bg-teal-600', text: 'text-teal-600' },
                    Low: { bg: 'bg-blue-400', text: 'text-blue-500' }
                  };
                  
                  return (
                    <div key={priority} className="flex flex-col items-center gap-2 w-1/4 h-full justify-end group">
                      <div className={`text-xs font-bold ${colors[priority as keyof typeof colors].text} opacity-0 group-hover:opacity-100 transition-opacity`}>{count}</div>
                      <div className={`w-full ${colors[priority as keyof typeof colors].bg} rounded-t-sm hover:opacity-80 transition-opacity`} style={{ height: `${height}%` }}></div>
                      <span className="text-[10px] font-medium text-slate-500">{priority}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col h-1/2 justify-between">
              <h3 className="text-sm font-bold text-slate-800">Avg. Resolution Time</h3>
              <div className="relative flex flex-col items-center justify-center mt-2">
                <svg className="w-full h-32 overflow-hidden" viewBox="0 0 200 110">
                  <path d="M20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f1f5f9" strokeLinecap="round" strokeWidth="20"></path>
                  <path d="M20 100 A 80 80 0 0 1 150 45" fill="none" stroke="#0d9488" strokeLinecap="round" strokeWidth="20"></path>
                  <text className="text-3xl font-black fill-slate-800" textAnchor="middle" x="100" y="90">{metrics.avgResolutionHours}h</text>
                  <text className="text-[10px] fill-slate-400" textAnchor="middle" x="100" y="105">Target: 24h</text>
                </svg>
                <div className="flex justify-between w-full px-6 text-[10px] text-slate-500 font-medium -mt-2">
                  <span>0h</span>
                  <span>48h</span>
                </div>
              </div>
              <div className={`rounded p-2 mt-2 flex items-center justify-center gap-2 ${
                metrics.avgResolutionHours <= 24 ? 'bg-green-50' : 'bg-yellow-50'
              }`}>
                <CheckCircle className={`w-4 h-4 ${
                  metrics.avgResolutionHours <= 24 ? 'text-green-600' : 'text-yellow-600'
                }`} />
                <span className={`text-xs font-semibold ${
                  metrics.avgResolutionHours <= 24 ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {metrics.avgResolutionHours <= 24 ? 'Within SLA Targets' : 'Above SLA Target'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Maintenance Tasks */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-teal-600" />
              Upcoming Maintenance Tasks
            </h2>
            <button 
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-bold text-white transition-colors flex items-center gap-2 shadow-sm"
              onClick={() => navigate('/admin/maintenance')}
            >
              View All Tasks <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {upcomingTasks.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No upcoming maintenance tasks found.</p>
                <p className="text-sm text-slate-400 mt-1">Create work orders to see maintenance tasks here.</p>
              </div>
            ) : (
              upcomingTasks.map((task) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                const isOverdue = dueDate && task.status !== 'Closed' && dueDate < today;
                const isInProgress = task.status === 'In Progress';
                const borderColor = isOverdue ? 'border-l-red-500' : 'border-l-teal-600';
                
                return (
                  <div key={task.id} className={`bg-white rounded-xl border border-l-[6px] ${borderColor} border-y border-r border-gray-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer`} onClick={() => navigate(`/admin/work-orders`)}>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`inline-flex items-center rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        task.workOrderType !== 'PPM' ? 'bg-orange-100 text-orange-800' : 'bg-teal-50 text-teal-800'
                      }`}>
                        {task.workOrderType === 'PPM' ? 'Preventive' : 'Reactive'}
                      </span>
                      <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${
                        isOverdue ? 'text-white bg-red-500' : 
                        isInProgress ? 'text-blue-700 bg-blue-100' : 
                        'text-slate-600 bg-slate-200'
                      }`}>
                        {isOverdue && <AlertTriangle className="w-3 h-3" />}
                        {isOverdue ? 'Overdue' : isInProgress ? 'In Progress' : task.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">{task.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {typeof task.location === 'string' ? task.location : 'Location not specified'} • {task.assetName}
                    </p>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 grid grid-cols-2 gap-y-2 text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span className={`font-bold ${isOverdue ? 'text-red-600' : 'text-teal-600'}`}>
                          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Hash className="w-4 h-4" />
                        <span>{task.id}</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <User className="w-4 h-4" />
                        <span>Vendor: {task.vendorName || 'Unassigned'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className={`text-sm font-extrabold ${
                        !task.estimatedCost || task.estimatedCost === '0' ? 'text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded' : 'text-slate-800'
                      }`}>
                        {task.estimatedCost && task.estimatedCost !== '0' ? `GHS ${task.estimatedCost}` : 'Cost Pending'}
                      </span>
                      <button className="text-sm font-semibold text-teal-600 hover:text-teal-700 underline decoration-2 decoration-transparent hover:decoration-teal-600 transition-all">
                        Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Schedule Maintenance Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Schedule Maintenance</h3>
                <p className="text-sm text-slate-600 mt-1">Create a new maintenance task for a property.</p>
              </div>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-50"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Task Name */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Task Name <span className="text-red-500">*</span></label>
                  <input 
                    name="title"
                    className="w-full h-11 px-4 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                    placeholder="e.g. Plumbing Repair"
                    type="text"
                    defaultValue={selectedDate ? "Scheduled Maintenance" : "Generator Service - Osu Branch"}
                  />
                </div>
                
                {/* Type */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Type <span className="text-red-500">*</span></label>
                  <Select defaultValue="reactive">
                    <SelectTrigger className="w-full h-11">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventive">Preventive</SelectItem>
                      <SelectItem value="reactive">Reactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                  <textarea 
                    name="description"
                    className="w-full min-h-[100px] px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 resize-y transition-all"
                    placeholder="Describe the issue or maintenance required..."
                    defaultValue={selectedDate ? "" : "Routine check of the backup generator fuel levels and oil filter replacement."}
                  />
                </div>
                
                {/* Asset/System */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Asset / System</label>
                  <div className="relative">
                    <input 
                      name="asset"
                      className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                      placeholder="Search assets..."
                      type="text"
                      defaultValue={selectedDate ? "" : "CAT Generator Model XJ-200"}
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  </div>
                </div>
                
                {/* Frequency */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Frequency</label>
                  <Select defaultValue="quarterly">
                    <SelectTrigger className="w-full h-11">
                      <SelectValue placeholder="Select Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One-time</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Start Date */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      className="w-full h-11 px-4 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                      type="date"
                      defaultValue={selectedDate || "2025-12-26"}
                      key={selectedDate} // Force re-render when selectedDate changes
                    />
                  </div>
                </div>
                
                {/* Due Date */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
                  <div className="relative">
                    <input 
                      className="w-full h-11 px-4 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                      type="date"
                      defaultValue={selectedDate || "2025-12-26"}
                      key={selectedDate} // Force re-render when selectedDate changes
                    />
                  </div>
                </div>
                
                {/* Assignee */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Assignee <span className="text-red-500">*</span></label>
                  <div className="relative cursor-pointer group">
                    <div className="w-full h-11 px-4 rounded-lg border border-slate-300 bg-white flex items-center justify-between group-hover:border-slate-400 group-focus-within:ring-1 group-focus-within:ring-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-cover bg-center bg-slate-200"></div>
                        <span className="text-slate-900 text-sm">Kwame Mensah</span>
                      </div>
                      <ChevronRight className="text-slate-400 rotate-90 h-4 w-4" />
                    </div>
                  </div>
                </div>
                
                {/* Estimated Cost */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Estimated Cost</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">GHS</span>
                    <input 
                      name="estimatedCost"
                      className="w-full h-11 pl-14 pr-4 rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                      placeholder="0.00"
                      type="number"
                      defaultValue={selectedDate ? "" : "450.00"}
                    />
                  </div>
                </div>
                
                {/* Attachments */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Attachments</label>
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-2 bg-slate-100 rounded-full mb-2 group-hover:bg-slate-200 transition-colors">
                        <FileText className="text-slate-400 group-hover:text-slate-500 h-6 w-6" />
                      </div>
                      <p className="text-sm text-slate-500"><span className="font-semibold text-slate-600">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or PDF (MAX. 5MB)</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-xl">
              <button 
                className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-100 hover:text-slate-900 transition-colors focus:ring-2 focus:ring-slate-200"
                onClick={() => setShowScheduleModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-bold shadow-sm hover:bg-red-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => {
                  const form = document.querySelector('form') as HTMLFormElement;
                  if (form) {
                    const formData = new FormData(form);
                    const data: Record<string, string> = {};
                    formData.forEach((value, key) => {
                      data[key] = value.toString();
                    });
                    handleScheduleMaintenance(data);
                  }
                }}
              >
                Schedule Maintenance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal for Calendar Items */}
      {showPreviewModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Task Preview</h3>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors p-1 rounded-lg hover:bg-slate-50"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Task Title</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{selectedTask.title}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedTask.type || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      selectedTask.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      selectedTask.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-teal-100 text-teal-800'
                    }`}>
                      {selectedTask.status === 'overdue' ? 'Overdue' :
                       selectedTask.status === 'completed' ? 'Completed' :
                       'Scheduled'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</label>
                  <p className="text-sm font-medium text-slate-900 mt-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {selectedTask.location || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled Date</label>
                  <p className="text-sm font-medium text-slate-900 mt-1 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {selectedTask.date}
                  </p>
                </div>
                
                {selectedTask.assignee && (
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignee</label>
                    <p className="text-sm font-medium text-slate-900 mt-1 flex items-center gap-1">
                      <User className="w-4 h-4 text-slate-400" />
                      {selectedTask.assignee}
                    </p>
                  </div>
                )}
                
                {selectedTask.priority && (
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      selectedTask.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                      selectedTask.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                      selectedTask.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {selectedTask.priority}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
              <button 
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors flex items-center gap-2"
                onClick={() => {
                  setShowPreviewModal(false);
                  navigate('/admin/maintenance');
                }}
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button 
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
                onClick={() => setShowPreviewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Month/Year Picker Modal */}
      {showMonthYearPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Select Month & Year</h3>
              <button 
                onClick={() => setShowMonthYearPicker(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors p-1 rounded-lg hover:bg-slate-50"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Months */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Month</h4>
                  <div className="grid grid-cols-1 gap-1">
                    {Array.from({ length: 12 }, (_, i) => {
                      const monthName = new Date(2025, i, 1).toLocaleDateString('en-US', { month: 'long' });
                      const today = new Date();
                      const testDate = new Date(currentViewYear, i, 1);
                      const minDate = new Date(today.getFullYear(), today.getMonth() - 12, 1);
                      const maxDate = new Date(today.getFullYear(), today.getMonth() + 12, 1);
                      const isValid = testDate >= minDate && testDate <= maxDate;
                      const isSelected = i === currentViewMonth;
                      
                      return (
                        <button
                          key={i}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                            !isValid ? 'text-slate-300 cursor-not-allowed' :
                            isSelected ? 'bg-teal-100 text-teal-800 font-semibold' :
                            'text-slate-700 hover:bg-slate-100'
                          }`}
                          onClick={() => isValid && selectMonthYear(i, currentViewYear)}
                          disabled={!isValid}
                        >
                          {monthName}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Years */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Year</h4>
                  <div className="grid grid-cols-1 gap-1">
                    {Array.from({ length: 3 }, (_, i) => {
                      const year = new Date().getFullYear() - 1 + i;
                      const today = new Date();
                      const testDate = new Date(year, currentViewMonth, 1);
                      const minDate = new Date(today.getFullYear(), today.getMonth() - 12, 1);
                      const maxDate = new Date(today.getFullYear(), today.getMonth() + 12, 1);
                      const isValid = testDate >= minDate && testDate <= maxDate;
                      const isSelected = year === currentViewYear;
                      
                      return (
                        <button
                          key={year}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                            !isValid ? 'text-slate-300 cursor-not-allowed' :
                            isSelected ? 'bg-teal-100 text-teal-800 font-semibold' :
                            'text-slate-700 hover:bg-slate-100'
                          }`}
                          onClick={() => isValid && selectMonthYear(currentViewMonth, year)}
                          disabled={!isValid}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;