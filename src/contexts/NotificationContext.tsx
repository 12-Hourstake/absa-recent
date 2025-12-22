import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Notification,
  NotificationContextType,
  NotificationType,
  NotificationPriority,
} from "@/types/notification";
import { NotificationService } from "@/services/notificationService";



const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // TODO: Replace with API call to fetch notifications
    const loadNotifications = async () => {
      try {
        // Load from localStorage as fallback until API is integrated
        const savedNotifications = localStorage.getItem("notifications");
        if (savedNotifications) {
          const parsed = JSON.parse(savedNotifications);
          const notificationsWithDates = parsed.map((notif: Notification) => ({
            ...notif,
            timestamp: new Date(notif.timestamp),
          }));
          setNotifications(notificationsWithDates);
        } else {
          // Start with empty notifications array - ready for API data
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
        setNotifications([]);
      }
    };

    loadNotifications();
  }, []);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "isRead">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      isRead: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem("notifications");
  };

  // API integration functions
  const loadNotificationsFromAPI = async () => {
    try {
      const notifications = await NotificationService.getNotifications();
      setNotifications(notifications);
    } catch (error) {
      console.error("Failed to load notifications from API:", error);
    }
  };

  const markAsReadAPI = async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
      markAsRead(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const deleteNotificationAPI = async (notificationId: string) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      deleteNotification(notificationId);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    // API integration functions
    loadNotificationsFromAPI,
    markAsReadAPI,
    deleteNotificationAPI,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
