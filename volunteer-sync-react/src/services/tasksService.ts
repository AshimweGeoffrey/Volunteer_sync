// Tasks Service
import apiClient, { ApiResponse, PaginatedResponse } from "./api";

export interface Task {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  maxVolunteers: number;
  currentVolunteers: number;
  category: number;
  requirements: string[];
  requiredSkills: string[];
  tags: string[];
  isUrgent: boolean;
  isActive: boolean;
  applicationDeadline: string;
  createdBy: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  organizationName?: string;
  organizationLogo?: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  maxVolunteers: number;
  category: number;
  requirements: string[];
  skills: string[];
  tags: string[];
  isUrgent: boolean;
  applicationDeadline: string;
}

export interface TaskFilters {
  page?: number;
  pageSize?: number;
  status?: string;
  category?: number;
  search?: string;
  organizationId?: string;
}

export interface RegistrationRequest {
  applicationMessage: string;
}

class TasksService {
  async getTasks(filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<Task>>
      >(`/api/tasks?${params.toString()}`);

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch tasks");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch tasks");
    }
  }

  async getTask(id: string): Promise<Task> {
    try {
      const response = await apiClient.get<ApiResponse<Task>>(
        `/api/tasks/${id}`
      );

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch task");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch task");
    }
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const response = await apiClient.post<ApiResponse<Task>>(
        "/api/tasks",
        taskData
      );

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to create task");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create task");
    }
  }

  async updateTask(
    id: string,
    taskData: Partial<CreateTaskRequest>
  ): Promise<Task> {
    try {
      const response = await apiClient.put<ApiResponse<Task>>(
        `/api/tasks/${id}`,
        taskData
      );

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to update task");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update task");
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/api/tasks/${id}`
      );

      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "Failed to delete task");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete task");
    }
  }

  async searchTasks(
    searchTerm: string,
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<Task>> {
    try {
      const params = new URLSearchParams({
        searchTerm,
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<Task>>
      >(`/api/tasks/search?${params.toString()}`);

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to search tasks");
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to search tasks"
      );
    }
  }

  async getFeaturedTasks(): Promise<Task[]> {
    try {
      const response = await apiClient.get<ApiResponse<Task[]>>(
        "/api/tasks/featured"
      );

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch featured tasks"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch featured tasks"
      );
    }
  }

  async registerForTask(
    taskId: string,
    registrationData: RegistrationRequest
  ): Promise<{ id: string }> {
    try {
      const response = await apiClient.post<ApiResponse<{ id: string }>>(
        `/api/tasks/${taskId}/register`,
        registrationData
      );

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to register for task");
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to register for task"
      );
    }
  }

  async unregisterFromTask(taskId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/api/tasks/${taskId}/register`
      );

      if (!response.data.isSuccess) {
        throw new Error(
          response.data.message || "Failed to unregister from task"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to unregister from task"
      );
    }
  }
}

const tasksService = new TasksService();
export default tasksService;
