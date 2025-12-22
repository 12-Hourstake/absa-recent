import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Car, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockVehicles } from "@/data/mockVehicles";

const Vehicles = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return mockVehicles;
    
    const term = searchTerm.toLowerCase();
    return mockVehicles.filter(vehicle =>
      vehicle.registration.toLowerCase().includes(term) ||
      vehicle.make.toLowerCase().includes(term) ||
      vehicle.model.toLowerCase().includes(term) ||
      vehicle.assignedDriver?.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: "bg-green-100 text-green-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      inactive: "bg-gray-100 text-gray-800",
      unassigned: "bg-blue-100 text-blue-800"
    };
    
    return <Badge className={statusConfig[status] || ""}>{status}</Badge>;
  };

  const activeVehicles = mockVehicles.filter(v => v.status === 'active').length;
  const maintenanceVehicles = mockVehicles.filter(v => v.status === 'maintenance').length;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Fleet Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage company vehicles and assignments
            </p>
          </div>
        </div>
        <Button onClick={() => alert('Add Vehicle Modal')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockVehicles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeVehicles}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {maintenanceVehicles}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unassigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockVehicles.filter(v => v.status === 'unassigned').length}
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
              placeholder="Search by registration, make, model, driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                No vehicles found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registration</TableHead>
                    <TableHead>Make & Model</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Fuel Type</TableHead>
                    <TableHead>Odometer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-mono font-medium">
                        {vehicle.registration}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                          <div className="text-sm text-muted-foreground">{vehicle.year}</div>
                        </div>
                      </TableCell>
                      <TableCell>{vehicle.assignedDriver || "Unassigned"}</TableCell>
                      <TableCell>{vehicle.assignedBranch}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{vehicle.fuelType}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {vehicle.odometer.toLocaleString()} km
                      </TableCell>
                      <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => alert(`View ${vehicle.registration} details`)}
                        >
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

export default Vehicles;
