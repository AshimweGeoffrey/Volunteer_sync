# VolunteerSync Backend API Specification

## Overview

This document provides the complete API specification for the VolunteerSync backend based on frontend requirements analysis. All endpoints follow RESTful conventions and return consistent response formats.

## Base Configuration

### Base URL

```
Production: https://api.volunteersync.rw/api
Development: http://localhost:5000/api
```

### Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <jwt-token>
```

### Response Format

All API responses follow this structure:

```json
{
  "isSuccess": boolean,
  "message": string,
  "data": object | array | null,
  "errors": string[]
}
```

## Data Models

### User Model

```json
{
  "id": "string (MongoDB ObjectId)",
  "firstName": "string",
  "lastName": "string",
  "email": "string (unique)",
  "phoneNumber": "string",
  "role": "number (0=User, 1=OrganizationAdmin, 2=SuperAdmin)",
  "dateJoined": "ISO 8601 datetime",
  "isActive": "boolean",
  "organizationId": "string (optional)",
  "profileImageUrl": "string (optional)",
  "bio": "string (optional)",
  "age": "number (optional)",
  "gender": "string (optional)",
  "location": "string (optional)",
  "skills": "string[]",
  "interests": "string[]",
  "availability": "string[]",
  "completedProjects": "number",
  "rating": "number (0-5)",
  "badges": "Badge[]",
  "lastLoginAt": "ISO 8601 datetime"
}
```

### Task/Project Model

```json
{
  "id": "string (MongoDB ObjectId)",
  "title": "string",
  "description": "string",
  "startDate": "ISO 8601 datetime",
  "endDate": "ISO 8601 datetime",
  "location": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string",
    "latitude": "number",
    "longitude": "number"
  },
  "maxVolunteers": "number",
  "currentVolunteers": "number",
  "status": "number (0=Draft, 1=Active, 2=Completed, 3=Cancelled)",
  "category": "number (1=Environment, 2=Education, 3=Health, etc.)",
  "requirements": "string[]",
  "skills": "string[]",
  "organizationId": "string",
  "createdById": "string",
  "imageUrls": "string[]",
  "tags": "string[]",
  "isUrgent": "boolean",
  "applicationDeadline": "ISO 8601 datetime",
  "createdAt": "ISO 8601 datetime",
  "organizationName": "string (populated)",
  "createdByName": "string (populated)"
}
```

### Organization Model

```json
{
  "id": "string (MongoDB ObjectId)",
  "name": "string",
  "description": "string",
  "contactInfo": {
    "email": "string",
    "phone": "string",
    "website": "string (optional)"
  },
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string",
    "latitude": "number",
    "longitude": "number"
  },
  "logoUrl": "string (optional)",
  "categories": "string[]",
  "isVerified": "boolean",
  "isActive": "boolean",
  "memberCount": "number",
  "taskCount": "number",
  "createdAt": "ISO 8601 datetime"
}
```

### Volunteer Registration Model

```json
{
  "id": "string (MongoDB ObjectId)",
  "taskId": "string",
  "userId": "string",
  "applicationMessage": "string",
  "registrationDate": "ISO 8601 datetime",
  "status": "number (0=Pending, 1=Approved, 2=Rejected, 3=Completed)",
  "rejectionReason": "string (optional)",
  "taskTitle": "string (populated)",
  "userName": "string (populated)",
  "userEmail": "string (populated)"
}
```

### Notification Model

```json
{
  "id": "string (MongoDB ObjectId)",
  "userId": "string",
  "title": "string",
  "message": "string",
  "type": "string (info|success|warning|error|project|application)",
  "isRead": "boolean",
  "createdAt": "ISO 8601 datetime",
  "projectId": "string (optional)",
  "actionUrl": "string (optional)",
  "icon": "string (optional)"
}
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/login

**Description**: User login  
**Authentication**: None required

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-string",
    "refreshToken": "refresh-token-string",
    "user": {
      /* User object */
    },
    "expiresIn": 3600
  },
  "errors": []
}
```

**Error Response (401)**:

```json
{
  "isSuccess": false,
  "message": "Invalid credentials",
  "data": null,
  "errors": ["Email or password is incorrect"]
}
```

#### POST /api/auth/register

**Description**: User registration  
**Authentication**: None required

**Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phoneNumber": "+250788123456"
}
```

**Response (201)**:

```json
{
  "isSuccess": true,
  "message": "Registration successful",
  "data": {
    "token": "jwt-token-string",
    "refreshToken": "refresh-token-string",
    "user": {
      /* User object */
    },
    "expiresIn": 3600
  },
  "errors": []
}
```

#### POST /api/auth/refresh

**Description**: Refresh JWT token  
**Authentication**: None required

**Request Body**:

```json
{
  "refreshToken": "refresh-token-string"
}
```

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Token refreshed",
  "data": {
    "token": "new-jwt-token",
    "expiresIn": 3600
  },
  "errors": []
}
```

#### POST /api/auth/logout

**Description**: User logout  
**Authentication**: Required

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Logout successful",
  "data": true,
  "errors": []
}
```

### User Management Endpoints

#### GET /api/users/profile

**Description**: Get current user profile  
**Authentication**: Required

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    /* Complete User object */
  },
  "errors": []
}
```

#### PUT /api/users/profile

**Description**: Update current user profile  
**Authentication**: Required

**Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+250788123456",
  "bio": "Updated bio text",
  "age": 28,
  "gender": "Male",
  "location": "Kigali, Rwanda",
  "interests": ["Environment", "Education"],
  "availability": ["Weekends", "Evenings"],
  "skills": ["Teaching", "Project Management"]
}
```

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Profile updated successfully",
  "data": {
    /* Updated User object */
  },
  "errors": []
}
```

#### GET /api/users/{id}

**Description**: Get user by ID  
**Authentication**: Required

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    /* User object (public fields only) */
  },
  "errors": []
}
```

#### GET /api/users

**Description**: Get all users with pagination  
**Authentication**: Required  
**Query Parameters**:

- `page` (default: 1)
- `pageSize` (default: 10)

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "items": [
      /* Array of User objects */
    ],
    "totalCount": 50,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "errors": []
}
```

#### GET /api/users/search

**Description**: Search users  
**Authentication**: Required  
**Query Parameters**:

- `searchTerm` (required)
- `page` (default: 1)
- `pageSize` (default: 10)

**Response**: Same as GET /api/users

### Task/Project Management Endpoints

#### GET /api/tasks

**Description**: Get all tasks with pagination and filtering  
**Authentication**: None required  
**Query Parameters**:

- `page` (default: 1)
- `pageSize` (default: 10)
- `status` (filter by status)
- `category` (filter by category)
- `search` (search term)
- `organizationId` (filter by organization)

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "items": [
      /* Array of Task objects */
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

**Description**: Get task by ID  
**Authentication**: None required

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    /* Complete Task object */
  },
  "errors": []
}
```

#### POST /api/tasks

**Description**: Create new task  
**Authentication**: Required (OrganizationAdmin, SuperAdmin)

**Request Body**:

```json
{
  "title": "Beach Cleanup Drive",
  "description": "Join us for a community beach cleanup...",
  "startDate": "2024-06-15T09:00:00Z",
  "endDate": "2024-06-15T15:00:00Z",
  "location": {
    "street": "Ocean Beach",
    "city": "Kigali",
    "state": "Kigali Province",
    "zipCode": "00100",
    "country": "Rwanda",
    "latitude": -1.9706,
    "longitude": 30.1044
  },
  "maxVolunteers": 50,
  "category": 1,
  "requirements": ["Must be 16 or older", "Bring sun protection"],
  "skills": ["Environmental awareness", "Physical fitness"],
  "tags": ["beach", "cleanup", "environment"],
  "isUrgent": false,
  "applicationDeadline": "2024-06-10T23:59:59Z"
}
```

**Response (201)**:

```json
{
  "isSuccess": true,
  "message": "Task created successfully",
  "data": {
    /* Created Task object */
  },
  "errors": []
}
```

#### PUT /api/tasks/{id}

**Description**: Update task  
**Authentication**: Required (Creator, OrganizationAdmin, SuperAdmin)

**Request Body**: Same as POST request

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Task updated successfully",
  "data": {
    /* Updated Task object */
  },
  "errors": []
}
```

#### DELETE /api/tasks/{id}

**Description**: Delete task  
**Authentication**: Required (Creator, OrganizationAdmin, SuperAdmin)

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Task deleted successfully",
  "data": true,
  "errors": []
}
```

#### GET /api/tasks/search

**Description**: Search tasks  
**Authentication**: None required  
**Query Parameters**:

- `searchTerm` (required)
- `page` (default: 1)
- `pageSize` (default: 10)

**Response**: Same as GET /api/tasks

#### GET /api/tasks/featured

**Description**: Get featured/urgent tasks  
**Authentication**: None required

**Response**: Same as GET /api/tasks

#### POST /api/tasks/{id}/register

**Description**: Register for a task  
**Authentication**: Required

**Request Body**:

```json
{
  "applicationMessage": "I'm excited to participate in this project..."
}
```

**Response (201)**:

```json
{
  "isSuccess": true,
  "message": "Registration successful",
  "data": {
    "id": "registration-id",
    "taskId": "task-id",
    "userId": "user-id",
    "applicationMessage": "application message",
    "registrationDate": "2024-03-15T10:30:00Z",
    "status": 0
  },
  "errors": []
}
```

#### DELETE /api/tasks/{id}/register

**Description**: Unregister from a task  
**Authentication**: Required

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Unregistered successfully",
  "data": true,
  "errors": []
}
```

### Volunteer Registration Management

#### GET /api/volunteers/registrations

**Description**: Get all registrations (Admin only)  
**Authentication**: Required (SuperAdmin)  
**Query Parameters**:

- `page` (default: 1)
- `pageSize` (default: 10)

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "items": [
      /* Array of Registration objects */
    ],
    "totalCount": 250,
    "page": 1,
    "pageSize": 10,
    "totalPages": 25,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "errors": []
}
```

#### GET /api/volunteers/tasks/{taskId}/registrations

**Description**: Get registrations for a specific task  
**Authentication**: Required (Task creator, OrganizationAdmin, SuperAdmin)

**Response**: Same as GET registrations

#### GET /api/volunteers/users/{userId}/registrations

**Description**: Get user's registrations  
**Authentication**: Required (User can only see their own)

**Response**: Same as GET registrations

#### POST /api/volunteers/registrations/{id}/approve

**Description**: Approve registration  
**Authentication**: Required (OrganizationAdmin, SuperAdmin)

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Registration approved successfully",
  "data": true,
  "errors": []
}
```

#### POST /api/volunteers/registrations/{id}/reject

**Description**: Reject registration  
**Authentication**: Required (OrganizationAdmin, SuperAdmin)

**Request Body**:

```json
{
  "reason": "Unfortunately, we have reached the maximum number of volunteers for this task."
}
```

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Registration rejected successfully",
  "data": true,
  "errors": []
}
```

### Organization Management

#### GET /api/organizations

**Description**: Get all organizations  
**Authentication**: None required  
**Query Parameters**:

- `page` (default: 1)
- `pageSize` (default: 10)
- `search` (search term)
- `verified` (filter by verification status)

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "items": [
      /* Array of Organization objects */
    ],
    "totalCount": 20,
    "page": 1,
    "pageSize": 10,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "errors": []
}
```

#### GET /api/organizations/{id}

**Description**: Get organization by ID  
**Authentication**: None required

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    /* Organization object */
  },
  "errors": []
}
```

#### POST /api/organizations

**Description**: Create organization  
**Authentication**: Required (SuperAdmin)

**Request Body**:

```json
{
  "name": "Green Earth Foundation",
  "description": "Environmental conservation organization...",
  "contactInfo": {
    "email": "contact@greenearth.org",
    "phone": "+1-555-0123",
    "website": "https://greenearth.org"
  },
  "address": {
    "street": "123 Green Street",
    "city": "Portland",
    "state": "OR",
    "zipCode": "97201",
    "country": "USA",
    "latitude": 45.5152,
    "longitude": -122.6784
  },
  "categories": ["Environment", "Education"]
}
```

**Response (201)**:

```json
{
  "isSuccess": true,
  "message": "Organization created successfully",
  "data": {
    /* Created Organization object */
  },
  "errors": []
}
```

### Notification Management

#### GET /api/notifications

**Description**: Get user notifications  
**Authentication**: Required  
**Query Parameters**:

- `page` (default: 1)
- `pageSize` (default: 10)
- `isRead` (filter by read status)

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "items": [
      /* Array of Notification objects */
    ],
    "unreadCount": 5,
    "totalCount": 25,
    "page": 1,
    "pageSize": 10
  },
  "errors": []
}
```

#### PUT /api/notifications/{id}/read

**Description**: Mark notification as read  
**Authentication**: Required

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Notification marked as read",
  "data": true,
  "errors": []
}
```

#### PUT /api/notifications/mark-all-read

**Description**: Mark all notifications as read  
**Authentication**: Required

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "All notifications marked as read",
  "data": true,
  "errors": []
}
```

### Dashboard & Statistics

#### GET /api/stats/dashboard

**Description**: Get dashboard statistics  
**Authentication**: None required

**Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "totalProjects": 45,
    "totalVolunteers": 2834,
    "totalOrganizations": 28,
    "completedProjects": 156,
    "activeProjects": 23,
    "upcomingProjects": 12
  },
  "errors": []
}
```

## Error Handling

### Standard Error Responses

#### 400 Bad Request

```json
{
  "isSuccess": false,
  "message": "Validation failed",
  "data": null,
  "errors": ["Email is required", "Password must be at least 8 characters"]
}
```

#### 401 Unauthorized

```json
{
  "isSuccess": false,
  "message": "Authentication required",
  "data": null,
  "errors": ["Invalid or expired token"]
}
```

#### 403 Forbidden

```json
{
  "isSuccess": false,
  "message": "Access denied",
  "data": null,
  "errors": ["Insufficient permissions"]
}
```

#### 404 Not Found

```json
{
  "isSuccess": false,
  "message": "Resource not found",
  "data": null,
  "errors": ["Task with id 'xyz' not found"]
}
```

#### 500 Internal Server Error

```json
{
  "isSuccess": false,
  "message": "Internal server error",
  "data": null,
  "errors": ["An unexpected error occurred"]
}
```

## Security Requirements

### Authentication

- JWT tokens with 1-hour expiration
- Refresh tokens with 7-day expiration
- Password hashing using bcrypt
- Rate limiting on auth endpoints (5 requests/minute)

### Authorization

- Role-based access control (User, OrganizationAdmin, SuperAdmin)
- Resource-level permissions (users can only edit their own data)
- Organization-scoped permissions for admin users

### Data Validation

- Input sanitization for all endpoints
- Email format validation
- Phone number format validation
- Required field validation
- Data type validation

## Rate Limiting

- Authentication endpoints: 5 requests per minute
- Other endpoints: 100 requests per minute
- Return HTTP 429 for exceeded limits

## File Upload Support

### Profile Images

- Endpoint: PUT /api/users/profile (multipart/form-data)
- Supported formats: JPG, PNG, GIF
- Max size: 5MB
- Auto-resize to 400x400px

### Project Images

- Endpoint: POST /api/tasks (multipart/form-data)
- Multiple images supported
- Max size per image: 10MB
- Auto-resize for thumbnails

## CORS Configuration

Allow origins:

- https://volunteersync.rw (production)
- http://localhost:3000 (development)

Allow methods: GET, POST, PUT, DELETE, OPTIONS
Allow headers: Content-Type, Authorization

## API Versioning

Current version: v1
Base path: /api/v1/
Future versions: /api/v2/, etc.

## Performance Requirements

- Response time: < 200ms for most endpoints
- Database query optimization with indexes
- Caching for frequently accessed data
- Pagination for large datasets (max 100 items per page)

## Monitoring & Logging

- Request/response logging
- Error logging with stack traces
- Performance monitoring
- Authentication audit logs
- API usage analytics

This specification provides all the endpoints and data structures needed to support the VolunteerSync React frontend functionality.
