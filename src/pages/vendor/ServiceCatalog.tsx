import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, ToggleLeft, Trash2, Search } from "lucide-react";

const ServiceCatalog = () => {
  const [formData, setFormData] = useState({ name: "", description: "", category: "", pricing: "", duration: "" });

  const services = [
    { name: "AC Unit Servicing", category: "HVAC", pricing: "GHS 250.00", duration: "2 hours", status: "Active" },
    { name: "Residential Plumbing Inspection", category: "Plumbing", pricing: "GHS 150.00", duration: "1 hour", status: "Active" },
    { name: "Kwame's Garden Landscaping", category: "Landscaping", pricing: "GHS 400.00", duration: "4 hours", status: "Inactive" },
    { name: "Commercial Electrical Wiring", category: "Electrical", pricing: "GHS 1200.00", duration: "1 day", status: "Active" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Catalog Editor</h1>
          <p className="text-muted-foreground">Create, edit, and manage services offered to properties.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90"><Plus className="h-4 w-4 mr-2" />Add New Service</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Add New Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Service Name</Label>
              <Input placeholder="e.g., Residential Plumbing Inspection" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe the service in detail." rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="landscaping">Landscaping</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pricing (GHS)</Label>
                <Input placeholder="250.00" value={formData.pricing} onChange={(e) => setFormData({ ...formData, pricing: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Est. Duration</Label>
                <Input placeholder="e.g., 2 hours" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-primary hover:bg-primary/90">Save Service</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by service name..." className="pl-10" />
              </div>
              <Select><SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Category" /></SelectTrigger></Select>
              <Select><SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Status" /></SelectTrigger></Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Service Name</th>
                    <th className="px-6 py-3 text-left font-semibold">Category</th>
                    <th className="px-6 py-3 text-left font-semibold">Pricing</th>
                    <th className="px-6 py-3 text-left font-semibold">Duration</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                    <th className="px-6 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {services.map((service, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 font-medium">{service.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{service.category}</td>
                      <td className="px-6 py-4 text-muted-foreground">{service.pricing}</td>
                      <td className="px-6 py-4 text-muted-foreground">{service.duration}</td>
                      <td className="px-6 py-4">
                        <Badge variant={service.status === "Active" ? "default" : "secondary"}>{service.status}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><ToggleLeft className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceCatalog;
