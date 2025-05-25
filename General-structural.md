# VolunteerSync - Backend Architecture & Digital Ocean Setup

## 1. Project Structure (Backend Focus)

### Overall Project Layout
```
VolunteerSync/
├── src/
│   ├── VolunteerSync.API/
│   ├── VolunteerSync.Application/
│   ├── VolunteerSync.Domain/
│   └── VolunteerSync.Infrastructure/
├── tests/
│   └── VolunteerSync.Tests/
├── scripts/
│   ├── deploy.sh
│   └── setup-mongo.sh
├── VolunteerSync.sln
└── README.md
```

### Backend Structure (Clean Architecture with MongoDB)
```
VolunteerSync.API/
├── Controllers/
│   ├── AuthController.cs
│   ├── UsersController.cs
│   ├── OrganizationsController.cs
│   ├── TasksController.cs
│   └── VolunteersController.cs
├── Middleware/
│   ├── AuthenticationMiddleware.cs
│   ├── ExceptionHandlingMiddleware.cs
│   └── RequestLoggingMiddleware.cs
├── Configuration/
│   ├── MongoDbSettings.cs
│   ├── JwtSettings.cs
│   └── ServiceCollectionExtensions.cs
├── Program.cs
├── appsettings.json
├── appsettings.Production.json
└── VolunteerSync.API.csproj

VolunteerSync.Application/
├── DTOs/
│   ├── Auth/
│   │   ├── LoginRequestDto.cs
│   │   ├── RegisterRequestDto.cs
│   │   ├── TokenResponseDto.cs
│   │   └── RefreshTokenDto.cs
│   ├── Users/
│   │   ├── UserDto.cs
│   │   ├── CreateUserDto.cs
│   │   ├── UpdateUserDto.cs
│   │   └── UserProfileDto.cs
│   ├── Organizations/
│   │   ├── OrganizationDto.cs
│   │   ├── CreateOrganizationDto.cs
│   │   ├── UpdateOrganizationDto.cs
│   │   └── OrganizationSummaryDto.cs
│   ├── Tasks/
│   │   ├── VolunteerTaskDto.cs
│   │   ├── CreateVolunteerTaskDto.cs
│   │   ├── UpdateVolunteerTaskDto.cs
│   │   ├── TaskSummaryDto.cs
│   │   └── TaskFilterDto.cs
│   └── Common/
│       ├── PagedResultDto.cs
│       └── ApiResponseDto.cs
├── Services/
│   ├── Interfaces/
│   │   ├── IAuthService.cs
│   │   ├── IUserService.cs
│   │   ├── IOrganizationService.cs
│   │   ├── IVolunteerTaskService.cs
│   │   └── IEmailService.cs
│   └── Implementations/
│       ├── AuthService.cs
│       ├── UserService.cs
│       ├── OrganizationService.cs
│       ├── VolunteerTaskService.cs
│       └── EmailService.cs
├── Mappings/
│   └── MappingProfile.cs
├── Validators/
│   ├── CreateUserValidator.cs
│   ├── CreateOrganizationValidator.cs
│   └── CreateTaskValidator.cs
├── Common/
│   ├── Exceptions/
│   │   ├── NotFoundException.cs
│   │   ├── ValidationException.cs
│   │   └── UnauthorizedException.cs
│   └── Constants/
│       └── AppConstants.cs
└── VolunteerSync.Application.csproj

VolunteerSync.Domain/
├── Entities/
│   ├── User.cs
│   ├── Organization.cs
│   ├── VolunteerTask.cs
│   ├── TaskRegistration.cs
│   └── BaseEntity.cs
├── Enums/
│   ├── UserRole.cs
│   ├── TaskStatus.cs
│   ├── TaskCategory.cs
│   └── RegistrationStatus.cs
├── Interfaces/
│   ├── Repositories/
│   │   ├── IUserRepository.cs
│   │   ├── IOrganizationRepository.cs
│   │   ├── IVolunteerTaskRepository.cs
│   │   └── ITaskRegistrationRepository.cs
│   └── Services/
│       └── IMongoContext.cs
├── ValueObjects/
│   ├── Address.cs
│   └── ContactInfo.cs
└── VolunteerSync.Domain.csproj

VolunteerSync.Infrastructure/
├── Data/
│   ├── MongoContext.cs
│   ├── DatabaseSettings.cs
│   └── MongoDbIndexes.cs
├── Repositories/
│   ├── BaseRepository.cs
│   ├── UserRepository.cs
│   ├── OrganizationRepository.cs
│   ├── VolunteerTaskRepository.cs
│   └── TaskRegistrationRepository.cs
├── Services/
│   ├── EmailService.cs
│   ├── PasswordHashingService.cs
│   └── TokenService.cs
├── Configurations/
│   ├── UserConfiguration.cs
│   ├── OrganizationConfiguration.cs
│   └── VolunteerTaskConfiguration.cs
└── VolunteerSync.Infrastructure.csproj
```

## 2. MongoDB Domain Models

### Core Entities with MongoDB Attributes

```csharp
// BaseEntity.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public abstract class BaseEntity
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    
    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

// User.cs
[BsonCollection("users")]
public class User : BaseEntity
{
    [BsonElement("firstName")]
    public string FirstName { get; set; }
    
    [BsonElement("lastName")]
    public string LastName { get; set; }
    
    [BsonElement("email")]
    [BsonRequired]
    public string Email { get; set; }
    
    [BsonElement("passwordHash")]
    public string PasswordHash { get; set; }
    
    [BsonElement("phoneNumber")]
    public string PhoneNumber { get; set; }
    
    [BsonElement("role")]
    [BsonRepresentation(BsonType.String)]
    public UserRole Role { get; set; }
    
    [BsonElement("dateJoined")]
    public DateTime DateJoined { get; set; } = DateTime.UtcNow;
    
    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;
    
    [BsonElement("organizationId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string OrganizationId { get; set; }
    
    [BsonElement("profileImageUrl")]
    public string ProfileImageUrl { get; set; }
    
    [BsonElement("skills")]
    public List<string> Skills { get; set; } = new();
    
    [BsonElement("availability")]
    public List<string> Availability { get; set; } = new();
    
    [BsonElement("lastLoginAt")]
    public DateTime? LastLoginAt { get; set; }
}

// Organization.cs
[BsonCollection("organizations")]
public class Organization : BaseEntity
{
    [BsonElement("name")]
    [BsonRequired]
    public string Name { get; set; }
    
    [BsonElement("description")]
    public string Description { get; set; }
    
    [BsonElement("contactInfo")]
    public ContactInfo ContactInfo { get; set; }
    
    [BsonElement("address")]
    public Address Address { get; set; }
    
    [BsonElement("website")]
    public string Website { get; set; }
    
    [BsonElement("logoUrl")]
    public string LogoUrl { get; set; }
    
    [BsonElement("categories")]
    public List<string> Categories { get; set; } = new();
    
    [BsonElement("isVerified")]
    public bool IsVerified { get; set; } = false;
    
    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;
    
    [BsonElement("memberCount")]
    public int MemberCount { get; set; } = 0;
    
    [BsonElement("taskCount")]
    public int TaskCount { get; set; } = 0;
}

// VolunteerTask.cs
[BsonCollection("volunteer_tasks")]
public class VolunteerTask : BaseEntity
{
    [BsonElement("title")]
    [BsonRequired]
    public string Title { get; set; }
    
    [BsonElement("description")]
    public string Description { get; set; }
    
    [BsonElement("startDate")]
    public DateTime StartDate { get; set; }
    
    [BsonElement("endDate")]
    public DateTime EndDate { get; set; }
    
    [BsonElement("location")]
    public Address Location { get; set; }
    
    [BsonElement("maxVolunteers")]
    public int MaxVolunteers { get; set; }
    
    [BsonElement("currentVolunteers")]
    public int CurrentVolunteers { get; set; } = 0;
    
    [BsonElement("status")]
    [BsonRepresentation(BsonType.String)]
    public TaskStatus Status { get; set; } = TaskStatus.Active;
    
    [BsonElement("category")]
    [BsonRepresentation(BsonType.String)]
    public TaskCategory Category { get; set; }
    
    [BsonElement("requirements")]
    public List<string> Requirements { get; set; } = new();
    
    [BsonElement("skills")]
    public List<string> Skills { get; set; } = new();
    
    [BsonElement("organizationId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string OrganizationId { get; set; }
    
    [BsonElement("createdById")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string CreatedById { get; set; }
    
    [BsonElement("imageUrls")]
    public List<string> ImageUrls { get; set; } = new();
    
    [BsonElement("tags")]
    public List<string> Tags { get; set; } = new();
    
    [BsonElement("isUrgent")]
    public bool IsUrgent { get; set; } = false;
    
    [BsonElement("applicationDeadline")]
    public DateTime? ApplicationDeadline { get; set; }
}

// TaskRegistration.cs
[BsonCollection("task_registrations")]
public class TaskRegistration : BaseEntity
{
    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; }
    
    [BsonElement("volunteerTaskId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string VolunteerTaskId { get; set; }
    
    [BsonElement("registrationDate")]
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    
    [BsonElement("status")]
    [BsonRepresentation(BsonType.String)]
    public RegistrationStatus Status { get; set; } = RegistrationStatus.Pending;
    
    [BsonElement("notes")]
    public string Notes { get; set; }
    
    [BsonElement("applicationMessage")]
    public string ApplicationMessage { get; set; }
    
    [BsonElement("reviewedById")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ReviewedById { get; set; }
    
    [BsonElement("reviewedAt")]
    public DateTime? ReviewedAt { get; set; }
    
    [BsonElement("completedAt")]
    public DateTime? CompletedAt { get; set; }
    
    [BsonElement("rating")]
    public int? Rating { get; set; }
    
    [BsonElement("feedback")]
    public string Feedback { get; set; }
}
```

### Value Objects

```csharp
// Address.cs
public class Address
{
    [BsonElement("street")]
    public string Street { get; set; }
    
    [BsonElement("city")]
    public string City { get; set; }
    
    [BsonElement("state")]
    public string State { get; set; }
    
    [BsonElement("zipCode")]
    public string ZipCode { get; set; }
    
    [BsonElement("country")]
    public string Country { get; set; }
    
    [BsonElement("latitude")]
    public double? Latitude { get; set; }
    
    [BsonElement("longitude")]
    public double? Longitude { get; set; }
}

// ContactInfo.cs
public class ContactInfo
{
    [BsonElement("email")]
    public string Email { get; set; }
    
    [BsonElement("phone")]
    public string Phone { get; set; }
    
    [BsonElement("website")]
    public string Website { get; set; }
    
    [BsonElement("socialMedia")]
    public Dictionary<string, string> SocialMedia { get; set; } = new();
}
```

## 3. MongoDB Repository Pattern

### Base Repository
```csharp
// BaseRepository.cs
public abstract class BaseRepository<T> where T : BaseEntity
{
    protected readonly IMongoCollection<T> _collection;
    protected readonly FilterDefinitionBuilder<T> _filterBuilder = Builders<T>.Filter;

    protected BaseRepository(IMongoDatabase database, string collectionName)
    {
        _collection = database.GetCollection<T>(collectionName);
    }

    public async Task<T> GetByIdAsync(string id)
    {
        var filter = _filterBuilder.Eq(entity => entity.Id, id);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _collection.Find(_filterBuilder.Empty).ToListAsync();
    }

    public async Task<T> CreateAsync(T entity)
    {
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
        await _collection.InsertOneAsync(entity);
        return entity;
    }

    public async Task UpdateAsync(T entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        var filter = _filterBuilder.Eq(existingEntity => existingEntity.Id, entity.Id);
        await _collection.ReplaceOneAsync(filter, entity);
    }

    public async Task DeleteAsync(string id)
    {
        var filter = _filterBuilder.Eq(entity => entity.Id, id);
        await _collection.DeleteOneAsync(filter);
    }

    public async Task<long> CountAsync(FilterDefinition<T> filter = null)
    {
        return await _collection.CountDocumentsAsync(filter ?? _filterBuilder.Empty);
    }

    public async Task<IEnumerable<T>> FindAsync(FilterDefinition<T> filter)
    {
        return await _collection.Find(filter).ToListAsync();
    }

    public async Task<(IEnumerable<T> Items, long TotalCount)> GetPagedAsync(
        FilterDefinition<T> filter, int page, int pageSize, SortDefinition<T> sort = null)
    {
        var totalCount = await _collection.CountDocumentsAsync(filter);
        var items = await _collection.Find(filter)
            .Sort(sort)
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}
```

## 4. REST API Endpoints (Enhanced)

### Authentication & Authorization
```
POST   /api/auth/login                    # User login
POST   /api/auth/register                 # User registration
POST   /api/auth/refresh                  # Refresh JWT token
POST   /api/auth/logout                   # User logout
POST   /api/auth/forgot-password          # Request password reset
POST   /api/auth/reset-password           # Reset password with token
GET    /api/auth/verify-email/{token}     # Verify email address
```

### User Management
```
GET    /api/users/profile                 # Get current user profile
PUT    /api/users/profile                 # Update current user profile
GET    /api/users/{id}                    # Get user by ID
GET    /api/users                         # Get users (paginated, filtered)
PUT    /api/users/{id}/activate           # Activate/deactivate user
GET    /api/users/search                  # Search users by criteria
```

### Organization Management
```
GET    /api/organizations                 # Get organizations (paginated, filtered)
GET    /api/organizations/{id}            # Get organization by ID
POST   /api/organizations                 # Create organization
PUT    /api/organizations/{id}            # Update organization
DELETE /api/organizations/{id}            # Delete organization
GET    /api/organizations/{id}/members    # Get organization members
POST   /api/organizations/{id}/join       # Join organization
DELETE /api/organizations/{id}/leave     # Leave organization
PUT    /api/organizations/{id}/verify     # Verify organization (admin)
GET    /api/organizations/search          # Search organizations
```

### Volunteer Task Management
```
GET    /api/tasks                         # Get tasks (paginated, filtered)
GET    /api/tasks/{id}                    # Get task by ID
POST   /api/tasks                         # Create task
PUT    /api/tasks/{id}                    # Update task
DELETE /api/tasks/{id}                   # Delete task
GET    /api/tasks/my-created              # Tasks created by current user
GET    /api/tasks/my-registrations        # Tasks user registered for
GET    /api/tasks/search                  # Search tasks
GET    /api/tasks/featured                # Get featured/urgent tasks
GET    /api/tasks/by-category/{category}  # Get tasks by category
GET    /api/tasks/near-location           # Get tasks near location
```

### Task Registration Management
```
POST   /api/tasks/{id}/register           # Register for task
DELETE /api/tasks/{id}/unregister         # Unregister from task
GET    /api/tasks/{id}/registrations      # Get task registrations
PUT    /api/registrations/{id}/approve    # Approve registration
PUT    /api/registrations/{id}/reject     # Reject registration
PUT    /api/registrations/{id}/complete   # Mark registration complete
POST   /api/registrations/{id}/feedback   # Add feedback/rating
```

### Analytics & Reporting
```
GET    /api/analytics/dashboard           # Dashboard statistics
GET    /api/analytics/organization/{id}   # Organization analytics
GET    /api/analytics/user/{id}           # User activity analytics
GET    /api/reports/tasks                 # Task reports
GET    /api/reports/volunteers            # Volunteer reports
```

## 5. Digital Ocean Ubuntu Setup

### Prerequisites Installation

#### 1. Update System and Install .NET 8
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y wget apt-transport-https software-properties-common

# Add Microsoft repository
wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

# Install .NET 8 SDK and Runtime
sudo apt update
sudo apt install -y dotnet-sdk-8.0 aspnetcore-runtime-8.0

# Verify installation
dotnet --version
```

#### 2. Install and Configure MongoDB
```bash
# Import MongoDB public GPG key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB installation
sudo systemctl status mongod
```

#### 3. Configure MongoDB Security
```bash
# Connect to MongoDB
mongosh

# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "your_strong_password_here",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase"]
})

# Create application database and user
use volunteersync
db.createUser({
  user: "volunteersync_user",
  pwd: "your_app_password_here",
  roles: ["readWrite"]
})

exit
```

#### 4. Enable MongoDB Authentication
```bash
# Edit MongoDB configuration
sudo nano /etc/mongod.conf

# Add these lines:
security:
  authorization: enabled

# Restart MongoDB
sudo systemctl restart mongod
```

#### 5. Install Nginx (Reverse Proxy)
```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Configure firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

### Project Setup and Deployment

#### 1. Clone and Build Project
```bash
# Create application directory
sudo mkdir -p /var/www/volunteersync
sudo chown $USER:$USER /var/www/volunteersync

# Clone repository (replace with your repo)
cd /var/www/volunteersync
git clone https://github.com/yourusername/volunteersync.git .

# Build the application
dotnet build --configuration Release
```

#### 2. Configure Application Settings
```bash
# Create production configuration
sudo nano /var/www/volunteersync/src/VolunteerSync.API/appsettings.Production.json
```

```json
{
  "ConnectionStrings": {
    "MongoDB": "mongodb://volunteersync_user:your_app_password_here@localhost:27017/volunteersync?authSource=volunteersync"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secure-jwt-secret-key-here-make-it-long",
    "Issuer": "VolunteerSync",
    "Audience": "VolunteerSync.API",
    "ExpirationHours": 24
  },
  "MongoDbSettings": {
    "ConnectionString": "mongodb://volunteersync_user:your_app_password_here@localhost:27017/volunteersync?authSource=volunteersync",
    "DatabaseName": "volunteersync"
  },
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "your-email@gmail.com",
    "SenderPassword": "your-app-password"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Urls": "http://localhost:5000"
}
```

#### 3. Create Systemd Service
```bash
# Create service file
sudo nano /etc/systemd/system/volunteersync.service
```

```ini
[Unit]
Description=VolunteerSync Web API
After=network.target

[Service]
Type=notify
ExecStart=/usr/bin/dotnet /var/www/volunteersync/src/VolunteerSync.API/bin/Release/net8.0/VolunteerSync.API.dll
Restart=always
RestartSec=5
TimeoutStopSec=20
KillMode=mixed
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false
WorkingDirectory=/var/www/volunteersync/src/VolunteerSync.API

[Install]
WantedBy=multi-user.target
```

#### 4. Configure Nginx Reverse Proxy
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/volunteersync
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/volunteersync /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. Start and Enable Services
```bash
# Set permissions
sudo chown -R www-data:www-data /var/www/volunteersync
sudo chmod -R 755 /var/www/volunteersync

# Start the application service
sudo systemctl enable volunteersync
sudo systemctl start volunteersync

# Check status
sudo systemctl status volunteersync
```

### NuGet Packages Required

```xml
<!-- VolunteerSync.API.csproj -->
<PackageReference Include="MongoDB.Driver" Version="2.22.0" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="12.0.1" />
<PackageReference Include="FluentValidation.AspNetCore" Version="11.3.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
<PackageReference Include="Serilog.AspNetCore" Version="7.0.0" />

<!-- VolunteerSync.Infrastructure.csproj -->
<PackageReference Include="MongoDB.Driver" Version="2.22.0" />
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
<PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="7.0.3" />

<!-- VolunteerSync.Application.csproj -->
<PackageReference Include="AutoMapper" Version="12.0.1" />
<PackageReference Include="FluentValidation" Version="11.7.1" />
<PackageReference Include="Microsoft.Extensions.DependencyInjection.Abstractions" Version="8.0.0" />
```

### Deployment Script
```bash
#!/bin/bash
# deploy.sh

echo "Starting deployment..."

# Pull latest changes
git pull origin main

# Build application
dotnet build --configuration Release

# Stop service
sudo systemctl stop volunteersync

# Restart service
sudo systemctl start volunteersync

# Check status
sudo systemctl status volunteersync

echo "Deployment completed!"
```

This refined architecture focuses specifically on a robust C# .NET backend with MongoDB, optimized for Digital Ocean deployment without Docker complexity. The structure supports efficient development and scaling while maintaining clean architecture principles.
