import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("recharts")) {
              return "recharts";
            }
            if (id.includes("lucide-react")) {
              return "lucide-react";
            }
            if (id.includes("react") || id.includes("react-dom")) {
              return "react";
            }
            if (id.includes("date-fns")) {
              return "date-fns";
            }
            if (id.includes("lodash")) {
              return "lodash";
            }
            if (id.includes("@radix-ui")) {
              return "radix-ui";
            }
            if (id.includes("react-hook-form") || id.includes("zod")) {
              return "forms";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
