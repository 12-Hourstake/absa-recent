import { useState } from "react";
import { Search, Plus, Download, MoreVertical, Building, TrendingUp, Users as UsersIcon, MapPin, Filter as FilterIcon, Eye, Edit, Trash2, X } from "lucide-react";
import FormModal from "@/components/ui/FormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomSelectDropdown from "../../components/ui/CustomSelectDropdown";

const mockBranches = [
  {
    id: 1,
    name: "Sunset Apartments",
    type: "Residential",
    city: "Accra",
    units: 50,
    occupancy: 95,
    manager: "Jane Doe",
    lastInspection: "2023-10-15",
  },
  {
    id: 2,
    name: "Downtown Plaza",
    type: "Commercial",
    city: "Kumasi",
    units: 20,
    occupancy: 85,
    manager: "John Smith",
    lastInspection: "2023-09-20",
  },
  {
    id: 3,
    name: "Oakwood Complex",
    type: "Residential",
    city: "Tamale",
    units: 120,
    occupancy: 98,
    manager: "Emily White",
    lastInspection: "2023-11-01",
  },
  {
    id: 4,
    name: "Bayview Lofts",
    type: "Residential",
    city: "Accra",
    units: 30,
    occupancy: 90,
    manager: "Michael Brown",
    lastInspection: "2023-10-22",
  },
  {
    id: 5,
    name: "Metro Business Center",
    type: "Commercial",
    city: "Kumasi",
    units: 45,
    occupancy: 80,
    manager: "Sarah Green",
    lastInspection: "2023-08-30",
  },
];

export default function Branches() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [filterBy, setFilterBy] = useState("all");

  const branchFields = [
    { name: 'name', label: 'Branch Name', type: 'text' as const, required: true, placeholder: 'Enter branch name' },
    { name: 'type', label: 'Branch Type', type: 'select' as const, required: true, options: [
      { value: 'residential', label: 'Residential' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'mixed', label: 'Mixed Use' }
    ]},
    { name: 'city', label: 'City', type: 'text' as const, required: true, placeholder: 'City name' },
    { name: 'address', label: 'Address', type: 'textarea' as const, required: true, placeholder: 'Full address' },
    { name: 'units', label: 'Number of Units', type: 'number' as const, required: true, placeholder: '0' },
    { name: 'manager', label: 'Branch Manager', type: 'text' as const, placeholder: 'Manager name' }
  ];

  const handleAddBranch = (data: Record<string, string>) => {
    console.log('Adding branch:', data);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Branch Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all your branches, units, and occupancy rates
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Import CSV
          </button>
          <button 
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4" />
            New Branch
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Branches</p>
                <p className="text-3xl font-bold mt-1">152</p>
                <p className="text-xs text-muted-foreground mt-1">Across 8 cities</p>
              </div>
              <Building className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                <p className="text-3xl font-bold mt-1">92%</p>
                <p className="text-xs text-green-600 mt-1">↑ +3% vs last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Units</p>
                <p className="text-3xl font-bold mt-1">1,248</p>
                <p className="text-xs text-muted-foreground mt-1">48 available</p>
              </div>
              <UsersIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Cities</p>
                <p className="text-3xl font-bold mt-1">8</p>
                <p className="text-xs text-muted-foreground mt-1">Nationwide coverage</p>
              </div>
              <MapPin className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardContent className="p-0">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 p-4 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search branches by name, city, or manager..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button 
                  className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                    filterBy === "all" ? "bg-red-600 text-white border-red-600" : "border-slate-300 hover:bg-slate-50"
                  }`}
                  onClick={() => setFilterBy("all")}
                >
                  All
                </button>
                <button 
                  className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                    filterBy === "residential" ? "bg-red-600 text-white border-red-600" : "border-slate-300 hover:bg-slate-50"
                  }`}
                  onClick={() => setFilterBy("residential")}
                >
                  Residential
                </button>
                <button 
                  className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                    filterBy === "commercial" ? "bg-red-600 text-white border-red-600" : "border-slate-300 hover:bg-slate-50"
                  }`}
                  onClick={() => setFilterBy("commercial")}
                >
                  Commercial
                </button>
                <CustomSelectDropdown
                  options={[
                    { value: "all", label: "All Cities" },
                    { value: "accra", label: "Accra" },
                    { value: "kumasi", label: "Kumasi" },
                    { value: "tamale", label: "Tamale" }
                  ]}
                  value={selectedCity}
                  onChange={setSelectedCity}
                  placeholder="All Cities"
                  className="w-[120px]"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    <input type="checkbox" className="rounded border-input" />
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Branch Name
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    City
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Units
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Occupancy %
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Manager
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Last Inspection
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockBranches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-muted/50">
                    <td className="p-4">
                      <input type="checkbox" className="rounded border-input" />
                    </td>
                    <td className="p-4 text-sm font-medium">{branch.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {branch.type}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {branch.city}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {branch.units}
                    </td>
                    <td className="p-4 text-sm">
                      <Badge
                        variant={branch.occupancy >= 90 ? "default" : "secondary"}
                      >
                        {branch.occupancy}%
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {branch.manager}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {branch.lastInspection}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button 
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                          onClick={() => {
                            setSelectedBranch(branch);
                            setShowViewModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                          onClick={() => {
                            setSelectedBranch(branch);
                            setShowEditModal(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
                          onClick={() => {
                            setSelectedBranch(branch);
                            setShowDeleteModal(true);
                          }}
                        >
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
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing 1 to 5 of 152 results
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Rows per page:
                </span>
                <Select defaultValue="5">
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <span className="text-sm">1 / 31</span>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 sm:p-6">
          <div className="w-full max-w-[800px] bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
              <div>
                <h2 className="text-gray-900 text-xl font-bold leading-tight">Add New Branch</h2>
                <p className="text-gray-500 text-sm mt-1">Enter the details for the new listing.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="group p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <form className="flex flex-col gap-8">
                {/* Section 1: Branch Identity */}
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col md:flex-row gap-5">
                    <label className="flex flex-col flex-1 gap-2">
                      <span className="text-gray-900 text-sm font-medium">Branch Name <span className="text-red-500">*</span></span>
                      <input 
                        className="w-full rounded-lg border border-gray-200 bg-white h-12 px-4 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-shadow" 
                        placeholder="e.g., Osu Heights Apartments" 
                        type="text"
                      />
                    </label>
                  </div>
                  <div className="flex flex-col md:flex-row gap-5">
                    <label className="flex flex-col flex-1 gap-2">
                      <span className="text-gray-900 text-sm font-medium">Branch Manager</span>
                      <div className="relative">
                        <select className="w-full rounded-lg border border-gray-200 bg-white h-12 px-4 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none appearance-none pr-10 cursor-pointer">
                          <option disabled selected value="">Select Manager</option>
                          <option value="kwame">Kwame Mensah</option>
                          <option value="abena">Abena Osei</option>
                          <option value="kofi">Kofi Boateng</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">⌄</span>
                      </div>
                    </label>
                    <label className="flex flex-col w-full md:w-1/3 gap-2">
                      <span className="text-gray-900 text-sm font-medium">Initial Status</span>
                      <div className="relative">
                        <select className="w-full rounded-lg border border-gray-200 bg-white h-12 px-4 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none appearance-none pr-10 cursor-pointer">
                          <option selected value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">⌄</span>
                      </div>
                    </label>
                  </div>
                </div>
                <hr className="border-gray-100"/>
                
                {/* Section 2: Location */}
                <div className="flex flex-col gap-5">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</h3>
                  <div className="flex flex-col md:flex-row gap-5">
                    <label className="flex flex-col flex-[2] gap-2">
                      <span className="text-gray-900 text-sm font-medium">Address <span className="text-red-500">*</span></span>
                      <div className="relative">
                        <input 
                          className="w-full rounded-lg border border-gray-200 bg-white h-12 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-shadow" 
                          placeholder="e.g., 15 Oxford Street" 
                          type="text"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">📍</span>
                      </div>
                    </label>
                    <label className="flex flex-col flex-1 gap-2">
                      <span className="text-gray-900 text-sm font-medium">City</span>
                      <input 
                        className="w-full rounded-lg border border-gray-200 bg-white h-12 px-4 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-shadow" 
                        placeholder="e.g., Accra" 
                        type="text"
                      />
                    </label>
                  </div>
                  <label className="flex flex-col w-full md:w-1/2 gap-2">
                    <span className="text-gray-900 text-sm font-medium">Region</span>
                    <div className="relative">
                      <select className="w-full rounded-lg border border-gray-200 bg-white h-12 px-4 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none appearance-none pr-10 cursor-pointer">
                        <option disabled selected value="">Select Region</option>
                        <option value="greater-accra">Greater Accra</option>
                        <option value="ashanti">Ashanti</option>
                        <option value="central">Central</option>
                        <option value="eastern">Eastern</option>
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">⌄</span>
                    </div>
                  </label>
                </div>
                <hr className="border-gray-100"/>
                
                {/* Section 3: Details & Financials */}
                <div className="flex flex-col gap-5">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <label className="flex flex-col gap-2">
                      <span className="text-gray-900 text-sm font-medium">Total Units</span>
                      <input 
                        className="w-full rounded-lg border border-gray-200 bg-white h-12 px-4 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-shadow" 
                        placeholder="0" 
                        type="number"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-gray-900 text-sm font-medium">Avg Rent</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium z-10">GHS</span>
                        <input 
                          className="w-full rounded-lg border border-gray-200 bg-white h-12 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-shadow" 
                          placeholder="0.00" 
                          type="text"
                        />
                      </div>
                    </label>
                    <label className="flex flex-col gap-2 md:col-span-3">
                      <span className="text-gray-900 text-sm font-medium">Tags</span>
                      <div className="w-full rounded-lg border border-gray-200 bg-white min-h-[48px] px-3 py-2 text-gray-900 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 transition-shadow flex flex-wrap gap-2 items-center cursor-text">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-100 text-red-800 text-xs font-medium border border-red-200">
                          Residential
                          <button className="hover:text-red-900 transition-colors" type="button">
                            <span className="text-sm">×</span>
                          </button>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-100 text-red-800 text-xs font-medium border border-red-200">
                          Gated
                          <button className="hover:text-red-900 transition-colors" type="button">
                            <span className="text-sm">×</span>
                          </button>
                        </span>
                        <input 
                          className="border-none bg-transparent p-0 text-sm placeholder:text-gray-400 focus:ring-0 flex-1 min-w-[80px]" 
                          placeholder="Add a tag..." 
                          type="text"
                        />
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Section 4: Visuals */}
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Image Upload */}
                    <div className="md:col-span-1">
                      <span className="block text-gray-900 text-sm font-medium mb-2">Branch Image</span>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-red-50 hover:border-red-300 transition-colors group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <span className="text-gray-400 mb-2 group-hover:text-red-500 transition-colors text-2xl">📷</span>
                          <p className="text-xs text-gray-500 group-hover:text-red-600 transition-colors">Click or drag image</p>
                        </div>
                        <input className="hidden" type="file"/>
                      </label>
                    </div>
                    {/* Description */}
                    <div className="md:col-span-2">
                      <span className="block text-gray-900 text-sm font-medium mb-2">Description</span>
                      <textarea 
                        className="w-full rounded-lg border border-gray-200 bg-white h-32 p-4 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none resize-none transition-shadow text-sm" 
                        placeholder="Write a brief description about the branch amenities and features..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-100 p-6 bg-gray-50 flex items-center justify-end gap-3 rounded-b-xl">
              <button 
                className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium text-sm hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 shadow-md shadow-red-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => {
                  handleAddBranch({});
                  setShowAddModal(false);
                }}
              >
                Add Branch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Branch Modal */}
      {showViewModal && selectedBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Branch Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Branch Name</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{selectedBranch.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedBranch.type}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">City</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedBranch.city}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Units</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedBranch.units}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Occupancy</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      selectedBranch.occupancy >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedBranch.occupancy}%
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Manager</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{selectedBranch.manager}</p>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Inspection</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{selectedBranch.lastInspection}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
              <button 
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors flex items-center gap-2"
                onClick={() => {
                  setShowViewModal(false);
                  setShowEditModal(true);
                }}
              >
                <Edit className="w-4 h-4" />
                Edit Branch
              </button>
              <button 
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Branch Modal */}
      {showEditModal && selectedBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Edit Branch</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors p-1 rounded-lg hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Branch</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{selectedBranch.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Manager</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{selectedBranch.manager}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{selectedBranch.type}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
              <button 
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors flex items-center gap-2"
                onClick={() => setShowEditModal(false)}
              >
                <Edit className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Branch Modal */}
      {showDeleteModal && selectedBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Branch</h3>
                <p className="text-sm text-slate-600 mt-1">This action cannot be undone</p>
              </div>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-red-800">
                    Are you sure you want to delete <strong>{selectedBranch.name}</strong>? This will permanently remove the branch and all associated data.
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Branch Details</label>
                  <div className="mt-2 space-y-1 text-sm text-slate-600">
                    <p>• {selectedBranch.units} units</p>
                    <p>• {selectedBranch.occupancy}% occupancy</p>
                    <p>• Located in {selectedBranch.city}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
              <button 
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors flex items-center gap-2"
                onClick={() => setShowDeleteModal(false)}
              >
                <Trash2 className="w-4 h-4" />
                Delete Branch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}