import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import aoLogo from "@/assets/images/ABSA_Group_Limited_Logo.svg copy 2.png";
import { useAuth } from "@/contexts/AuthContext";
import { hasPagePermission } from "@/utils/permissions";
import { resetAuthForDevelopment } from "@/utils/safetyHelpers";
import {
  LayoutDashboard,
  Package,
  Package2,
  ClipboardList,
  Wrench,
  Users,
  Zap,
  BarChart3,
  Settings,
  Building2,
  DoorOpen,
  UserSquare2,
  FileText,
  CreditCard,
  AlertTriangle,
  Calculator,
  Fuel,
  Car,
  Droplet,
  FileCheck,
  Clock,
  Receipt,
  FolderOpen,
  TrendingUp,
  ChevronRight,
  UserCog,
  Shield,
  LogOut,
  Activity,
  RotateCcw,
} from "lucide-react";
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
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mainMenuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard, permission: "dashboard" },
  { title: "Assets", url: "/admin/assets", icon: Package, permission: "assets" },
  { title: "Work Orders", url: "/admin/work-orders", icon: ClipboardList, permission: "workOrders" },
  { title: "Maintenance", url: "/admin/maintenance", icon: Wrench, permission: "maintenance" },
  { title: "Requests", url: "/admin/requests", icon: FileText, permission: "workOrders" },
  { title: "Vendors", url: "/admin/vendors", icon: Users, permission: "vendors" },
  { title: "Reports", url: "/admin/reports", icon: BarChart3, permission: "reports" },
  { title: "User Management", url: "/admin/user-management", icon: UserCog, permission: "userManagement" },
];

const collapsibleSections = [
  {
    title: "Branches",
    icon: Building2,
    permission: "branches",
    items: [
      { title: "Branches", url: "/admin/branches", icon: Building2 },
    ],
  },
  {
    title: "Utilities",
    icon: Zap,
    permission: "utilities",
    items: [
      { title: "Utilities Overview", url: "/admin/utilities", icon: BarChart3 },
      { title: "ECG Electricity", url: "/admin/ecg-electricity", icon: Zap },
      { title: "Ghana Water", url: "/admin/ghana-water", icon: Droplet },
      { title: "Water Tanker Supply", url: "/admin/water-tanker", icon: Droplet },
    ],
  },
  {
    title: "SLA Monitoring",
    icon: AlertTriangle,
    permission: "sla",
    items: [
      { title: "SLA Dashboard", url: "/admin/sla-dashboard", icon: BarChart3 },
      { title: "SLA Breaches", url: "/admin/sla-breaches", icon: AlertTriangle },
      { title: "SLA Penalty Calculator", url: "/admin/sla-penalty-calculator", icon: Calculator },
    ],
  },
  {
    title: "Fuel",
    icon: Fuel,
    permission: "fuel",
    items: [
      { title: "Fuel Dashboard", url: "/admin/fuel-dashboard", icon: BarChart3 },
      { title: "Fuel Cards", url: "/admin/fuel-cards", icon: CreditCard },
      { title: "Fuel Delivery", url: "/admin/fuel-delivery", icon: Fuel },
      { title: "Fuel Reconciliation", url: "/admin/fuel-reconciliation", icon: FileCheck },
      { title: "Fuel Audits", url: "/admin/fuel-audits", icon: ClipboardList },
    ],
  },

  {
    title: "Shared Services",
    icon: FolderOpen,
    permission: "documents",
    items: [
      { title: "Documents", url: "/admin/documents", icon: FolderOpen },
      { title: "Analytics", url: "/admin/analytics", icon: TrendingUp },
    ],
  },
];

export const Sidebar = () => {
  const { open } = useSidebar();
  const { session } = useAuth();
  const location = useLocation();
  const [openSection, setOpenSection] = React.useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  const handleLogout = () => {
    // This will be handled by the parent AdminLayout
    const event = new CustomEvent('sidebar-logout');
    window.dispatchEvent(event);
  };

  return (
    <SidebarUI className="border-r border-sidebar-border" style={{ backgroundColor: 'rgb(135, 10, 60)' }}>
      <SidebarHeader className="border-b border-white/20 p-4" style={{ backgroundColor: 'rgb(135, 10, 60)' }}>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center p-1">
            <img src="/ABSA_Group_Limited_Logo.svg copy 2.png" alt="ABSA Facility Management" className="h-full w-full object-contain" />
          </div>
          {open && (
            <div className="flex flex-col animate-fade-in">
            <span className="text-lg font-bold text-white tracking-tight">
              ABSA Facility Management
            </span>
            <span className="text-xs text-white/80 font-semibold uppercase tracking-wider">
              ADMIN Portal
            </span>
          </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20" style={{ backgroundColor: 'rgb(135, 10, 60)' }}>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems
                .filter((item) => !session?.permissions || hasPagePermission(session.permissions, item.permission as any))
                .map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    className={({ isActive }) => 
                      `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                        isActive 
                          ? "bg-red-700 text-white font-bold" 
                          : "hover:bg-white/10 text-white/80 hover:text-white"
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {open && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Additional</SidebarGroupLabel>
          <SidebarGroupContent>
            {collapsibleSections
              .filter((section) => !session?.permissions || hasPagePermission(session.permissions, section.permission as any))
              .map((section) => (
              <Collapsible 
                key={section.title} 
                open={openSection === section.title}
                onOpenChange={(isOpen) => setOpenSection(isOpen ? section.title : null)}
                className="group/collapsible"
              >
                <div className="mb-2">
                <CollapsibleTrigger className="flex w-full items-center justify-between text-white/90 h-8 rounded-md px-2 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <section.icon className="h-4 w-4" />
                    {open && <span className="text-sm">{section.title}</span>}
                  </div>
                  {open && <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />}
                </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-1">
                  <SidebarMenu className="ml-4">
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <NavLink
                          to={item.url}
                          className={({ isActive }) => 
                            `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                              isActive 
                                ? "bg-red-700 text-white font-bold" 
                                : "hover:bg-white/10 text-white/80 hover:text-white"
                            }`
                          }
                        >
                          <item.icon className="h-4 w-4" />
                          {open && <span className="text-sm">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </div>
              </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {(!session?.permissions || hasPagePermission(session.permissions, 'settings')) && (
                <SidebarMenuItem>
                  <NavLink
                    to="/admin/settings"
                    className={({ isActive }) => 
                      `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                        isActive 
                          ? "bg-red-700 text-white font-bold" 
                          : "hover:bg-white/10 text-white/80 hover:text-white"
                      }`
                    }
                  >
                    <Settings className="h-4 w-4" />
                    {open && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <NavLink
                  to="/admin/logs"
                  className={({ isActive }) => 
                    `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive 
                        ? "bg-red-700 text-white font-bold" 
                        : "hover:bg-white/10 text-white/80 hover:text-white"
                    }`
                  }
                >
                  <Activity className="h-4 w-4" />
                  {open && <span>Logs</span>}
                </NavLink>
              </SidebarMenuItem>
              {session?.role === 'MAIN_ADMIN' && (
                <SidebarMenuItem>
                  <NavLink
                    to="/admin/audit-logs"
                    className={({ isActive}) => 
                      `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                        isActive 
                          ? "bg-red-700 text-white font-bold" 
                          : "hover:bg-white/10 text-white/80 hover:text-white"
                      }`
                    }
                  >
                    <Shield className="h-4 w-4" />
                    {open && <span>Audit Logs</span>}
                  </NavLink>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {(process.env.NODE_ENV === 'development' || session?.role === 'MAIN_ADMIN') && (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setShowResetConfirm(true)}>
                    <RotateCcw className="h-4 w-4" />
                    {open && <span>Reset Auth</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  {open && <span>Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reset Authentication</h3>
            <p className="text-gray-600 mb-6">
              This will clear all authentication data and redirect to login. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAuthForDevelopment();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Reset Auth
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarUI>
  );
};
