import { useState } from "react";
import { Plus, Search, Car, Truck, AlertTriangle, ChevronDown, X, Upload } from "lucide-react";

const Vehicles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    year: '',
    registration: '',
    fuelType: '',
    color: '',
    vin: '',
    purchaseDate: '',
    mileage: '',
    insuranceExpiry: '',
    notes: ''
  });

  const vehicles = [
    {
      id: "1",
      name: "Toyota Hilux",
      registration: "GR-2345-23",
      driver: "Kwame Osei",
      fuelType: "Diesel",
      odometer: "45,231 km",
      location: "Accra Central",
      status: "active",
      serviceProgress: 75,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0PJSkzXkBSMNUefXsqQQ8TdnpgeFmXyCZz50hTtph8faMr8iSSQddth-alQgbvbot9w4DE4D2pgoy0IY2zM4EhGtAJWxptHsdPgpws_o__wqyUpLKu4PrWbkvRJOlGAGieyYGZl2hE76rIa4A8v7ewmnyHdRnr5QOsGvB8ybxjPmWIfyvRpoCmcIi0RzoapRs4vcAfEXTkKdSSOHiHYqOLXU8ob4d-sYwjC81N2ZoZsXPEBv5zw2lDKkZ72opbMVVYORd3xbOaCVA"
    },
    {
      id: "2",
      name: "Nissan Navara",
      registration: "GE-1902-22",
      driver: "Abena Mensah",
      fuelType: "Diesel",
      odometer: "12,400 km",
      location: "Kumasi Depot",
      status: "active",
      serviceProgress: 10,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOvVdSiEim9cAvJCjAFkBBB0F1k_rNr82WwQraa9PK8cpWOMwHAJXrEG7bbXX6fRfC3RyCrkiLsV0F2BWB29LBcpXLqlPp9WGPPCifq_uETeCaPXFQry_fwhysDcVBQzyg1m-aYWcklTZ-_1l90bNUeICppP2B9r202EErDXCN44C9B4PSYMXrWJyVzQq8dsAkn1ycGRtJSTuD83IMEulMqet5KRIyD35_5iQe2QdzHREFqiQZqlXCyHsEG1WdBbfaC4y0FfIzSDaC"
    },
    {
      id: "3",
      name: "Hyundai H-100",
      registration: "AS-8812-21",
      driver: "Kofi Boateng",
      fuelType: "Diesel",
      odometer: "89,100 km",
      location: "Tema Port",
      status: "maintenance",
      serviceProgress: 98,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9t4otNbcZvC4umGUSReaoXrUkuTHE3NcQ97iykqbPaF4O-B96xYrmpcSTGa4D9aG2YBMVA9DRLkQwSuv7vLm_5tbwyZDSA1NxvZSPu5zsbjcF0iJVLFk3d8T-AQM2C496vBa0DdcC1o0U3y26dYK576-LH0XWtOiaVUMgTuSjNAYZH1xgMoeagZgSt_K0dGdetfjCNWUGf7H3kziP0Cb9d33ouPT0Ly98FRHSpelbCdHynhyZjYUYXKfxQmwO9PH2MHJyPRnFGiyN"
    },
    {
      id: "4",
      name: "Toyota Corolla",
      registration: "GT-4521-20",
      driver: "Esi Darko",
      fuelType: "Petrol",
      odometer: "67,000 km",
      location: "Accra North",
      status: "active",
      serviceProgress: 45,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMukqRHCattAQ9a9WseKGV2hMdzD-mW7ZiJdRC7sEsaLddpEzmSPpcT_J_C-rQ4fBdQIQUPzOvO_Xl6v7xr6217oBjh1UN0YSic5Z-vIfkdiuqFRsCHAltLTMZ30-6KDEFhIdlNSOSwA5rMZ8x-_ZxOljn4pxQUOCHK2N9Xr-UF6eMKqXOa1JJol42W8CmzAYgwqOGsI3i5LVd3T4Gn9mwM4xQGbZ4ZriIzPmOu-VkWG1NUUK1itsDFtqIVrP_r0im2przYSsILNUw"
    },
    {
      id: "5",
      name: "Mitsubishi Pajero",
      registration: "GR-3310-23",
      driver: null,
      fuelType: "Diesel",
      odometer: "5,000 km",
      location: "Head Office",
      status: "unassigned",
      serviceProgress: 0,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyyvOWpSZtmODfM-KWjOR68u5kIkDG674B-1SM5VSpihp3rQGushDrRLyD5oIWgVHx1OwM2ya6Fgtrgh0HjPzot60hKY5ql7UhQg410E4mjhXSE1iuKZnO_0AeMTkBbGeQCOgL5ehJt6YSVfN_kzPmHNP-vZBDMFHTDQ4fHeEeKbK2UUr93fxWBmH6c9PCZtTH-jzb_EFq3TsuANi3SQD8Qw9eB26O_61GqYytOGQwhe-RL7NzRB1F8HjFDpzbZMvdc9TWdLubMlCE"
    },
    {
      id: "6",
      name: "Yamaha Dispatch",
      registration: "GX-102-22",
      driver: "Kojo Antwi",
      fuelType: "Petrol",
      odometer: "18,300 km",
      location: "Osu Branch",
      status: "active",
      serviceProgress: 30,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNYVJjVMy5LzODWd8Dl8XB1pv-OGdHdPSTP55qgntcQ15GhPPvLLca2D8s0FG-WNwsrkBwIfbRXOS3x9mG6ux3VMxH7hAIeDADhNLvRuu_Eaex3HNXWoK_nsIMaO0vzEIw7yo2w7fDG_-TOe7laOi7q91cy0_PFb6EKF07kuE22Ekuc4fFBS0ElRQcjd4Qn7Esm8lZXZxesxIAdpZ-MSD28NF3jad2zAOr5yWS4pQOR-GgQG14rma4aSQ7vw5EJzW3ChVpegK-Ks3A"
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen">
      <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:px-12 scroll-smooth">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 text-3xl font-black tracking-tight">Fleet Management</h2>
            <p className="text-slate-500 text-base">Manage and monitor all vehicles in the company fleet.</p>
          </div>
          <button 
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-all active:scale-95 focus:ring-4 focus:ring-red-300"
            onClick={() => setShowAddVehicleModal(true)}
          >
            <Plus className="w-5 h-5" />
            <span>Add Vehicle</span>
          </button>
        </div>

        {/* Dashboard Stats & Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 text-slate-500 mb-2">
                <Car className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium">Total Vehicles</span>
              </div>
              <div>
                <span className="text-3xl font-bold text-slate-900">42</span>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded ml-2">+2 New</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 text-slate-500 mb-2">
                <Truck className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium">Active Fleet</span>
              </div>
              <div>
                <span className="text-3xl font-bold text-slate-900">35</span>
                <span className="text-xs font-semibold text-slate-400 ml-2">83% Utilization</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 text-slate-500 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-medium">Maintenance</span>
              </div>
              <div>
                <span className="text-3xl font-bold text-slate-900">7</span>
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded ml-2">Needs Attention</span>
              </div>
            </div>
          </div>
          {/* Pie Chart Widget */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="w-24 h-24 rounded-full shrink-0" style={{background: 'conic-gradient(#0d9488 0% 65%, #f59e0b 65% 85%, #cbd5e1 85% 100%)'}}></div>
            <div className="flex flex-col gap-2 flex-1">
              <h3 className="text-sm font-bold text-slate-900">Assignment Breakdown</h3>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                  <span className="text-xs text-slate-600 flex-1">Assigned</span>
                  <span className="text-xs font-bold text-slate-900">65%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-xs text-slate-600 flex-1">Maintenance</span>
                  <span className="text-xs font-bold text-slate-900">20%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                  <span className="text-xs text-slate-600 flex-1">Unassigned</span>
                  <span className="text-xs font-bold text-slate-900">15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 sticky top-0 bg-slate-50 z-20 py-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm shadow-sm transition-all" 
              placeholder="Search by reg number, model, or driver..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-teal-200 whitespace-nowrap shadow-sm">
              <span>Status: All</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-teal-200 whitespace-nowrap shadow-sm">
              <span>Make: Toyota</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-teal-200 whitespace-nowrap shadow-sm">
              <span>Fuel: Diesel</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
              <div className="p-5 flex gap-4">
                <div className="w-20 h-20 rounded-lg bg-slate-100 bg-cover bg-center border border-slate-100 shrink-0" style={{backgroundImage: `url('${vehicle.image}')`}}></div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border tracking-wide ${
                      vehicle.status === 'active' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                      vehicle.status === 'maintenance' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {vehicle.status === 'unassigned' ? 'Unassigned' : vehicle.status === 'maintenance' ? 'Maintenance' : 'Active'}
                    </span>
                    <div className="relative group/tooltip">
                      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                        <path className={vehicle.status === 'maintenance' ? 'text-red-500' : vehicle.status === 'unassigned' ? 'text-slate-300' : 'text-teal-500'} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${vehicle.serviceProgress}, 100`} strokeWidth="3"></path>
                      </svg>
                      {vehicle.serviceProgress > 90 && (
                        <div className="absolute top-full right-0 mt-1 hidden group-hover/tooltip:block bg-red-600 text-white text-xs p-1.5 rounded whitespace-nowrap z-10">Overdue Service</div>
                      )}
                      {vehicle.serviceProgress > 70 && vehicle.serviceProgress <= 90 && (
                        <div className="absolute top-full right-0 mt-1 hidden group-hover/tooltip:block bg-slate-800 text-white text-xs p-1.5 rounded whitespace-nowrap z-10">Service due in 2000km</div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg truncate">{vehicle.name}</h3>
                  <p className="text-slate-500 text-xs font-mono">{vehicle.registration}</p>
                </div>
              </div>
              <div className="px-5 pb-4 grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs">Driver</span>
                  <span className={`font-medium ${vehicle.driver ? 'text-slate-700' : 'text-slate-400 italic'}`}>{vehicle.driver || '--'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs">Odometer</span>
                  <span className="text-slate-700 font-medium">{vehicle.odometer}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs">Fuel Type</span>
                  <span className="text-slate-700 font-medium">{vehicle.fuelType}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs">Location</span>
                  <span className="text-slate-700 font-medium">{vehicle.location}</span>
                </div>
              </div>
              <div className={`px-5 py-3 border-t flex gap-2 ${
                vehicle.status === 'maintenance' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'
              }`}>
                {vehicle.status === 'unassigned' ? (
                  <button className="w-full py-1.5 rounded bg-red-600 border border-red-600 text-white text-xs font-semibold hover:bg-red-700 shadow-sm transition-colors">Assign Driver</button>
                ) : vehicle.status === 'maintenance' ? (
                  <button className="flex-1 py-1.5 rounded bg-white border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-600 hover:text-white transition-colors">Service Log</button>
                ) : (
                  <>
                    <button className="flex-1 py-1.5 rounded bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 hover:text-teal-700 transition-colors">Details</button>
                    <button className="flex-1 py-1.5 rounded bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 hover:text-teal-700 transition-colors">Assign</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Pagination */}
        <div className="flex justify-between items-center border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">Showing <span className="font-bold text-slate-800">1-6</span> of <span className="font-bold text-slate-800">42</span> vehicles</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-slate-200 rounded text-sm text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 bg-red-600 text-white rounded text-sm font-semibold shadow-sm hover:bg-red-700">1</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">2</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">3</button>
            <span className="px-2 py-1.5 text-slate-400">...</span>
            <button className="px-3 py-1.5 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[800px] max-h-[90vh] flex flex-col rounded-xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Add New Vehicle
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Enter details to register a new vehicle to the fleet.
                </p>
              </div>
              <button 
                className="group p-2 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() => setShowAddVehicleModal(false)}
              >
                <X className="h-5 w-5 text-slate-500 group-hover:text-slate-900" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Section: Vehicle Details */}
                <div className="col-span-1 md:col-span-2 pb-2 border-b border-slate-200 mb-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Vehicle Details
                  </h3>
                </div>

                {/* Make */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-900">
                    Make <span className="text-red-500">*</span>
                  </span>
                  <input 
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-slate-500 focus:ring-1 focus:ring-slate-200 py-2.5 px-3.5 text-sm shadow-sm transition-all"
                    placeholder="e.g. Toyota"
                    required
                    type="text"
                    value={vehicleForm.make}
                    onChange={(e) => setVehicleForm({...vehicleForm, make: e.target.value})}
                  />
                </label>

                {/* Model */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-900">
                    Model <span className="text-red-500">*</span>
                  </span>
                  <input 
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-slate-500 focus:ring-1 focus:ring-slate-200 py-2.5 px-3.5 text-sm shadow-sm transition-all"
                    placeholder="e.g. Hilux"
                    required
                    type="text"
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})}
                  />
                </label>

                {/* Registration Number */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-900">
                    Registration Number <span className="text-red-500">*</span>
                  </span>
                  <input 
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-slate-500 focus:ring-1 focus:ring-slate-200 py-2.5 px-3.5 text-sm shadow-sm transition-all uppercase"
                    placeholder="e.g. GW-2024-23"
                    required
                    type="text"
                    value={vehicleForm.registration}
                    onChange={(e) => setVehicleForm({...vehicleForm, registration: e.target.value})}
                  />
                </label>

                {/* Year */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-900">
                    Year <span className="text-red-500">*</span>
                  </span>
                  <input 
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-slate-500 focus:ring-1 focus:ring-slate-200 py-2.5 px-3.5 text-sm shadow-sm transition-all"
                    max="2025"
                    min="1990"
                    placeholder="e.g. 2023"
                    required
                    type="number"
                    value={vehicleForm.year}
                    onChange={(e) => setVehicleForm({...vehicleForm, year: e.target.value})}
                  />
                </label>

                {/* Section: Specifications & Assignment */}
                <div className="col-span-1 md:col-span-2 pb-2 border-b border-slate-200 mt-4 mb-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Specifications & Assignment
                  </h3>
                </div>

                {/* Fuel Type */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-900">Fuel Type</span>
                  <select 
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-slate-500 focus:ring-1 focus:ring-slate-200 py-2.5 px-3.5 text-sm shadow-sm appearance-none transition-all"
                    value={vehicleForm.fuelType}
                    onChange={(e) => setVehicleForm({...vehicleForm, fuelType: e.target.value})}
                  >
                    <option value="">Select fuel type</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric</option>
                  </select>
                </label>

                {/* Initial Odometer */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-900">Initial Odometer (km)</span>
                  <input 
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-slate-500 focus:ring-1 focus:ring-slate-200 py-2.5 px-3.5 text-sm shadow-sm transition-all"
                    placeholder="0"
                    type="number"
                    value={vehicleForm.mileage}
                    onChange={(e) => setVehicleForm({...vehicleForm, mileage: e.target.value})}
                  />
                </label>

                {/* Current Driver */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-900">Current Driver</span>
                  <select className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-slate-500 focus:ring-1 focus:ring-slate-200 py-2.5 px-3.5 text-sm shadow-sm appearance-none transition-all">
                    <option value="">Search driver (e.g. Kwame Boateng)</option>
                    <option value="kwame_boateng">Kwame Boateng</option>
                    <option value="ama_mensah">Ama Mensah</option>
                    <option value="kofi_kingston">Kofi Kingston</option>
                    <option value="yaw_oteng">Yaw Oteng</option>
                  </select>
                </label>

                {/* Vehicle Status */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-slate-900">Vehicle Status</span>
                  <select className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 focus:border-slate-500 focus:ring-1 focus:ring-slate-200 py-2.5 px-3.5 text-sm shadow-sm appearance-none transition-all">
                    <option value="active" selected>Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>

                {/* Section: Media & Extras */}
                <div className="col-span-1 md:col-span-2 pb-2 border-b border-slate-200 mt-4 mb-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Media & Extras
                  </h3>
                </div>

                {/* Image Upload */}
                <div className="col-span-1 md:col-span-2">
                  <span className="text-sm font-medium text-slate-900 mb-1.5 block">Vehicle Image</span>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-white hover:border-slate-400 transition-colors group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-8 w-8 text-slate-500 mb-2 group-hover:text-slate-600 transition-colors" />
                      <p className="mb-1 text-sm text-slate-900 font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input className="hidden" type="file" />
                  </label>
                </div>

                {/* Notes */}
                <div className="col-span-1 md:col-span-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-slate-900">Notes</span>
                    <textarea 
                      className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-slate-500 focus:ring-1 focus:ring-slate-200 py-2.5 px-3.5 text-sm shadow-sm resize-none transition-all"
                      placeholder="Add any additional notes about the vehicle condition or insurance..."
                      rows={3}
                      value={vehicleForm.notes}
                      onChange={(e) => setVehicleForm({...vehicleForm, notes: e.target.value})}
                    />
                  </label>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 shrink-0 flex items-center justify-end gap-3">
              <button 
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-300 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
                onClick={() => setShowAddVehicleModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-red-600 shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                onClick={() => {
                  console.log('Adding vehicle:', vehicleForm);
                  setShowAddVehicleModal(false);
                  setVehicleForm({
                    make: '', model: '', year: '', registration: '', fuelType: '', color: '', vin: '', purchaseDate: '', mileage: '', insuranceExpiry: '', notes: ''
                  });
                }}
              >
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
