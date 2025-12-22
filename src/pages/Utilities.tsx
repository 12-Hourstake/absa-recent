import { useState } from "react";
import {
  Zap,
  Droplets,
  Sun,
  PiggyBank,
  Download,
  Plus,
  TrendingDown,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
  Eye,
  X,
  Search,
} from "lucide-react";

const Utilities = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showLogModal, setShowLogModal] = useState(false);

  const kpiData = [
    {
      title: "Total Electricity Purchased",
      value: "21,000",
      unit: "kWh",
      icon: Zap,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "15% reduction",
      trendIcon: TrendingDown,
      trendColor: "text-emerald-600",
      change: "-2,400 kWh",
    },
    {
      title: "Water Purchase Volume",
      value: "3,000",
      unit: "m³",
      icon: Droplets,
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
      trend: "8% reduction",
      trendIcon: TrendingDown,
      trendColor: "text-emerald-600",
      change: "-260 m³",
    },
    {
      title: "Fuel Purchase Volume",
      value: "16,200",
      unit: "L",
      icon: Sun,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      trend: "12% increase",
      trendIcon: TrendingUp,
      trendColor: "text-emerald-600",
      change: "+1,740 L",
    },
    {
      title: "Cost Savings",
      value: "GH₵ 45,230",
      unit: "",
      icon: PiggyBank,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: "vs. grid only",
      trendIcon: null,
      trendColor: "text-slate-500",
      change: "This month",
    },
  ];

  const chartData = [
    { month: "May", consumption: 18500, solar: 14200, cost: 8200 },
    { month: "Jun", consumption: 19200, solar: 15100, cost: 7800 },
    { month: "Jul", consumption: 20100, solar: 15800, cost: 7400 },
    { month: "Aug", consumption: 22000, solar: 16500, cost: 6900 },
    { month: "Sep", consumption: 19800, solar: 15900, cost: 7200 },
    { month: "Oct", consumption: 21000, solar: 16200, cost: 6800 },
  ];

  const alerts = [
    {
      type: "warning",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      title: "High Usage Alert",
      message: "Kumasi Branch exceeded normal consumption by 15% this week",
      action: "View Details",
    },
    {
      type: "info",
      icon: Lightbulb,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      title: "Optimization Opportunity",
      message: "Switch HVAC schedule at East Legon to save GH₵ 2,400/month",
      action: "Apply Now",
    },
  ];

  const topConsumers = [
    { location: "Accra Financial Centre", consumption: 4230, percentage: 20.1, trend: "up" },
    { location: "Kumasi Heights", consumption: 3400, percentage: 16.2, trend: "up" },
    { location: "East Legon Branch", consumption: 2890, percentage: 13.8, trend: "down" },
    { location: "Tema Commercial", consumption: 2650, percentage: 12.6, trend: "stable" },
    { location: "Takoradi Main", consumption: 2180, percentage: 10.4, trend: "down" },
  ];

  const meterReadings = [
    {
      location: "Accra Financial Centre",
      meterId: "M-2309-AFC",
      date: "Oct 24, 2026",
      consumption: "4,230",
      cost: "5,922.00",
      status: "Normal",
      statusColor: "bg-teal-100 text-red-800",
      efficiency: 92,
    },
    {
      location: "Kumasi Heights",
      meterId: "M-4402-KMS",
      date: "Oct 23, 2026",
      consumption: "3,400",
      cost: "4,760.00",
      status: "High Usage",
      statusColor: "bg-amber-100 text-amber-800",
      efficiency: 78,
    },
    {
      location: "East Legon Branch",
      meterId: "M-8821-ELB",
      date: "Oct 23, 2026",
      consumption: "2,890",
      cost: "4,046.00",
      status: "Normal",
      statusColor: "bg-teal-100 text-teal-800",
      efficiency: 88,
    },
    {
      location: "Tamale Main",
      meterId: "M-1290-TML",
      date: "Oct 22, 2025",
      consumption: "2,180",
      cost: "3,052.00",
      status: "Efficient",
      statusColor: "bg-emerald-100 text-emerald-800",
      efficiency: 95,
    },
  ];

  return (
    <div className="mx-auto max-w-[1600px] flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Utility Management</h1>
          <p className="text-slate-600">Monitor consumption, costs, and sustainability across all Ghana operations</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
            <Calendar className="h-4 w-4 text-slate-500" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm border-none outline-none bg-transparent"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm border-none outline-none bg-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-lg text-sm font-medium hover:bg-red-900 transition-colors"
            onClick={() => setShowLogModal(true)}
          >
            <Plus className="h-4 w-4" />
            Log Reading
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {kpiData.map((kpi, index) => (
          <div key={index} className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
              <span className="text-[18px]">⋮⋮</span>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">{kpi.title}</p>
                <h4 className="mt-2 text-3xl font-bold text-slate-900">
                  {kpi.value}
                  {kpi.unit && <span className="text-lg font-normal text-slate-500 ml-1">{kpi.unit}</span>}
                </h4>
              </div>
              <div className={`rounded-lg p-2 ${kpi.iconBg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {kpi.trendIcon && (
                <span className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded border ${
                  kpi.trendColor === "text-emerald-600" ? "text-green-900 bg-green-100 border-green-200" : "text-red-900 bg-red-100 border-red-200"
                }`}>
                  <kpi.trendIcon className="text-[14px] mr-0.5 h-3 w-3" /> {kpi.trend}
                </span>
              )}
              <span className="text-xs text-slate-500">{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {alerts.map((alert, index) => (
          <div key={index} className={`${alert.bgColor} ${alert.borderColor} border rounded-xl p-4`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-white`}>
                <alert.icon className={`h-5 w-5 ${alert.iconColor}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">{alert.title}</h3>
                <p className="text-sm text-slate-700 mb-3">{alert.message}</p>
                <button className="text-sm font-medium text-red-800 hover:text-teal-700">
                  {alert.action} →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Consumption Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Utility Purchase Trends</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-slate-600">Total Electricity Purchased</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-slate-600">Total Fuel Purchased</span>
              </div>
            </div>
          </div>
          
          <div className="relative h-80">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-full h-px bg-slate-100"></div>
              ))}
            </div>
            
            <div className="relative h-full flex items-end justify-between gap-4 px-4">
              {chartData.map((data, index) => (
                <div key={index} className="flex flex-col items-center gap-3 flex-1 group">
                  <div className="relative w-full flex items-end justify-center gap-2 h-full max-w-16">
                    <div className="relative w-full">
                      <div 
                        className="w-full bg-red-500 rounded-t hover:bg-teal-400 transition-colors cursor-pointer" 
                        style={{ height: `${(data.consumption / 25000) * 100}%` }}
                        title={`Total: ${data.consumption.toLocaleString()} kWh`}
                      ></div>
                      <div 
                        className="absolute bottom-0 w-full bg-amber-500 rounded-t opacity-80 hover:opacity-100 transition-opacity cursor-pointer" 
                        style={{ height: `${(data.solar / 25000) * 100}%` }}
                        title={`Solar: ${data.solar.toLocaleString()} kWh`}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-600">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Consumers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Top Consumers</h3>
          <div className="space-y-4">
            {topConsumers.map((consumer, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-slate-900 text-sm">{consumer.location}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-full bg-slate-200 rounded-full h-1.5 max-w-20">
                      <div 
                        className="bg-red-500 h-1.5 rounded-full" 
                        style={{ width: `${consumer.percentage * 5}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500">{consumer.percentage}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{consumer.consumption.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">kWh</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Energy Mix & Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Energy Mix */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Energy Mix</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8"></circle>
                <circle 
                  cx="50" cy="50" r="40" fill="none" stroke="#AF144B" strokeWidth="8"
                  strokeDasharray="167.77" strokeDashoffset="50.33"
                  className="transition-all duration-1000"
                ></circle>
                <circle 
                  cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="8"
                  strokeDasharray="167.77" strokeDashoffset="117.44"
                  className="transition-all duration-1000"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">77%</span>
                <span className="text-sm text-slate-500">Self-powered</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">Solar Generation</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">16,200 kWh (77%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">Grid Supply</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">4,800 kWh (23%)</span>
            </div>
          </div>
        </div>

        {/* Monthly Bill Projection */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Monthly Bill Projection</h3>
          <p className="text-sm text-slate-600 mb-6">Based on current consumption trends</p>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-slate-900">GH₵ 12,450</span>
                <span className="text-sm text-slate-600 mb-1">estimated</span>
              </div>
              <div className="w-full bg-white-200 rounded-full h-3">
                <div className="bg-teal-800 h-3 rounded-full" style={{ width: "78%" }}></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-600">
                <span>Current: GH₵ 12,450</span>
                <span>Budget: GH₵ 16,000</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-teal-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Savings vs. grid-only:</span>
                <span className="font-semibold text-emerald-600">GH₵ 8,750</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meter Readings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Recent Logs</h3>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors">
              Filter
            </button>
            <button className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors">
              Export
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Meter ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Consumption</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Efficiency</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {meterReadings.map((reading, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{reading.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {reading.meterId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {reading.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-slate-900">{reading.consumption} kWh</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-slate-900">GH₵ {reading.cost}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-16 bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${reading.efficiency >= 90 ? 'bg-emerald-500' : reading.efficiency >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${reading.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs font-medium text-slate-600">{reading.efficiency}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reading.statusColor}`}>
                      {reading.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="text-slate-400 hover:text-red-800 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">Showing 4 of 28 locations</span>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 rounded-md bg-red-50 text-teal-700 text-sm font-medium">1</button>
            <button className="px-3 py-1 rounded-md hover:bg-slate-100 text-slate-600 text-sm font-medium transition-colors">2</button>
            <button className="px-3 py-1 rounded-md hover:bg-slate-100 text-slate-600 text-sm font-medium transition-colors">3</button>
            <button className="p-2 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Log Reading Modal */}
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
                <X className="h-5 w-5 text-slate-400 hover:text-slate-900" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto p-8 space-y-6">
              {/* Utility Type */}
              <div>
                <label className="block text-slate-900 text-sm font-medium mb-2">Utility Type</label>
                <div className="relative">
                  <Select>
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="Select Utility Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="gas">Gas</SelectItem>
                      <SelectItem value="solar">Solar</SelectItem>
                    </SelectContent>
                  </Select>
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
                onClick={() => setShowLogModal(false)}
              >
                Log Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Utilities;