# VolunteerSync Platform

VolunteerSync is a comprehensive volunteer management platform that connects volunteers with organizations and helps coordinate volunteer activities. The platform consists of a .NET Core backend API, React frontend, and static HTML prototype.

## Project Structure

```
.
├── backend/                 # .NET Core 8.0 Backend API
├── frontend/               # Static HTML/CSS Prototype
├── volunteer-sync-react/   # Production React Frontend
├── db/                     # Database Scripts & Seeders
├── scripts/               # Testing & Utility Scripts
└── docs/                  # Documentation Files
```

## Components

### Backend (.NET Core 8.0)

- Clean Architecture implementation with domain-driven design
- MongoDB integration with Repository pattern
- JWT authentication with refresh tokens
- Role-based access control (User, OrganizationAdmin, SuperAdmin)
- Comprehensive API endpoints for volunteer management
- Built with ASP.NET Core 8.0

### React Frontend

- TypeScript-based React application
- Modern UI with responsive design
- Context-based state management
- Role-based access control
- Real-time notifications
- Integration with backend API

### Features

- User registration and authentication
- Organization management
- Volunteer task creation and management
- Task registration and approval workflow
- User profiles with badges and contribution history
- Administrative dashboard
- Search and filtering capabilities

## Tech Stack

### Backend

- ASP.NET Core 8.0
- MongoDB
- JWT Authentication
- AutoMapper
- FluentValidation

### Frontend

- React 18+
- TypeScript
- Context API
- Fetch API
- Modern CSS

### Development & Testing

- Comprehensive API testing scripts
- Database seeding tools
- Development utilities

## Getting Started

### Prerequisites

- .NET 8.0 SDK
- Node.js 16+
- MongoDB 6.0+
- VS Code or Visual Studio 2022

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Restore packages and run:

```bash
dotnet restore
dotnet run --project src/VolunteerSync.API
```

### Frontend Setup

1. Navigate to React frontend:

```bash
cd volunteer-sync-react
```

2. Install dependencies and start:

```bash
npm install
npm start
```

### Database Setup

1. Start MongoDB server
2. Run seeder script:

```bash
cd db
dotnet run --project SimpleSeeder.csproj
```

## API Documentation

- Full API documentation in [API_Documentation.md](API_Documentation.md)
- Backend implementation details in [BACKEND_IMPLEMENTATION_ANALYSIS.md](BACKEND_IMPLEMENTATION_ANALYSIS.md)
- Frontend API integration guide in [FRONTEND_API_ANALYSIS.md](FRONTEND_API_ANALYSIS.md)

## Architecture

### Backend Architecture

- Clean Architecture pattern
- Domain-driven design
- CQRS pattern with MediatR
- Repository pattern for data access
- Comprehensive error handling
- Structured logging

### Frontend Architecture

- Component-based architecture
- Context-based state management
- Role-based route protection
- Responsive design patterns
- Reusable UI components

## Testing

- API endpoint testing scripts
- Integration tests
- Database seeding tools
- Frontend component tests

## Development Workflow

1. Run backend API (port 5000)
2. Start React development server (port 3000)
3. Use provided scripts for testing and validation

## Deployment

- Docker support for backend
- Production build scripts for frontend
- Environment-specific configurations
- Health check endpoints

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Create pull request

## License

This project is licensed under the MIT License

## Acknowledgments

- Built with .NET Core and React
- Uses MongoDB for data storage
- Implements JWT authentication
