// API Configuration and Base Service
import axios, { AxiosInstance, AxiosResponse } from "axios";

// API Configuration - Using the correct base URL for the backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create axios instance with the correct configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Check both storage locations for token
    const token =
      localStorage.getItem("volunteerSyncToken") ||
      sessionStorage.getItem("volunteerSyncToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors by attempting token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Check both storage locations for refresh token
        const refreshToken =
          localStorage.getItem("volunteerSyncRefreshToken") ||
          sessionStorage.getItem("volunteerSyncRefreshToken");

        if (refreshToken) {
          // Use the correct endpoint with full path as per API docs: POST /api/auth/refresh
          const response = await axios.post(
            `${API_BASE_URL}/api/auth/refresh`,
            {
              refreshToken,
            }
          );

          // Extract the new token from the response
          const { token } = response.data.data;

          // Store in the same location as the original token
          if (localStorage.getItem("volunteerSyncRefreshToken")) {
            localStorage.setItem("volunteerSyncToken", token);
          } else {
            sessionStorage.setItem("volunteerSyncToken", token);
          }

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("volunteerSyncToken");
        localStorage.removeItem("volunteerSyncRefreshToken");
        localStorage.removeItem("volunteerSyncUser");

        sessionStorage.removeItem("volunteerSyncToken");
        sessionStorage.removeItem("volunteerSyncRefreshToken");
        sessionStorage.removeItem("volunteerSyncUser");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Standard API response interface
export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  errors: string[];
}

// Paginated response interface
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default apiClient;
