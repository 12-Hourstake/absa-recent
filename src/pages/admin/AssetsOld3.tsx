import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Package, Eye, Loader2 } from "lucide-react";
import { useAssets } from "@/contexts/AssetContext";
import { useNavigate } from "react-router-dom";
import { AssetStatus } from "@/types/asset";

const Assets = () => {
  const navigate = useNavigate();
  const { assets, isLoading, error } = useAssets();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter assets based on search
  const filteredAssets = useMemo(() => {
    if (!searchTerm) return assets;
    
    const term = searchTerm.toLowerCase();
    return assets.filter(asset =>
      asset.name.toLowerCase().includes(term) ||
      asset.location.branch.toLowerCase().includes(term) ||
      asset.technicalDetails.serialNumber?.toLowerCase().includes(term) ||
      asset.technicalDetails.manufacturer?.toLowerCase().includes(term)
    );
  }, [assets, searchTerm]);

  const getStatusBadge = (status: AssetStatus) => {
    const statusConfig = {
      [AssetStatus.ACTIVE]: "bg-green-100 text-green-800",
      [AssetStatus.INACTIVE]: "bg-gray-100 text-gray-800",
      [AssetStatus.UNDER_MAINTENANCE]: "bg-yellow-100 text-yellow-800",
      [AssetStatus.DISPOSED]: "bg-red-100 text-red-800",
      [AssetStatus.RESERVED]: "bg-blue-100 text-blue-800"
    };
    
    return <Badge className={statusConfig[status] || ""}>{status}</Badge>;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Asset Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track all facility assets
            </p>
          </div>
        </div>
        <Button onClick={() => navigate("/admin/add-asset")} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Asset
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>❌ {error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assets.filter(a => a.status === AssetStatus.ACTIVE).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Under Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {assets.filter(a => a.status === AssetStatus.UNDER_MAINTENANCE).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inactive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {assets.filter(a => a.status === AssetStatus.INACTIVE).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredAssets.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                No assets found
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchTerm ? "Try a different search term" : "Add your first asset to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Maintenance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{asset.type}</Badge>
                      </TableCell>
                      <TableCell>{asset.location.branch}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {asset.technicalDetails.serialNumber || "N/A"}
                      </TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                      <TableCell>
                        {asset.lastMaintenanceDate 
                          ? formatDate(asset.lastMaintenanceDate)
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/assets/${asset.id}`)}
                          className="gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Assets;
