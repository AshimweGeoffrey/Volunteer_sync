# VolunteerSync API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Common Response Format

All API responses follow this structure:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {}, // Response data
  "errors": [] // Array of error messages (empty on success)
}
```

## Data Models

### User Roles

- `0` - User (Regular volunteer)
- `1` - OrganizationMember
- `2` - OrganizationAdmin
- `3` - SystemAdmin

### Task Categories

- `0` - Education
- `1` - Healthcare
- `2` - Environment
- `3` - CommunityService
- `4` - AnimalWelfare
- `5` - DisasterRelief
- `6` - Arts
- `7` - Sports
- `8` - Technology
- `9` - Other

### Task Status

- `0` - Draft
- `1` - Active
- `2` - Paused
- `3` - Completed
- `4` - Cancelled

### Registration Status

- `0` - Pending
- `1` - Approved
- `2` - Rejected
- `3` - Completed
- `4` - Cancelled

### Address Object

```json
{
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "latitude": 40.7128,
  "longitude": -74.006
}
```

### Contact Info Object

```json
{
  "email": "contact@organization.com",
  "phone": "+1-555-0123",
  "website": "https://organization.com",
  "socialMedia": {
    "facebook": "https://facebook.com/organization",
    "twitter": "https://twitter.com/organization"
  }
}
```

## Authentication Endpoints

### POST /api/auth/login

**Description**: User login  
**Authentication**: None required

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:

```json
{
  "isSuccess": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresAt": "2025-05-25T10:00:00Z",
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "User"
  },
  "errors": []
}
```

### POST /api/auth/register

**Description**: User registration  
**Authentication**: None required

**Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123!",
  "phoneNumber": "+1-555-0123",
  "role": 0,
  "organizationId": "507f1f77bcf86cd799439012"
}
```

**Response**:

```json
{
  "isSuccess": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresAt": "2025-05-25T10:00:00Z",
    "userId": "507f1f77bcf86cd799439013",
    "email": "john.doe@example.com",
    "role": "User"
  },
  "errors": []
}
```

### POST /api/auth/refresh

**Description**: Refresh JWT token  
**Authentication**: None required

**Request Body**:

```json
"refresh_token_here"
```

**Response**:

```json
{
  "isSuccess": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_access_token_here",
    "refreshToken": "new_refresh_token_here",
    "expiresAt": "2025-05-25T10:00:00Z",
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "User"
  },
  "errors": []
}
```

### POST /api/auth/logout

**Description**: User logout  
**Authentication**: Required

**Request Body**: None

**Response**:

```json
{
  "isSuccess": true,
  "message": "Logout successful",
  "data": true,
  "errors": []
}
```

## User Management Endpoints

### GET /api/users/profile

**Description**: Get current user profile  
**Authentication**: Required

**Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1-555-0123",
    "role": 0,
    "dateJoined": "2025-01-15T08:30:00Z",
    "isActive": true,
    "organizationId": "507f1f77bcf86cd799439012",
    "profileImageUrl": "https://example.com/profile.jpg",
    "skills": ["JavaScript", "Project Management", "Public Speaking"],
    "availability": ["Weekends", "Evenings"],
    "lastLoginAt": "2025-05-24T15:30:00Z"
  },
  "errors": []
}
```

### PUT /api/users/profile

**Description**: Update current user profile  
**Authentication**: Required

**Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "password": "newPassword123!",
  "phoneNumber": "+1-555-0124",
  "role": 0,
  "organizationId": "507f1f77bcf86cd799439012",
  "skills": ["JavaScript", "React", "Node.js"],
  "availability": ["Weekends", "Monday evenings"]
}
```

**Response**:

```json
{
  "isSuccess": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "phoneNumber": "+1-555-0124",
    "role": 0,
    "dateJoined": "2025-01-15T08:30:00Z",
    "isActive": true,
    "organizationId": "507f1f77bcf86cd799439012",
    "profileImageUrl": "https://example.com/profile.jpg",
    "skills": ["JavaScript", "React", "Node.js"],
    "availability": ["Weekends", "Monday evenings"],
    "lastLoginAt": "2025-05-24T15:30:00Z"
  },
  "errors": []
}
```

### GET /api/users/{id}

**Description**: Get user by ID  
**Authentication**: Required

**Response**: Same as profile response

### GET /api/users

**Description**: Get all users with pagination  
**Authentication**: Required  
**Query Parameters**:

- `page` (default: 1)
- `pageSize` (default: 10)

**Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+1-555-0123",
        "role": 0,
        "dateJoined": "2025-01-15T08:30:00Z",
        "isActive": true,
        "organizationId": "507f1f77bcf86cd799439012",
        "profileImageUrl": "https://example.com/profile.jpg",
        "skills": ["JavaScript", "Project Management"],
        "availability": ["Weekends"],
        "lastLoginAt": "2025-05-24T15:30:00Z"
      }
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

### GET /api/users/search

**Description**: Search users  
**Authentication**: Required  
**Query Parameters**:

- `searchTerm` (required)
- `page` (default: 1)
- `pageSize` (default: 10)

**Response**: Same as GET /api/users

### DELETE /api/users/{id}

**Description**: Delete user  
**Authentication**: SystemAdmin only

**Response**:

```json
{
  "isSuccess": true,
  "message": "User deleted successfully",
  "data": true,
  "errors": []
}
```

## Organization Management Endpoints

### GET /api/organizations

**Description**: Get all organizations with pagination  
**Authentication**: None required  
**Query Parameters**:

- `page` (default: 1)
- `pageSize` (default: 10)

**Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "507f1f77bcf86cd799439012",
        "name": "Green Earth Foundation",
        "description": "Environmental conservation organization dedicated to protecting our planet",
        "contactInfo": {
          "email": "contact@greenearth.org",
          "phone": "+1-555-0100",
          "website": "https://greenearth.org",
          "socialMedia": {
            "facebook": "https://facebook.com/greenearth",
            "twitter": "https://twitter.com/greenearth"
          }
        },
        "address": {
          "street": "123 Green St",
          "city": "Portland",
          "state": "OR",
          "zipCode": "97201",
          "country": "USA",
          "latitude": 45.5152,
          "longitude": -122.6784
        },
        "website": "https://greenearth.org",
        "logoUrl": "https://greenearth.org/logo.png",
        "categories": ["Environment", "Education"],
        "isVerified": true,
        "isActive": true,
        "memberCount": 150,
        "taskCount": 25,
        "createdAt": "2024-01-01T00:00:00Z"
      }
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

### GET /api/organizations/{id}

**Description**: Get organization by ID  
**Authentication**: None required

**Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Green Earth Foundation",
    "description": "Environmental conservation organization dedicated to protecting our planet",
    "contactInfo": {
      "email": "contact@greenearth.org",
      "phone": "+1-555-0100",
      "website": "https://greenearth.org",
      "socialMedia": {
        "facebook": "https://facebook.com/greenearth",
        "twitter": "https://twitter.com/greenearth"
      }
    },
    "address": {
      "street": "123 Green St",
      "city": "Portland",
      "state": "OR",
      "zipCode": "97201",
      "country": "USA",
      "latitude": 45.5152,
      "longitude": -122.6784
    },
    "website": "https://greenearth.org",
    "logoUrl": "https://greenearth.org/logo.png",
    "categories": ["Environment", "Education"],
    "isVerified": true,
    "isActive": true,
    "memberCount": 150,
    "taskCount": 25,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "errors": []
}
```

### POST /api/organizations

**Description**: Create organization  
**Authentication**: SuperAdmin, OrganizationAdmin

**Request Body**:

```json
{
  "name": "Tech for Good",
  "description": "Using technology to solve social problems",
  "contactInfo": {
    "email": "info@techforgood.org",
    "phone": "+1-555-0200",
    "website": "https://techforgood.org",
    "socialMedia": {
      "linkedin": "https://linkedin.com/company/techforgood"
    }
  },
  "address": {
    "street": "456 Tech Ave",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94102",
    "country": "USA",
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "website": "https://techforgood.org",
  "categories": ["Technology", "Education"]
}
```

**Response**:

```json
{
  "isSuccess": true,
  "message": "Organization created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439020",
    "name": "Tech for Good",
    "description": "Using technology to solve social problems",
    "contactInfo": {
      "email": "info@techforgood.org",
      "phone": "+1-555-0200",
      "website": "https://techforgood.org",
      "socialMedia": {
        "linkedin": "https://linkedin.com/company/techforgood"
      }
    },
    "address": {
      "street": "456 Tech Ave",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94102",
      "country": "USA",
      "latitude": 37.7749,
      "longitude": -122.4194
    },
    "website": "https://techforgood.org",
    "logoUrl": null,
    "categories": ["Technology", "Education"],
    "isVerified": false,
    "isActive": true,
    "memberCount": 0,
    "taskCount": 0,
    "createdAt": "2025-05-24T16:30:00Z"
  },
  "errors": []
}
```

### PUT /api/organizations/{id}

**Description**: Update organization  
**Authentication**: SuperAdmin, OrganizationAdmin

**Request Body**: Same as POST request

**Response**: Same as POST response with updated data

### DELETE /api/organizations/{id}

**Description**: Delete organization  
**Authentication**: SuperAdmin only

**Response**:

```json
{
  "isSuccess": true,
  "message": "Organization deleted successfully",
  "data": true,
  "errors": []
}
```

### GET /api/organizations/search

**Description**: Search organizations  
**Authentication**: None required  
**Query Parameters**:

- `searchTerm` (required)
- `page` (default: 1)
- `pageSize` (default: 10)

**Response**: Same as GET /api/organizations

### GET /api/organizations/verified

**Description**: Get verified organizations  
**Authentication**: None required

**Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Green Earth Foundation",
      "description": "Environmental conservation organization",
      "contactInfo": { ... },
      "address": { ... },
      "website": "https://greenearth.org",
      "logoUrl": "https://greenearth.org/logo.png",
      "categories": ["Environment", "Education"],
      "isVerified": true,
      "isActive": true,
      "memberCount": 150,
      "taskCount": 25,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "errors": []
}
```

### POST /api/organizations/{id}/verify

**Description**: Verify organization  
**Authentication**: SuperAdmin only

**Response**:

```json
{
  "isSuccess": true,
  "message": "Organization verified successfully",
  "data": true,
  "errors": []
}
```

## Task Management Endpoints

### GET /api/tasks

**Description**: Get all tasks with pagination  
**Authentication**: None required  
**Query Parameters**:

- `page` (default: 1)
- `pageSize` (default: 10)

**Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "507f1f77bcf86cd799439030",
        "title": "Beach Cleanup Drive",
        "description": "Join us for a community beach cleanup to protect marine life and keep our beaches pristine",
        "startDate": "2025-06-15T09:00:00Z",
        "endDate": "2025-06-15T15:00:00Z",
        "location": {
          "street": "Ocean Beach",
          "city": "San Diego",
          "state": "CA",
          "zipCode": "92109",
          "country": "USA",
          "latitude": 32.7457,
          "longitude": -117.2534
        },
        "maxVolunteers": 50,
        "currentVolunteers": 23,
        "status": 1,
        "category": 2,
        "requirements": ["Must be 16 or older", "Bring sun protection"],
        "skills": ["Environmental awareness", "Physical fitness"],
        "organizationId": "507f1f77bcf86cd799439012",
        "createdById": "507f1f77bcf86cd799439011",
        "imageUrls": [
          "https://example.com/beach1.jpg",
          "https://example.com/beach2.jpg"
        ],
        "tags": ["beach", "cleanup", "environment", "ocean"],
        "isUrgent": false,
        "applicationDeadline": "2025-06-10T23:59:59Z",
        "createdAt": "2025-05-20T10:00:00Z"
      }
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

### GET /api/tasks/{id}

**Description**: Get task by ID  
**Authentication**: None required

**Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "id": "507f1f77bcf86cd799439030",
    "title": "Beach Cleanup Drive",
    "description": "Join us for a community beach cleanup to protect marine life and keep our beaches pristine",
    "startDate": "2025-06-15T09:00:00Z",
    "endDate": "2025-06-15T15:00:00Z",
    "location": {
      "street": "Ocean Beach",
      "city": "San Diego",
      "state": "CA",
      "zipCode": "92109",
      "country": "USA",
      "latitude": 32.7457,
      "longitude": -117.2534
    },
    "maxVolunteers": 50,
    "currentVolunteers": 23,
    "status": 1,
    "category": 2,
    "requirements": ["Must be 16 or older", "Bring sun protection"],
    "skills": ["Environmental awareness", "Physical fitness"],
    "organizationId": "507f1f77bcf86cd799439012",
    "createdById": "507f1f77bcf86cd799439011",
    "imageUrls": [
      "https://example.com/beach1.jpg",
      "https://example.com/beach2.jpg"
    ],
    "tags": ["beach", "cleanup", "environment", "ocean"],
    "isUrgent": false,
    "applicationDeadline": "2025-06-10T23:59:59Z",
    "createdAt": "2025-05-20T10:00:00Z"
  },
  "errors": []
}
```

### POST /api/tasks

**Description**: Create task  
**Authentication**: SuperAdmin, OrganizationAdmin, OrganizationMember

**Request Body**:

```json
{
  "title": "Food Bank Sorting",
  "description": "Help sort and organize food donations for families in need",
  "organizationId": "507f1f77bcf86cd799439012",
  "startDate": "2025-06-20T08:00:00Z",
  "endDate": "2025-06-20T16:00:00Z",
  "location": {
    "street": "123 Food Bank Way",
    "city": "Seattle",
    "state": "WA",
    "zipCode": "98101",
    "country": "USA",
    "latitude": 47.6062,
    "longitude": -122.3321
  },
  "maxVolunteers": 20,
  "category": 3,
  "requirements": [
    "Must be 18 or older",
    "Comfortable standing for long periods"
  ],
  "skills": ["Organization", "Attention to detail"],
  "imageUrls": ["https://example.com/foodbank.jpg"],
  "tags": ["food", "charity", "community"],
  "isUrgent": true,
  "applicationDeadline": "2025-06-18T23:59:59Z"
}
```

**Response**:

```json
{
  "isSuccess": true,
  "message": "Task created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439031",
    "title": "Food Bank Sorting",
    "description": "Help sort and organize food donations for families in need",
    "startDate": "2025-06-20T08:00:00Z",
    "endDate": "2025-06-20T16:00:00Z",
    "location": {
      "street": "123 Food Bank Way",
      "city": "Seattle",
      "state": "WA",
      "zipCode": "98101",
      "country": "USA",
      "latitude": 47.6062,
      "longitude": -122.3321
    },
    "maxVolunteers": 20,
    "currentVolunteers": 0,
    "status": 1,
    "category": 3,
    "requirements": [
      "Must be 18 or older",
      "Comfortable standing for long periods"
    ],
    "skills": ["Organization", "Attention to detail"],
    "organizationId": "507f1f77bcf86cd799439012",
    "createdById": "507f1f77bcf86cd799439011",
    "imageUrls": ["https://example.com/foodbank.jpg"],
    "tags": ["food", "charity", "community"],
    "isUrgent": true,
    "applicationDeadline": "2025-06-18T23:59:59Z",
    "createdAt": "2025-05-24T16:30:00Z"
  },
  "errors": []
}
```

### PUT /api/tasks/{id}

**Description**: Update task  
**Authentication**: SuperAdmin, OrganizationAdmin, OrganizationMember

**Request Body**: Same as POST request

**Response**: Same as POST response with updated data

### DELETE /api/tasks/{id}

**Description**: Delete task  
**Authentication**: SuperAdmin, OrganizationAdmin

**Response**:

```json
{
  "isSuccess": true,
  "message": "Task deleted successfully",
  "data": true,
  "errors": []
}
```

### GET /api/tasks/search

**Description**: Search tasks  
**Authentication**: None required  
**Query Parameters**:

- `searchTerm` (required)
- `page` (default: 1)
- `pageSize` (default: 10)

**Response**: Same as GET /api/tasks

### GET /api/tasks/organization/{organizationId}

**Description**: Get tasks by organization  
**Authentication**: None required

**Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": [
    {
      "id": "507f1f77bcf86cd799439030",
      "title": "Beach Cleanup Drive",
      "description": "Join us for a community beach cleanup"
      // ... full task object
    }
  ],
  "errors": []
}
```

### GET /api/tasks/created-by/{userId}

**Description**: Get tasks created by user  
**Authentication**: Required (users can only see their own)

**Response**: Same as organization tasks response

### GET /api/tasks/category/{category}

**Description**: Get tasks by category  
**Authentication**: None required  
**Path Parameters**:

- `category` (0-9, see Task Categories section)

**Response**: Same as organization tasks response

### GET /api/tasks/featured

**Description**: Get featured/urgent tasks  
**Authentication**: None required

**Response**: Same as organization tasks response

### POST /api/tasks/{id}/register

**Description**: Register for task  
**Authentication**: Required

**Request Body**:

```json
{
  "applicationMessage": "I'm excited to participate in this beach cleanup. I have experience with environmental volunteer work and am available for the entire duration."
}
```

**Response**:

```json
{
  "isSuccess": true,
  "message": "Successfully registered for task",
  "data": {
    "id": "507f1f77bcf86cd799439040",
    "taskId": "507f1f77bcf86cd799439030",
    "userId": "507f1f77bcf86cd799439011",
    "applicationMessage": "I'm excited to participate in this beach cleanup...",
    "registrationDate": "2025-05-24T16:30:00Z",
    "status": 0,
    "taskTitle": "Beach Cleanup Drive",
    "userName": "John Doe",
    "userEmail": "john.doe@example.com"
  },
  "errors": []
}
```

### DELETE /api/tasks/{id}/register

**Description**: Unregister from task  
**Authentication**: Required

**Response**:

```json
{
  "isSuccess": true,
  "message": "Successfully unregistered from task",
  "data": true,
  "errors": []
}
```

## Volunteer Registration Management Endpoints

### GET /api/volunteers/registrations

**Description**: Get all registrations  
**Authentication**: SuperAdmin only  
**Query Parameters**:

- `page` (default: 1)
- `pageSize` (default: 10)

**Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "507f1f77bcf86cd799439040",
        "taskId": "507f1f77bcf86cd799439030",
        "userId": "507f1f77bcf86cd799439011",
        "applicationMessage": "I'm excited to participate in this beach cleanup...",
        "registrationDate": "2025-05-24T16:30:00Z",
        "status": 0,
        "taskTitle": "Beach Cleanup Drive",
        "userName": "John Doe",
        "userEmail": "john.doe@example.com"
      }
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

### GET /api/volunteers/registrations/{id}

**Description**: Get registration by ID  
**Authentication**: Required

**Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": {
    "id": "507f1f77bcf86cd799439040",
    "taskId": "507f1f77bcf86cd799439030",
    "userId": "507f1f77bcf86cd799439011",
    "applicationMessage": "I'm excited to participate in this beach cleanup...",
    "registrationDate": "2025-05-24T16:30:00Z",
    "status": 0,
    "taskTitle": "Beach Cleanup Drive",
    "userName": "John Doe",
    "userEmail": "john.doe@example.com"
  },
  "errors": []
}
```

### POST /api/volunteers/registrations

**Description**: Create registration  
**Authentication**: Required

**Request Body**:

```json
{
  "taskId": "507f1f77bcf86cd799439030",
  "userId": "507f1f77bcf86cd799439011",
  "applicationMessage": "I would like to volunteer for this task. I have relevant experience and am committed to helping."
}
```

**Response**:

```json
{
  "isSuccess": true,
  "message": "Registration created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439041",
    "taskId": "507f1f77bcf86cd799439030",
    "userId": "507f1f77bcf86cd799439011",
    "applicationMessage": "I would like to volunteer for this task...",
    "registrationDate": "2025-05-24T16:35:00Z",
    "status": 0,
    "taskTitle": "Beach Cleanup Drive",
    "userName": "John Doe",
    "userEmail": "john.doe@example.com"
  },
  "errors": []
}
```

### PUT /api/volunteers/registrations/{id}/status

**Description**: Update registration status  
**Authentication**: SuperAdmin, OrganizationAdmin

**Request Body**:

```json
{
  "status": 1
}
```

**Response**:

```json
{
  "isSuccess": true,
  "message": "Registration status updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439040",
    "taskId": "507f1f77bcf86cd799439030",
    "userId": "507f1f77bcf86cd799439011",
    "applicationMessage": "I'm excited to participate...",
    "registrationDate": "2025-05-24T16:30:00Z",
    "status": 1,
    "taskTitle": "Beach Cleanup Drive",
    "userName": "John Doe",
    "userEmail": "john.doe@example.com"
  },
  "errors": []
}
```

### DELETE /api/volunteers/registrations/{id}

**Description**: Delete registration  
**Authentication**: Required

**Response**:

```json
{
  "isSuccess": true,
  "message": "Registration deleted successfully",
  "data": true,
  "errors": []
}
```

### GET /api/volunteers/tasks/{taskId}/registrations

**Description**: Get registrations for task  
**Authentication**: SuperAdmin, OrganizationAdmin, OrganizationMember

**Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": [
    {
      "id": "507f1f77bcf86cd799439040",
      "taskId": "507f1f77bcf86cd799439030",
      "userId": "507f1f77bcf86cd799439011",
      "applicationMessage": "I'm excited to participate...",
      "registrationDate": "2025-05-24T16:30:00Z",
      "status": 1,
      "taskTitle": "Beach Cleanup Drive",
      "userName": "John Doe",
      "userEmail": "john.doe@example.com"
    }
  ],
  "errors": []
}
```

### GET /api/volunteers/users/{userId}/registrations

**Description**: Get user's registrations  
**Authentication**: Required (users can only see their own)

**Response**: Same as task registrations response

### POST /api/volunteers/registrations/{id}/approve

**Description**: Approve registration  
**Authentication**: SuperAdmin, OrganizationAdmin

**Response**:

```json
{
  "isSuccess": true,
  "message": "Registration approved successfully",
  "data": true,
  "errors": []
}
```

### POST /api/volunteers/registrations/{id}/reject

**Description**: Reject registration  
**Authentication**: SuperAdmin, OrganizationAdmin

**Request Body**:

```json
{
  "reason": "Unfortunately, we have reached the maximum number of volunteers for this task."
}
```

**Response**:

```json
{
  "isSuccess": true,
  "message": "Registration rejected successfully",
  "data": true,
  "errors": []
}
```

### GET /api/volunteers/organizations/{organizationId}/pending-registrations

**Description**: Get pending registrations for organization  
**Authentication**: SuperAdmin, OrganizationAdmin

**Response**:

```json
{
  "isSuccess": true,
  "message": "Success",
  "data": [
    {
      "id": "507f1f77bcf86cd799439042",
      "taskId": "507f1f77bcf86cd799439031",
      "userId": "507f1f77bcf86cd799439013",
      "applicationMessage": "I would love to help with food sorting...",
      "registrationDate": "2025-05-24T17:00:00Z",
      "status": 0,
      "taskTitle": "Food Bank Sorting",
      "userName": "Jane Smith",
      "userEmail": "jane.smith@example.com"
    }
  ],
  "errors": []
}
```

## Error Responses

### 400 Bad Request

```json
{
  "isSuccess": false,
  "message": "Validation failed",
  "data": null,
  "errors": ["Email is required", "Password must be at least 8 characters long"]
}
```

### 401 Unauthorized

```json
{
  "isSuccess": false,
  "message": "Unauthorized access",
  "data": null,
  "errors": ["Invalid or expired token"]
}
```

### 403 Forbidden

```json
{
  "isSuccess": false,
  "message": "Access forbidden",
  "data": null,
  "errors": ["You don't have permission to access this resource"]
}
```

### 404 Not Found

```json
{
  "isSuccess": false,
  "message": "Resource not found",
  "data": null,
  "errors": ["Task with ID 507f1f77bcf86cd799439999 not found"]
}
```

### 500 Internal Server Error

```json
{
  "isSuccess": false,
  "message": "Internal server error",
  "data": null,
  "errors": ["An unexpected error occurred"]
}
```

## Rate Limiting

- Authentication endpoints: 5 requests per minute
- Other endpoints: 100 requests per minute
- Exceeded limits return HTTP 429 Too Many Requests

## Notes

- All dates are in ISO 8601 format (UTC)
- ObjectIds are MongoDB ObjectId strings (24 characters)
- Pagination starts at page 1
- Maximum page size is 100
- All endpoints support CORS for web applications
- API supports both JSON request/response format
