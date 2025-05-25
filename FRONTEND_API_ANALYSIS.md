# Frontend API Requirements Analysis

## Overview

This document analyzes the VolunteerSync React frontend to identify all required backend API endpoints, data models, and expected responses. Based on the analysis of all frontend components, here is the complete API specification that the backend needs to implement.

## Frontend Components Analysis

### Analyzed Components

1. **Authentication Components**: Login, Signup, ProtectedRoute
2. **User Management**: UserProfile, EditProfile, UserContext
3. **Project Management**: ProjectList, ProjectDetails, OnmapList
4. **Core Features**: Header, NotificationComponent, Home
5. **Data Models**: Types definitions, Mock data structures

## Required Data Models

### User Model

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  joinedDate: string;
  bio: string;
  age: number;
  gender: string;
  interests: string[];
  availability: string[];
  badges: Badge[];
  completedProjects: number;
  rating: number;
  notifications: Notification[];
  unreadNotifications: number;
  role?: "User" | "OrganizationAdmin" | "SuperAdmin";
  skills?: string[];
  isActive?: boolean;
  organizationId?: string;
  lastLoginAt?: string;
}
```

### VolunteerProject Model

```typescript
interface VolunteerProject {
  id: string;
  title: string;
  organization: string;
  location: string;
  district: string;
  sector: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  duration: string;
  startDate: string;
  endDate: string;
  volunteersNeeded: number;
  volunteersRegistered: number;
  categories: string[];
  image: string;
  status: "active" | "completed" | "upcoming";
  requirements: string[];
  benefits: string[];
  contactEmail: string;
  contactPhone: string;
  // Additional backend fields
  organizationId?: string;
  createdById?: string;
  maxVolunteers?: number;
  currentVolunteers?: number;
  applicationDeadline?: string;
  tags?: string[];
  isUrgent?: boolean;
  skills?: string[];
}
```

### Organization Model

```typescript
interface Organization {
  id: string;
  name: string;
  type: "NGO" | "Government" | "Community" | "International" | "Religious";
  location: string;
  description: string;
  website?: string;
  email: string;
  phone: string;
  logo: string;
  projectsCount: number;
  volunteersCount: number;
  isVerified?: boolean;
  isActive?: boolean;
  memberCount?: number;
  taskCount?: number;
  createdAt?: string;
}
```

### Notification Model

```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "project" | "application";
  isRead: boolean;
  createdAt: string;
  projectId?: string;
  actionUrl?: string;
  icon?: string;
}
```

### Badge Model

```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
  type: "bronze" | "silver" | "gold";
}
```

## Required API Endpoints

### 1. Authentication Endpoints

#### POST /api/auth/login

- **Frontend Usage**: Login component form submission
- **Request Body**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- **Response**:

```json
{
  "isSuccess": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token",
    "refreshToken": "refresh-token",
    "user": {
      /* User object */
    },
    "expiresIn": 3600
  },
  "errors": []
}
```

#### POST /api/auth/register

- **Frontend Usage**: Signup component form submission
- **Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phoneNumber": "+250788123456"
}
```

- **Response**: Same as login response

#### POST /api/auth/logout

- **Frontend Usage**: Header logout functionality
- **Headers**: Authorization: Bearer {token}
- **Response**:

```json
{
  "isSuccess": true,
  "message": "Logout successful",
  "data": true,
  "errors": []
}
```

### 2. User Management Endpoints

#### GET /api/users/profile

- **Frontend Usage**: UserProfile component, UserContext initialization
- **Headers**: Authorization: Bearer {token}
- **Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    /* User object with full profile */
  },
  "errors": []
}
```

#### PUT /api/users/profile

- **Frontend Usage**: EditProfile component save functionality
- **Headers**: Authorization: Bearer {token}
- **Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+250788123456",
  "bio": "Updated bio",
  "age": 28,
  "gender": "Male",
  "location": "Kigali, Rwanda",
  "interests": ["Environment", "Education"],
  "availability": ["Weekends", "Evenings"],
  "skills": ["Teaching", "Project Management"]
}
```

- **Response**: Same as GET profile

### 3. Project/Task Management Endpoints

#### GET /api/tasks

- **Frontend Usage**: ProjectList, OnmapList components for project listings
- **Query Parameters**:
  - page (default: 1)
  - pageSize (default: 10)
  - status (active, completed, upcoming)
  - search (search term)
- **Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "items": [
      /* Array of VolunteerProject objects */
    ],
    "totalCount": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "errors": []
}
```

#### GET /api/tasks/{id}

- **Frontend Usage**: ProjectDetails component for individual project view
- **Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    /* VolunteerProject object */
  },
  "errors": []
}
```

#### POST /api/tasks

- **Frontend Usage**: ProjectList create modal functionality
- **Headers**: Authorization: Bearer {token}
- **Request Body**:

```json
{
  "title": "Project Title",
  "description": "Project description",
  "location": {
    "street": "Street address",
    "city": "City",
    "country": "Rwanda",
    "latitude": -1.9706,
    "longitude": 30.1044
  },
  "startDate": "2024-06-01T09:00:00Z",
  "endDate": "2024-06-01T17:00:00Z",
  "maxVolunteers": 20,
  "category": 1,
  "requirements": ["Requirement 1", "Requirement 2"],
  "skills": ["Skill 1", "Skill 2"],
  "organizationId": "org-id"
}
```

#### POST /api/tasks/{id}/register

- **Frontend Usage**: ProjectDetails apply button, OnmapList join project
- **Headers**: Authorization: Bearer {token}
- **Request Body**:

```json
{
  "applicationMessage": "I'm interested in volunteering for this project"
}
```

- **Response**:

```json
{
  "isSuccess": true,
  "message": "Registration successful",
  "data": {
    "id": "registration-id",
    "taskId": "task-id",
    "userId": "user-id",
    "status": 0,
    "registrationDate": "2024-03-15T10:30:00Z"
  },
  "errors": []
}
```

### 4. Notification Management

#### GET /api/notifications

- **Frontend Usage**: NotificationComponent, Header notification bell
- **Headers**: Authorization: Bearer {token}
- **Query Parameters**:
  - page (default: 1)
  - pageSize (default: 10)
  - isRead (filter by read status)
- **Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "items": [
      /* Array of Notification objects */
    ],
    "unreadCount": 5,
    "totalCount": 25
  },
  "errors": []
}
```

#### PUT /api/notifications/{id}/read

- **Frontend Usage**: NotificationComponent mark as read functionality
- **Headers**: Authorization: Bearer {token}
- **Response**:

```json
{
  "isSuccess": true,
  "message": "Notification marked as read",
  "data": true,
  "errors": []
}
```

#### PUT /api/notifications/mark-all-read

- **Frontend Usage**: NotificationComponent mark all as read
- **Headers**: Authorization: Bearer {token}
- **Response**:

```json
{
  "isSuccess": true,
  "message": "All notifications marked as read",
  "data": true,
  "errors": []
}
```

### 5. Organization Management

#### GET /api/organizations

- **Frontend Usage**: Project listings show organization info
- **Query Parameters**:
  - page, pageSize for pagination
  - search for organization search
- **Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "items": [
      /* Array of Organization objects */
    ],
    "totalCount": 50,
    "page": 1,
    "pageSize": 10
  },
  "errors": []
}
```

### 6. Dashboard/Stats Endpoints

#### GET /api/stats/dashboard

- **Frontend Usage**: Home component statistics display
- **Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "totalProjects": 45,
    "totalVolunteers": 2834,
    "totalOrganizations": 28,
    "completedProjects": 156
  },
  "errors": []
}
```

## Frontend Authentication Flow

### Authentication State Management

1. **Initial Load**: Check localStorage for existing token
2. **Login Process**: Store token and user data in localStorage + context
3. **Token Validation**: Verify token on app initialization
4. **Auto Logout**: Clear token on expiry or manual logout
5. **Route Protection**: Redirect to login if not authenticated

### Key Authentication Features

- JWT token storage in localStorage
- Automatic token validation on app load
- Protected route wrapper component
- Persistent login state across browser sessions
- Proper cleanup on logout

## Frontend Data Flow Patterns

### 1. Project Management Flow

```
ProjectList → GET /api/tasks → Display projects
ProjectList (Create) → POST /api/tasks → Refresh list
ProjectDetails → GET /api/tasks/{id} → Show details
ProjectDetails (Apply) → POST /api/tasks/{id}/register → Update UI + notification
```

### 2. User Profile Flow

```
UserProfile → GET /api/users/profile → Display profile
EditProfile → PUT /api/users/profile → Update profile + notification
```

### 3. Notification Flow

```
Header → GET /api/notifications → Show notification count
NotificationComponent → GET /api/notifications → List notifications
NotificationComponent (Mark Read) → PUT /api/notifications/{id}/read → Update status
```

## Error Handling Requirements

### Frontend Expects Consistent Error Format

```json
{
  "isSuccess": false,
  "message": "Error description",
  "data": null,
  "errors": ["Specific error message 1", "Specific error message 2"]
}
```

### HTTP Status Codes Expected

- 200: Success
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication required)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

## File Upload Requirements

### Profile Image Upload

- **Endpoint**: PUT /api/users/profile (with multipart form data)
- **Frontend Usage**: EditProfile component image upload
- **Expected**: Base64 string or file upload support

### Project Image Upload

- **Endpoint**: POST /api/tasks (with image URLs or file upload)
- **Frontend Usage**: Project creation with images

## Search and Filtering Requirements

### Project Search

- **Full-text search** across title, description, location
- **Category filtering** by project categories
- **Status filtering** (active, completed, upcoming)
- **Location-based filtering** by district/sector

### Organization Search

- **Search by name** and description
- **Filter by organization type**

## Pagination Standards

### Expected Pagination Response

```json
{
  "items": [
    /* Array of items */
  ],
  "totalCount": 100,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

## Real-time Features (Future Enhancement)

### Notification Updates

- WebSocket or Server-Sent Events for real-time notifications
- Live updates when project status changes
- Real-time volunteer registration updates

## Summary

The frontend is well-structured with a clear separation of concerns:

- **Authentication**: JWT-based with persistent storage
- **State Management**: React Context for user and notifications
- **Route Protection**: Higher-order component for protected routes
- **API Integration**: Consistent error handling and loading states
- **User Experience**: Notifications, loading indicators, form validation

The backend needs to implement all the above endpoints with the exact response formats expected by the frontend components to ensure seamless integration.
