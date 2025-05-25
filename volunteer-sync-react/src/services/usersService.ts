// Users Service
import apiClient, { ApiResponse, PaginatedResponse } from "./api";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  age: number;
  gender: string;
  location: string;
  interests: string[];
  availability: string[];
  skills: string[];
  profilePictureUrl: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
  age?: number;
  gender?: string;
  location?: string;
  interests?: string[];
  availability?: string[];
  skills?: string[];
}

export interface UserFilters {
  page?: number;
  pageSize?: number;
}

export interface SearchUsersFilters {
  searchTerm: string;
  page?: number;
  pageSize?: number;
}

class UsersService {
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(
        "/api/users/profile"
      );

      if (response.data.isSuccess) {
        // Update local storage with latest user data
        localStorage.setItem(
          "volunteerSyncUser",
          JSON.stringify(response.data.data)
        );
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch profile");
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }

  async updateProfile(profileData: UpdateProfileRequest): Promise<User> {
    try {
      const response = await apiClient.put<ApiResponse<User>>(
        "/api/users/profile",
        profileData
      );

      if (response.data.isSuccess) {
        // Update local storage with latest user data
        localStorage.setItem(
          "volunteerSyncUser",
          JSON.stringify(response.data.data)
        );
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(
        `/api/users/${id}`
      );

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch user");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
  }

  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<User>>
      >(`/api/users?${params.toString()}`);

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch users");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  }

  async searchUsers(
    filters: SearchUsersFilters
  ): Promise<PaginatedResponse<User>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<User>>
      >(`/api/users/search?${params.toString()}`);

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to search users");
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to search users"
      );
    }
  }
}

const usersService = new UsersService();
export default usersService;
