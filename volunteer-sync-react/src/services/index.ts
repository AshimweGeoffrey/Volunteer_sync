// Services Index - Export all services for easy importing
export { default as authService } from "./authService";
export { default as usersService } from "./usersService";
export { default as tasksService } from "./tasksService";
export { default as notificationsService } from "./notificationsService";
export { default as volunteerRegistrationsService } from "./volunteerRegistrationsService";
export { default as organizationsService } from "./organizationsService";
export { default as statsService } from "./statsService";
export { default as imageService } from "./imageService";

// Export types
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "./authService";
export type { User, UpdateProfileRequest } from "./usersService";
export type {
  Task,
  CreateTaskRequest,
  TaskFilters,
  RegistrationRequest,
} from "./tasksService";
export type { Notification, NotificationFilters } from "./notificationsService";
export type { VolunteerRegistration } from "./volunteerRegistrationsService";
export type {
  Organization,
  CreateOrganizationRequest,
  OrganizationFilters,
} from "./organizationsService";
export type { DashboardStats, RecentActivity } from "./statsService";
export type { ApiResponse, PaginatedResponse } from "./api";
