// Notifications Service
import apiClient, { ApiResponse, PaginatedResponse } from "./api";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | "Info"
    | "Success"
    | "Warning"
    | "Error"
    | "TaskUpdate"
    | "RegistrationUpdate";
  isRead: boolean;
  createdAt: string;
  projectId?: string;
  actionUrl?: string;
  icon?: string;
}

export interface NotificationFilters {
  page?: number;
  pageSize?: number;
  isRead?: boolean;
}

class NotificationsService {
  async getNotifications(
    filters: NotificationFilters = {}
  ): Promise<PaginatedResponse<Notification>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<Notification>>
      >(`/api/notifications?${params.toString()}`);

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch notifications"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(
        `/api/notifications/${id}/read`
      );

      if (!response.data.isSuccess) {
        throw new Error(
          response.data.message || "Failed to mark notification as read"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(
        "/api/notifications/mark-all-read"
      );

      if (!response.data.isSuccess) {
        throw new Error(
          response.data.message || "Failed to mark all notifications as read"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to mark all notifications as read"
      );
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<number>>(
        "/api/notifications/unread-count"
      );

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch unread count"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch unread count"
      );
    }
  }
}

const notificationsService = new NotificationsService();
export default notificationsService;
