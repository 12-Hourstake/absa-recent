import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

// Asset interface (same as Assets page)
interface Asset {
  id: string;
  location: string;
  avrModel: string;
  serialNumber: string;
  kva: string;
  dateInstalled: string;
  avrStatus: string;
  endOfLife: string;
  inUse: string;
  quantity: number;
  vendor: string;
  comments: string;
  category: string;
  branch: string;
}

// Seed data (same as Assets page)
const SEED_ASSETS: Asset[] = [
  {
    id: "AST-001",
    location: "Osu",
    avrModel: "Schneider APC Smart-UPS 3000VA",
    serialNumber: "SN123456789",
    kva: "3.0",
    dateInstalled: "2023-01-15",
    avrStatus: "Good",
    endOfLife: "N",
    inUse: "Y",
    quantity: 1,
    vendor: "Schneider Electric",
    comments: "Primary UPS for server room",
    category: "UPS",
    branch: "Osu Branch"
  },
  {
    id: "AST-002", 
    location: "Head Office- Lifts",
    avrModel: "Caterpillar C15 Generator",
    serialNumber: "CAT987654321",
    kva: "500",
    dateInstalled: "2022-08-20",
    avrStatus: "Good",
    endOfLife: "N",
    inUse: "Y",
    quantity: 1,
    vendor: "Mantrac Ghana",
    comments: "Backup power for entire building",
    category: "GENERATORS",
    branch: "Head Office"
  },
  {
    id: "AST-003",
    location: "Achimota",
    avrModel: "Honeywell Air Purifier H13",
    serialNumber: "HON456789123",
    kva: "0.5",
    dateInstalled: "2023-03-10",
    avrStatus: "Good",
    endOfLife: "N",
    inUse: "Y",
    quantity: 2,
    vendor: "Honeywell Ghana",
    comments: "Air quality management system",
    category: "AIR PURIFIERS",
    branch: "Achimota Branch"
  }
];

const STORAGE_KEY = "ASSETS_CACHE_V1";

const InventoryDashboard = () => {
  const [assets, setAssets] = useState<Asset[]>([]);

  // Load assets from same source as Assets page
  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = () => {
    try {
      const cachedAssets = localStorage.getItem(STORAGE_KEY);
      const cached = cachedAssets ? JSON.parse(cachedAssets) : [];
      
      // Merge seed data with cached data (avoid duplicates)
      const existingIds = cached.map((asset: Asset) => asset.id);
      const newSeedAssets = SEED_ASSETS.filter(asset => !existingIds.includes(asset.id));
      
      const allAssets = [...cached, ...newSeedAssets];
      setAssets(allAssets);
    } catch (err) {
      console.error("Error loading assets:", err);
      setAssets(SEED_ASSETS);
    }
  };

  // Calculate inventory statistics
  const inventoryStats = useMemo(() => {
    const totalAssets = assets.reduce((sum, asset) => sum + asset.quantity, 0);
    const assetsInUse = assets.filter(asset => asset.inUse === "Y").reduce((sum, asset) => sum + asset.quantity, 0);
    const endOfLifeAssets = assets.filter(asset => asset.endOfLife === "Y").reduce((sum, asset) => sum + asset.quantity, 0);
    const activeAssets = assets.filter(asset => asset.avrStatus === "Good").reduce((sum, asset) => sum + asset.quantity, 0);

    return {
      totalAssets,
      assetsInUse,
      endOfLifeAssets,
      activeAssets
    };
  }, [assets]);

  // Group assets by location
  const locationSummary = useMemo(() => {
    const locationMap = new Map<string, { total: number; inUse: number; endOfLife: number }>();
    
    assets.forEach(asset => {
      const current = locationMap.get(asset.location) || { total: 0, inUse: 0, endOfLife: 0 };
      current.total += asset.quantity;
      if (asset.inUse === "Y") current.inUse += asset.quantity;
      if (asset.endOfLife === "Y") current.endOfLife += asset.quantity;
      locationMap.set(asset.location, current);
    });

    return Array.from(locationMap.entries()).map(([location, stats]) => ({
      location,
      ...stats
    }));
  }, [assets]);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inventory Overview</h1>
        <p className="text-muted-foreground">Asset stock summary across all branches</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold">{inventoryStats.totalAssets}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <Package className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assets In Use</p>
                <p className="text-2xl font-bold">{inventoryStats.assetsInUse}</p>
              </div>
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">End of Life</p>
                <p className="text-2xl font-bold">{inventoryStats.endOfLifeAssets}</p>
              </div>
              <div className="rounded-lg bg-red-50 p-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Assets</p>
                <p className="text-2xl font-bold">{inventoryStats.activeAssets}</p>
              </div>
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory by Location */}
      <Card>
        <CardHeader className="bg-muted/50 p-4">
          <CardTitle className="text-base">Inventory by Location</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead className="text-sm">Location</TableHead>
                  <TableHead className="text-sm">Total Assets</TableHead>
                  <TableHead className="text-sm">In Use</TableHead>
                  <TableHead className="text-sm">End of Life</TableHead>
                  <TableHead className="text-sm">Utilization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locationSummary.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No inventory data available.
                    </TableCell>
                  </TableRow>
                ) : (
                  locationSummary.map((location) => {
                    const utilizationRate = location.total > 0 ? Math.round((location.inUse / location.total) * 100) : 0;
                    
                    return (
                      <TableRow key={location.location} className="hover:bg-muted/50">
                        <TableCell className="text-sm font-medium">{location.location}</TableCell>
                        <TableCell className="text-sm">{location.total}</TableCell>
                        <TableCell className="text-sm">
                          <Badge className="bg-green-100 text-green-800">{location.inUse}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {location.endOfLife > 0 ? (
                            <Badge variant="destructive">{location.endOfLife}</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">0</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full" 
                                style={{ width: `${utilizationRate}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{utilizationRate}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryDashboard;