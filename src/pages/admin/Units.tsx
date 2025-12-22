import { useState } from "react";
import { Plus, MoreVertical, Home, Users, Building2, DollarSign, TrendingUp, Eye, Edit, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const mockUnits = [
  {
    id: 1,
    unitNumber: "A-301",
    type: "2BR / 1BA",
    floor: 3,
    status: "Occupied",
    monthlyRent: 3200,
    occupancy: 95,
  },
  {
    id: 2,
    unitNumber: "B-205",
    type: "1BR / 1BA",
    floor: 2,
    status: "Vacant",
    monthlyRent: 2400,
    occupancy: 0,
  },
  {
    id: 3,
    unitNumber: "C-410",
    type: "Studio",
    floor: 4,
    status: "Under Maintenance",
    monthlyRent: 1800,
    occupancy: 0,
  },
  {
    id: 4,
    unitNumber: "A-105",
    type: "3BR / 2BA",
    floor: 1,
    status: "Occupied",
    monthlyRent: 4500,
    occupancy: 100,
  },
  {
    id: 5,
    unitNumber: "B-308",
    type: "2BR / 2BA",
    floor: 3,
    status: "Occupied",
    monthlyRent: 3800,
    occupancy: 98,
  },
  {
    id: 6,
    unitNumber: "C-112",
    type: "1BR / 1BA",
    floor: 1,
    status: "Vacant",
    monthlyRent: 2200,
    occupancy: 0,
  },
];



export default function Units() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  
  const totalUnits = mockUnits.length;
  const occupiedUnits = mockUnits.filter(u => u.status === "Occupied").length;
  const vacantUnits = mockUnits.filter(u => u.status === "Vacant").length;
  const totalRevenue = mockUnits.reduce((sum, u) => sum + u.monthlyRent, 0);

  const handleAddUnit = (formData: any) => {
    console.log('Adding new unit:', formData);
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col gap-6 p-8 w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-foreground">Unit Management</h1>
          <p className="text-muted-foreground text-lg">
            Oversee and manage all branch units and occupancy rates
          </p>
        </div>
        <button 
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-5 w-5" />
          Add New Unit
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUnits}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all floors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{occupiedUnits}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((occupiedUnits / totalUnits) * 100).toFixed(0)}% occupancy rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacant Units</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{vacantUnits}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Available for rent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">GHS {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From occupied units
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Units Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Units</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Unit
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Floor
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Status
                  </th>

                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Monthly Rent
                  </th>
                  <th className="text-left p-4 text-xs font-semibold uppercase text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
                          {unit.unitNumber.split('-')[1]}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{unit.unitNumber}</div>
                          <div className="text-xs text-muted-foreground">Floor {unit.floor}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {unit.type}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {unit.floor}
                    </td>
                    <td className="p-4">
                      <Badge 
                        className={`font-medium ${
                          unit.status === 'Occupied' ? 'bg-green-100 text-green-800' :
                          unit.status === 'Vacant' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {unit.status}
                      </Badge>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-foreground text-sm">GHS {unit.monthlyRent.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">per month</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button 
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                          onClick={() => {
                            setSelectedUnit(unit);
                            setShowViewModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                          onClick={() => {
                            setSelectedUnit(unit);
                            setShowEditModal(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button 
                          className="p-2 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
                          onClick={() => {
                            setSelectedUnit(unit);
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
        </CardContent>
      </Card>

      {/* Add Unit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            {/* Modal Backdrop */}
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"></div>
            
            {/* Modal Panel */}
            <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-gray-100">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <div>
                  <h3 className="text-xl font-bold leading-6 text-gray-900">Add New Unit</h3>
                  <p className="mt-1 text-sm text-gray-500">Enter details for the new rental unit.</p>
                </div>
                <button 
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              
              {/* Modal Body (Form) */}
              <form className="px-6 py-6 space-y-6">
                {/* Section 1: Identification */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                  {/* Unit Number */}
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900 mb-2" htmlFor="unit-number">Unit Number <span className="text-red-500">*</span></label>
                    <div className="relative rounded-md shadow-sm">
                      <input 
                        className="block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 bg-gray-50" 
                        id="unit-number" 
                        name="unit-number" 
                        placeholder="e.g. B-402" 
                        type="text"
                      />
                    </div>
                  </div>
                  {/* Floor Level */}
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900 mb-2" htmlFor="floor-level">Floor Level</label>
                    <div className="relative rounded-md shadow-sm">
                      <input 
                        className="block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 bg-gray-50" 
                        id="floor-level" 
                        name="floor-level" 
                        placeholder="e.g. 4" 
                        type="number"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Section 2: Specs */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3">
                  {/* Bedrooms */}
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900 mb-2" htmlFor="bedrooms">Bedrooms</label>
                    <div className="flex items-center">
                      <button className="h-11 w-11 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-red-500 flex items-center justify-center" type="button">
                        <span className="text-lg">−</span>
                      </button>
                      <input 
                        className="block w-full min-w-0 border-0 py-3 text-center text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 h-11" 
                        id="bedrooms" 
                        name="bedrooms" 
                        placeholder="0" 
                        type="number" 
                        defaultValue="2"
                      />
                      <button className="h-11 w-11 rounded-r-lg border border-l-0 border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-red-500 flex items-center justify-center" type="button">
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                  {/* Bathrooms */}
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900 mb-2" htmlFor="bathrooms">Bathrooms</label>
                    <div className="flex items-center">
                      <button className="h-11 w-11 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-red-500 flex items-center justify-center" type="button">
                        <span className="text-lg">−</span>
                      </button>
                      <input 
                        className="block w-full min-w-0 border-0 py-3 text-center text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 h-11" 
                        id="bathrooms" 
                        name="bathrooms" 
                        placeholder="0" 
                        type="number" 
                        defaultValue="1"
                      />
                      <button className="h-11 w-11 rounded-r-lg border border-l-0 border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-red-500 flex items-center justify-center" type="button">
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                  {/* Area */}
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900 mb-2" htmlFor="area">Area (SqM)</label>
                    <div className="relative rounded-md shadow-sm">
                      <input 
                        className="block w-full rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 bg-gray-50" 
                        id="area" 
                        name="area" 
                        placeholder="e.g. 85" 
                        type="number"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Section 3: Financials & Status */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                  {/* Rent */}
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900 mb-2" htmlFor="rent">Monthly Rent</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">GHS</span>
                      </div>
                      <input 
                        className="block w-full rounded-lg border-0 py-3 pl-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 bg-gray-50" 
                        id="rent" 
                        name="rent" 
                        placeholder="0.00" 
                        type="text"
                      />
                    </div>
                  </div>
                  {/* Unit Status */}
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900 mb-2" htmlFor="status">Unit Status</label>
                    <div className="relative rounded-md shadow-sm">
                      <select 
                        className="block w-full rounded-lg border-0 py-3 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6 bg-gray-50" 
                        id="status" 
                        name="status"
                      >
                        <option>Available</option>
                        <option>Occupied</option>
                        <option>Under Maintenance</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Separator */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-start">
                    <span className="bg-white pr-2 text-sm text-gray-400">Optional Details</span>
                  </div>
                </div>
                

                
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Unit Images</label>
                  <div className="flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                    <div className="text-center">
                      <span className="mx-auto text-4xl text-gray-300 group-hover:text-red-500 transition-colors">☁️</span>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                        <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 hover:text-red-700" htmlFor="file-upload">
                          <span>Upload files</span>
                          <input className="sr-only" id="file-upload" name="file-upload" type="file"/>
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                </div>
              </form>
              
              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-gray-100">
                <button 
                  className="inline-flex w-full justify-center rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:w-auto transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" 
                  type="button"
                  onClick={() => {
                    handleAddUnit({});
                    setShowAddModal(false);
                  }}
                >
                  Add Unit
                </button>
                <button 
                  className="inline-flex w-full justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto transition-colors" 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Unit Modal */}
      {showViewModal && selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Unit Details</h3>
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
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit Number</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{selectedUnit.unitNumber}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedUnit.type}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Floor</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedUnit.floor}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      selectedUnit.status === 'Occupied' ? 'bg-green-100 text-green-800' :
                      selectedUnit.status === 'Vacant' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedUnit.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Rent</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">GHS {selectedUnit.monthlyRent.toLocaleString()}</p>
                  </div>
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
                Edit Unit
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

      {/* Edit Unit Modal */}
      {showEditModal && selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Edit Unit</h3>
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
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{selectedUnit.unitNumber}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{selectedUnit.type}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Rent</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">GHS {selectedUnit.monthlyRent.toLocaleString()}</p>
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



      {/* Delete Unit Modal */}
      {showDeleteModal && selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Unit</h3>
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
                    Are you sure you want to delete unit <strong>{selectedUnit.unitNumber}</strong>? This will permanently remove the unit and all associated data.
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit Details</label>
                  <div className="mt-2 space-y-1 text-sm text-slate-600">
                    <p>• {selectedUnit.type}</p>
                    <p>• Floor {selectedUnit.floor}</p>
                    <p>• GHS {selectedUnit.monthlyRent.toLocaleString()}/month</p>

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
                Delete Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
