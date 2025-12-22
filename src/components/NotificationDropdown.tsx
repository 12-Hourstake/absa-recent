import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { UserRole } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Check,
  Trash2,
  X,
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
} from "lucide-react";
import { NotificationType } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";

export const NotificationDropdown = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  // Get the correct notifications route based on user role
  const getNotificationsRoute = () => {
    if (!user) return "/notifications";
    switch (user.role) {
      case UserRole.ADMIN:
        return "/admin/notifications";
      case UserRole.COLLEAGUE_REQUESTER:
        return "/colleague/notifications";
      case UserRole.VENDOR:
        return "/vendor/notifications";
      default:
        return "/notifications";
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case NotificationType.SUCCESS:
        return <CheckCircle2 className={`${iconClass} text-green-600`} />;
      case NotificationType.ERROR:
        return <AlertCircle className={`${iconClass} text-red-600`} />;
      case NotificationType.WARNING:
        return <AlertTriangle className={`${iconClass} text-yellow-600`} />;
      case NotificationType.WORK_ORDER:
        return <ClipboardList className={`${iconClass} text-red-600`} />;
      case NotificationType.MAINTENANCE:
        return <Wrench className={`${iconClass} text-red-600`} />;
      case NotificationType.INCIDENT:
        return <AlertCircle className={`${iconClass} text-red-600`} />;
      case NotificationType.REQUEST:
        return <FileText className={`${iconClass} text-red-600`} />;
      case NotificationType.ASSET:
        return <Package className={`${iconClass} text-red-600`} />;
      case NotificationType.VENDOR:
        return <Users className={`${iconClass} text-orange-600`} />;
      case NotificationType.USER:
        return <Users className={`${iconClass} text-gray-600`} />;
      case NotificationType.SYSTEM:
        return <Settings className={`${iconClass} text-gray-600`} />;
      default:
        return <Info className={`${iconClass} text-red-600`} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-4 border-l-red-500";
      case "high":
        return "border-l-4 border-l-orange-500";
      case "medium":
        return "border-l-4 border-l-yellow-500";
      case "low":
        return "border-l-4 border-l-green-500";
      default:
        return "border-l-4 border-l-gray-300";
    }
  };

  const handleNotificationClick = (
    notificationId: string,
    actionUrl?: string
  ) => {
    markAsRead(notificationId);
    if (actionUrl) {
      navigate(actionUrl);
      setIsOpen(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} new</Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                title="Mark all as read"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                title="Clear all notifications"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="divide-y">
              {sortedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-accent cursor-pointer transition-colors ${
                    !notification.isRead ? "bg-red-50/50" : ""
                  } ${getPriorityColor(notification.priority)}`}
                  onClick={() =>
                    handleNotificationClick(
                      notification.id,
                      notification.actionUrl
                    )
                  }
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 shrink-0"
                          onClick={(e) => handleDelete(e, notification.id)}
                          title="Delete notification"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.timestamp, {
                            addSuffix: true,
                          })}
                        </span>
                        {!notification.isRead && (
                          <Badge
                            variant="default"
                            className="h-2 w-2 p-0 rounded-full"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  navigate(getNotificationsRoute());
                  setIsOpen(false);
                }}
              >
                View All Notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
