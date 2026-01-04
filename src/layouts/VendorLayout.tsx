import { Outlet, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
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
  LayoutDashboard,
  ClipboardList,
  FileText,
  TrendingUp,
  User,
  LogOut,
  Wrench,
  Receipt,
  Calendar,
  Upload,
  BookOpen,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { UserRole } from "@/types/auth";

const VendorLayout = () => {
  const { user, logout } = useAuth();
  const { open, setOpenMobile, isMobile } = useSidebar();
  const navigate = useNavigate();

  const menuItems = [
    { title: "Dashboard", url: "/vendor/dashboard", icon: LayoutDashboard },
    { title: "Work Orders", url: "/vendor/work-orders", icon: ClipboardList },
    { title: "Invoice Submission", url: "/vendor/invoice-submission", icon: Receipt },
    { title: "Penalties", url: "/vendor/penalties", icon: AlertTriangle },
    { title: "Profile", url: "/vendor/profile", icon: User },
    { title: "Support", url: "/vendor/support", icon: HelpCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigateToRoleDashboard = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const roleDashboardMap: Record<UserRole, string> = {
      [UserRole.ADMIN]: "/admin/dashboard",
      [UserRole.COLLEAGUE_REQUESTER]: "/colleague/dashboard",
      [UserRole.VENDOR]: "/vendor/dashboard",
    };
    navigate(roleDashboardMap[user.role] || "/login");
  };

  return (
    <div className="h-screen flex w-full bg-gradient-to-br from-gray-50 via-white to-red-50/10 overflow-hidden">
      <SidebarUI className="border-r border-gray-200/80 backdrop-blur-xl shadow-xl sticky top-0 h-screen" style={{ backgroundColor: '#870A3C' }}>
        <SidebarHeader className="border-b border-white/20 p-6" style={{ backgroundColor: '#870A3C' }}>
          <div className="flex items-center gap-3">
            <div
              className="relative cursor-pointer"
              onClick={navigateToRoleDashboard}
              title="Go to dashboard"
            >
              <div className="absolute inset-0 bg-icon-brand rounded-2xl blur-sm opacity-25"></div>
              <div className="relative h-10 w-10 rounded-2xl bg-white flex items-center justify-center shadow-lg p-1">
                <img
                  src="/ABSA_Group_Limited_Logo.svg copy 2.png"
                  alt="ABSA Facility Management"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            {open && (
              <div className="flex flex-col animate-fade-in">
                <span className="text-lg font-bold text-white tracking-tight">
                ABSA Facility Management
                </span>
                <span className="text-xs text-white/80 font-semibold uppercase tracking-wider">
                  Vendor Portal
                </span>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="p-4" style={{ backgroundColor: '#870A3C' }}>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 px-2">
              Service Center
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {menuItems.map((item, index) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                        className={({ isActive }) =>
                          `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                            isActive
                              ? "bg-white/20 text-white shadow-md font-semibold"
                              : "hover:bg-white/10 text-gray-200 hover:text-white font-medium"
                          }`
                        }
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {({ isActive }) => (
                          <>
                            <div
                              className={`relative ${
                                open ? "mr-0" : "mx-auto"
                              }`}
                            >
                              <div
                                className={`relative p-1.5 rounded-md transition-all duration-300 ${
                                  isActive
                                    ? "bg-white/20"
                                    : "[background:var(--icon-bg)] group-hover:[background:var(--icon-bg-hover)]"
                                }`}
                              >
                                <item.icon
                                  className={`h-4 w-4 ${
                                    isActive ? "text-white" : "text-gray-300"
                                  }`}
                                />
                              </div>
                            </div>
                            {open && (
                              <span className="text-sm font-medium tracking-normal animate-fade-in">
                                {item.title}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Logout Button at Bottom */}
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={handleLogout}
                      className="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 hover:bg-red-600/20 text-gray-200 hover:text-white font-semibold w-full"
                    >
                      <div className={`relative ${open ? "mr-0" : "mx-auto"}`}>
                        <div className="relative p-1.5 rounded-md transition-all duration-300 [background:var(--icon-bg)] group-hover:bg-red-600/30">
                          <LogOut className="h-4 w-4 text-gray-300 group-hover:text-white" />
                        </div>
                      </div>
                      {open && (
                        <span className="text-sm font-bold tracking-normal animate-fade-in">
                          Logout
                        </span>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </SidebarUI>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 h-14 md:h-16 border-b border-border bg-card/95 backdrop-blur-xl shadow-sm flex items-center px-3 sm:px-4 md:px-6 gap-2 sm:gap-4">
          {/* Mobile menu toggle */}
          <SidebarTrigger className="md:hidden" />

          <div className="flex-1">
            <h1 className="text-base md:text-lg font-semibold">
              Vendor Service Portal
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
              Manage work orders and track performance
            </p>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden sm:block">
              <NotificationDropdown />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-red-50 hover:text-red-600 transition-all duration-300 rounded-xl hidden md:flex"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-4 w-4 md:h-5 md:w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                    <Badge variant="secondary" className="w-fit">
                      {user?.role.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NavLink to="/vendor/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="md:hidden" />
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
  );
};

export default VendorLayout;
