import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Upload, Calendar, FolderOpen, List, Briefcase, HelpCircle } from "lucide-react";

const VendorTools = () => {
  const { user } = useAuth();

  const tools = [
    { title: "Submit Invoices", description: "Upload and manage your invoices for completed jobs. All amounts in GHS.", icon: Upload, link: "/vendor/invoice-submission" },
    { title: "Availability Calendar", description: "Set your working hours and block out dates.", icon: Calendar, link: "/vendor/calendar" },
    { title: "Document Management", description: "Upload compliance documents like your Business Registration.", icon: FolderOpen, link: "/vendor/documents" },
    { title: "Service Catalog", description: "Manage the services you offer to properties in Accra and Kumasi.", icon: List, link: "/vendor/service-catalog" },
    { title: "Job Board", description: "View and bid on new service requests from property managers.", icon: Briefcase, link: "/vendor/work-orders" },
    { title: "Support & Help", description: "Get assistance or find answers to your questions.", icon: HelpCircle, link: "/vendor/support" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3 p-4 my-6">
        <h1 className="text-4xl font-black tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'Vendor'}.</h1>
        <p className="text-muted-foreground">Select a tool to get started.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {tools.map((tool, index) => (
          <a key={index} href={tool.link} className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition-shadow focus:outline-none focus:ring-4 focus:ring-primary/30">
            <div className="text-primary">
              <tool.icon className="h-8 w-8" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold">{tool.title}</h2>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </div>
          </a>
        ))}
      </div>

      <footer className="flex justify-center mt-auto border-t pt-10">
        <div className="flex flex-col gap-6 text-center w-full max-w-7xl">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6">
            <a className="text-muted-foreground hover:text-primary" href="/vendor/support">Support</a>
            <a className="text-muted-foreground hover:text-primary" href="/vendor/support">Help Center</a>
            <a className="text-muted-foreground hover:text-primary" href="#">Terms of Service</a>
          </div>
          <p className="text-muted-foreground">© 2024 ABSA Property Management. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default VendorTools;
