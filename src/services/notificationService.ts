import { Notification } from "@/types/notification";

// Base API URL - update this with your actual API endpoint
const API_BASE_URL = "http://localhost:3001/api";

export class NotificationService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        // TODO: Add authentication headers
        // Authorization: `Bearer ${getAuthToken()}`,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Fetch all notifications for the current user
  static async getNotifications(): Promise<Notification[]> {
    return this.request<Notification[]>("/notifications");
  }

  // Mark a notification as read
  static async markAsRead(notificationId: string): Promise<void> {
    await this.request(`/notifications/${notificationId}/read`, {
      method: "PATCH",
    });
  }

  // Delete a notification
  static async deleteNotification(notificationId: string): Promise<void> {
    await this.request(`/notifications/${notificationId}`, {
      method: "DELETE",
    });
  }

  // Clear all notifications
  static async clearAllNotifications(): Promise<void> {
    await this.request("/notifications", {
      method: "DELETE",
    });
  }
}