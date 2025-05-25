// Organizations Service
import apiClient, { ApiResponse, PaginatedResponse } from "./api";

export interface Organization {
  id: string;
  name: string;
  description: string;
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  logoUrl: string;
  categories: string[];
  isVerified: boolean;
  isActive: boolean;
  memberCount: number;
  taskCount: number;
  createdAt: string;
}

export interface CreateOrganizationRequest {
  name: string;
  description: string;
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  logoUrl?: string;
  categories: string[];
}

export interface OrganizationFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  verified?: boolean;
}

export interface SearchOrganizationsFilters {
  searchTerm: string;
  page?: number;
  pageSize?: number;
}

class OrganizationsService {
  async getOrganizations(
    filters: OrganizationFilters = {}
  ): Promise<PaginatedResponse<Organization>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<Organization>>
      >(`/api/organizations?${params.toString()}`);

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch organizations"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch organizations"
      );
    }
  }

  async getOrganization(id: string): Promise<Organization> {
    try {
      const response = await apiClient.get<ApiResponse<Organization>>(
        `/api/organizations/${id}`
      );

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch organization"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch organization"
      );
    }
  }

  async createOrganization(
    organizationData: CreateOrganizationRequest
  ): Promise<Organization> {
    try {
      const response = await apiClient.post<ApiResponse<Organization>>(
        "/api/organizations",
        organizationData
      );

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to create organization"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create organization"
      );
    }
  }

  async updateOrganization(
    id: string,
    organizationData: Partial<CreateOrganizationRequest>
  ): Promise<Organization> {
    try {
      const response = await apiClient.put<ApiResponse<Organization>>(
        `/api/organizations/${id}`,
        organizationData
      );

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to update organization"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update organization"
      );
    }
  }

  async deleteOrganization(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/organizations/${id}`
      );

      if (!response.data.isSuccess) {
        throw new Error(
          response.data.message || "Failed to delete organization"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete organization"
      );
    }
  }

  async searchOrganizations(
    filters: SearchOrganizationsFilters
  ): Promise<PaginatedResponse<Organization>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<
        ApiResponse<PaginatedResponse<Organization>>
      >(`/organizations/search?${params.toString()}`);

      if (response.data.isSuccess) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to search organizations"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to search organizations"
      );
    }
  }

  async verifyOrganization(id: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        `/organizations/${id}/verify`
      );

      if (!response.data.isSuccess) {
        throw new Error(
          response.data.message || "Failed to verify organization"
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to verify organization"
      );
    }
  }
}

const organizationsService = new OrganizationsService();
export default organizationsService;
