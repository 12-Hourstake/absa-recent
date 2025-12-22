export enum NotificationType {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
  WORK_ORDER = "work_order",
  MAINTENANCE = "maintenance",
  INCIDENT = "incident",
  REQUEST = "request",
  VENDOR = "vendor",
  ASSET = "asset",
  USER = "user",
  SYSTEM = "system",
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  metadata?: {
    workOrderId?: string;
    assetId?: string;
    requestId?: string;
    userId?: string;
    [key: string]: any;
  };
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  // API integration functions
  loadNotificationsFromAPI?: () => Promise<void>;
  markAsReadAPI?: (notificationId: string) => Promise<void>;
  deleteNotificationAPI?: (notificationId: string) => Promise<void>;
}
