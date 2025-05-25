// Authentication Service
import apiClient, { ApiResponse } from "./api";

/**
 * Login request structure as per backend API specification
 * POST /api/auth/login
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean; // Optional parameter for persistent login
}

/**
 * Register request structure as per backend API specification
 * POST /api/auth/register
 */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
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
  };
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Using the correct endpoint as per API documentation: POST /api/auth/login
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        "/api/auth/login",
        credentials
      );

      if (response.data.isSuccess) {
        const { token, refreshToken, user } = response.data.data;

        // Determine storage method based on rememberMe flag
        const storageMethod = credentials.rememberMe
          ? localStorage
          : sessionStorage;

        // Store tokens and user data
        storageMethod.setItem("volunteerSyncToken", token);
        storageMethod.setItem("volunteerSyncRefreshToken", refreshToken);
        storageMethod.setItem("volunteerSyncUser", JSON.stringify(user));

        return response.data.data;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Using the correct endpoint as per API documentation: POST /api/auth/register
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        "/api/auth/register",
        userData
      );

      if (response.data.isSuccess) {
        const { token, refreshToken, user } = response.data.data;

        // Store tokens and user data
        localStorage.setItem("volunteerSyncToken", token);
        localStorage.setItem("volunteerSyncRefreshToken", refreshToken);
        localStorage.setItem("volunteerSyncUser", JSON.stringify(user));

        return response.data.data;
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  }

  async logout(): Promise<void> {
    try {
      // Using the correct endpoint as per API documentation: POST /api/auth/logout
      await apiClient.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear both storage locations regardless of API call success
      localStorage.removeItem("volunteerSyncToken");
      localStorage.removeItem("volunteerSyncRefreshToken");
      localStorage.removeItem("volunteerSyncUser");

      sessionStorage.removeItem("volunteerSyncToken");
      sessionStorage.removeItem("volunteerSyncRefreshToken");
      sessionStorage.removeItem("volunteerSyncUser");
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem("volunteerSyncRefreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Using the correct endpoint as per API documentation: POST /api/auth/refresh
      const response = await apiClient.post<ApiResponse<{ token: string }>>(
        "/api/auth/refresh",
        {
          refreshToken,
        }
      );

      if (response.data.isSuccess) {
        const { token } = response.data.data;
        localStorage.setItem("volunteerSyncToken", token);
        return token;
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      this.logout(); // Clear everything if refresh fails
      throw error;
    }
  }

  isAuthenticated(): boolean {
    // Check both storage locations for token
    return !!(
      localStorage.getItem("volunteerSyncToken") ||
      sessionStorage.getItem("volunteerSyncToken")
    );
  }

  getCurrentUser(): AuthResponse["user"] | null {
    // Try to get user from both storage locations
    const localUserStr = localStorage.getItem("volunteerSyncUser");
    const sessionUserStr = sessionStorage.getItem("volunteerSyncUser");
    const userStr = localUserStr || sessionUserStr;
    return userStr ? JSON.parse(userStr) : null;
  }
}

const authService = new AuthService();
export default authService;
