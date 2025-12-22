import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CustomSelectDropdown from "@/components/ui/CustomSelectDropdown";
import { Plus, Users, TrendingUp, Award, Download, BarChart3, PieChart, CheckCircle, XCircle, Clock } from "lucide-react";

// Interfaces
interface Vendor {
  id: string;
  name: string;
  contact: string;
  category: string;
  createdDate: string;
}

interface WorkOrder {
  id: string;
  assetId: string;
  assetName: string;
  category: string;
  location: string;
  workOrderType: string;
  status: string;
  vendorType: string;
  createdDate: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  estimatedCost: string;
  assignedVendor?: string;
}

interface VendorStats {
  vendorId: string;
  vendorName: string;
  totalWorkOrders: number;
  completedWorkOrders: number;
  rejectedWorkOrders: number;
  openWorkOrders: number;
  completionRate: number;
}

const VENDORS_STORAGE_KEY = "VENDORS_CACHE_V1";
const WORK_ORDERS_STORAGE_KEY = "WORK_ORDERS_CACHE_V1";

// Seed vendors data
const SEED_VENDORS: Vendor[] = [
  {
    id: "VEN-001",
    name: "Adom Electrical Services",
    contact: "kwame@adomelectrical.com",
    category: "Electrical",
    createdDate: "2023-01-15"
  },
  {
    id: "VEN-002",
    name: "Osei & Sons Plumbing",
    contact: "osei@oseiplumbing.com",
    category: "Plumbing",
    createdDate: "2023-02-20"
  },
  {
    id: "VEN-003",
    name: "Accra Security Services",
    contact: "info@accrasecurity.com",
    category: "Security",
    createdDate: "2023-03-10"
  }
];

const Vendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState("all");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    category: ""
  });

  // Load data on component mount
  useEffect(() => {
    loadVendors();
    loadWorkOrders();
  }, []);

  const loadVendors = () => {
    try {
      const cachedVendors = localStorage.getItem(VENDORS_STORAGE_KEY);
      const cached = cachedVendors ? JSON.parse(cachedVendors) : [];
      
      // Merge seed data with cached data (avoid duplicates)
      const existingIds = cached.map((vendor: Vendor) => vendor.id);
      const newSeedVendors = SEED_VENDORS.filter(vendor => !existingIds.includes(vendor.id));
      
      const allVendors = [...cached, ...newSeedVendors];
      setVendors(allVendors);
    } catch (err) {
      console.error("Error loading vendors:", err);
      setVendors(SEED_VENDORS);
    }
  };

  const loadWorkOrders = () => {
    try {
      const cachedWorkOrders = localStorage.getItem(WORK_ORDERS_STORAGE_KEY);
      const workOrders = cachedWorkOrders ? JSON.parse(cachedWorkOrders) : [];
      setWorkOrders(workOrders);
    } catch (err) {
      console.error("Error loading work orders:", err);
      setWorkOrders([]);
    }
  };

  const saveVendors = (newVendors: Vendor[]) => {
    try {
      // Only save user-added vendors (not seed data)
      const userVendors = newVendors.filter(vendor => !SEED_VENDORS.some(seed => seed.id === vendor.id));
      localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(userVendors));
    } catch (err) {
      console.error("Error saving vendors:", err);
    }
  };

  // Filter work orders by time range
  const filteredWorkOrders = useMemo(() => {
    if (timeRange === "all") return workOrders;
    
    const now = new Date();
    const days = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return workOrders.filter(wo => new Date(wo.createdDate) >= cutoffDate);
  }, [workOrders, timeRange]);

  // Calculate vendor statistics
  const vendorStats = useMemo(() => {
    return vendors.map(vendor => {
      const vendorWorkOrders = filteredWorkOrders.filter(wo => wo.vendorId === vendor.id);
      const completed = vendorWorkOrders.filter(wo => wo.status === "Closed").length;
      const rejected = vendorWorkOrders.filter(wo => wo.status === "Rejected").length;
      const open = vendorWorkOrders.filter(wo => wo.status === "Open").length;
      const total = vendorWorkOrders.length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        vendorId: vendor.id,
        vendorName: vendor.name,
        totalWorkOrders: total,
        completedWorkOrders: completed,
        rejectedWorkOrders: rejected,
        openWorkOrders: open,
        completionRate
      };
    });
  }, [vendors, filteredWorkOrders]);

  // Find best performing vendor
  const bestVendor = useMemo(() => {
    return vendorStats
      .filter(stats => stats.completedWorkOrders > 0)
      .sort((a, b) => {
        if (b.completionRate !== a.completionRate) return b.completionRate - a.completionRate;
        return b.completedWorkOrders - a.completedWorkOrders;
      })[0];
  }, [vendorStats]);

  // Vendor ranking
  const vendorRanking = useMemo(() => {
    return vendorStats
      .sort((a, b) => {
        if (b.completionRate !== a.completionRate) return b.completionRate - a.completionRate;
        return b.completedWorkOrders - a.completedWorkOrders;
      })
      .map((stats, index) => ({ ...stats, rank: index + 1 }));
  }, [vendorStats]);

  const handleAddVendor = () => {
    try {
      // Validation
      if (!formData.name) {
        setError("Please enter vendor name");
        return;
      }

      // Generate new vendor ID
      const newId = `VEN-${String(vendors.length + 1).padStart(3, '0')}`;
      
      const newVendor: Vendor = {
        id: newId,
        name: formData.name,
        contact: formData.contact,
        category: formData.category,
        createdDate: new Date().toISOString().split('T')[0]
      };

      const updatedVendors = [...vendors, newVendor];
      setVendors(updatedVendors);
      saveVendors(updatedVendors);

      // Reset form
      setFormData({ name: "", contact: "", category: "" });
      setIsAddModalOpen(false);
      setSuccess("Vendor added successfully!");
      setError("");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to add vendor");
      console.error("Error adding vendor:", err);
    }
  };

  const handleVendorSelection = (vendorId: string) => {
    if (selectedVendors.includes(vendorId)) {
      setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
    } else if (selectedVendors.length < 2) {
      setSelectedVendors([...selectedVendors, vendorId]);
    }
  };

  const exportData = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const headers = ['Vendor Name', 'Total Work Orders', 'Completed', 'Rejected', 'Completion Rate'];
      const data = vendorRanking.map(stats => [
        stats.vendorName,
        stats.totalWorkOrders,
        stats.completedWorkOrders,
        stats.rejectedWorkOrders,
        `${stats.completionRate}%`
      ]);
      
      const csv = [headers, ...data]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vendor-comparison-${timeRange}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getComparisonData = (vendorId: string) => {
    return vendorStats.find(stats => stats.vendorId === vendorId);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">✅ {success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>❌ {error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vendor Performance Dashboard</h1>
          <p className="text-muted-foreground">Compare vendor performance and manage service providers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportData('csv')} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Time Range Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label>Time Range:</Label>
            <CustomSelectDropdown
              options={[
                { value: "all", label: "All Time" },
                { value: "7days", label: "Last 7 Days" },
                { value: "30days", label: "Last 30 Days" },
                { value: "90days", label: "Last 90 Days" }
              ]}
              value={timeRange}
              onChange={setTimeRange}
              placeholder="Select time range"
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Vendors</p>
                <p className="text-2xl font-bold">{vendors.length}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Work Orders</p>
                <p className="text-2xl font-bold">{filteredWorkOrders.length}</p>
              </div>
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Completion Rate</p>
                <p className="text-2xl font-bold">
                  {vendorStats.length > 0 
                    ? Math.round(vendorStats.reduce((sum, stats) => sum + stats.completionRate, 0) / vendorStats.length)
                    : 0}%
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={bestVendor ? "border-yellow-200 bg-yellow-50" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top Performer</p>
                <p className="text-lg font-bold truncate">
                  {bestVendor ? bestVendor.vendorName : "No data"}
                </p>
                {bestVendor && (
                  <Badge className="bg-yellow-100 text-yellow-800 mt-1">
                    {bestVendor.completionRate}% completion
                  </Badge>
                )}
              </div>
              <div className="rounded-lg bg-yellow-50 p-2 text-yellow-600">
                <Award className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Selection for Comparison */}
      <Card>
        <CardHeader className="bg-muted/50 p-4">
          <CardTitle className="text-base">Select 2 Vendors to Compare</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendorStats.map((stats) => (
              <div
                key={stats.vendorId}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedVendors.includes(stats.vendorId)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${selectedVendors.length >= 2 && !selectedVendors.includes(stats.vendorId) ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => handleVendorSelection(stats.vendorId)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{stats.vendorName}</h3>
                  {stats.vendorId === bestVendor?.vendorId && (
                    <Badge className="bg-yellow-100 text-yellow-800">Top Performer</Badge>
                  )}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Total: {stats.totalWorkOrders}</p>
                  <p>Completed: {stats.completedWorkOrders}</p>
                  <p>Completion Rate: {stats.completionRate}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison */}
      {selectedVendors.length === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedVendors.map((vendorId, index) => {
            const stats = getComparisonData(vendorId);
            if (!stats) return null;

            return (
              <Card key={vendorId} className="border-2 border-blue-200">
                <CardHeader className="bg-blue-50 p-4">
                  <CardTitle className="text-lg">{stats.vendorName}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">{stats.totalWorkOrders}</p>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{stats.completedWorkOrders}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{stats.rejectedWorkOrders}</p>
                      <p className="text-sm text-muted-foreground">Rejected</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{stats.openWorkOrders}</p>
                      <p className="text-sm text-muted-foreground">Open</p>
                    </div>
                  </div>

                  {/* Completion Rate Progress */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="text-sm font-bold">{stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Distribution Chart */}
                  <div>
                    <h4 className="font-medium mb-2">Work Order Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Completed: {stats.completedWorkOrders}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Rejected: {stats.rejectedWorkOrders}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Open: {stats.openWorkOrders}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Vendor Ranking Table */}
      <Card>
        <CardHeader className="bg-muted/50 p-4">
          <CardTitle className="text-base">Vendor Performance Ranking</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead className="text-sm">Rank</TableHead>
                  <TableHead className="text-sm">Vendor Name</TableHead>
                  <TableHead className="text-sm">Total Work Orders</TableHead>
                  <TableHead className="text-sm">Completed</TableHead>
                  <TableHead className="text-sm">Rejected</TableHead>
                  <TableHead className="text-sm">Completion Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorRanking.map((stats) => (
                  <TableRow key={stats.vendorId} className="hover:bg-muted/50">
                    <TableCell className="text-sm font-bold">#{stats.rank}</TableCell>
                    <TableCell className="text-sm font-medium">
                      {stats.vendorName}
                      {stats.vendorId === bestVendor?.vendorId && (
                        <Badge className="ml-2 bg-yellow-100 text-yellow-800">Top</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{stats.totalWorkOrders}</TableCell>
                    <TableCell className="text-sm">
                      <Badge className="bg-green-100 text-green-800">{stats.completedWorkOrders}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <Badge variant={stats.rejectedWorkOrders > 0 ? "destructive" : "secondary"}>
                        {stats.rejectedWorkOrders}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${stats.completionRate}%` }}
                          />
                        </div>
                        <span className="font-medium">{stats.completionRate}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Vendor Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Add New Vendor
            </DialogTitle>
            <DialogDescription>
              Add a new service provider to the vendor database
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Vendor Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter vendor name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact (Optional)</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                placeholder="Email or phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category/Specialty (Optional)</Label>
              <CustomSelectDropdown
                options={[
                  { value: "Electrical", label: "Electrical" },
                  { value: "Plumbing", label: "Plumbing" },
                  { value: "HVAC", label: "HVAC" },
                  { value: "Security", label: "Security" },
                  { value: "Cleaning", label: "Cleaning" },
                  { value: "Maintenance", label: "General Maintenance" }
                ]}
                value={formData.category}
                onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                placeholder="Select category"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddVendor}>
              Add Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vendors;