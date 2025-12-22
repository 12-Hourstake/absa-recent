import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Ensure React is available globally for production builds
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).ReactDOM = { createRoot };
}

createRoot(document.getElementById("root")!).render(<App />);
