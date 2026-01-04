import { useState } from "react";
import {
  Zap,
  Droplets,
  Sun,
  PiggyBank,
  Download,
  Plus,
  PieChart,
  Lightbulb,
  Thermometer,
  AlertTriangle,
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";


const Utilities = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showLogModal, setShowLogModal] = useState(false);

  const handleLogReading = (formData: any) => {
    console.log('Logging utility reading:', formData);
    setShowLogModal(false);
  };

  const kpiData = [
    {
      title: "Total Electricity Purchased",
      value: "21,000",
      unit: "kWh",
      icon: Zap,
      iconColor: "text-blue-600",
      borderColor: "border-l-blue-600",
      trend: "15% reduction",
      trendIcon: "trending_down",
      trendColor: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Water Purchase Volume",
      value: "3,000",
      unit: "m³",
      icon: Droplets,
      iconColor: "text-teal-500",
      borderColor: "border-l-teal-500",
      trend: "8% reduction",
      trendIcon: "trending_down",
      trendColor: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Fuel Purchase Volume",
      value: "16,200",
      unit: "L",
      icon: Sun,
      iconColor: "text-amber-500",
      borderColor: "border-l-amber-500",
      trend: "67% self-powered",
      trendIcon: "eco",
      trendColor: "text-amber-700 bg-amber-50",
    },
    {
      title: "Total Cost Savings",
      value: "GH₵ 45,230",
      unit: "",
      icon: PiggyBank,
      iconColor: "text-emerald-600",
      borderColor: "border-l-emerald-600",
      trend: "vs. full grid usage",
      trendIcon: "",
      trendColor: "text-slate-500 bg-slate-50",
    },
  ];

  const chartData = [
    { month: "May", consumption: 40, cost: 35 },
    { month: "Jun", consumption: 55, cost: 48 },
    { month: "Jul", consumption: 60, cost: 52 },
    { month: "Aug", consumption: 75, cost: 65 },
    { month: "Sep", consumption: 45, cost: 40 },
    { month: "Oct", consumption: 50, cost: 42 },
  ];

  const optimizations = [
    {
      icon: Thermometer,
      iconColor: "text-red-800",
      title: "Adjust HVAC in Osu Branch",
      description: "Reduce usage during 12pm-2pm off-peak.",
    },
    {
      icon: AlertTriangle,
      iconColor: "text-red-500",
      title: "Inspect Water Pump",
      description: "Airport City facility showing abnormal spike.",
    },
    {
      icon: Clock,
      iconColor: "text-red-800",
      title: "Shift Pump Schedule",
      description: "Move Kwabenya pumping to night hours.",
    },
  ];

  const meterReadings = [
    {
      location: "Accra Financial Centre",
      meterId: "M-2309-AFC",
      date: "Oct 24, 2026",
      consumption: "4,230",
      cost: "5,922.00",
      status: "Normal",
      statusColor: "bg-red-100 text-red-900",
    },
    {
      location: "Kwame Nkrumah Circle Branch",
      meterId: "M-8821-KNC",
      date: "Oct 23, 2026",
      consumption: "1,105",
      cost: "1,547.00",
      status: "Normal",
      statusColor: "bg-red-100 text-red-900",
    },
    {
      location: "Kumasi Heights",
      meterId: "M-4402-KMS",
      date: "Oct 23, 2026",
      consumption: "3,400",
      cost: "4,760.00",
      status: "High Usage",
      statusColor: "bg-amber-100 text-amber-800",
    },
    {
      location: "Tamale Main",
      meterId: "M-1290-TML",
      date: "Oct 22, 2023",
      consumption: "890",
      cost: "1,246.00",
      status: "Normal",
      statusColor: "bg-red-100 text-red-900",
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0">
      <div className="flex-1 px-4 py-8 md:px-8 lg:px-12 w-full max-w-[1920px] mx-auto min-w-0">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 min-w-0">
        <div className="space-y-2 min-w-0">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight break-words">
            Utility Management
          </h2>
          <p className="text-slate-500 text-sm lg:text-base break-words">
            Monitor utility consumption, costs, and sustainability metrics across Ghana operations.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-slate-200 min-w-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border-b sm:border-b-0 sm:border-r border-slate-200 pb-3 sm:pb-0 sm:pr-3 sm:mr-1 min-w-0">
            <input
              className="text-xs border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500 py-1.5 px-2 text-slate-600 w-full sm:w-auto"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <span className="text-slate-400 text-xs text-center sm:text-left">to</span>
            <input
              className="text-xs border-slate-300 rounded focus:ring-teal-500 focus:border-teal-500 py-1.5 px-2 text-slate-600 w-full sm:w-auto"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-1.5 px-3 rounded transition-colors w-full sm:w-auto">
              Apply Filter
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 min-w-0">
            <button className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded shadow-sm transition-colors">
              <Download className="h-4 w-4" />
              <span className="truncate">Export</span>
            </button>
            <button 
              className="flex items-center justify-center gap-2 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded shadow-sm transition-colors"
              onClick={() => {
                console.log('Log Reading button clicked');
                setShowLogModal(true);
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="truncate">Log Reading</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8 min-w-0">
        {kpiData.map((kpi, index) => (
          <div key={index} className={`bg-white rounded-xl p-4 lg:p-5 shadow-sm border-l-4 ${kpi.borderColor} min-w-0`}>
            <div className="flex justify-between items-start mb-2 min-w-0">
              <p className="text-slate-500 text-sm font-medium truncate pr-2">{kpi.title}</p>
              <kpi.icon className={`h-5 w-5 ${kpi.iconColor} flex-shrink-0`} />
            </div>
            <div className="flex items-baseline gap-2 min-w-0">
              <h3 className="text-xl lg:text-2xl font-bold text-slate-900 truncate">
                {kpi.value} {kpi.unit && <span className="text-sm font-normal text-slate-500">{kpi.unit}</span>}
              </h3>
            </div>
            <div className={`mt-2 flex items-center text-xs font-medium w-fit px-2 py-1 rounded ${kpi.trendColor} max-w-full`}>
              {kpi.trendIcon && <span className="material-symbols-outlined text-sm mr-1 flex-shrink-0">{kpi.trendIcon}</span>}
              <span className="truncate">{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Energy Mix Chart */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-red-800" />
              Energy Mix
            </h3>
            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[220px]">
              <div className="w-48 h-48 rounded-full relative" style={{
                background: "conic-gradient(#f59e0b 0% 67%, #1162d4 67% 97%, #ef4444 97% 100%)"
              }}>
                <div className="absolute inset-0 m-auto w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Self</span>
                  <span className="text-2xl font-bold text-slate-800">67%</span>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="text-slate-600">Total Fuel Purchased</span>
                </div>
                <span className="font-semibold text-slate-900">16,200 L</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <span className="text-slate-600">Total Water Purchased</span>
                </div>
                <span className="font-semibold text-slate-900">4,200 m³</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-slate-600">Generator</span>
                </div>
                <span className="font-semibold text-slate-900">600 kWh</span>
              </div>
            </div>
          </div>

          {/* Projected Bill Card */}
          <div className="bg-red-50 rounded-xl shadow-sm p-6 border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-teal-900">Projected Monthly Bill</h3>
              <span className="material-symbols-outlined text-red-800">receipt_long</span>
            </div>
            <p className="text-sm text-red-900 mb-4">Estimate based on current trend.</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-teal-900">GH₵ 12,450</span>
              <span className="text-sm text-red-800 mb-1">/ month</span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2.5">
              <div className="bg-red-800 h-2.5 rounded-full" style={{ width: "75%" }}></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-red-800">Current</span>
              <span className="text-xs text-red-800">Limit: 16k</span>
            </div>
          </div>
        </div>

        {/* Consumption Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Consumption & Cost Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Utility Purchase Trends (6 Months)</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
                  <span className="text-xs text-slate-500">Total Electricity Purchased</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-slate-900 rounded-sm"></span>
                  <span className="text-xs text-slate-500">Cost (GH₵)</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-64 w-full flex items-end justify-between gap-4 px-2">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-px bg-slate-100"></div>
                ))}
              </div>
              
              {chartData.map((data, index) => (
                <div key={index} className="flex flex-col items-center gap-2 z-10 flex-1 group cursor-pointer">
                  <div className="relative w-full flex items-end justify-center gap-1 h-full">
                    <div 
                      className="w-1/3 bg-red-500 rounded-t-sm group-hover:bg-teal-400 transition-colors" 
                      style={{ height: `${data.consumption}%` }}
                    ></div>
                    <div 
                      className="w-1/3 bg-slate-900 rounded-t-sm group-hover:bg-slate-700 transition-colors" 
                      style={{ height: `${data.cost}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid - Lower Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Consumption Treemap */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-900">Consumption by Area</h3>
                <button className="text-red-800 hover:text-red-900 text-xs font-semibold">View Breakdown</button>
              </div>
              
              <div className="h-48 w-full flex flex-wrap gap-1">
                <div className="flex-grow-[4] h-full flex flex-col gap-1">
                  <div className="bg-red-800 p-3 h-2/3 rounded-sm text-white flex flex-col justify-between hover:bg-red-900 cursor-pointer transition-colors relative group">
                    <span className="text-xs font-semibold opacity-90">East Legon Branch HVAC</span>
                    <span className="text-sm font-bold">40%</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="flex flex-row h-1/3 gap-1">
                    <div className="bg-teal-400 p-2 flex-grow rounded-sm text-white flex flex-col justify-between hover:bg-red-500 cursor-pointer">
                      <span className="text-[10px] font-semibold opacity-90 truncate">Server Room</span>
                      <span className="text-xs font-bold">20%</span>
                    </div>
                    <div className="bg-teal-300 p-2 flex-grow rounded-sm text-teal-900 flex flex-col justify-between hover:bg-teal-400 cursor-pointer">
                      <span className="text-[10px] font-semibold opacity-90 truncate">Lighting</span>
                      <span className="text-xs font-bold">15%</span>
                    </div>
                  </div>
                </div>
                <div className="flex-grow-[1] h-full flex flex-col gap-1">
                  <div className="bg-red-200 p-2 flex-grow rounded-sm text-teal-900 flex flex-col justify-center items-center hover:bg-teal-300 cursor-pointer text-center">
                    <span className="text-[10px] font-bold">Pumps</span>
                    <span className="text-xs">10%</span>
                  </div>
                  <div className="bg-slate-200 p-2 flex-grow rounded-sm text-slate-700 flex flex-col justify-center items-center hover:bg-slate-300 cursor-pointer text-center">
                    <span className="text-[10px] font-bold">Other</span>
                    <span className="text-xs">15%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization Recommendations */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Optimization
              </h3>
              <div className="space-y-3 overflow-y-auto max-h-48 pr-2">
                {optimizations.map((item, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors cursor-pointer group">
                    <item.icon className={`h-5 w-5 ${item.iconColor} mt-0.5 group-hover:scale-110 transition-transform`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Insights Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-bold text-slate-900">Electricity Insights - Recent Logs</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 rounded">
              Filter by Location
            </button>
            <button className="px-3 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 rounded">
              Download CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Location Name</th>
                <th className="px-6 py-3">Meter ID</th>
                <th className="px-6 py-3">Reading Date</th>
                <th className="px-6 py-3 text-right">Consumption (kWh)</th>
                <th className="px-6 py-3 text-right">Cost (GH₵)</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {meterReadings.map((reading, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900">{reading.location}</td>
                  <td className="px-6 py-4 text-slate-500">{reading.meterId}</td>
                  <td className="px-6 py-4 text-slate-500">{reading.date}</td>
                  <td className="px-6 py-4 text-right font-medium">{reading.consumption}</td>
                  <td className="px-6 py-4 text-right">{reading.cost}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reading.statusColor}`}>
                      {reading.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-red-800 transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">Showing 4 of 128 records</span>
          <div className="flex gap-1">
            <button className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 rounded bg-red-50 text-red-900 text-xs font-medium">1</button>
            <button className="px-3 py-1 rounded hover:bg-slate-100 text-slate-600 text-xs font-medium">2</button>
            <button className="px-3 py-1 rounded hover:bg-slate-100 text-slate-600 text-xs font-medium">3</button>
            <span className="px-2 py-1 text-slate-400 text-xs">...</span>
            <button className="p-1 rounded hover:bg-slate-100 text-slate-500">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Log Utility Reading Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 bg-white">
              <div>
                <h2 className="text-slate-900 text-2xl font-bold tracking-tight">Log Utility Reading</h2>
                <p className="text-sm text-slate-600 mt-1">Enter current meter details for property billing.</p>
              </div>
              <button 
                onClick={() => setShowLogModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                <span className="text-slate-400 hover:text-slate-900 text-2xl">×</span>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto p-8 space-y-6">
              {/* Utility Type */}
              <div>
                <label className="block text-slate-900 text-sm font-medium mb-2">Utility Type</label>
                <div className="relative">
                  <select className="w-full h-12 pl-12 pr-10 bg-white border border-slate-300 rounded-lg text-slate-900 text-base focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 appearance-none cursor-pointer">
                    <option value="">Select Utility Type</option>
                    <option value="electricity">Electricity</option>
                    <option value="water">Water</option>
                    <option value="gas">Gas</option>
                    <option value="solar">Solar</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <ChevronRight className="rotate-90 h-4 w-4" />
                  </div>
                </div>
              </div>
              
              {/* Property Search */}
              <div>
                <label className="block text-slate-900 text-sm font-medium mb-2">Property / Unit</label>
                <div className="relative flex w-full">
                  <input 
                    className="w-full h-12 pl-4 pr-12 bg-white border border-slate-300 rounded-lg text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-shadow"
                    placeholder="Search property (e.g. Flat 4B, Osu Castle Rd)"
                    type="text"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-500">
                    <Search className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 ml-1">Searching database for Ghanaian properties...</p>
              </div>
              
              {/* Meter Reading & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meter Reading */}
                <div>
                  <label className="block text-slate-900 text-sm font-medium mb-2">
                    Meter Reading 
                    <span className="text-xs font-normal text-slate-500 ml-1">(Units / GHS)</span>
                  </label>
                  <div className="relative">
                    <input 
                      className="w-full h-12 pl-4 pr-12 bg-white border border-slate-300 rounded-lg text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                      placeholder="00000.00"
                      step="0.01"
                      type="number"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 text-sm font-medium">
                      Units
                    </div>
                  </div>
                </div>
                
                {/* Date Picker */}
                <div>
                  <label className="block text-slate-900 text-sm font-medium mb-2">Date of Reading</label>
                  <div className="relative">
                    <input 
                      className="w-full h-12 pl-4 pr-10 bg-white border border-slate-300 rounded-lg text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-slate-600"
                      placeholder="DD/MM/YYYY"
                      type="date"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                      <Clock className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-slate-900 text-sm font-medium mb-2">Proof of Reading</label>
                <div className="group border-2 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all rounded-lg p-6 flex flex-col items-center justify-center gap-3 cursor-pointer bg-white">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform duration-200">
                    <Plus className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-900">Click to upload photo</p>
                    <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              <div>
                <label className="block text-slate-900 text-sm font-medium mb-2">Additional Notes <span className="text-slate-500 font-normal">(Optional)</span></label>
                <textarea 
                  className="w-full p-4 bg-white border border-slate-300 rounded-lg text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 resize-none"
                  placeholder="Add any observations about the meter condition..."
                  rows={3}
                />
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-200 bg-slate-100 flex items-center justify-end gap-3">
              <button 
                className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                onClick={() => setShowLogModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2.5 rounded-lg bg-red-600 text-white text-sm font-bold shadow-md shadow-red-600/20 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
                onClick={() => {
                  handleLogReading({});
                  setShowLogModal(false);
                }}
              >
                Log Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Utilities;