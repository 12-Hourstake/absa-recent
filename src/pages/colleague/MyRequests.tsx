import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClipboardList,
  Search,
  Filter,
  Calendar,
  MapPin,
  ArrowLeft,
  Eye,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBackButtonText } from "@/hooks/useBackButtonText";
import { useRequests } from "@/contexts/RequestContext";
import { useAuth } from "@/contexts/AuthContext";
import { RequestStatus, RequestPriority, RequestType } from "@/types/request";

const MyRequests = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();
  const { requests, incidents } = useRequests();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Filter requests for current user
  const userRequests = requests.filter(request => request.submittedBy.userId === user?.id);
  const userIncidents = incidents.filter(incident => incident.reportedBy.userId === user?.id);

  const filteredRequests = userRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesType = typeFilter === "all" || request.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: RequestStatus) => {
    const variants = {
      [RequestStatus.SUBMITTED]: { variant: "outline" as const, label: "Submitted", icon: Clock },
      [RequestStatus.IN_PROGRESS]: { variant: "default" as const, label: "In Progress", icon: Clock },
      [RequestStatus.COMPLETED]: { variant: "secondary" as const, label: "Completed", icon: CheckCircle2 },
      [RequestStatus.CANCELLED]: { variant: "destructive" as const, label: "Cancelled", icon: XCircle }
    };
    const config = variants[status];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: RequestPriority) => {
    const variants = {
      [RequestPriority.LOW]: { color: "bg-green-100 text-green-800" },
      [RequestPriority.MEDIUM]: { color: "bg-yellow-100 text-yellow-800" },
      [RequestPriority.HIGH]: { color: "bg-orange-100 text-orange-800" },
      [RequestPriority.URGENT]: { color: "bg-red-100 text-red-800" }
    };
    const config = variants[priority];
    return <Badge className={config.color}>{priority}</Badge>;
  };

  const getTypeLabel = (type: RequestType) => {
    const labels = {
      [RequestType.MAINTENANCE]: "Maintenance",
      [RequestType.CLEANING]: "Cleaning",
      [RequestType.SECURITY]: "Security",
      [RequestType.IT_SUPPORT]: "IT Support",
      [RequestType.FACILITIES]: "Facilities",
      [RequestType.OTHER]: "Other"
    };
    return labels[type];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
          </div>
          <p className="text-muted-foreground">
            View and track your submitted requests and incident reports
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backButtonText}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">{userRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Maintenance requests submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incident Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">{userIncidents.length}</div>
            <p className="text-xs text-muted-foreground">
              Safety incidents reported
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">
              {userRequests.filter(r => r.status === RequestStatus.IN_PROGRESS).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently being processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">
              {userRequests.filter(r => r.status === RequestStatus.COMPLETED).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Requests</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={RequestStatus.SUBMITTED}>Submitted</SelectItem>
                  <SelectItem value={RequestStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={RequestStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={RequestStatus.CANCELLED}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Label htmlFor="type-filter">Filter by Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={RequestType.MAINTENANCE}>Maintenance</SelectItem>
                  <SelectItem value={RequestType.CLEANING}>Cleaning</SelectItem>
                  <SelectItem value={RequestType.SECURITY}>Security</SelectItem>
                  <SelectItem value={RequestType.IT_SUPPORT}>IT Support</SelectItem>
                  <SelectItem value={RequestType.FACILITIES}>Facilities</SelectItem>
                  <SelectItem value={RequestType.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {request.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getTypeLabel(request.type)}</Badge>
                  </TableCell>
                  <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {request.location.branch}
                      {request.location.room && ` - ${request.location.room}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(request.submittedAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredRequests.length === 0 && (
            <div className="text-center py-8">
              <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No requests found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "You haven't submitted any requests yet."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyRequests;
