using MongoDB.Driver;
using MongoDB.Bson;
using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Enums;
using VolunteerSync.Domain.ValueObjects;
using VolunteerSync.Infrastructure.Services;
using TaskStatus = VolunteerSync.Domain.Enums.TaskStatus;

namespace VolunteerSync.DataSeeder;

public class DatabaseSeeder
{
    private readonly IMongoDatabase _database;
    private readonly PasswordHashingService _passwordHashingService;

    public DatabaseSeeder()
    {
        var client = new MongoClient("mongodb://localhost:27017");
        _database = client.GetDatabase("VolunteerSyncDB");
        _passwordHashingService = new PasswordHashingService();
    }

    public async Task SeedAsync()
    {
        Console.WriteLine("Starting database seeding...");

        // Clear existing data
        await ClearCollectionsAsync();

        // Seed data in order
        var organizations = await SeedOrganizationsAsync();
        var users = await SeedUsersAsync(organizations);
        var tasks = await SeedVolunteerTasksAsync(organizations, users);
        await SeedTaskRegistrationsAsync(users, tasks);

        Console.WriteLine("Database seeding completed successfully!");
    }

    private async Task ClearCollectionsAsync()
    {
        Console.WriteLine("Clearing existing collections...");
        
        await _database.GetCollection<User>("users").DeleteManyAsync(FilterDefinition<User>.Empty);
        await _database.GetCollection<Organization>("organizations").DeleteManyAsync(FilterDefinition<Organization>.Empty);
        await _database.GetCollection<VolunteerTask>("volunteer_tasks").DeleteManyAsync(FilterDefinition<VolunteerTask>.Empty);
        await _database.GetCollection<TaskRegistration>("task_registrations").DeleteManyAsync(FilterDefinition<TaskRegistration>.Empty);
    }

    private async Task<List<Organization>> SeedOrganizationsAsync()
    {
        Console.WriteLine("Seeding organizations...");
        
        var organizations = new List<Organization>
        {
            new Organization
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Name = "Green Earth Foundation",
                Description = "Dedicated to environmental conservation and sustainable living practices.",
                ContactInfo = new ContactInfo
                {
                    Email = "contact@greenearth.org",
                    Phone = "(555) 123-4567",
                    Website = "https://greenearth.org",
                    SocialMedia = new Dictionary<string, string>
                    {
                        ["facebook"] = "https://facebook.com/greenearth",
                        ["twitter"] = "https://twitter.com/greenearth"
                    }
                },
                Address = new Address
                {
                    Street = "123 Eco Street",
                    City = "Portland",
                    State = "Oregon",
                    ZipCode = "97201",
                    Country = "USA",
                    Latitude = 45.5152,
                    Longitude = -122.6784
                },
                Website = "https://greenearth.org",
                LogoUrl = "https://example.com/logos/greenearth.png",
                Categories = new List<string> { "Environment", "Conservation", "Sustainability" },
                IsVerified = true,
                IsActive = true,
                MemberCount = 150,
                TaskCount = 12,
                CreatedAt = DateTime.UtcNow.AddDays(-365),
                UpdatedAt = DateTime.UtcNow.AddDays(-30)
            },
            new Organization
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Name = "Community Food Bank",
                Description = "Fighting hunger in our community by providing food assistance to families in need.",
                ContactInfo = new ContactInfo
                {
                    Email = "help@communityfoodbank.org",
                    Phone = "(555) 987-6543",
                    Website = "https://communityfoodbank.org"
                },
                Address = new Address
                {
                    Street = "456 Main Street",
                    City = "Seattle",
                    State = "Washington",
                    ZipCode = "98101",
                    Country = "USA",
                    Latitude = 47.6062,
                    Longitude = -122.3321
                },
                Website = "https://communityfoodbank.org",
                LogoUrl = "https://example.com/logos/foodbank.png",
                Categories = new List<string> { "Community Service", "Food Security", "Social Services" },
                IsVerified = true,
                IsActive = true,
                MemberCount = 200,
                TaskCount = 8,
                CreatedAt = DateTime.UtcNow.AddDays(-200),
                UpdatedAt = DateTime.UtcNow.AddDays(-10)
            },
            new Organization
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Name = "Tech for Good",
                Description = "Leveraging technology to solve social problems and bridge the digital divide.",
                ContactInfo = new ContactInfo
                {
                    Email = "info@techforgood.org",
                    Phone = "(555) 456-7890",
                    Website = "https://techforgood.org"
                },
                Address = new Address
                {
                    Street = "789 Innovation Blvd",
                    City = "San Francisco",
                    State = "California",
                    ZipCode = "94105",
                    Country = "USA",
                    Latitude = 37.7749,
                    Longitude = -122.4194
                },
                Website = "https://techforgood.org",
                LogoUrl = "https://example.com/logos/techforgood.png",
                Categories = new List<string> { "Technology", "Education", "Digital Inclusion" },
                IsVerified = true,
                IsActive = true,
                MemberCount = 75,
                TaskCount = 6,
                CreatedAt = DateTime.UtcNow.AddDays(-180),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new Organization
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Name = "Animal Rescue Alliance",
                Description = "Rescuing, rehabilitating, and finding homes for abandoned and abused animals.",
                ContactInfo = new ContactInfo
                {
                    Email = "rescue@animalalliance.org",
                    Phone = "(555) 321-9876",
                    Website = "https://animalalliance.org"
                },
                Address = new Address
                {
                    Street = "321 Pet Lane",
                    City = "Austin",
                    State = "Texas",
                    ZipCode = "78701",
                    Country = "USA",
                    Latitude = 30.2672,
                    Longitude = -97.7431
                },
                Website = "https://animalalliance.org",
                LogoUrl = "https://example.com/logos/animalrescue.png",
                Categories = new List<string> { "Animal Welfare", "Rescue", "Pet Care" },
                IsVerified = true,
                IsActive = true,
                MemberCount = 120,
                TaskCount = 15,
                CreatedAt = DateTime.UtcNow.AddDays(-300),
                UpdatedAt = DateTime.UtcNow.AddDays(-7)
            }
        };

        var collection = _database.GetCollection<Organization>("organizations");
        await collection.InsertManyAsync(organizations);
        
        Console.WriteLine($"Seeded {organizations.Count} organizations.");
        return organizations;
    }

    private async Task<List<User>> SeedUsersAsync(List<Organization> organizations)
    {
        Console.WriteLine("Seeding users...");
        
        var users = new List<User>();

        // System Admin
        users.Add(new User
        {
            Id = ObjectId.GenerateNewId().ToString(),
            FirstName = "Admin",
            LastName = "User",
            Email = "admin@volunteersync.com",
            PasswordHash = _passwordHashingService.HashPassword("Admin123!"),
            PhoneNumber = "(555) 000-0001",
            Role = UserRole.SystemAdmin,
            DateJoined = DateTime.UtcNow.AddDays(-400),
            IsActive = true,
            Skills = new List<string> { "System Administration", "User Management" },
            Availability = new List<string> { "Weekdays", "Weekends" },
            LastLoginAt = DateTime.UtcNow.AddHours(-2),
            CreatedAt = DateTime.UtcNow.AddDays(-400),
            UpdatedAt = DateTime.UtcNow.AddHours(-2)
        });

        // Organization Admins (one per organization)
        for (int i = 0; i < organizations.Count; i++)
        {
            var org = organizations[i];
            users.Add(new User
            {
                Id = ObjectId.GenerateNewId().ToString(),
                FirstName = $"Admin{i + 1}",
                LastName = "Manager",
                Email = $"admin{i + 1}@{org.Name.ToLower().Replace(" ", "")}.org",
                PasswordHash = _passwordHashingService.HashPassword("OrgAdmin123!"),
                PhoneNumber = $"(555) 100-000{i + 1}",
                Role = UserRole.OrganizationAdmin,
                OrganizationId = org.Id,
                DateJoined = DateTime.UtcNow.AddDays(-200 + i * 10),
                IsActive = true,
                Skills = new List<string> { "Management", "Organization", "Leadership" },
                Availability = new List<string> { "Weekdays", "Evenings" },
                LastLoginAt = DateTime.UtcNow.AddHours(-1 - i),
                CreatedAt = DateTime.UtcNow.AddDays(-200 + i * 10),
                UpdatedAt = DateTime.UtcNow.AddHours(-1 - i)
            });
        }

        // Organization Members (2-3 per organization)
        var memberCount = 0;
        for (int orgIndex = 0; orgIndex < organizations.Count; orgIndex++)
        {
            var org = organizations[orgIndex];
            var membersForOrg = 2 + (orgIndex % 2); // 2 or 3 members per org
            
            for (int memberIndex = 0; memberIndex < membersForOrg; memberIndex++)
            {
                memberCount++;
                users.Add(new User
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    FirstName = $"Member{memberCount}",
                    LastName = "Staff",
                    Email = $"member{memberCount}@{org.Name.ToLower().Replace(" ", "")}.org",
                    PasswordHash = _passwordHashingService.HashPassword("Member123!"),
                    PhoneNumber = $"(555) 200-{memberCount:D4}",
                    Role = UserRole.OrganizationMember,
                    OrganizationId = org.Id,
                    DateJoined = DateTime.UtcNow.AddDays(-150 + memberCount * 5),
                    IsActive = true,
                    Skills = GetRandomSkills(orgIndex),
                    Availability = new List<string> { "Weekdays", "Weekends" },
                    LastLoginAt = DateTime.UtcNow.AddHours(-memberCount),
                    CreatedAt = DateTime.UtcNow.AddDays(-150 + memberCount * 5),
                    UpdatedAt = DateTime.UtcNow.AddHours(-memberCount)
                });
            }
        }

        // Regular Users (volunteers)
        var volunteerNames = new[]
        {
            ("John", "Smith"), ("Sarah", "Johnson"), ("Michael", "Brown"), ("Emily", "Davis"),
            ("David", "Wilson"), ("Jessica", "Moore"), ("James", "Taylor"), ("Ashley", "Anderson"),
            ("Christopher", "Thomas"), ("Amanda", "Jackson"), ("Matthew", "White"), ("Jennifer", "Harris"),
            ("Andrew", "Martin"), ("Nicole", "Garcia"), ("Joshua", "Martinez"), ("Stephanie", "Robinson"),
            ("Ryan", "Clark"), ("Melissa", "Rodriguez"), ("Brandon", "Lewis"), ("Laura", "Lee")
        };

        for (int i = 0; i < volunteerNames.Length; i++)
        {
            var (firstName, lastName) = volunteerNames[i];
            users.Add(new User
            {
                Id = ObjectId.GenerateNewId().ToString(),
                FirstName = firstName,
                LastName = lastName,
                Email = $"{firstName.ToLower()}.{lastName.ToLower()}@email.com",
                PasswordHash = _passwordHashingService.HashPassword("Volunteer123!"),
                PhoneNumber = $"(555) 300-{i + 1:D4}",
                Role = UserRole.User,
                DateJoined = DateTime.UtcNow.AddDays(-100 + i * 3),
                IsActive = true,
                Skills = GetRandomVolunteerSkills(),
                Availability = GetRandomAvailability(),
                LastLoginAt = DateTime.UtcNow.AddDays(-i % 30),
                CreatedAt = DateTime.UtcNow.AddDays(-100 + i * 3),
                UpdatedAt = DateTime.UtcNow.AddDays(-i % 30)
            });
        }

        var collection = _database.GetCollection<User>("users");
        await collection.InsertManyAsync(users);
        
        Console.WriteLine($"Seeded {users.Count} users.");
        return users;
    }

    private async Task<List<VolunteerTask>> SeedVolunteerTasksAsync(List<Organization> organizations, List<User> users)
    {
        Console.WriteLine("Seeding volunteer tasks...");
        
        var tasks = new List<VolunteerTask>();
        var random = new Random();

        // Get organization admins and members for each org
        var orgStaff = users.Where(u => u.Role == UserRole.OrganizationAdmin || u.Role == UserRole.OrganizationMember)
                           .ToList();

        var taskTemplates = new[]
        {
            // Environment tasks
            ("Beach Cleanup Drive", "Join us for a community beach cleanup to protect marine life and keep our shores beautiful.", TaskCategory.Environment, 25, 8),
            ("Tree Planting Initiative", "Help us plant native trees in local parks to combat climate change and improve air quality.", TaskCategory.Environment, 15, 6),
            ("Recycling Education Workshop", "Teach community members about proper recycling practices and waste reduction.", TaskCategory.Environment, 10, 4),
            
            // Community Service tasks
            ("Food Distribution", "Help distribute meals to families in need at our community food bank.", TaskCategory.CommunityService, 20, 6),
            ("Homeless Shelter Support", "Assist with meal preparation and serving at the local homeless shelter.", TaskCategory.CommunityService, 15, 8),
            ("Senior Center Activities", "Organize recreational activities and provide companionship for elderly residents.", TaskCategory.CommunityService, 8, 4),
            
            // Technology tasks
            ("Digital Literacy Classes", "Teach basic computer skills to seniors and underserved community members.", TaskCategory.Technology, 12, 4),
            ("Website Development", "Help build websites for local nonprofits to increase their online presence.", TaskCategory.Technology, 5, 6),
            ("Tech Support for Nonprofits", "Provide technical support and training for nonprofit organizations.", TaskCategory.Technology, 8, 4),
            
            // Animal Welfare tasks
            ("Dog Walking Program", "Walk dogs at the animal shelter to ensure they get proper exercise and socialization.", TaskCategory.AnimalWelfare, 30, 2),
            ("Pet Adoption Event", "Help organize and staff pet adoption events to find homes for rescued animals.", TaskCategory.AnimalWelfare, 20, 8),
            ("Animal Shelter Maintenance", "Assist with cleaning kennels and maintaining facilities at the animal shelter.", TaskCategory.AnimalWelfare, 15, 6),
            
            // Education tasks
            ("After-School Tutoring", "Provide homework help and tutoring for elementary school students.", TaskCategory.Education, 20, 3),
            ("Adult Literacy Program", "Help adults improve their reading and writing skills through one-on-one sessions.", TaskCategory.Education, 10, 2),
            ("STEM Workshop for Kids", "Lead hands-on science and technology activities for children ages 8-12.", TaskCategory.Education, 25, 4)
        };

        int taskIndex = 0;
        foreach (var org in organizations)
        {
            var orgMembers = orgStaff.Where(u => u.OrganizationId == org.Id).ToList();
            var tasksPerOrg = org.TaskCount;
            
            for (int i = 0; i < tasksPerOrg && taskIndex < taskTemplates.Length; i++, taskIndex++)
            {
                var template = taskTemplates[taskIndex % taskTemplates.Length];
                var creator = orgMembers[random.Next(orgMembers.Count)];
                var startDate = DateTime.UtcNow.AddDays(random.Next(1, 60)); // 1-60 days from now
                var duration = random.Next(2, 8); // 2-8 hours
                
                var task = new VolunteerTask
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    Title = template.Item1,
                    Description = template.Item2,
                    StartDate = startDate,
                    EndDate = startDate.AddHours(duration),
                    Location = GetLocationForOrganization(org),
                    MaxVolunteers = template.Item5,
                    CurrentVolunteers = random.Next(0, Math.Min(template.Item5, 3)), // 0-3 or max volunteers
                    Status = GetRandomTaskStatus(),
                    Category = template.Item4,
                    OrganizationId = org.Id,
                    CreatedById = creator.Id,
                    RequiredSkills = GetRequiredSkillsForCategory(template.Item4),
                    RequiredHours = duration,
                    IsFeatured = random.Next(0, 4) == 0, // 25% chance to be featured
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                    UpdatedAt = DateTime.UtcNow.AddDays(-random.Next(0, 5))
                };

                tasks.Add(task);
            }
        }

        var collection = _database.GetCollection<VolunteerTask>("volunteer_tasks");
        await collection.InsertManyAsync(tasks);
        
        Console.WriteLine($"Seeded {tasks.Count} volunteer tasks.");
        return tasks;
    }

    private async Task SeedTaskRegistrationsAsync(List<User> users, List<VolunteerTask> tasks)
    {
        Console.WriteLine("Seeding task registrations...");
        
        var registrations = new List<TaskRegistration>();
        var random = new Random();
        var volunteers = users.Where(u => u.Role == UserRole.User).ToList();

        foreach (var task in tasks)
        {
            var registrationCount = Math.Min(task.CurrentVolunteers + random.Next(0, 3), task.MaxVolunteers);
            var selectedVolunteers = volunteers.OrderBy(x => random.Next()).Take(registrationCount).ToList();

            foreach (var volunteer in selectedVolunteers)
            {
                var registration = new TaskRegistration
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    UserId = volunteer.Id,
                    VolunteerTaskId = task.Id,
                    RegistrationDate = DateTime.UtcNow.AddDays(-random.Next(1, 15)),
                    Status = GetRandomRegistrationStatus(),
                    Notes = GetRandomRegistrationNotes(),
                    ApplicationMessage = GetRandomApplicationMessage(),
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 15)),
                    UpdatedAt = DateTime.UtcNow.AddDays(-random.Next(0, 5))
                };

                registrations.Add(registration);
            }
        }

        var collection = _database.GetCollection<TaskRegistration>("task_registrations");
        await collection.InsertManyAsync(registrations);
        
        Console.WriteLine($"Seeded {registrations.Count} task registrations.");
    }

    private List<string> GetRandomSkills(int orgIndex)
    {
        var skillSets = new[]
        {
            new[] { "Environmental Science", "Project Management", "Public Speaking", "Data Analysis" },
            new[] { "Food Service", "Customer Service", "Inventory Management", "Event Planning" },
            new[] { "Programming", "Web Development", "Technical Writing", "Training" },
            new[] { "Animal Care", "Veterinary Assistance", "Event Coordination", "Photography" }
        };
        
        return skillSets[orgIndex % skillSets.Length].ToList();
    }

    private List<string> GetRandomVolunteerSkills()
    {
        var allSkills = new[]
        {
            "Communication", "Teamwork", "Problem Solving", "Time Management", "Leadership",
            "Customer Service", "Computer Skills", "Writing", "Photography", "Event Planning",
            "Teaching", "Mentoring", "First Aid", "Driving", "Cooking", "Gardening",
            "Social Media", "Marketing", "Fundraising", "Public Speaking"
        };
        
        var random = new Random();
        return allSkills.OrderBy(x => random.Next()).Take(random.Next(2, 6)).ToList();
    }

    private List<string> GetRandomAvailability()
    {
        var options = new[] { "Weekdays", "Weekends", "Evenings", "Mornings", "Afternoons" };
        var random = new Random();
        return options.OrderBy(x => random.Next()).Take(random.Next(1, 4)).ToList();
    }

    private Address GetLocationForOrganization(Organization org)
    {
        // Create locations near the organization's address
        var random = new Random();
        var latOffset = (random.NextDouble() - 0.5) * 0.1; // ±0.05 degrees
        var lngOffset = (random.NextDouble() - 0.5) * 0.1;
        
        return new Address
        {
            Street = $"{random.Next(100, 999)} Volunteer Street",
            City = org.Address.City,
            State = org.Address.State,
            ZipCode = org.Address.ZipCode,
            Country = org.Address.Country,
            Latitude = org.Address.Latitude + latOffset,
            Longitude = org.Address.Longitude + lngOffset
        };
    }

    private TaskStatus GetRandomTaskStatus()
    {
        var random = new Random();
        var statuses = new[] { TaskStatus.Active, TaskStatus.Active, TaskStatus.Active, TaskStatus.Draft, TaskStatus.Completed };
        return statuses[random.Next(statuses.Length)];
    }

    private List<string> GetRequiredSkillsForCategory(TaskCategory category)
    {
        return category switch
        {
            TaskCategory.Environment => new List<string> { "Physical Fitness", "Teamwork" },
            TaskCategory.CommunityService => new List<string> { "Communication", "Empathy" },
            TaskCategory.Technology => new List<string> { "Computer Skills", "Teaching" },
            TaskCategory.AnimalWelfare => new List<string> { "Animal Care", "Physical Fitness" },
            TaskCategory.Education => new List<string> { "Teaching", "Patience", "Communication" },
            _ => new List<string> { "Teamwork", "Communication" }
        };
    }

    private RegistrationStatus GetRandomRegistrationStatus()
    {
        var random = new Random();
        var statuses = new[] 
        { 
            RegistrationStatus.Approved, RegistrationStatus.Approved, RegistrationStatus.Approved,
            RegistrationStatus.Pending, RegistrationStatus.Completed 
        };
        return statuses[random.Next(statuses.Length)];
    }

    private string GetRandomRegistrationNotes()
    {
        var notes = new[]
        {
            "Enthusiastic volunteer with relevant experience",
            "Available for the full duration of the task",
            "Has transportation and required skills",
            "Previous volunteer with excellent feedback",
            "Flexible schedule and eager to help",
            ""
        };
        
        var random = new Random();
        return notes[random.Next(notes.Length)];
    }

    private string GetRandomApplicationMessage()
    {
        var messages = new[]
        {
            "I'm excited to contribute to this important cause and have previous experience in similar activities.",
            "I would love to volunteer for this opportunity. I'm available for the entire time slot and can bring friends if needed.",
            "This aligns perfectly with my personal values and I'm eager to make a difference in our community.",
            "I have relevant skills and am passionate about supporting this organization's mission.",
            "Looking forward to volunteering and meeting like-minded people while helping a great cause.",
            ""
        };
        
        var random = new Random();
        return messages[random.Next(messages.Length)];
    }
}

// Console application to run the seeder
public class Program
{
    public static async Task Main(string[] args)
    {
        try
        {
            var seeder = new DatabaseSeeder();
            await seeder.SeedAsync();
            
            Console.WriteLine("\n=== Seeding Summary ===");
            Console.WriteLine("✅ Organizations: 4 created");
            Console.WriteLine("✅ Users: ~35 created (1 admin, 4 org admins, ~10 org members, ~20 volunteers)");
            Console.WriteLine("✅ Volunteer Tasks: ~39 created");
            Console.WriteLine("✅ Task Registrations: Multiple created");
            Console.WriteLine("\n📝 Default Login Credentials:");
            Console.WriteLine("System Admin: admin@volunteersync.com / Admin123!");
            Console.WriteLine("Org Admin 1: admin1@greenearthfoundation.org / OrgAdmin123!");
            Console.WriteLine("Org Admin 2: admin2@communityfoodbank.org / OrgAdmin123!");
            Console.WriteLine("Volunteer: john.smith@email.com / Volunteer123!");
            Console.WriteLine("\nPress any key to exit...");
            Console.ReadKey();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during seeding: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
            Console.WriteLine("\nPress any key to exit...");
            Console.ReadKey();
        }
    }
}
