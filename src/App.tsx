import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
// Auth Components
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Asset Components
import { AssetProvider } from "@/contexts/AssetContext";

// User Management Components
import { UserManagementProvider } from "@/contexts/UserManagementContext";
import { UsersProvider } from "@/contexts/UsersProvider";

// Request Components
import { RequestProvider } from "@/contexts/RequestContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Inventory Components
import { InventoryProvider } from "@/contexts/InventoryContext";

// Permission Components
import { PermissionProvider } from "@/contexts/PermissionContext";

// Notification Components
import { NotificationProvider } from "@/contexts/NotificationContext";

// Document Components
import { DocumentProvider } from "@/contexts/DocumentContext";

// SLA Components
import { SLAProvider } from "@/contexts/SLAContext";

// Colleague and Vendor Account Components
import { ColleagueProvider } from "@/contexts/ColleagueContext";
import { VendorAccountProvider } from "@/contexts/VendorAccountContext";

// Layouts
import AdminLayout from "@/layouts/AdminLayout";
import ColleagueLayout from "@/layouts/ColleagueLayout";
import VendorLayout from "@/layouts/VendorLayout";

// Components
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
  </div>
);

// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const WorkOrders = lazy(() => import("./pages/WorkOrders"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const Vendors = lazy(() => import("./pages/Vendors"));
const Utilities = lazy(() => import("./pages/Utilities"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Notifications = lazy(() => import("./pages/Notifications"));
const ECGElectricity = lazy(() => import("./pages/ECGElectricity"));
const GhanaWater = lazy(() => import("./pages/GhanaWater"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AddAsset = lazy(() => import("./pages/admin/AddAsset"));
const AssetDetails = lazy(() => import("./pages/admin/AssetDetails"));
const CreateWorkOrder = lazy(() => import("./pages/admin/CreateWorkOrder"));
const WorkOrderDetails = lazy(() => import("./pages/admin/WorkOrderDetails"));
const ScheduleMaintenance = lazy(() => import("./pages/admin/ScheduleMaintenance"));
const MaintenanceDetails = lazy(() => import("./pages/admin/MaintenanceDetails"));
const ManageVendors = lazy(() => import("./pages/admin/ManageVendors"));
const AddVendor = lazy(() => import("./pages/admin/AddVendor"));
const UtilityReports = lazy(() => import("./pages/admin/UtilityReports"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const UserPermissionManagement = lazy(() => import("./pages/admin/UserPermissionManagement"));
const UserPermissions = lazy(() => import("./pages/admin/UserPermissions"));
const AuditLogs = lazy(() => import("./pages/admin/AuditLogs"));
const ManageBranches = lazy(() => import("./pages/admin/ManageBranches"));
const InventoryDashboard = lazy(() => import("./pages/admin/InventoryDashboard"));
const InventoryList = lazy(() => import("./pages/admin/InventoryList"));
const AddInventoryItem = lazy(() => import("./pages/admin/AddInventoryItem"));
const InventoryReports = lazy(() => import("./pages/admin/InventoryReports"));
const Branches = lazy(() => import("./pages/admin/Branches"));
const Units = lazy(() => import("./pages/admin/Units"));
const Billing = lazy(() => import("./pages/admin/Billing"));
const FuelCards = lazy(() => import("./pages/admin/FuelCards"));
const FuelDelivery = lazy(() => import("./pages/admin/FuelDelivery"));
const FuelReconciliation = lazy(() => import("./pages/admin/FuelReconciliation"));
const FuelAudits = lazy(() => import("./pages/admin/FuelAudits"));
const Vehicles = lazy(() => import("./pages/admin/Vehicles"));
const CompletionCertificate = lazy(() => import("./pages/admin/CompletionCertificate"));
const MonthlySnapCheck = lazy(() => import("./pages/admin/MonthlySnapCheck"));
const TankerRequests = lazy(() => import("./pages/admin/TankerRequests"));
const Requests = lazy(() => import("./pages/admin/Requests"));
const AdminLogs = lazy(() => import("./pages/admin/Logs"));
const Logs = lazy(() => import("./pages/admin/Logs"));
const Documents = lazy(() => import("./pages/admin/Documents"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const SLAPenaltyCalculator = lazy(() => import("./pages/admin/SLAPenaltyCalculator"));
const SLADashboard = lazy(() => import("./pages/admin/SLADashboard"));
const SLABreaches = lazy(() => import("./pages/admin/SLABreaches"));
const Assets = lazy(() => import("./pages/admin/Assets"));
const WaterTankerManagement = lazy(() => import("./pages/WaterTankerManagement"));
const FuelDashboard = lazy(() => import("./pages/admin/FuelDashboard"));

// Colleague Pages
const ColleagueDashboard = lazy(() => import("./pages/colleague/ColleagueDashboard"));
const ColleagueRequests = lazy(() => import("./pages/colleague/Requests"));
const ColleagueLogs = lazy(() => import("./pages/colleague/Logs"));
const SubmitRequest = lazy(() => import("./pages/colleague/SubmitRequest"));
const SubmitFuelWaterRequest = lazy(() => import("./pages/colleague/SubmitFuelWaterRequest"));
const MyRequests = lazy(() => import("./pages/colleague/MyRequests"));
const ReportIncident = lazy(() => import("./pages/colleague/ReportIncident"));
const RequestHistory = lazy(() => import("./pages/colleague/RequestHistory"));
const ColleagueProfile = lazy(() => import("./pages/colleague/ColleagueProfile"));
const Support = lazy(() => import("./pages/colleague/Support"));

// Vendor Pages
const VendorDashboard = lazy(() => import("./pages/vendor/VendorDashboard"));
const VendorProfile = lazy(() => import("./pages/vendor/VendorProfile"));
const VendorWorkOrders = lazy(() => import("./pages/vendor/VendorWorkOrders"));
const VendorWorkOrderDetails = lazy(() => import("./pages/vendor/VendorWorkOrderDetails"));
const VendorContracts = lazy(() => import("./pages/vendor/VendorContracts"));
const VendorReports = lazy(() => import("./pages/vendor/VendorReports"));
const VendorTools = lazy(() => import("./pages/vendor/VendorTools"));
const InvoiceSubmission = lazy(() => import("./pages/vendor/InvoiceSubmission"));
const VendorInvoices = lazy(() => import("./pages/vendor/VendorInvoices"));
const InvoiceDetail = lazy(() => import("./pages/vendor/InvoiceDetail"));
const AvailabilityCalendar = lazy(() => import("./pages/vendor/AvailabilityCalendar"));
const DocumentUploads = lazy(() => import("./pages/vendor/DocumentUploads"));
const ServiceCatalog = lazy(() => import("./pages/vendor/ServiceCatalog"));
const VendorProfileSettings = lazy(() => import("./pages/vendor/VendorProfileSettings"));
const VendorSupport = lazy(() => import("./pages/vendor/VendorSupport"));

// Types
import { UserRole } from "@/types/auth";

const queryClient = new QueryClient();

// Main App Router Component
const AppRouter = () => {
  const { session, isLoading } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredPortal="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="add-asset" element={<AddAsset />} />
            <Route path="create-work-order" element={<CreateWorkOrder />} />
            <Route path="manage-vendors" element={<ManageVendors />} />
            <Route path="add-vendor" element={<AddVendor />} />
            <Route path="utility-reports" element={<UtilityReports />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="manage-branches" element={<ManageBranches />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="users/:userId/permissions" element={<UserPermissions />} />
            <Route path="user-permissions" element={<UserPermissionManagement />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="inventory" element={<InventoryDashboard />} />
            <Route path="inventory/list" element={<InventoryList />} />
            <Route path="inventory/add" element={<AddInventoryItem />} />
            <Route path="inventory/reports" element={<InventoryReports />} />
            <Route path="branches" element={<Branches />} />
            <Route path="units" element={<Units />} />
            <Route path="billing" element={<Billing />} />
            <Route path="fuel-dashboard" element={<FuelDashboard />} />
            <Route path="fuel-cards" element={<FuelCards />} />
            <Route path="fuel-delivery" element={<FuelDelivery />} />
            <Route path="fuel-reconciliation" element={<FuelReconciliation />} />
            <Route path="fuel-audits" element={<FuelAudits />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="completion-certificate" element={<CompletionCertificate />} />
            <Route path="monthly-snap-check" element={<MonthlySnapCheck />} />
            <Route path="tanker-requests" element={<TankerRequests />} />
            <Route path="requests" element={<Requests />} />
            <Route path="logs" element={<AdminLogs />} />
            <Route path="documents" element={<Documents />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="sla-dashboard" element={<SLADashboard />} />
            <Route path="sla-breaches" element={<SLABreaches />} />
            <Route path="sla-penalty-calculator" element={<SLAPenaltyCalculator />} />
            <Route path="assets" element={<Assets />} />
            <Route path="assets/:assetId" element={<AssetDetails />} />
            <Route path="work-orders" element={<WorkOrders />} />
            <Route path="work-orders/:workOrderId" element={<WorkOrderDetails />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route
              path="maintenance/:maintenanceId"
              element={<MaintenanceDetails />}
            />
            <Route path="schedule-maintenance" element={<ScheduleMaintenance />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="utilities" element={<Utilities />} />
            <Route path="ecg-electricity" element={<ECGElectricity />} />
            <Route path="ghana-water" element={<GhanaWater />} />
            <Route path="water-tanker" element={<WaterTankerManagement />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Colleague Routes */}
          <Route
            path="/colleague/*"
            element={
              <ProtectedRoute requiredPortal="colleague">
                <ColleagueLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ColleagueDashboard />} />
            <Route path="requests" element={<ColleagueRequests />} />
            <Route path="logs" element={<ColleagueLogs />} />
            <Route path="submit-request" element={<SubmitRequest />} />
            <Route path="my-requests" element={<MyRequests />} />
            <Route path="report-incident" element={<ReportIncident />} />
            <Route path="request-history" element={<RequestHistory />} />
            <Route path="profile" element={<ColleagueProfile />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* Vendor Routes */}
          <Route
            path="/vendor/*"
            element={
              <ProtectedRoute requiredPortal="vendor">
                <VendorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="work-orders" element={<VendorWorkOrders />} />
            <Route path="work-orders/:workOrderId" element={<VendorWorkOrderDetails />} />
            <Route path="contracts" element={<VendorContracts />} />
            <Route path="reports" element={<VendorReports />} />
            <Route path="tools" element={<VendorTools />} />
            <Route path="invoice-submission" element={<InvoiceSubmission />} />
            <Route path="invoices" element={<VendorInvoices />} />
            <Route path="invoices/:invoiceId" element={<InvoiceDetail />} />
            <Route path="availability" element={<AvailabilityCalendar />} />
            <Route path="documents" element={<DocumentUploads />} />
            <Route path="service-catalog" element={<ServiceCatalog />} />
            <Route path="settings" element={<VendorProfileSettings />} />
            <Route path="support" element={<VendorSupport />} />
          </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UsersProvider>
          <AuthProvider>
            <DocumentProvider>
              <SLAProvider>
                <NotificationProvider>
              <AssetProvider>
                <UserManagementProvider>
                  <RequestProvider>
                    <ColleagueProvider>
                      <VendorAccountProvider>
                        <ThemeProvider>
                          <PermissionProvider>
                            <InventoryProvider>
                              <BrowserRouter>
                                <ScrollToTop />
                                <SidebarProvider>
                                  <Toaster />
                                  <Sonner />
                                  <AppRouter />
                                </SidebarProvider>
                              </BrowserRouter>
                            </InventoryProvider>
                          </PermissionProvider>
                        </ThemeProvider>
                      </VendorAccountProvider>
                    </ColleagueProvider>
                  </RequestProvider>
                </UserManagementProvider>
              </AssetProvider>
                </NotificationProvider>
              </SLAProvider>
            </DocumentProvider>
          </AuthProvider>
        </UsersProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
