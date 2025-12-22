import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bell,
  Trash2,
  Check,
  X,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  Wrench,
  ClipboardList,
  Package,
  Users,
  Settings,
  FileText,
  ArrowLeft,
  Eye,
  Clock,
} from "lucide-react";
import { NotificationType, NotificationPriority, Notification } from "@/types/notification";
import { formatDistanceToNow, format } from "date-fns";

const Notifications = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "read" && notification.isRead) ||
      (statusFilter === "unread" && !notification.isRead);

    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const sortedNotifications = [...filteredNotifications].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  const getNotificationIcon = (type: NotificationType) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case NotificationType.SUCCESS:
        return <CheckCircle2 className={`${iconClass} text-green-600`} />;
      case NotificationType.ERROR:
        return <AlertCircle className={`${iconClass} text-red-600`} />;
      case NotificationType.WARNING:
        return <AlertTriangle className={`${iconClass} text-yellow-600`} />;
      case NotificationType.WORK_ORDER:
        return <ClipboardList className={`${iconClass} text-blue-600`} />;
      case NotificationType.MAINTENANCE:
        return <Wrench className={`${iconClass} text-purple-600`} />;
      case NotificationType.INCIDENT:
        return <AlertCircle className={`${iconClass} text-red-600`} />;
      case NotificationType.REQUEST:
        return <FileText className={`${iconClass} text-indigo-600`} />;
      case NotificationType.ASSET:
        return <Package className={`${iconClass} text-red-800`} />;
      case NotificationType.VENDOR:
        return <Users className={`${iconClass} text-orange-600`} />;
      case NotificationType.USER:
        return <Users className={`${iconClass} text-gray-600`} />;
      case NotificationType.SYSTEM:
        return <Settings className={`${iconClass} text-gray-600`} />;
      default:
        return <Info className={`${iconClass} text-blue-600`} />;
    }
  };

  const getPriorityBadge = (priority: NotificationPriority) => {
    const variants = {
      [NotificationPriority.URGENT]: { color: "bg-red-100 text-red-800", label: "Urgent" },
      [NotificationPriority.HIGH]: { color: "bg-orange-100 text-orange-800", label: "High" },
      [NotificationPriority.MEDIUM]: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
      [NotificationPriority.LOW]: { color: "bg-green-100 text-green-800", label: "Low" },
    };
    const config = variants[priority];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.URGENT:
        return "border-l-4 border-l-red-500";
      case NotificationPriority.HIGH:
        return "border-l-4 border-l-orange-500";
      case NotificationPriority.MEDIUM:
        return "border-l-4 border-l-yellow-500";
      case NotificationPriority.LOW:
        return "border-l-4 border-l-green-500";
      default:
        return "border-l-4 border-l-gray-300";
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setSelectedNotification(notification);
  };

  const handleViewAction = (notification: Notification) => {
    if (notification.actionUrl) {
      if (!notification.isRead) {
        markAsRead(notification.id);
      }
      navigate(notification.actionUrl);
    }
  };

  const handleDelete = (notificationId: string) => {
    setNotificationToDelete(notificationId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (notificationToDelete) {
      deleteNotification(notificationToDelete);
      if (selectedNotification?.id === notificationToDelete) {
        setSelectedNotification(null);
      }
      setDeleteDialogOpen(false);
      setNotificationToDelete(null);
    }
  };

  const confirmClearAll = () => {
    clearAllNotifications();
    setSelectedNotification(null);
    setClearAllDialogOpen(false);
  };

  return (
    <div className="mx-auto max-w-[1600px] flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">All Notifications</h1>
          </div>
          <p className="text-muted-foreground">
            Manage and view all your notifications in one place
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
            <span className="text-[18px]">⋮⋮</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Total</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-900">{notifications.length}</h4>
            </div>
            <div className="rounded-lg bg-red-50 p-2 text-red-600">
              <Bell className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">All notifications</span>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
            <span className="text-[18px]">⋮⋮</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Unread</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-900">{unreadCount}</h4>
            </div>
            <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-orange-600">Requires attention</span>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
            <span className="text-[18px]">⋮⋮</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Read</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-900">{notifications.length - unreadCount}</h4>
            </div>
            <div className="rounded-lg bg-green-50 p-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-green-600">Already viewed</span>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between rounded-xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 cursor-move text-slate-400">
            <span className="text-[18px]">⋮⋮</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Urgent</p>
              <h4 className="mt-2 text-3xl font-bold text-slate-900">{notifications.filter((n) => n.priority === NotificationPriority.URGENT).length}</h4>
            </div>
            <div className="rounded-lg bg-red-50 p-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-red-600">High priority</span>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Actions</CardTitle>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <Check className="mr-2 h-4 w-4" />
                  Mark All as Read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setClearAllDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type-filter">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={NotificationType.WORK_ORDER}>Work Order</SelectItem>
                  <SelectItem value={NotificationType.MAINTENANCE}>Maintenance</SelectItem>
                  <SelectItem value={NotificationType.INCIDENT}>Incident</SelectItem>
                  <SelectItem value={NotificationType.REQUEST}>Request</SelectItem>
                  <SelectItem value={NotificationType.ASSET}>Asset</SelectItem>
                  <SelectItem value={NotificationType.VENDOR}>Vendor</SelectItem>
                  <SelectItem value={NotificationType.SYSTEM}>System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority-filter">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value={NotificationPriority.URGENT}>Urgent</SelectItem>
                  <SelectItem value={NotificationPriority.HIGH}>High</SelectItem>
                  <SelectItem value={NotificationPriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={NotificationPriority.LOW}>Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* List View */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Notifications ({filteredNotifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                <p className="text-muted-foreground">
                  {notifications.length === 0
                    ? "You don't have any notifications yet."
                    : "Try adjusting your filters."}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {sortedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      !notification.isRead ? "bg-blue-50/50 border-blue-200" : "hover:bg-accent"
                    } ${
                      selectedNotification?.id === notification.id
                        ? "ring-2 ring-primary"
                        : ""
                    } ${getPriorityColor(notification.priority)}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm line-clamp-1">
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <Badge
                                  variant="default"
                                  className="h-2 w-2 p-0 rounded-full"
                                />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            title="Delete notification"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          {getPriorityBadge(notification.priority)}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatDistanceToNow(notification.timestamp, {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail View */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNotification ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(selectedNotification.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{selectedNotification.title}</h3>
                    {getPriorityBadge(selectedNotification.priority)}
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Message</Label>
                    <p className="text-sm mt-1">{selectedNotification.message}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Type</Label>
                    <p className="text-sm mt-1 capitalize">
                      {selectedNotification.type.replace(/_/g, " ")}
                    </p>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Timestamp</Label>
                    <p className="text-sm mt-1">
                      {format(selectedNotification.timestamp, "PPpp")}
                    </p>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge variant={selectedNotification.isRead ? "secondary" : "default"}>
                        {selectedNotification.isRead ? "Read" : "Unread"}
                      </Badge>
                    </div>
                  </div>

                  {selectedNotification.metadata && Object.keys(selectedNotification.metadata).length > 0 && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Additional Info</Label>
                      <div className="mt-1 space-y-1">
                        {Object.entries(selectedNotification.metadata).map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <span className="font-medium">{key}:</span> {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t space-y-2">
                  {!selectedNotification.isRead && (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => markAsRead(selectedNotification.id)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Read
                    </Button>
                  )}
                  {selectedNotification.actionUrl && (
                    <Button
                      className="w-full"
                      onClick={() => handleViewAction(selectedNotification)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  )}
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => handleDelete(selectedNotification.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Notification
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Select a notification to view details
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Notification</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this notification? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear All Confirmation Dialog */}
      <Dialog open={clearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Notifications</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all notifications? This will permanently delete
              all {notifications.length} notification(s). This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmClearAll}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notifications;
