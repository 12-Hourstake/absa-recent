import { useState, useMemo } from 'react';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  History,
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
  TrendingUp,
  BarChart3,
  Download,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBackButtonText } from "@/hooks/useBackButtonText";
import { useRequests } from "@/contexts/RequestContext";
import { useAuth } from "@/contexts/AuthContext";
import { RequestStatus, RequestPriority, RequestType, IncidentType, IncidentSeverity } from "@/types/request";

const RequestHistory = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();
  const { requests, incidents } = useRequests();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("requests");

  // Filter data for current user
  const userRequests = requests.filter(request => request.submittedBy.userId === user?.id);
  const userIncidents = incidents.filter(incident => incident.reportedBy.userId === user?.id);

  // Date filtering function
  const filterByDateRange = (date: Date, range: string) => {
    const now = new Date();
    const itemDate = new Date(date);
    
    switch (range) {
      case "today":
        return itemDate.toDateString() === now.toDateString();
      case "week": {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= weekAgo;
      }
      case "month": {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return itemDate >= monthAgo;
      }
      case "quarter": {
        const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return itemDate >= quarterAgo;
      }
      default:
        return true;
    }
  };

  // Filter requests
  const filteredRequests = userRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesType = typeFilter === "all" || request.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    const matchesDate = filterByDateRange(request.submittedAt, dateRange);
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesDate;
  });

  // Filter incidents
  const filteredIncidents = userIncidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter;
    const matchesType = typeFilter === "all" || incident.type === typeFilter;
    const matchesDate = filterByDateRange(incident.reportedAt, dateRange);
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  // Statistics calculations
  const stats = useMemo(() => {
    const totalRequests = userRequests.length;
    const totalIncidents = userIncidents.length;
    const completedRequests = userRequests.filter(r => r.status === RequestStatus.COMPLETED).length;
    const inProgressRequests = userRequests.filter(r => r.status === RequestStatus.IN_PROGRESS).length;
    const avgResolutionTime = userRequests
      .filter(r => r.status === RequestStatus.COMPLETED && r.actualCompletion)
      .reduce((acc, r) => {
        const submitted = new Date(r.submittedAt);
        const completed = new Date(r.actualCompletion!);
        return acc + (completed.getTime() - submitted.getTime());
      }, 0) / Math.max(completedRequests, 1);

    return {
      totalRequests,
      totalIncidents,
      completedRequests,
      inProgressRequests,
      avgResolutionTime: avgResolutionTime / (1000 * 60 * 60 * 24) // Convert to days
    };
  }, [userRequests, userIncidents]);

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

  const getSeverityBadge = (severity: IncidentSeverity) => {
    const variants = {
      [IncidentSeverity.LOW]: { color: "bg-green-100 text-green-800" },
      [IncidentSeverity.MEDIUM]: { color: "bg-yellow-100 text-yellow-800" },
      [IncidentSeverity.HIGH]: { color: "bg-orange-100 text-orange-800" },
      [IncidentSeverity.CRITICAL]: { color: "bg-red-100 text-red-800" }
    };
    const config = variants[severity];
    return <Badge className={config.color}>{severity}</Badge>;
  };

  const getTypeLabel = (type: RequestType | IncidentType): string => {
    const requestLabels: Record<string, string> = {
      [RequestType.MAINTENANCE]: "Maintenance",
      [RequestType.CLEANING]: "Cleaning",
      [RequestType.SECURITY]: "Security",
      [RequestType.IT_SUPPORT]: "IT Support",
      [RequestType.FACILITIES]: "Facilities",
      [RequestType.OTHER]: "Other"
    };
    
    const incidentLabels: Record<string, string> = {
      [IncidentType.SAFETY]: "Safety",
      [IncidentType.SECURITY]: "Security",
      [IncidentType.EMERGENCY]: "Emergency",
      [IncidentType.EQUIPMENT_FAILURE]: "Equipment Failure",
      [IncidentType.ENVIRONMENTAL]: "Environmental",
      [IncidentType.OTHER]: "Other"
    };
    
    return requestLabels[type] || incidentLabels[type] || type;
  };

  const exportData = () => {
    const dataToExport = activeTab === "requests" ? filteredRequests : filteredIncidents;
    const csvContent = [
      ["ID", "Title", "Type", "Status", "Priority/Severity", "Location", "Date", "Description"],
      ...dataToExport.map(item => [
        item.id,
        item.title,
        getTypeLabel(item.type),
        item.status,
        'priority' in item ? item.priority : item.severity,
        item.location.branch + (item.location.room ? ` - ${item.location.room}` : ''),
        new Date('submittedAt' in item ? item.submittedAt : item.reportedAt).toLocaleDateString(),
        item.description.substring(0, 100) + (item.description.length > 100 ? '...' : '')
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Request History</h1>
          </div>
          <p className="text-muted-foreground">
            Complete history of your requests and incident reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backButtonText}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">{stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              All time submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incident Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">{stats.totalIncidents}</div>
            <p className="text-xs text-muted-foreground">
              Safety incidents reported
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">{stats.completedRequests}</div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">{stats.inProgressRequests}</div>
            <p className="text-xs text-muted-foreground">
              Currently being processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">{stats.avgResolutionTime.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Days to complete
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
          <div className="grid gap-4 md:grid-cols-6">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search</Label>
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
            <div>
              <Label htmlFor="status-filter">Status</Label>
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
            <div>
              <Label htmlFor="type-filter">Type</Label>
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
                  <SelectItem value={IncidentType.SAFETY}>Safety</SelectItem>
                  <SelectItem value={IncidentType.EMERGENCY}>Emergency</SelectItem>
                  <SelectItem value={IncidentType.EQUIPMENT_FAILURE}>Equipment Failure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority-filter">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value={RequestPriority.LOW}>Low</SelectItem>
                  <SelectItem value={RequestPriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={RequestPriority.HIGH}>High</SelectItem>
                  <SelectItem value={RequestPriority.URGENT}>Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date-filter">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="quarter">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Requests and Incidents */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">
            Requests ({filteredRequests.length})
          </TabsTrigger>
          <TabsTrigger value="incidents">
            Incidents ({filteredIncidents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Requests</CardTitle>
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
                    <TableHead>Completed</TableHead>
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
                        {request.actualCompletion ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(request.actualCompletion).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
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
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No requests found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all" || typeFilter !== "all" || dateRange !== "all"
                      ? "Try adjusting your filters or search terms."
                      : "You haven't submitted any requests yet."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>Incident Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead>Resolved</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{incident.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {incident.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getTypeLabel(incident.type)}</Badge>
                      </TableCell>
                      <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                      <TableCell>{getStatusBadge(incident.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {incident.location.branch}
                          {incident.location.room && ` - ${incident.location.room}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(incident.reportedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {incident.resolvedAt ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(incident.resolvedAt).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
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
              
              {filteredIncidents.length === 0 && (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No incidents found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all" || typeFilter !== "all" || dateRange !== "all"
                      ? "Try adjusting your filters or search terms."
                      : "You haven't reported any incidents yet."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestHistory;
