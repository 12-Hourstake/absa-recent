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
import { Plus, Users, TrendingUp, Award, Trash2, Star, BarChart3, PieChart, CheckCircle, XCircle, Clock } from "lucide-react";

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
  vendorId: string;
  vendorName: string;
  slaStatus?: 'Met' | 'Breached';
  completionDate?: string;
}

interface VendorKPI {
  id: string;
  name: string;
  score: 0 | 1 | 2 | 3; // NotRated=0, Poor=1, Good=2, Excellent=3
}

interface VendorPerformance {
  vendorId: string;
  vendorName: string;
  kpis: VendorKPI[];
  totalScore: number;
  overallRating: 'Poor' | 'Good' | 'Excellent' | 'Not Rated';
}

interface VendorStats {
  vendorId: string;
  vendorName: string;
  totalWorkOrders: number;
  completedWorkOrders: number;
  rejectedWorkOrders: number;
  openWorkOrders: number;
  slaMetCount: number;
  slaBreachedCount: number;
}

const VENDORS_STORAGE_KEY = "VENDORS_CACHE_V1";
const WORK_ORDERS_STORAGE_KEY = "WORK_ORDERS_CACHE_V1";

// Fixed KPIs (system-defined, not editable)
const FIXED_KPIS = [
  { id: "kpi1", name: "Timely PPM servicing and service reports as per SLA" },
  { id: "kpi2", name: "Meet response and resolution per SLA for reactive maintenance" },
  { id: "kpi3", name: "General servicing and maintenance performance" },
  { id: "kpi4", name: "Availability of stock / spare parts" },
  { id: "kpi5", name: "Monthly performance report" }
];

// Seed vendors data
const SEED_VENDORS: Vendor[] = [
  { id: "VEN-001", name: "JANITOR", contact: "janitor@services.com", category: "Cleaning", createdDate: "2023-01-15" },
  { id: "VEN-002", name: "POWER", contact: "power@electrical.com", category: "Electrical", createdDate: "2023-01-20" },
  { id: "VEN-003", name: "AC", contact: "ac@hvac.com", category: "HVAC", createdDate: "2023-02-01" },
  { id: "VEN-004", name: "ELEVATOR", contact: "elevator@lifts.com", category: "Elevator", createdDate: "2023-02-10" },
  { id: "VEN-005", name: "NSROMA", contact: "nsroma@services.com", category: "General", createdDate: "2023-02-15" },
  { id: "VEN-006", name: "GYM", contact: "gym@equipment.com", category: "Fitness", createdDate: "2023-03-01" },
  { id: "VEN-007", name: "MID ATLANTICS", contact: "midatlantic@marine.com", category: "Marine", createdDate: "2023-03-10" },
  { id: "VEN-008", name: "AIR PURIFIERS", contact: "air@purifiers.com", category: "Air Quality", createdDate: "2023-03-15" },
  { id: "VEN-009", name: "OUTDOOR", contact: "outdoor@landscaping.com", category: "Landscaping", createdDate: "2023-04-01" },
  { id: "VEN-010", name: "TINO", contact: "tino@maintenance.com", category: "Maintenance", createdDate: "2023-04-10" },
  { id: "VEN-011", name: "FUMIGATION", contact: "fumigation@pest.com", category: "Pest Control", createdDate: "2023-04-15" }
];

const Vendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteVendorId, setDeleteVendorId] = useState<string | null>(null);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
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
      
      const allVendors = [...SEED_VENDORS, ...cached.filter((v: Vendor) => !SEED_VENDORS.some(seed => seed.id === v.id))];
      setVendors(allVendors);
      
      // Save merged data
      localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(allVendors));
    } catch (err) {
      console.error("Error loading vendors:", err);
      setVendors(SEED_VENDORS);
      localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(SEED_VENDORS));
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
      setVendors(newVendors);
      localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(newVendors));
    } catch (err) {
      console.error("Error saving vendors:", err);
    }
  };

  // Calculate KPI scores based on work orders (ZERO-BASELINE)
  const calculateKPIScore = (vendorId: string, kpiId: string): 0 | 1 | 2 | 3 => {
    const vendorWorkOrders = workOrders.filter(wo => wo.vendorId === vendorId);
    
    if (vendorWorkOrders.length === 0) return 0; // ZERO baseline for new vendors
    
    switch (kpiId) {
      case "kpi1": // Timely PPM servicing
        const ppmOrders = vendorWorkOrders.filter(wo => wo.workOrderType === "PPM");
        if (ppmOrders.length === 0) return 0; // Zero if no PPM orders
        const ppmOnTime = ppmOrders.filter(wo => wo.slaStatus === "Met").length;
        const ppmRate = ppmOnTime / ppmOrders.length;
        return ppmRate >= 0.9 ? 3 : ppmRate >= 0.7 ? 2 : 1;
        
      case "kpi2": // SLA compliance for reactive maintenance
        const reactiveOrders = vendorWorkOrders.filter(wo => wo.workOrderType !== "PPM");
        if (reactiveOrders.length === 0) return 0; // Zero if no reactive orders
        const reactiveOnTime = reactiveOrders.filter(wo => wo.slaStatus === "Met").length;
        const reactiveRate = reactiveOnTime / reactiveOrders.length;
        return reactiveRate >= 0.9 ? 3 : reactiveRate >= 0.7 ? 2 : 1;
        
      case "kpi3": // General maintenance performance
        const completedOrders = vendorWorkOrders.filter(wo => wo.status === "Closed").length;
        const completionRate = completedOrders / vendorWorkOrders.length;
        return completionRate >= 0.9 ? 3 : completionRate >= 0.7 ? 2 : 1;
        
      case "kpi4": // Stock availability
        return vendorWorkOrders.length > 0 ? 2 : 0; // Zero if no work orders
        
      case "kpi5": // Monthly performance report
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyOrders = vendorWorkOrders.filter(wo => {
          const woDate = new Date(wo.createdDate);
          return woDate.getMonth() === currentMonth && woDate.getFullYear() === currentYear;
        });
        return monthlyOrders.length > 0 ? 3 : vendorWorkOrders.length > 0 ? 2 : 0;
        
      default:
        return 0; // Zero baseline
    }
  };

  // Calculate vendor performance
  const vendorPerformances = useMemo((): VendorPerformance[] => {
    return vendors.map(vendor => {
      const kpis = FIXED_KPIS.map(kpi => ({
        id: kpi.id,
        name: kpi.name,
        score: calculateKPIScore(vendor.id, kpi.id)
      }));
      
      const totalScore = kpis.reduce((sum, kpi) => sum + kpi.score, 0);
      
      let overallRating: 'Poor' | 'Good' | 'Excellent' | 'Not Rated';
      if (totalScore === 0) overallRating = 'Not Rated'; // Zero baseline
      else if (totalScore >= 13) overallRating = 'Excellent'; // 13-15
      else if (totalScore >= 9) overallRating = 'Good'; // 9-12
      else overallRating = 'Poor'; // 1-8
      
      return {
        vendorId: vendor.id,
        vendorName: vendor.name,
        kpis,
        totalScore,
        overallRating
      };
    });
  }, [vendors, workOrders]);

  // Calculate vendor statistics for comparison
  const vendorStats = useMemo((): VendorStats[] => {
    return vendors.map(vendor => {
      const vendorWorkOrders = workOrders.filter(wo => wo.vendorId === vendor.id);
      const completed = vendorWorkOrders.filter(wo => wo.status === "Closed").length;
      const rejected = vendorWorkOrders.filter(wo => wo.status === "Rejected").length;
      const open = vendorWorkOrders.filter(wo => wo.status === "Open").length;
      const slaMetCount = vendorWorkOrders.filter(wo => wo.slaStatus === "Met").length;
      const slaBreachedCount = vendorWorkOrders.filter(wo => wo.slaStatus === "Breached").length;

      return {
        vendorId: vendor.id,
        vendorName: vendor.name,
        totalWorkOrders: vendorWorkOrders.length,
        completedWorkOrders: completed,
        rejectedWorkOrders: rejected,
        openWorkOrders: open,
        slaMetCount,
        slaBreachedCount
      };
    });
  }, [vendors, workOrders]);

  const handleAddVendor = () => {
    try {
      if (!formData.name) {
        setError("Please enter vendor name");
        return;
      }

      const newId = `VEN-${String(vendors.length + 1).padStart(3, '0')}`;
      
      const newVendor: Vendor = {
        id: newId,
        name: formData.name,
        contact: formData.contact,
        category: formData.category,
        createdDate: new Date().toISOString().split('T')[0]
      };

      const updatedVendors = [...vendors, newVendor];
      saveVendors(updatedVendors);

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

  const handleDeleteVendor = (vendorId: string) => {
    try {
      const updatedVendors = vendors.filter(v => v.id !== vendorId);
      saveVendors(updatedVendors);
      setDeleteVendorId(null);
      setSuccess("Vendor deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete vendor");
      console.error("Error deleting vendor:", err);
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      case 'Not Rated': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVendorSelection = (vendorId: string) => {
    if (selectedVendors.includes(vendorId)) {
      setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
    } else if (selectedVendors.length < 5) {
      setSelectedVendors([...selectedVendors, vendorId]);
    }
  };

  const getComparisonData = (vendorId: string) => {
    const performance = vendorPerformances.find(vp => vp.vendorId === vendorId);
    const stats = vendorStats.find(vs => vs.vendorId === vendorId);
    return { performance, stats };
  };

  const getScoreColor = (score: number) => {
    if (score === 3) return 'text-green-600';
    if (score === 2) return 'text-yellow-600';
    if (score === 1) return 'text-red-600';
    return 'text-gray-400'; // Zero score
  };

  // Calculate summary stats
  const stats = {
    totalVendors: vendors.length,
    excellentVendors: vendorPerformances.filter(vp => vp.overallRating === 'Excellent').length,
    averageScore: vendorPerformances.length > 0 
      ? Math.round(vendorPerformances.reduce((sum, vp) => sum + vp.totalScore, 0) / vendorPerformances.length * 10) / 10
      : 0,
    totalWorkOrders: workOrders.length
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
          <h1 className="text-2xl font-bold tracking-tight">Vendor Performance Review</h1>
          <p className="text-muted-foreground">KPI-based vendor evaluation system</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Vendors</p>
                <p className="text-2xl font-bold">{stats.totalVendors}</p>
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
                <p className="text-sm text-muted-foreground">Excellent Performers</p>
                <p className="text-2xl font-bold">{stats.excellentVendors}</p>
              </div>
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <Award className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{stats.averageScore}/15</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Work Orders</p>
                <p className="text-2xl font-bold">{stats.totalWorkOrders}</p>
              </div>
              <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                <Star className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Selection for Comparison */}
      <Card>
        <CardHeader className="bg-muted/50 p-4">
          <CardTitle className="text-base flex items-center justify-between">
            Select Vendors to Compare (2-5)
            {selectedVendors.length >= 5 && (
              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                You can compare up to 5 vendors at a time
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendorPerformances.map((performance) => (
              <div
                key={performance.vendorId}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedVendors.includes(performance.vendorId)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${selectedVendors.length >= 5 && !selectedVendors.includes(performance.vendorId) ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => handleVendorSelection(performance.vendorId)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{performance.vendorName}</h3>
                  <Badge className={getRatingColor(performance.overallRating)}>
                    {performance.overallRating}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Total Score: {performance.totalScore}/15</p>
                  <p>Work Orders: {vendorStats.find(vs => vs.vendorId === performance.vendorId)?.totalWorkOrders || 0}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Multi-Vendor Comparison */}
      {selectedVendors.length >= 2 && (
        <div className={`grid gap-6 overflow-x-auto ${
          selectedVendors.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
          selectedVendors.length === 3 ? 'grid-cols-1 lg:grid-cols-3' :
          'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
        }`}>
          {selectedVendors.map((vendorId) => {
            const { performance, stats } = getComparisonData(vendorId);
            if (!performance || !stats) return null;

            return (
              <Card key={vendorId} className="border-2 border-blue-200">
                <CardHeader className="bg-blue-50 p-4">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {performance.vendorName}
                    <Badge className={getRatingColor(performance.overallRating)}>
                      {performance.overallRating}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* KPI Scores */}
                  <div>
                    <h4 className="font-medium mb-2">KPI Performance</h4>
                    <div className="space-y-2">
                      {performance.kpis.map((kpi, index) => (
                        <div key={kpi.id} className="flex justify-between items-center">
                          <span className="text-sm">KPI {index + 1}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  kpi.score === 3 ? 'bg-green-500' : 
                                  kpi.score === 2 ? 'bg-yellow-500' : 
                                  kpi.score === 1 ? 'bg-red-500' : 'bg-gray-300'
                                }`}
                                style={{ width: `${(kpi.score / 3) * 100}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${getScoreColor(kpi.score)}`}>
                              {kpi.score}/3
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Score</span>
                        <span className="text-lg font-bold">{performance.totalScore}/15</span>
                      </div>
                    </div>
                  </div>

                  {/* Work Order Stats */}
                  <div>
                    <h4 className="font-medium mb-2">Work Order Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold">{stats.totalWorkOrders}</p>
                        <p className="text-sm text-muted-foreground">Total</p>
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
                  </div>

                  {/* SLA Performance */}
                  <div>
                    <h4 className="font-medium mb-2">SLA Performance</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">SLA Met: {stats.slaMetCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm">SLA Breached: {stats.slaBreachedCount}</span>
                      </div>
                    </div>
                    {stats.totalWorkOrders > 0 && (
                      <div className="mt-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">SLA Compliance Rate</span>
                          <span className="text-sm font-medium">
                            {Math.round((stats.slaMetCount / (stats.slaMetCount + stats.slaBreachedCount)) * 100) || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ 
                              width: `${Math.round((stats.slaMetCount / (stats.slaMetCount + stats.slaBreachedCount)) * 100) || 0}%` 
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedVendors.length === 1 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <p className="text-orange-800">Select at least one more vendor to start comparison</p>
          </CardContent>
        </Card>
      )}

      {/* Vendor Performance Table */}
      <Card>
        <CardHeader className="bg-muted/50 p-4">
          <CardTitle className="text-base">Vendor Performance Scorecard</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead className="text-sm">Vendor Name</TableHead>
                  <TableHead className="text-sm">KPI 1: PPM Servicing</TableHead>
                  <TableHead className="text-sm">KPI 2: SLA Compliance</TableHead>
                  <TableHead className="text-sm">KPI 3: Maintenance Performance</TableHead>
                  <TableHead className="text-sm">KPI 4: Stock Availability</TableHead>
                  <TableHead className="text-sm">KPI 5: Monthly Reports</TableHead>
                  <TableHead className="text-sm">Total Score</TableHead>
                  <TableHead className="text-sm">Overall Rating</TableHead>
                  <TableHead className="text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorPerformances.map((performance) => (
                  <TableRow key={performance.vendorId} className="hover:bg-muted/50">
                    <TableCell className="text-sm font-medium">{performance.vendorName}</TableCell>
                    {performance.kpis.map((kpi) => (
                      <TableCell key={kpi.id} className="text-sm">
                        <span className={`font-semibold ${getScoreColor(kpi.score)}`}>
                          {kpi.score}/3
                        </span>
                      </TableCell>
                    ))}
                    <TableCell className="text-sm font-bold">
                      {performance.totalScore}/15
                    </TableCell>
                    <TableCell>
                      <Badge className={getRatingColor(performance.overallRating)}>
                        {performance.overallRating}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteVendorId(performance.vendorId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* KPI Legend */}
      <Card>
        <CardHeader className="bg-muted/50 p-4">
          <CardTitle className="text-base">KPI Scoring Legend</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Rating Scale:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-semibold">0 - Not Rated (No Work Orders)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600 font-semibold">1 - Poor</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-600 font-semibold">2 - Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-semibold">3 - Excellent</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Overall Rating:</h4>
              <div className="space-y-1 text-sm">
                <div>Not Rated: 0 points (New vendors)</div>
                <div>Poor: 1-8 points</div>
                <div>Good: 9-12 points</div>
                <div>Excellent: 13-15 points</div>
              </div>
            </div>
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
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Electrical, Plumbing, HVAC"
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteVendorId} onOpenChange={() => setDeleteVendorId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Vendor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this vendor? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteVendorId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteVendorId && handleDeleteVendor(deleteVendorId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vendors;