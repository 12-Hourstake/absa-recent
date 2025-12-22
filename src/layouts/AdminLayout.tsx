import { Outlet, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { UserRole } from "@/types/auth";
import { useEffect } from "react";

const AdminLayout = () => {
  const { session, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleSidebarLogout = () => {
      handleLogout();
    };

    window.addEventListener('sidebar-logout', handleSidebarLogout);
    return () => {
      window.removeEventListener('sidebar-logout', handleSidebarLogout);
    };
  }, []);

  const navigateToRoleDashboard = () => {
    if (!session) {
      navigate("/login");
      return;
    }
    const portalDashboardMap = {
      admin: "/admin/dashboard",
      colleague: "/colleague/dashboard",
      vendor: "/vendor/dashboard",
    };
    navigate(portalDashboardMap[session.portal] || "/login");
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-gradient-to-br from-gray-50 via-white to-red-50/10 overflow-hidden">
        <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 h-14 md:h-16 border-b border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-sm flex items-center px-3 sm:px-4 md:px-6 gap-2 sm:gap-4 relative">
          {/* Left section */}
          <div className="flex items-center">
            <SidebarTrigger className="md:hidden" />
          </div>



          {/* Right section */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2 md:gap-3 relative z-20">
            {/* Notifications */}
            <div className="hidden sm:block">
              <NotificationDropdown />
            </div>

            {/* Hide logout button on mobile, show in dropdown */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-red-50 hover:text-red-800 transition-all duration-300 rounded-xl hidden md:flex"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full transition-all duration-300"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-header-brand rounded-full blur-sm opacity-20"></div>
                    <div className="relative h-8 w-8 rounded-full bg-header-brand flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-xl"
              >
                <DropdownMenuLabel className="px-4 py-3 bg-gradient-to-r from-slate-50 to-red-50/30 rounded-t-xl">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-semibold text-slate-800">
                      {session?.fullName}
                    </p>
                    <p className="text-xs text-slate-600">{session?.email}</p>
                    <Badge
                      variant="secondary"
                      className="w-fit bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-700"
                    >
                      {session?.role.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-200/60" />
                <DropdownMenuItem
                  asChild
                  className="hover:bg-red-50/50 transition-colors duration-200"
                >
                  <NavLink
                    to="/admin/profile"
                    className="cursor-pointer flex items-center gap-3 px-4 py-2"
                  >
                    <User className="h-4 w-4 text-slate-600" />
                    <span className="font-medium">Profile</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="hover:bg-red-50/50 transition-colors duration-200"
                >
                  <NavLink
                    to="/admin/settings"
                    className="cursor-pointer flex items-center gap-3 px-4 py-2"
                  >
                    <Settings className="h-4 w-4 text-slate-600" />
                    <span className="font-medium">Settings</span>
                  </NavLink>
                </DropdownMenuItem>
                {session?.portal === "admin" && (
                  <>
                    <DropdownMenuSeparator className="bg-slate-200/60" />
                    <DropdownMenuLabel className="px-4 py-2 text-xs font-medium text-slate-500">
                      Switch Role
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      className="hover:bg-red-50/50 transition-colors duration-200 cursor-pointer"
                      onClick={() => switchRole("FACILITY_MANAGER")}
                    >
                      <User className="h-4 w-4 text-slate-600 mr-3" />
                      <span className="font-medium">Facility Manager</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-red-50/50 transition-colors duration-200 cursor-pointer"
                      onClick={() => switchRole("HEAD_OF_FACILITIES")}
                    >
                      <User className="h-4 w-4 text-slate-600 mr-3" />
                      <span className="font-medium">Head of Facilities</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator className="bg-slate-200/60 md:hidden" />
                {/* Mobile-only logout option */}
                <DropdownMenuItem
                  className="md:hidden text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 absa-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
