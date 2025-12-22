import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component
 * Automatically scrolls to the top of the page when route changes
 * Also tracks navigation history for back button text
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    // Scroll to top - handle both window and main content area
    window.scrollTo(0, 0);
    
    // Also scroll the main content area (since layouts use overflow on main)
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo(0, 0);
    }
    
    // Track navigation history for back button
    // If we have a previous path, store it before updating to current
    if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname) {
      sessionStorage.setItem("lastPagePath", prevPathnameRef.current);
    }
    
    // Update the ref to current path
    prevPathnameRef.current = pathname;
  }, [pathname]);

  return null;
};

export default ScrollToTop;
