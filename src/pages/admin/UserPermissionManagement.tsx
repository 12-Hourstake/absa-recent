import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Shield, Settings, Eye, Edit, Save, CheckCircle2, XCircle, ArrowLeft, Search, UserPlus, Building, X, Sparkles, DollarSign, Home, Info } from "lucide-react";
import { usePermissions } from "@/contexts/PermissionContext";
import { UserPermissions } from "@/types/permissions";
import { toast } from "sonner";

const UserPermissionManagement = () => {
  const navigate = useNavigate();
  const { getAllUsers, updateUserPermissions } = usePermissions();

  const [selectedUser, setSelectedUser] = useState<UserPermissions | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<UserPermissions["permissions"] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);

  const users = getAllUsers();

  const handleSavePermissions = () => {
    if (selectedUser && editingPermissions) {
      updateUserPermissions(selectedUser.userId, editingPermissions);
      toast.success("Permissions updated successfully");
    }
  };

  const handleUpdatePermission = (type: "dashboard" | "actions", key: string, value: boolean) => {
    if (editingPermissions) {
      setEditingPermissions({
        ...editingPermissions,
        [type]: {
          ...editingPermissions[type],
          [key]: value,
        },
      });
    }
  };

  const selectUser = (user: UserPermissions) => {
    setSelectedUser(user);
    setEditingPermissions({ ...user.permissions });
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col">
      <main className="flex-1 w-full px-6 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">User Permissions Management</h2>
              <p className="text-slate-500">Manage user access, roles, and permissions across the system</p>
            </div>
            <button 
              className="bg-red-500 hover:bg-red-600 text-white h-10 px-5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-all"
              onClick={() => setShowAddRoleModal(true)}
            >
              <UserPlus className="w-5 h-5" />
              Add Role
            </button>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-500/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{users.length}</p>
            </div>
            <div className="size-12 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-500/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Admin Users</p>
              <p className="text-2xl font-bold text-slate-900">{users.filter(u => u.role === "admin").length}</p>
            </div>
            <div className="size-12 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-500/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active Roles</p>
              <p className="text-2xl font-bold text-slate-900">{new Set(users.map(u => u.role)).size}</p>
            </div>
            <div className="size-12 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
              <Settings className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-500/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Permission Sets</p>
              <p className="text-2xl font-bold text-slate-900">12</p>
            </div>
            <div className="size-12 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
              <Settings className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-320px)] min-h-[600px]">
          {/* Left Pane: User Directory */}
          <div className="w-full lg:w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-lg text-sm focus:border-blue-500 focus:ring-0 transition-colors" 
                  placeholder="Search users..." 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {/* User Item: Active */}
              <button 
                className={`w-full p-3 flex items-center gap-3 rounded-lg transition-all text-left ${
                  selectedUser?.userId === "Abena Osei" ? 'bg-blue-500/5 border border-blue-500/20' : 'hover:bg-slate-50 border border-transparent hover:border-slate-100'
                }`}
                onClick={() => selectUser(users.find(u => u.userId === "Abena Osei") || users[0])}
              >
                <div className="relative">
                  <div className="size-10 rounded-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBl36BqAhFNgMap4BRlRPO2tKLLcsThXiB3JNQ_wV56JO-NvFyanAL9kfKsZqxbRbdG1g5uM4l7v51t_oQNz4QnLX0k0hyiGewKUy2Udd5a2F3Tzo8xOOufzVgVISfV1YKGe43GIEsqwWX45f9d8AFMicWfkmLNWMnIkbXJ3dMgIDqHDIfeZb11LjECjQ5p0ciFALD6gEShU_sWIJrZg0gHl4sVNImll6Ao-QHNikqMb1bzlz962LWhh9VEU2YWcxsLeUuuERQ4mKZo')"}}></div>
                  <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">Abena Osei</h4>
                  <p className="text-xs text-blue-500 font-medium truncate">Financial Officer</p>
                </div>
                {selectedUser?.userId === "Abena Osei" && <ArrowLeft className="w-5 h-5 text-blue-500 rotate-180" />}
              </button>

              {/* Other Users */}
              {users.filter(u => u.userId !== "Abena Osei").map((user) => (
                <button 
                  key={user.userId}
                  className={`w-full p-3 flex items-center gap-3 rounded-lg transition-all text-left group ${
                    selectedUser?.userId === user.userId ? 'bg-blue-500/5 border border-blue-500/20' : 'hover:bg-slate-50 border border-transparent hover:border-slate-100'
                  }`}
                  onClick={() => selectUser(user)}
                >
                  <div className="relative">
                    <div className="size-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-bold text-slate-600">
                      {user.userId.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 truncate">{user.userId}</h4>
                    <p className="text-xs text-slate-500 group-hover:text-slate-600 truncate">{user.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Pane: Permission Details */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            {/* Main Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              {selectedUser ? (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Permission Details for {selectedUser.userId}</h3>
                  <p className="text-slate-600 mb-6">Manage access levels and permissions for this user.</p>
                  
                  {/* Permission controls would go here */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">Dashboard Access</h4>
                      <div className="space-y-2">
                        {Object.entries(selectedUser.permissions.dashboard).map(([key, value]) => (
                          <label key={key} className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              checked={editingPermissions?.dashboard[key as keyof typeof selectedUser.permissions.dashboard] || false}
                              onChange={(e) => handleUpdatePermission('dashboard', key, e.target.checked)}
                              className="h-4 w-4 text-blue-500 rounded border-slate-300"
                            />
                            <span className="text-sm text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">Actions</h4>
                      <div className="space-y-2">
                        {Object.entries(selectedUser.permissions.actions).map(([key, value]) => (
                          <label key={key} className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              checked={editingPermissions?.actions[key as keyof typeof selectedUser.permissions.actions] || false}
                              onChange={(e) => handleUpdatePermission('actions', key, e.target.checked)}
                              className="h-4 w-4 text-blue-500 rounded border-slate-300"
                            />
                            <span className="text-sm text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button 
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                      onClick={() => setEditingPermissions(selectedUser.permissions)}
                    >
                      Reset
                    </button>
                    <button 
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      onClick={handleSavePermissions}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a User</h3>
                  <p className="text-slate-500">Choose a user from the list to view and edit their permissions.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Role Modal */}
        {showAddRoleModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6">
            <div className="relative flex max-h-[90vh] w-full max-w-[960px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 bg-white">
                <div>
                  <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">Add New Role / Permission Set</h2>
                  <p className="text-slate-500 text-sm mt-1">Define access levels for property management modules.</p>
                </div>
                <button 
                  className="group p-2 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
                  onClick={() => setShowAddRoleModal(false)}
                >
                  <X className="h-5 w-5 text-slate-500 group-hover:text-slate-800" />
                </button>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 bg-slate-50">
                <form className="flex flex-col gap-8">
                  {/* Top Form Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Role Name */}
                    <div className="flex flex-col gap-2">
                      <label className="text-slate-900 text-sm font-semibold leading-normal">Role Name</label>
                      <input 
                        className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 px-4 py-3 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none transition-all"
                        placeholder="e.g., Osu Branch Manager"
                        type="text"
                      />
                    </div>
                    
                    {/* Base Role Template */}
                    <div className="flex flex-col gap-2">
                      <label className="text-slate-900 text-sm font-semibold leading-normal">
                        Base Role Template <span className="font-normal text-slate-400">(Optional)</span>
                      </label>
                      <div className="relative">
                        <select className="w-full appearance-none rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 px-4 py-3 text-sm pr-10 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none transition-all">
                          <option value="">Select existing role to clone...</option>
                          <option value="prop-mgr">Property Manager</option>
                          <option value="fin-officer">Finance Officer</option>
                          <option value="maint-super">Maintenance Supervisor</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Description (Full Width) */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-slate-900 text-sm font-semibold leading-normal">Description</label>
                      <textarea 
                        className="w-full resize-none rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 px-4 py-3 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none transition-all"
                        placeholder="e.g., Full access to maintenance requests and asset management for Greater Accra region properties."
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <hr className="border-slate-300" />
                  
                  {/* Permissions Matrix Section */}
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-slate-900 text-lg font-bold leading-tight">Module Access & Permissions</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                        <Info className="h-4 w-4" />
                        <span>Changes apply immediately upon creation</span>
                      </div>
                    </div>
                    
                    {/* Permissions Table */}
                    <div className="overflow-x-auto rounded-lg border border-slate-300 bg-white shadow-sm">
                      <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-100">
                            <th className="p-4 font-semibold text-slate-900 w-[30%]">Module</th>
                            <th className="p-4 font-medium text-slate-600 text-center w-[14%]">View</th>
                            <th className="p-4 font-medium text-slate-600 text-center w-[14%]">Create</th>
                            <th className="p-4 font-medium text-slate-600 text-center w-[14%]">Edit</th>
                            <th className="p-4 font-medium text-slate-600 text-center w-[14%]">Delete</th>
                            <th className="p-4 font-medium text-slate-600 text-center w-[14%]">Export</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {/* Row 1: Assets */}
                          <tr className="group hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900">Properties & Assets</span>
                                <span className="text-xs text-slate-500">Accra & Kumasi Portfolio</span>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" defaultChecked />
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" defaultChecked />
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" />
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-200 bg-slate-100 text-slate-300 cursor-not-allowed" disabled type="checkbox" />
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" />
                            </td>
                          </tr>
                          
                          {/* Row 2: Work Orders */}
                          <tr className="group hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900">Maintenance & Work Orders</span>
                                <span className="text-xs text-slate-500">Contractor assignment</span>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" defaultChecked />
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" defaultChecked />
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" defaultChecked />
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" />
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" defaultChecked />
                            </td>
                          </tr>
                          
                          {/* Row 3: Finance */}
                          <tr className="group hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900">Financials (GHS)</span>
                                <span className="text-xs text-slate-500">Invoicing & Revenue Reports</span>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" />
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" />
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-200 bg-slate-100 text-slate-300 cursor-not-allowed" disabled type="checkbox" />
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-200 bg-slate-100 text-slate-300 cursor-not-allowed" disabled type="checkbox" />
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" />
                            </td>
                          </tr>
                          
                          {/* Row 4: Tenants */}
                          <tr className="group hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900">Tenant Management</span>
                                <span className="text-xs text-slate-500">Lease Profiles & History</span>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" defaultChecked />
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" />
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" />
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" />
                            </td>
                            <td className="p-4 text-center">
                              <input className="h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-500 focus:ring-offset-0 cursor-pointer transition-all" type="checkbox" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </form>
              </div>
              
              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
                <button 
                  className="flex h-10 min-w-[84px] items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1 transition-colors"
                  onClick={() => setShowAddRoleModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="flex h-10 min-w-[84px] items-center justify-center rounded-lg bg-red-600 px-6 text-sm font-bold text-white hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all"
                  onClick={() => setShowAddRoleModal(false)}
                >
                  Create Role/Set
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserPermissionManagement;