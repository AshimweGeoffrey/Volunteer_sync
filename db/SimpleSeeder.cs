using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

// Simple models for seeding
public class Organization
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public List<string> Skills { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}

public class VolunteerTask
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string OrganizationId { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int MaxVolunteers { get; set; }
    public List<string> RequiredSkills { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}

public class TaskRegistration
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public string UserId { get; set; } = string.Empty;
    public string TaskId { get; set; } = string.Empty;
    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Registered"; // Registered, Confirmed, Completed, Cancelled
}

class Program
{
    private static IMongoDatabase _database = null!;
    
    static async Task Main(string[] args)
    {
        try
        {
            Console.WriteLine("🌱 Starting VolunteerSync Database Seeder...");
            
            // Connect to MongoDB (no authentication)
            var client = new MongoClient("mongodb://localhost:27017");
            _database = client.GetDatabase("VolunteerSync");
            
            Console.WriteLine("✅ Connected to MongoDB");
            
            // Clear existing data
            await ClearExistingData();
            
            // Seed data
            var organizations = await SeedOrganizations();
            var users = await SeedUsers();
            var tasks = await SeedVolunteerTasks(organizations);
            await SeedTaskRegistrations(users, tasks);
            
            Console.WriteLine("🎉 Database seeding completed successfully!");
            Console.WriteLine($"   - {organizations.Count} Organizations");
            Console.WriteLine($"   - {users.Count} Users");
            Console.WriteLine($"   - {tasks.Count} Volunteer Tasks");
            Console.WriteLine("   - Task Registrations created");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
        }
    }
    
    static async Task ClearExistingData()
    {
        Console.WriteLine("🧹 Clearing existing data...");
        
        await _database.DropCollectionAsync("organizations");
        await _database.DropCollectionAsync("users");
        await _database.DropCollectionAsync("volunteer_tasks");
        await _database.DropCollectionAsync("task_registrations");
        
        Console.WriteLine("✅ Existing data cleared");
    }
    
    static async Task<List<Organization>> SeedOrganizations()
    {
        Console.WriteLine("🏢 Seeding organizations...");
        
        var organizations = new List<Organization>
        {
            new Organization
            {
                Name = "Green Earth Foundation",
                Description = "Environmental conservation and sustainability organization focused on protecting natural resources and promoting eco-friendly practices.",
                Email = "contact@greenearth.org",
                Phone = "+1-555-0101",
                Address = "123 Eco Street, Green Valley, CA 90210"
            },
            new Organization
            {
                Name = "Community Food Bank",
                Description = "Fighting hunger in our community by providing food assistance to families and individuals in need.",
                Email = "help@communityfoodbank.org",
                Phone = "+1-555-0102",
                Address = "456 Helping Hand Ave, Downtown, CA 90211"
            },
            new Organization
            {
                Name = "Youth Education Alliance",
                Description = "Empowering youth through educational programs, mentorship, and skill development initiatives.",
                Email = "info@youthalliance.org",
                Phone = "+1-555-0103",
                Address = "789 Learning Lane, Education District, CA 90212"
            },
            new Organization
            {
                Name = "Senior Care Network",
                Description = "Providing support and companionship to elderly community members through various assistance programs.",
                Email = "support@seniorcare.org",
                Phone = "+1-555-0104",
                Address = "321 Care Circle, Sunset Hills, CA 90213"
            },
            new Organization
            {
                Name = "Animal Rescue Alliance",
                Description = "Rescuing, rehabilitating, and finding homes for abandoned and abused animals in our community.",
                Email = "rescue@animalalliance.org",
                Phone = "+1-555-0105",
                Address = "654 Paw Print Drive, Pet Haven, CA 90214"
            }
        };
        
        var collection = _database.GetCollection<Organization>("organizations");
        await collection.InsertManyAsync(organizations);
        
        Console.WriteLine($"✅ Created {organizations.Count} organizations");
        return organizations;
    }
    
    static async Task<List<User>> SeedUsers()
    {
        Console.WriteLine("👥 Seeding users...");
        
        var users = new List<User>
        {
            new User
            {
                FirstName = "Alice",
                LastName = "Johnson",
                Email = "alice.johnson@email.com",
                Phone = "+1-555-1001",
                Skills = new List<string> { "Teaching", "Environmental Science", "Event Planning" }
            },
            new User
            {
                FirstName = "Bob",
                LastName = "Smith",
                Email = "bob.smith@email.com",
                Phone = "+1-555-1002",
                Skills = new List<string> { "Construction", "Project Management", "Leadership" }
            },
            new User
            {
                FirstName = "Carol",
                LastName = "Davis",
                Email = "carol.davis@email.com",
                Phone = "+1-555-1003",
                Skills = new List<string> { "Cooking", "Food Service", "Organization" }
            },
            new User
            {
                FirstName = "David",
                LastName = "Wilson",
                Email = "david.wilson@email.com",
                Phone = "+1-555-1004",
                Skills = new List<string> { "Healthcare", "First Aid", "Elder Care" }
            },
            new User
            {
                FirstName = "Emma",
                LastName = "Brown",
                Email = "emma.brown@email.com",
                Phone = "+1-555-1005",
                Skills = new List<string> { "Animal Care", "Veterinary Assistant", "Training" }
            },
            new User
            {
                FirstName = "Frank",
                LastName = "Miller",
                Email = "frank.miller@email.com",
                Phone = "+1-555-1006",
                Skills = new List<string> { "Tutoring", "Mathematics", "Mentoring" }
            },
            new User
            {
                FirstName = "Grace",
                LastName = "Taylor",
                Email = "grace.taylor@email.com",
                Phone = "+1-555-1007",
                Skills = new List<string> { "Gardening", "Landscaping", "Environmental Education" }
            },
            new User
            {
                FirstName = "Henry",
                LastName = "Anderson",
                Email = "henry.anderson@email.com",
                Phone = "+1-555-1008",
                Skills = new List<string> { "Technology", "Computer Skills", "Digital Literacy" }
            },
            new User
            {
                FirstName = "Ivy",
                LastName = "Thomas",
                Email = "ivy.thomas@email.com",
                Phone = "+1-555-1009",
                Skills = new List<string> { "Art", "Creative Writing", "Workshop Facilitation" }
            },
            new User
            {
                FirstName = "Jack",
                LastName = "Martinez",
                Email = "jack.martinez@email.com",
                Phone = "+1-555-1010",
                Skills = new List<string> { "Sports", "Youth Coaching", "Team Building" }
            }
        };
        
        var collection = _database.GetCollection<User>("users");
        await collection.InsertManyAsync(users);
        
        Console.WriteLine($"✅ Created {users.Count} users");
        return users;
    }
    
    static async Task<List<VolunteerTask>> SeedVolunteerTasks(List<Organization> organizations)
    {
        Console.WriteLine("📋 Seeding volunteer tasks...");
        
        var tasks = new List<VolunteerTask>
        {
            // Green Earth Foundation tasks
            new VolunteerTask
            {
                Title = "Community Garden Setup",
                Description = "Help establish a new community garden by preparing soil, planting seeds, and setting up irrigation systems.",
                OrganizationId = organizations[0].Id!,
                StartDate = DateTime.UtcNow.AddDays(7),
                EndDate = DateTime.UtcNow.AddDays(8),
                MaxVolunteers = 15,
                RequiredSkills = new List<string> { "Gardening", "Physical Labor", "Environmental Science" }
            },
            new VolunteerTask
            {
                Title = "Beach Cleanup Drive",
                Description = "Join us for a coastal cleanup to remove trash and debris from local beaches and waterways.",
                OrganizationId = organizations[0].Id!,
                StartDate = DateTime.UtcNow.AddDays(14),
                EndDate = DateTime.UtcNow.AddDays(14),
                MaxVolunteers = 25,
                RequiredSkills = new List<string> { "Environmental Education", "Physical Labor" }
            },
            
            // Community Food Bank tasks
            new VolunteerTask
            {
                Title = "Food Sorting and Packaging",
                Description = "Sort donated food items and package them into family-sized portions for distribution.",
                OrganizationId = organizations[1].Id!,
                StartDate = DateTime.UtcNow.AddDays(3),
                EndDate = DateTime.UtcNow.AddDays(3),
                MaxVolunteers = 12,
                RequiredSkills = new List<string> { "Organization", "Food Service", "Attention to Detail" }
            },
            new VolunteerTask
            {
                Title = "Mobile Food Distribution",
                Description = "Help distribute food to families at various community locations using our mobile food truck.",
                OrganizationId = organizations[1].Id!,
                StartDate = DateTime.UtcNow.AddDays(10),
                EndDate = DateTime.UtcNow.AddDays(10),
                MaxVolunteers = 8,
                RequiredSkills = new List<string> { "Customer Service", "Physical Labor", "Driving" }
            },
            
            // Youth Education Alliance tasks
            new VolunteerTask
            {
                Title = "After-School Tutoring Program",
                Description = "Provide one-on-one tutoring support for elementary and middle school students in various subjects.",
                OrganizationId = organizations[2].Id!,
                StartDate = DateTime.UtcNow.AddDays(5),
                EndDate = DateTime.UtcNow.AddDays(35),
                MaxVolunteers = 10,
                RequiredSkills = new List<string> { "Teaching", "Mathematics", "Tutoring", "Mentoring" }
            },
            new VolunteerTask
            {
                Title = "STEM Workshop Facilitator",
                Description = "Lead hands-on science, technology, engineering, and math workshops for high school students.",
                OrganizationId = organizations[2].Id!,
                StartDate = DateTime.UtcNow.AddDays(21),
                EndDate = DateTime.UtcNow.AddDays(22),
                MaxVolunteers = 6,
                RequiredSkills = new List<string> { "Technology", "Workshop Facilitation", "STEM Education" }
            },
            
            // Senior Care Network tasks
            new VolunteerTask
            {
                Title = "Senior Companion Visits",
                Description = "Spend time with elderly residents, engaging in conversation, games, and light activities.",
                OrganizationId = organizations[3].Id!,
                StartDate = DateTime.UtcNow.AddDays(2),
                EndDate = DateTime.UtcNow.AddDays(30),
                MaxVolunteers = 15,
                RequiredSkills = new List<string> { "Elder Care", "Communication", "Patience" }
            },
            new VolunteerTask
            {
                Title = "Technology Training for Seniors",
                Description = "Teach seniors how to use smartphones, tablets, and computers to stay connected with family.",
                OrganizationId = organizations[3].Id!,
                StartDate = DateTime.UtcNow.AddDays(12),
                EndDate = DateTime.UtcNow.AddDays(19),
                MaxVolunteers = 5,
                RequiredSkills = new List<string> { "Technology", "Teaching", "Digital Literacy", "Patience" }
            },
            
            // Animal Rescue Alliance tasks
            new VolunteerTask
            {
                Title = "Dog Walking and Exercise",
                Description = "Help exercise our rescue dogs by taking them on walks and providing playtime.",
                OrganizationId = organizations[4].Id!,
                StartDate = DateTime.UtcNow.AddDays(1),
                EndDate = DateTime.UtcNow.AddDays(60),
                MaxVolunteers = 20,
                RequiredSkills = new List<string> { "Animal Care", "Physical Activity", "Reliability" }
            },
            new VolunteerTask
            {
                Title = "Animal Shelter Cleaning",
                Description = "Help maintain clean and sanitary conditions at our animal shelter facilities.",
                OrganizationId = organizations[4].Id!,
                StartDate = DateTime.UtcNow.AddDays(6),
                EndDate = DateTime.UtcNow.AddDays(6),
                MaxVolunteers = 8,
                RequiredSkills = new List<string> { "Animal Care", "Cleaning", "Physical Labor" }
            }
        };
        
        var collection = _database.GetCollection<VolunteerTask>("volunteer_tasks");
        await collection.InsertManyAsync(tasks);
        
        Console.WriteLine($"✅ Created {tasks.Count} volunteer tasks");
        return tasks;
    }
    
    static async Task SeedTaskRegistrations(List<User> users, List<VolunteerTask> tasks)
    {
        Console.WriteLine("📝 Seeding task registrations...");
        
        var registrations = new List<TaskRegistration>();
        var random = new Random();
        
        // Create realistic registrations - each user registers for 1-3 tasks
        foreach (var user in users)
        {
            var numberOfRegistrations = random.Next(1, 4); // 1-3 registrations per user
            var selectedTasks = tasks.OrderBy(x => random.Next()).Take(numberOfRegistrations);
            
            foreach (var task in selectedTasks)
            {
                registrations.Add(new TaskRegistration
                {
                    UserId = user.Id!,
                    TaskId = task.Id!,
                    RegisteredAt = DateTime.UtcNow.AddDays(-random.Next(1, 10)),
                    Status = random.Next(100) < 80 ? "Confirmed" : "Registered" // 80% confirmed
                });
            }
        }
        
        // Add a few completed registrations for past tasks
        for (int i = 0; i < 5; i++)
        {
            var user = users[random.Next(users.Count)];
            var task = tasks[random.Next(tasks.Count)];
            
            registrations.Add(new TaskRegistration
            {
                UserId = user.Id!,
                TaskId = task.Id!,
                RegisteredAt = DateTime.UtcNow.AddDays(-random.Next(30, 60)),
                Status = "Completed"
            });
        }
        
        var collection = _database.GetCollection<TaskRegistration>("task_registrations");
        await collection.InsertManyAsync(registrations);
        
        Console.WriteLine($"✅ Created {registrations.Count} task registrations");
    }
}
