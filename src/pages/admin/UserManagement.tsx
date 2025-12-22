import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Edit, Settings, Search, Building, Shield, UserPlus, ArrowLeft, MoreVertical, History, Lock, UserCheck, TrendingUp, Server, ShieldCheck, Home, Wallet, X, Mail, Phone, Store, ChevronDown, Copy, RotateCcw, Eye, Trash2 } from "lucide-react";
import { useUserManagement } from "@/contexts/UserManagementContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, CreateUserData, UpdateUserData, User } from "@/types/user";
import { usePermissions } from "@/hooks/usePermissions";
import CustomSelectDropdown from "../../components/ui/CustomSelectDropdown";
import { getBranchNames } from "@/data/mockBranches";
import EmptyState from "@/components/ui/EmptyState";

const UserManagement = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { users, addUser, updateUser, deleteUser, isLoading, error } = useUserManagement();
  const { hasAction, canManagePermissions } = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [viewMode, setViewMode] = useState("users");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [tempPassword, setTempPassword] = useState("");
  const [success, setSuccess] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "" as UserRole | "",
    branchIds: [] as string[],
    vendorId: ""
  });

  const branches = getBranchNames();
  const branchOptions = branches.map((branch, index) => ({
    value: `BR-${String(index + 1).padStart(3, '0')}`,
    label: branch
  }));

  // Generate temp password on modal open
  useEffect(() => {
    if (showAddUserModal) {
      generateTempPassword();
    }
  }, [showAddUserModal]);

  const generateTempPassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    const symbols = '!@#$%';
    let password = '';
    
    // Add uppercase letter
    password += chars.charAt(Math.floor(Math.random() * 26));
    // Add lowercase letter  
    password += chars.charAt(26 + Math.floor(Math.random() * 26));
    // Add number
    password += chars.charAt(52 + Math.floor(Math.random() * 7));
    // Add symbol
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    
    // Add 4 more random characters
    for (let i = 0; i < 4; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setTempPassword(password);
  };

  const getRoleOptions = () => {
    if (session?.role === 'VENDOR_ADMIN') {
      return [
        { value: UserRole.VENDOR_ADMIN, label: "Vendor Admin" },
        { value: UserRole.VENDOR_USER, label: "Vendor User" }
      ];
    }
    
    return [
      { value: UserRole.FACILITY_MANAGER, label: "Facility Manager" },
      { value: UserRole.HEAD_OF_FACILITIES, label: "Head of Facilities" },
      { value: UserRole.VENDOR_ADMIN, label: "Vendor Admin" },
      { value: UserRole.VENDOR_USER, label: "Vendor User" },
      { value: UserRole.COLLEAGUE, label: "Colleague Requester" }
    ];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Password copied to clipboard!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleAddUser = async () => {
    try {
      if (!formData.fullName || !formData.email || !formData.role) {
        throw new Error("Please fill in all required fields");
      }

      const userData: CreateUserData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role as UserRole,
        branchIds: formData.branchIds,
        vendorId: formData.vendorId || undefined
      };

      await addUser(userData);
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        role: "" as UserRole | "",
        branchIds: [],
        vendorId: ""
      });
      
      setShowAddUserModal(false);
      setSuccess("User created successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const handleEditUser = async () => {
    try {
      if (!selectedUser) return;

      const userData: UpdateUserData = {
        fullName: formData.fullName,
        phone: formData.phone,
        branchIds: formData.branchIds,
        status: (formData as any).status || selectedUser.status
      };

      await updateUser(selectedUser.userId, userData);
      
      setShowEditModal(false);
      setSelectedUser(null);
      setSuccess("User updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (!selectedUser) return;

      await deleteUser(selectedUser.userId);
      
      setShowDeleteModal(false);
      setSelectedUser(null);
      setSuccess("User deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handlePermissions = (user: User) => {
    navigate(`/admin/users/${user.userId}/permissions`);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      branchIds: user.branchIds,
      vendorId: user.vendorId || "",
      status: user.status || 'ACTIVE'
    } as any);
    setShowEditModal(true);
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.HEAD_OF_FACILITIES:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case UserRole.FACILITY_MANAGER:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case UserRole.VENDOR_ADMIN:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case UserRole.VENDOR_USER:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case UserRole.COLLEAGUE:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatRole = (role: UserRole) => {
    if (!role) return 'Unknown Role';
    return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const groups = [
    { name: "Administrators", icon: ShieldCheck, color: "teal", members: 12, status: "Active" },
    { name: "Property Managers", icon: Home, color: "blue", members: 45, status: "Active" },
    { name: "Finance Officers", icon: Wallet, color: "orange", members: 8, status: "Review" }
  ];

  return (
    <div className="font-sans bg-slate-50 text-slate-900 overflow-x-hidden antialiased">
      <div className="relative flex h-auto min-h-screen w-full flex-col">
        <main className="flex-1 flex flex-col px-4 md:px-8 lg:px-12 py-8 w-full max-w-[1920px] mx-auto">
          <div className="w-full flex flex-col gap-8">
            <div className="flex flex-wrap justify-between items-end gap-4 border-b border-slate-200 pb-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">User Management</h1>
                <p className="text-slate-500 text-base font-normal">Manage user accounts and role assignments across branches</p>
              </div>
              <div className="flex gap-3">
                {hasAction('users', 'create') && (
                  <button 
                    className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-sm transition-all"
                    onClick={() => setShowAddUserModal(true)}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Add User</span>
                  </button>
                )}
              </div>
            </div>

            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col h-full min-h-[400px]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-slate-900 text-lg font-bold flex items-center gap-2">
                      <Users className="w-5 h-5 text-teal-700" />
                      Group Permissions
                    </h3>
                    <p className="text-slate-500 text-sm">Quick assignment of roles to user groups</p>
                  </div>
                  <button className="text-teal-700 hover:bg-teal-50 px-3 py-1.5 rounded-md text-xs font-bold transition-colors border border-transparent hover:border-teal-100">
                    Manage Hierarchy
                  </button>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  {groups.map((group, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-teal-200 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-full bg-${group.color}-100 text-${group.color}-700 flex items-center justify-center`}>
                          <group.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm">{group.name}</div>
                          <div className="text-slate-500 text-xs">Full system access • {group.members} Members</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 ${group.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-[10px] font-bold rounded uppercase tracking-wide`}>
                          {group.status}
                        </span>
                        <button className="size-8 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-slate-400 hover:text-teal-700 transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col h-full min-h-[400px]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-slate-900 text-lg font-bold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-teal-700" />
                      Activity Heatmap
                    </h3>
                    <p className="text-slate-500 text-sm">System login patterns (Last 7 Days)</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="size-3 bg-slate-100 rounded-sm"></div>
                      <div className="size-3 bg-red-200 rounded-sm"></div>
                      <div className="size-3 bg-red-400 rounded-sm"></div>
                      <div className="size-3 bg-red-700 rounded-sm"></div>
                    </div>
                    <span>More</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="w-full overflow-hidden">
                    <div className="flex text-[10px] text-slate-400 justify-between px-1 mb-2 font-medium uppercase tracking-wider">
                      <span>00:00</span>
                      <span>06:00</span>
                      <span>12:00</span>
                      <span>18:00</span>
                      <span>23:00</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, dayIndex) => (
                        <div key={day} className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 w-6 font-medium">{day}</span>
                          <div className="flex-1 flex gap-1 h-3">
                            {Array.from({length: 9}, (_, i) => {
                              const intensity = Math.random();
                              let bgColor = 'bg-slate-100';
                              if (intensity > 0.7) bgColor = 'bg-red-700';
                              else if (intensity > 0.5) bgColor = 'bg-red-400';
                              else if (intensity > 0.3) bgColor = 'bg-red-200';
                              return <div key={i} className={`flex-1 ${bgColor} rounded-sm`}></div>;
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto flex-1">
                <div className="relative flex-1 min-w-[320px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:bg-white focus:ring-0 text-sm transition-all" 
                    placeholder="Search Users or Groups..." 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative min-w-[180px]">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
                  <div className="pl-10">
                    <CustomSelectDropdown
                      options={[
                        { value: "all", label: "All Roles" },
                        { value: UserRole.FACILITY_MANAGER, label: "Facility Manager" },
                        { value: UserRole.HEAD_OF_FACILITIES, label: "Head of Facilities" },
                        { value: UserRole.VENDOR_ADMIN, label: "Vendor Admin" },
                        { value: UserRole.VENDOR_USER, label: "Vendor User" },
                        { value: UserRole.COLLEAGUE, label: "Colleague" }
                      ]}
                      value={roleFilter}
                      onChange={setRoleFilter}
                      placeholder="All Roles"
                      className="bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>
                <div className="relative min-w-[180px]">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
                  <div className="pl-10">
                    <CustomSelectDropdown
                      options={[
                        { value: "all", label: "All Groups" },
                        { value: "exec", label: "Executive Mgmt" },
                        { value: "ops", label: "Operations" },
                        { value: "support", label: "IT Support" }
                      ]}
                      value={groupFilter}
                      onChange={setGroupFilter}
                      placeholder="All Groups"
                      className="bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0 mt-2 lg:mt-0">
                <span className="text-sm text-slate-500 hidden xl:block">Showing <span className="font-bold text-slate-900">1-6</span> of <span className="font-bold text-slate-900">485</span></span>
                <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                  <button 
                    className={`px-3 py-1.5 flex items-center gap-2 rounded text-xs font-bold transition-all ${
                      viewMode === 'users' ? 'bg-white text-teal-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    onClick={() => setViewMode('users')}
                  >
                    <Users className="w-4 h-4" />
                    Users
                  </button>
                  <button 
                    className={`px-3 py-1.5 flex items-center gap-2 rounded text-xs font-semibold transition-all ${
                      viewMode === 'groups' ? 'bg-white text-teal-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
                    }`}
                    onClick={() => setViewMode('groups')}
                  >
                    <UserCheck className="w-4 h-4" />
                    Groups
                  </button>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 text-sm font-medium">✅ {success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm font-medium">❌ {error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.length === 0 ? (
                <div className="col-span-full">
                  <EmptyState
                    icon={Users}
                    title={searchTerm ? "No users found" : "No users available yet"}
                    description={searchTerm ? "Try adjusting your search criteria to find users." : "Add a user to begin managing team access and permissions."}
                    actionLabel={!searchTerm && hasAction('users', 'create') ? "Add User" : undefined}
                    onAction={!searchTerm && hasAction('users', 'create') ? () => setShowAddUserModal(true) : undefined}
                    showAction={!searchTerm && hasAction('users', 'create')}
                  />
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const initials = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
                  const isActive = user.status === 'ACTIVE' || user.isActive === true;
                  
                  return (
                    <article key={user.userId} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-200 transition-all group flex flex-col relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                      <div className="p-5 flex items-start justify-between border-b border-slate-100">
                        <div className="flex gap-4">
                          <div className="relative">
                            <div className="size-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg border border-blue-200">
                              {initials}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 size-3.5 ${isActive ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white rounded-full`}></div>
                          </div>
                          <div>
                            <h3 className="text-slate-900 font-bold text-base leading-tight">{user.fullName}</h3>
                            <p className="text-slate-500 text-xs mt-1">{user.email}</p>
                          </div>
                        </div>
                        <button 
                          className="text-slate-400 hover:text-teal-700 transition-colors rounded p-1"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowViewModal(true);
                          }}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-5 flex-1 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Role</span>
                          <span className={`px-2 py-0.5 rounded text-xs border font-medium ${getRoleBadgeColor(user.role)}`}>
                            {formatRole(user.role)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Portal</span>
                          <span className="text-slate-900 capitalize">{user.portal}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Status</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status || (user.isActive ? 'ACTIVE' : 'DISABLED')}
                          </span>
                        </div>
                        <div className="mt-2 pt-3 border-t border-slate-50 flex justify-between items-center text-xs">
                          <span className="text-slate-400">Last login</span>
                          <span className="text-slate-700 font-medium">{formatDate(user.lastLogin)}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-b-xl border-t border-slate-100 flex gap-2">
                        <div className="flex gap-1">
                          {hasAction('users', 'edit') && (
                            <button 
                              className="flex-1 h-9 rounded-md bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-teal-300 hover:text-teal-700 transition-colors flex items-center justify-center gap-1"
                              onClick={() => openEditModal(user)}
                            >
                              <Edit className="w-4 h-4" /> Edit
                            </button>
                          )}
                          {isActive && canManagePermissions() ? (
                            <button 
                              className="flex-1 h-9 rounded-md bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:border-teal-300 hover:text-teal-700 transition-colors flex items-center justify-center gap-1"
                              onClick={() => handlePermissions(user)}
                            >
                              <Settings className="w-4 h-4" /> Permissions
                            </button>
                          ) : !isActive && hasAction('users', 'edit') ? (
                            <button 
                              className="flex-1 h-9 rounded-md bg-green-50 border border-green-200 text-green-600 text-xs font-bold hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                              onClick={() => {
                                updateUser(user.userId, { status: 'ACTIVE' });
                              }}
                            >
                              <Lock className="w-4 h-4" /> Reactivate
                            </button>
                          ) : null}
                          {user.userId !== 'main-admin' && user.userId !== session?.userId && hasAction('users', 'delete') && (
                            <button 
                              className="h-9 w-9 rounded-md bg-white border border-red-300 text-red-600 text-xs font-bold hover:bg-red-50 hover:border-red-400 transition-colors flex items-center justify-center"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeleteModal(true);
                              }}
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-[840px] bg-white rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Add New User</h2>
                <p className="text-sm text-slate-500 mt-1 font-normal">Enter details to create a new account for the ABSA system.</p>
              </div>
              <button 
                className="group p-2 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
                onClick={() => setShowAddUserModal(false)}
              >
                <X className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto p-8 bg-white">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                {/* Full Name */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-900 mb-2">Full Name *</label>
                  <input 
                    className="w-full h-14 px-4 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all placeholder:text-slate-400 text-slate-900 font-normal text-base"
                    placeholder="e.g. Kwame Asante"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>
                
                {/* Email Address */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-900 mb-2">Email Address *</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-slate-600 transition-colors" />
                    <input 
                      className="w-full h-14 pl-12 pr-4 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all placeholder:text-slate-400 text-slate-900 font-normal text-base"
                      placeholder="k.asante@absa.com.gh"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                
                {/* Phone Number */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-900 mb-2">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-slate-600 transition-colors" />
                    <input 
                      className="w-full h-14 pl-12 pr-4 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all placeholder:text-slate-400 text-slate-900 font-normal text-base"
                      placeholder="+233 54 123 4567"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
                
                {/* Divider */}
                <div className="col-span-2 border-t border-slate-200 my-2"></div>
                
                {/* Role */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-900 mb-2">Role *</label>
                  <CustomSelectDropdown
                    options={getRoleOptions()}
                    value={formData.role}
                    onChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}
                    placeholder="Select Role"
                    className="h-14"
                  />
                </div>
                
                {/* Branch */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-900 mb-2">Branch Location *</label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 z-10" />
                    <div className="pl-12">
                      <CustomSelectDropdown
                        options={branchOptions}
                        value={formData.branchIds[0] || ""}
                        onChange={(value) => setFormData(prev => ({ ...prev, branchIds: [value] }))}
                        placeholder="Select Branch"
                        className="h-14"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Divider */}
                <div className="col-span-2 border-t border-slate-200 my-2"></div>
                
                {/* Temporary Password */}
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-900">Temporary Password</label>
                    <button 
                      className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors uppercase tracking-wider flex items-center gap-1 focus:outline-none focus:underline"
                      type="button"
                      onClick={generateTempPassword}
                    >
                      <RotateCcw className="h-3 w-3" /> Auto-Generate
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-slate-600 transition-colors" />
                    <input 
                      className="w-full h-14 pl-12 pr-12 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all text-slate-900 font-medium text-base font-mono"
                      readOnly
                      type="text"
                      value={tempPassword}
                    />
                    <button 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none p-1 rounded"
                      title="Copy to clipboard"
                      type="button"
                      onClick={() => copyToClipboard(tempPassword)}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 pl-1">Password must be changed upon first login.</p>
                </div>
                
                {/* Send Email Checkbox */}
                <div className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-4 hover:border-slate-300 transition-colors">
                  <div className="relative flex items-center mt-1">
                    <input 
                      checked={sendWelcomeEmail}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 bg-white checked:border-red-500 checked:bg-red-500 focus:ring-offset-0 focus:ring-2 focus:ring-red-200 transition-all"
                      id="send-email"
                      type="checkbox"
                      onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                    />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 text-xs pointer-events-none font-bold">✓</span>
                  </div>
                  <label className="flex flex-col cursor-pointer select-none" htmlFor="send-email">
                    <span className="text-sm font-semibold text-slate-900">Send Welcome Email</span>
                    <span className="text-sm text-slate-600 mt-0.5">The user will receive an automated email at <strong>k.asante@absa.com.gh</strong> with their login instructions and temporary password.</span>
                  </label>
                </div>
              </form>
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-8 py-6 border-t border-slate-200 bg-white">
              <button 
                className="px-6 h-12 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all focus:ring-2 focus:ring-slate-200 focus:outline-none"
                onClick={() => setShowAddUserModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-8 h-12 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm transition-all focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddUser}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Add User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Edit User</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors p-1 rounded-lg hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Full Name</label>
                  <input 
                    className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Email (Read Only)</label>
                  <input 
                    className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-slate-50 text-slate-500"
                    type="email"
                    value={formData.email}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Phone</label>
                  <input 
                    className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Status</label>
                  <CustomSelectDropdown
                    options={[
                      { value: "ACTIVE", label: "Active" },
                      { value: "DISABLED", label: "Disabled" }
                    ]}
                    value={(formData as any).status || "ACTIVE"}
                    onChange={(value) => setFormData(prev => ({ ...prev, status: value as 'ACTIVE' | 'DISABLED' }))}
                    placeholder="Select Status"
                  />
                </div>
              </form>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
              <button 
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleEditUser}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">User Permissions</h3>
                <p className="text-sm text-slate-600 mt-1">Manage access levels for {selectedUser.name}</p>
              </div>
              <button 
                onClick={() => setShowPermissionsModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Role</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedUser.role}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Spend Limit</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedUser.spendLimit}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Permissions</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-900">Property Management</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-bold">Full Access</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-900">Financial Reports</span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-bold">Read Only</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-900">User Management</span>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-bold">No Access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
              <button 
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
                onClick={() => setShowPermissionsModal(false)}
              >
                Close
              </button>
              <button 
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors flex items-center gap-2"
                onClick={() => setShowPermissionsModal(false)}
              >
                <Settings className="w-4 h-4" />
                Update Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">User Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg border border-blue-200">
                    {selectedUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{selectedUser.fullName}</h4>
                    <p className="text-sm text-slate-500">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{formatRole(selectedUser.role)}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Portal</label>
                    <p className="text-sm font-medium text-slate-900 mt-1 capitalize">{selectedUser.portal}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      (selectedUser.status === 'ACTIVE' || selectedUser.isActive === true) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedUser.status || (selectedUser.isActive ? 'ACTIVE' : 'DISABLED')}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{selectedUser.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Login</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{formatDate(selectedUser.lastLogin)}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
              <button 
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors flex items-center gap-2"
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedUser);
                }}
              >
                <Edit className="w-4 h-4" />
                Edit User
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

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Delete User</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Are you sure?</h4>
                  <p className="text-sm text-slate-600">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm text-slate-700">
                You are about to delete <strong>{selectedUser.fullName}</strong> ({selectedUser.email}). 
                This will permanently remove their account and access to the system.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
              <button 
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
                onClick={() => setShowDeleteModal(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDeleteUser}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;