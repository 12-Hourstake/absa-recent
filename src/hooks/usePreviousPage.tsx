import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook to track and display the previous page name
 * Returns the name of the previous page for display in back buttons
 */
export const usePreviousPage = () => {
  const location = useLocation();
  const [previousPage, setPreviousPage] = useState<string>("Dashboard");

  useEffect(() => {
    const currentPath = location.pathname;
    const currentPageName = getPageNameFromPath(currentPath);
    
    // Get the stored previous page name BEFORE we update it
    const storedPreviousPage = sessionStorage.getItem("previousPageName");
    const storedCurrentPage = sessionStorage.getItem("currentPageName");
    
    // Set the previous page display
    if (storedCurrentPage) {
      setPreviousPage(storedCurrentPage);
    } else if (storedPreviousPage) {
      setPreviousPage(storedPreviousPage);
    }
    
    // Update the history: current becomes previous, new current is stored
    if (storedCurrentPage) {
      sessionStorage.setItem("previousPageName", storedCurrentPage);
    }
    sessionStorage.setItem("currentPageName", currentPageName);
  }, [location.pathname]);

  return previousPage;
};

/**
 * Helper function to get a readable page name from URL path
 */
const getPageNameFromPath = (path: string): string => {
  // Remove trailing slash
  path = path.replace(/\/$/, "");
  
  // Extract the main section from the path
  const segments = path.split("/").filter(Boolean);
  
  // Handle different URL patterns
  if (segments.length === 0) return "Dashboard";
  
  // For detail pages (e.g., /admin/assets/123), return the list page name
  if (segments.length >= 3 && !isNaN(Number(segments[segments.length - 1]))) {
    return formatPageName(segments[segments.length - 2]);
  }
  
  // For regular pages
  const lastSegment = segments[segments.length - 1];
  
  // Special cases
  if (lastSegment === "admin" || lastSegment === "vendor" || lastSegment === "colleague") {
    return "Dashboard";
  }
  
  return formatPageName(lastSegment);
};

/**
 * Format URL segment into readable page name
 */
const formatPageName = (segment: string): string => {
  // Handle special cases
  const specialCases: Record<string, string> = {
    "work-orders": "Work Orders",
    "add-asset": "Assets",
    "create-work-order": "Work Orders",
    "schedule-maintenance": "Maintenance",
    "add-vendor": "Vendors",
    "user-permissions": "Dashboard",
    "inventory-list": "Inventory Dashboard",
    "inventory-reports": "Inventory Dashboard",
    "add-inventory-item": "Inventory",
    "utility-reports": "Utilities",
  };
  
  if (specialCases[segment]) {
    return specialCases[segment];
  }
  
  // Convert kebab-case to Title Case
  return segment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
