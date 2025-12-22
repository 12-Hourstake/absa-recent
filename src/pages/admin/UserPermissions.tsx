import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, User, Save, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { User as UserType, UserPermissions } from "@/types/user";
import { useUserManagement } from "@/contexts/UserManagementContext";
import { useAuth } from "@/contexts/AuthContext";
import { getDefaultPermissions } from "@/utils/permissions";

const UserPermissions = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { updateUserPermissions, isLoading, error } = useUserManagement();
  const [user, setUser] = useState<UserType | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Load user data from cache
    const loadUser = () => {
      try {
        const users = JSON.parse(localStorage.getItem("USERS_CACHE_V1") || "[]");
        const foundUser = users.find((u: UserType) => u.userId === userId);
        if (foundUser) {
          setUser(foundUser);
          // Initialize permissions if missing
          const userPermissions = foundUser.permissions || getDefaultPermissions(foundUser.role);
          setPermissions(userPermissions);
        }
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };

    loadUser();
  }, [userId]);

  const canEditPermissions = () => {
    if (!session || !user) return false;
    
    // Main Admin can edit anyone's permissions
    if (session.role === 'MAIN_ADMIN') return true;
    
    // Vendor Admin can only edit vendor users from same vendor
    if (session.role === 'VENDOR_ADMIN') {
      return user.vendorId === session.vendorId;
    }
    
    return false;
  };

  const handlePermissionChange = (section: 'pages' | 'actions', key: string, subKey?: string, value?: boolean) => {
    if (!permissions) return;
    
    const newPermissions = { ...permissions };
    
    if (section === 'pages') {
      (newPermissions.pages as any)[key] = value;
    } else if (section === 'actions' && subKey) {
      if (!(newPermissions.actions as any)[key]) {
        (newPermissions.actions as any)[key] = {};
      }
      (newPermissions.actions as any)[key][subKey] = value;
    }
    
    setPermissions(newPermissions);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!user || !permissions) return;
    
    try {
      await updateUserPermissions(user.userId, permissions);
      setHasChanges(false);
      setSuccess("Permissions updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating permissions:", err);
    }
  };

  const handleReset = () => {
    if (!user) return;
    const defaultPermissions = getDefaultPermissions(user.role);
    setPermissions(defaultPermissions);
    setHasChanges(true);
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin/user-management")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to User Management
          </button>
        </div>
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/user-management")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to User Management
        </button>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{user.fullName}</h1>
                <p className="text-slate-600">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">
                    {user.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - {user.portal} Portal
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
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

            {!canEditPermissions() ? (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
                <p className="text-gray-600">
                  You don't have permission to edit this user's permissions.
                </p>
              </div>
            ) : permissions ? (
              <div className="space-y-8">
                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={!hasChanges || isLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset to Default
                    </button>
                  </div>
                  {hasChanges && (
                    <span className="text-sm text-orange-600 font-medium">
                      You have unsaved changes
                    </span>
                  )}
                </div>

                {/* Page Permissions */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Page Access Permissions
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">Control which pages this user can access in the sidebar and via direct URLs.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(permissions.pages).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handlePermissionChange('pages', key, undefined, e.target.checked)}
                          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Permissions */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Action Permissions
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">Control what actions this user can perform within each module.</p>
                  
                  <div className="space-y-6">
                    {Object.entries(permissions.actions).map(([module, actions]) => (
                      <div key={module} className="bg-white rounded-lg border border-gray-200 p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 capitalize">
                          {module.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {Object.entries(actions as Record<string, boolean>).map(([action, value]) => (
                            <label key={action} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => handlePermissionChange('actions', module, action, e.target.checked)}
                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                              />
                              <span className="text-sm text-gray-700 capitalize">
                                {action.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading permissions...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPermissions;