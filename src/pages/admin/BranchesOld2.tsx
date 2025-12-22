import { useState, useEffect } from "react";
import { Search, Plus, Download, Eye, Edit, Trash2, X, Building, TrendingUp, Users as UsersIcon, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import CustomSelectDropdown from "../../components/ui/CustomSelectDropdown";

interface Branch {
  id: string;
  name: string;
  type: string;
  city: string;
  region: string;
  totalUnits: number;
  occupancyRate: number;
  floorAreaSqm: number;
  manager: string;
  lastInspection: string;
  status: 'Active' | 'Inactive';
  address: string;
  description?: string;
}

// Excel seed data
const SEED_BRANCHES: Omit<Branch, 'id'>[] = [
  { name: "Accra Central Branch", type: "Branch", city: "Accra", region: "Greater Accra", totalUnits: 45, occupancyRate: 92, floorAreaSqm: 1200, manager: "Kwame Asante", lastInspection: "2024-01-15", status: "Active", address: "15 Independence Avenue, Accra" },
  { name: "Kumasi Main Branch", type: "Branch", city: "Kumasi", region: "Ashanti", totalUnits: 38, occupancyRate: 88, floorAreaSqm: 980, manager: "Akosua Mensah", lastInspection: "2024-01-10", status: "Active", address: "22 Prempeh II Street, Kumasi" },
  { name: "Tema Industrial Branch", type: "Critical Site", city: "Tema", region: "Greater Accra", totalUnits: 52, occupancyRate: 95, floorAreaSqm: 1450, manager: "Kofi Boateng", lastInspection: "2024-01-20", status: "Active", address: "Industrial Area, Tema" },
  { name: "Takoradi Port Branch", type: "Branch", city: "Takoradi", region: "Western", totalUnits: 28, occupancyRate: 85, floorAreaSqm: 750, manager: "Ama Darko", lastInspection: "2024-01-08", status: "Active", address: "Harbour Road, Takoradi" },
  { name: "Cape Coast Branch", type: "Branch", city: "Cape Coast", region: "Central", totalUnits: 32, occupancyRate: 90, floorAreaSqm: 850, manager: "Yaw Oppong", lastInspection: "2024-01-12", status: "Active", address: "Commercial Street, Cape Coast" },
  { name: "Tamale Northern Branch", type: "Branch", city: "Tamale", region: "Northern", totalUnits: 25, occupancyRate: 80, floorAreaSqm: 650, manager: "Fatima Abdul", lastInspection: "2024-01-05", status: "Active", address: "Central Market Area, Tamale" },
  { name: "Ho Regional Branch", type: "Branch", city: "Ho", region: "Volta", totalUnits: 22, occupancyRate: 86, floorAreaSqm: 580, manager: "Edem Kpodo", lastInspection: "2024-01-18", status: "Active", address: "Civic Centre Road, Ho" },
  { name: "Sunyani Branch", type: "Branch", city: "Sunyani", region: "Bono", totalUnits: 30, occupancyRate: 88, floorAreaSqm: 720, manager: "Adjoa Frimpong", lastInspection: "2024-01-14", status: "Active", address: "Market Square, Sunyani" },
  { name: "Koforidua Eastern Branch", type: "Branch", city: "Koforidua", region: "Eastern", totalUnits: 26, occupancyRate: 84, floorAreaSqm: 680, manager: "Kwaku Owusu", lastInspection: "2024-01-07", status: "Active", address: "Jackson Park, Koforidua" },
  { name: "Wa Upper West Branch", type: "Branch", city: "Wa", region: "Upper West", totalUnits: 18, occupancyRate: 78, floorAreaSqm: 480, manager: "Alhassan Yakubu", lastInspection: "2024-01-03", status: "Active", address: "Central Wa, Upper West" },
  { name: "Corporate Headquarters", type: "Corporate", city: "Accra", region: "Greater Accra", totalUnits: 85, occupancyRate: 98, floorAreaSqm: 2200, manager: "Dr. Nana Akoto", lastInspection: "2024-01-22", status: "Active", address: "Airport Residential Area, Accra" },
  { name: "Bolgatanga Branch", type: "Branch", city: "Bolgatanga", region: "Upper East", totalUnits: 20, occupancyRate: 82, floorAreaSqm: 520, manager: "Mary Atanga", lastInspection: "2024-01-09", status: "Active", address: "Commercial Area, Bolgatanga" }
];

const CACHE_KEY = 'BRANCHES_CACHE_V1';

export default function Branches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    type: 'Branch',
    city: '',
    region: '',
    totalUnits: '',
    floorAreaSqm: '',
    manager: '',
    status: 'Active' as 'Active' | 'Inactive',
    address: '',
    description: ''
  });

  // Load branches on mount
  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        setBranches(JSON.parse(cached));
      } else {
        // Initialize with seed data
        const initialBranches = SEED_BRANCHES.map((branch, index) => ({
          ...branch,
          id: `branch-${index + 1}`
        }));
        setBranches(initialBranches);
        localStorage.setItem(CACHE_KEY, JSON.stringify(initialBranches));
      }
    } catch (error) {
      console.error('Error loading branches:', error);
      // Fallback to seed data
      const initialBranches = SEED_BRANCHES.map((branch, index) => ({
        ...branch,
        id: `branch-${index + 1}`
      }));
      setBranches(initialBranches);
    }
  };

  const saveBranches = (updatedBranches: Branch[]) => {
    setBranches(updatedBranches);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updatedBranches));
  };

  // Calculate stats
  const stats = {
    totalBranches: branches.length,
    averageOccupancy: branches.length > 0 ? Math.round(branches.reduce((sum, b) => sum + b.occupancyRate, 0) / branches.length) : 0,
    totalUnits: branches.reduce((sum, b) => sum + b.totalUnits, 0),
    activeSites: branches.filter(b => b.status === 'Active').length
  };

  // Filter branches
  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         branch.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         branch.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "all" || branch.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesType = selectedType === "all" || branch.type.toLowerCase() === selectedType.toLowerCase();
    
    return matchesSearch && matchesCity && matchesType;
  });

  const handleAddBranch = () => {
    if (!formData.name || !formData.city || !formData.totalUnits || !formData.floorAreaSqm) {
      alert('Please fill in all required fields');
      return;
    }

    const newBranch: Branch = {
      id: `branch-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      city: formData.city,
      region: formData.region,
      totalUnits: parseInt(formData.totalUnits),
      occupancyRate: 0, // Default to 0 for new branches
      floorAreaSqm: parseFloat(formData.floorAreaSqm),
      manager: formData.manager,
      lastInspection: '',
      status: formData.status,
      address: formData.address,
      description: formData.description
    };

    saveBranches([...branches, newBranch]);
    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteBranch = () => {
    if (selectedBranch) {
      const updatedBranches = branches.filter(b => b.id !== selectedBranch.id);
      saveBranches(updatedBranches);
      setShowDeleteModal(false);
      setSelectedBranch(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Branch',
      city: '',
      region: '',
      totalUnits: '',
      floorAreaSqm: '',
      manager: '',
      status: 'Active',
      address: '',
      description: ''
    });
  };

  // Get unique cities and types for filters
  const cities = Array.from(new Set(branches.map(b => b.city))).sort();
  const types = Array.from(new Set(branches.map(b => b.type))).sort();

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
          <button 
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4" />
            New Branch
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Branches</p>
                <p className="text-3xl font-bold mt-1">{stats.totalBranches}</p>
                <p className="text-xs text-muted-foreground mt-1">Nationwide coverage</p>
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
                <p className="text-3xl font-bold mt-1">{stats.averageOccupancy}%</p>
                <p className="text-xs text-green-600 mt-1">Average across branches</p>
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
                <p className="text-3xl font-bold mt-1">{stats.totalUnits}</p>
                <p className="text-xs text-muted-foreground mt-1">All branches combined</p>
              </div>
              <UsersIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Sites</p>
                <p className="text-3xl font-bold mt-1">{stats.activeSites}</p>
                <p className="text-xs text-muted-foreground mt-1">Currently operational</p>
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
                    selectedType === "all" ? "bg-red-600 text-white border-red-600" : "border-slate-300 hover:bg-slate-50"
                  }`}
                  onClick={() => setSelectedType("all")}
                >
                  All Types
                </button>
                {types.map(type => (
                  <button 
                    key={type}
                    className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                      selectedType === type.toLowerCase() ? "bg-red-600 text-white border-red-600" : "border-slate-300 hover:bg-slate-50"
                    }`}
                    onClick={() => setSelectedType(type.toLowerCase())}
                  >
                    {type}
                  </button>
                ))}
                <CustomSelectDropdown
                  options={[
                    { value: "all", label: "All Cities" },
                    ...cities.map(city => ({ value: city.toLowerCase(), label: city }))
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
                    Branch Name
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    City
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Floor Area (sq.m)
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Total Units
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Occupancy Rate
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Manager
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBranches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-muted/50">
                    <td className="p-4 text-sm font-medium">{branch.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{branch.type}</td>
                    <td className="p-4 text-sm text-muted-foreground">{branch.city}</td>
                    <td className="p-4 text-sm text-muted-foreground">{branch.floorAreaSqm.toLocaleString()}</td>
                    <td className="p-4 text-sm text-muted-foreground">{branch.totalUnits}</td>
                    <td className="p-4 text-sm">
                      <Badge variant={branch.occupancyRate >= 90 ? "default" : "secondary"}>
                        {branch.occupancyRate}%
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{branch.manager}</td>
                    <td className="p-4 text-sm">
                      <Badge variant={branch.status === 'Active' ? "default" : "secondary"}>
                        {branch.status}
                      </Badge>
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
              Showing {filteredBranches.length} of {branches.length} branches
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 sm:p-6">
          <div className="w-full max-w-[600px] bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-gray-900 text-xl font-bold">Add New Branch</h2>
                <p className="text-gray-500 text-sm mt-1">Enter the details for the new branch.</p>
              </div>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      placeholder="Enter branch name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Branch Manager</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      placeholder="Manager name"
                      value={formData.manager}
                      onChange={(e) => setFormData({...formData, manager: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      placeholder="City name"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      placeholder="Region name"
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Units <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      placeholder="Number of units"
                      value={formData.totalUnits}
                      onChange={(e) => setFormData({...formData, totalUnits: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Floor Area (sq.m) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.1"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                      placeholder="Floor area in square meters"
                      value={formData.floorAreaSqm}
                      onChange={(e) => setFormData({...formData, floorAreaSqm: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                    placeholder="Full address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none resize-none"
                    rows={3}
                    placeholder="Brief description of the branch"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 p-6 bg-gray-50 flex items-center justify-end gap-3">
              <button 
                className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium text-sm hover:bg-white transition-colors"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
                onClick={handleAddBranch}
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
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Floor Area</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedBranch.floorAreaSqm.toLocaleString()} sq.m</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Units</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedBranch.totalUnits}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Occupancy</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      selectedBranch.occupancyRate >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedBranch.occupancyRate}%
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      selectedBranch.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedBranch.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Manager</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{selectedBranch.manager}</p>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Address</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{selectedBranch.address}</p>
                </div>

                {selectedBranch.lastInspection && (
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Inspection</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedBranch.lastInspection}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
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
                    <p>• {selectedBranch.totalUnits} units</p>
                    <p>• {selectedBranch.floorAreaSqm.toLocaleString()} sq.m floor area</p>
                    <p>• {selectedBranch.occupancyRate}% occupancy</p>
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
                onClick={handleDeleteBranch}
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