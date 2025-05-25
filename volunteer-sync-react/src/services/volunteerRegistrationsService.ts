// Volunteer Registrations Service
import apiClient, { ApiResponse, PaginatedResponse } from "./api";

export interface VolunteerRegistration {
  id: string;
  taskId: string;
  userId: string;
  applicationMessage: string;
  registrationDate: string;
  status: "Pending" | "Approved" | "Rejected";
  rejectionReason?: string;
  // Populated fields for API responses
  taskTitle: string;
  userName: string;
  userEmail: string;
}

export interface RegistrationFilters {
  page?: number;
  pageSize?: number;
}

export interface ApproveRegistrationRequest {
  // No body needed for approval
}

export interface RejectRegistrationRequest {
  reason: string;
}

class VolunteerRegistrationsService {
  async getAllRegistrations(
    filters: RegistrationFilters = {}
  ): Promise<PaginatedResponse<VolunteerRegistration>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<VolunteerRegistration>>
      >(`/api/volunteers/registrations?${params.toString()}`);

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch registrations"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch registrations"
      );
    }
  }

  async getTaskRegistrations(
    taskId: string,
    filters: RegistrationFilters = {}
  ): Promise<PaginatedResponse<VolunteerRegistration>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<VolunteerRegistration>>
      >(`/api/volunteers/tasks/${taskId}/registrations?${params.toString()}`);

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch task registrations"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch task registrations"
      );
    }
  }

  async getUserRegistrations(
    userId: string,
    filters: RegistrationFilters = {}
  ): Promise<PaginatedResponse<VolunteerRegistration>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<VolunteerRegistration>>
      >(`/api/volunteers/users/${userId}/registrations?${params.toString()}`);

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch user registrations"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user registrations"
      );
    }
  }

  async approveRegistration(registrationId: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        `/api/volunteers/registrations/${registrationId}/approve`
      );

      if (!response.data.isSuccess) {
        throw new Error(
          response.data.message || "Failed to approve registration"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to approve registration"
      );
    }
  }

  async rejectRegistration(
    registrationId: string,
    reason: string
  ): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        `/api/volunteers/registrations/${registrationId}/reject`,
        { reason }
      );

      if (!response.data.isSuccess) {
        throw new Error(
          response.data.message || "Failed to reject registration"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to reject registration"
      );
    }
  }
}

const volunteerRegistrationsService = new VolunteerRegistrationsService();
export default volunteerRegistrationsService;
