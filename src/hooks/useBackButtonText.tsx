import { useEffect, useState } from "react";

/**
 * Hook to determine back button text
 * Returns "Back to [Previous Page Name]" based on the previous route
 * Note: Navigation tracking is handled by ScrollToTop component
 */
export const useBackButtonText = () => {
  const [backButtonText, setBackButtonText] = useState<string>("Go Back");

  useEffect(() => {
    // Get the previous page path from sessionStorage (set by ScrollToTop component)
    const previousPath = sessionStorage.getItem("lastPagePath");
    
    if (previousPath) {
      const pageName = getPageNameFromPath(previousPath);
      setBackButtonText(`Back to ${pageName}`);
    }
  }, []); // Only run once on mount

  return backButtonText;
};

/**
 * Helper function to convert a URL path to a readable page name
 */
const getPageNameFromPath = (path: string): string => {
  // Remove trailing slash
  path = path.replace(/\/$/, "");
  
  // Handle root dashboard paths
  if (path === "/admin/dashboard" || path === "/admin" || path === "/") {
    return "Dashboard";
  }
  if (path === "/vendor/dashboard" || path === "/vendor") {
    return "Dashboard";
  }
  if (path === "/colleague/dashboard" || path === "/colleague") {
    return "Dashboard";
  }
  
  // Extract the last segment or second-to-last if it's a detail page
  const segments = path.split("/").filter(Boolean);
  
  // If the last segment is a number/ID, use the second-to-last segment
  const lastSegment = segments[segments.length - 1];
  const isDetailPage = !isNaN(Number(lastSegment)) || lastSegment.match(/^[A-Z0-9-]+$/);
  const relevantSegment = isDetailPage && segments.length > 1 
    ? segments[segments.length - 2] 
    : lastSegment;
  
  // Map specific routes to readable names
  const routeNameMap: Record<string, string> = {
    // Admin routes
    "dashboard": "Dashboard",
    "assets": "Assets",
    "work-orders": "Work Orders",
    "maintenance": "Maintenance",
    "utilities": "Utilities",
    "reports": "Reports",
    "vendors": "Vendors",
    "add-asset": "Assets",
    "create-work-order": "Work Orders",
    "schedule-maintenance": "Maintenance",
    "add-vendor": "Vendors",
    "user-management": "User Management",
    "user-permissions": "User Permissions",
    "manage-branches": "Branch Management",
    "manage-vendors": "Vendor Management",
    "inventory": "Inventory Dashboard",
    "inventory-list": "Inventory List",
    "inventory-reports": "Inventory Reports",
    "add-inventory-item": "Inventory",
    "profile": "Profile",
    "settings": "Settings",
    "utility-reports": "Utility Reports",
    
    // Vendor routes
    "contracts": "Contracts",
    "tools": "Tools",
    
    // Colleague routes
    "submit-request": "Submit Request",
    "my-requests": "My Requests",
    "report-incident": "Report Incident",
    "request-history": "Request History",
  };
  
  // Return mapped name or format the segment
  return routeNameMap[relevantSegment] || formatSegmentName(relevantSegment);
};

/**
 * Format a URL segment into a readable name
 */
const formatSegmentName = (segment: string): string => {
  return segment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
