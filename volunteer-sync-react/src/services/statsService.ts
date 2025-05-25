// Statistics Service
import apiClient, { ApiResponse } from "./api";

export interface DashboardStats {
  totalUsers: number;
  totalTasks: number;
  totalOrganizations: number;
  activeUsers: number;
  activeTasks: number;
  completedTasks: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  recentActivities: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  type:
    | "UserRegistered"
    | "TaskCreated"
    | "RegistrationApproved"
    | "OrganizationVerified";
  description: string;
  timestamp: string;
  userId?: string;
  taskId?: string;
  organizationId?: string;
}

class StatsService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<ApiResponse<DashboardStats>>(
        "/api/stats/dashboard"
      );

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch dashboard stats"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
}

const statsService = new StatsService();
export default statsService;
