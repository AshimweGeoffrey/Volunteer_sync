using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace VolunteerSyncSeeder;

// Simple models for seeding
public class Organization
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public List<string> Skills { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class VolunteerTask
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    [BsonRepresentation(BsonType.ObjectId)]
    public string OrganizationId { get; set; } = string.Empty;
    
    public List<string> RequiredSkills { get; set; } = new();
    public DateTime EventDate { get; set; }
    public int MaxVolunteers { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class TaskRegistration
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    [BsonRepresentation(BsonType.ObjectId)]
    public string TaskId { get; set; } = string.Empty;
    
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;
    
    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Registered"; // Registered, Completed, Cancelled
}

public class Program
{
    private static readonly string ConnectionString = "mongodb://localhost:27017";
    private static readonly string DatabaseName = "VolunteerSync";

    public static async Task Main(string[] args)
    {
        Console.WriteLine("🌟 VolunteerSync Database Seeder");
        Console.WriteLine("================================");

        try
        {
            var client = new MongoClient(ConnectionString);
            var database = client.GetDatabase(DatabaseName);

            Console.WriteLine($"✅ Connected to MongoDB: {DatabaseName}");

            // Clear existing data
            await ClearDatabase(database);
            
            // Seed data
            var organizations = await SeedOrganizations(database);
            var users = await SeedUsers(database);
            var tasks = await SeedVolunteerTasks(database, organizations);
            await SeedTaskRegistrations(database, tasks, users);

            Console.WriteLine("🎉 Database seeding completed successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error seeding database: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
        }
    }

    private static async Task ClearDatabase(IMongoDatabase database)
    {
        Console.WriteLine("🧹 Clearing existing data...");
        
        await database.GetCollection<Organization>("Organizations").DeleteManyAsync(FilterDefinition<Organization>.Empty);
        await database.GetCollection<User>("Users").DeleteManyAsync(FilterDefinition<User>.Empty);
        await database.GetCollection<VolunteerTask>("VolunteerTasks").DeleteManyAsync(FilterDefinition<VolunteerTask>.Empty);
        await database.GetCollection<TaskRegistration>("TaskRegistrations").DeleteManyAsync(FilterDefinition<TaskRegistration>.Empty);
        
        Console.WriteLine("✅ Database cleared");
    }

    private static async Task<List<Organization>> SeedOrganizations(IMongoDatabase database)
    {
        Console.WriteLine("📊 Seeding Organizations...");
        
        var collection = database.GetCollection<Organization>("Organizations");
        
        var organizations = new List<Organization>
        {
            new Organization
            {
                Name = "Green Earth Foundation",
                Description = "Environmental conservation and sustainability initiatives",
                Website = "https://greenearthfoundation.org",
                ContactEmail = "contact@greenearthfoundation.org"
            },
            new Organization
            {
                Name = "Community Food Bank",
                Description = "Fighting hunger in our local community",
                Website = "https://communityfoodbank.org",
                ContactEmail = "volunteers@communityfoodbank.org"
            },
            new Organization
            {
                Name = "Youth Education Alliance",
                Description = "Supporting educational opportunities for underprivileged youth",
                Website = "https://youtheducationalliance.org",
                ContactEmail = "info@youtheducationalliance.org"
            },
            new Organization
            {
                Name = "Senior Care Network",
                Description = "Providing companionship and support for elderly community members",
                Website = "https://seniorcarenetwork.org",
                ContactEmail = "help@seniorcarenetwork.org"
            },
            new Organization
            {
                Name = "Animal Rescue Haven",
                Description = "Rescuing and rehabilitating abandoned animals",
                Website = "https://animalrescuehaven.org",
                ContactEmail = "rescue@animalrescuehaven.org"
            }
        };

        await collection.InsertManyAsync(organizations);
        Console.WriteLine($"✅ Created {organizations.Count} organizations");
        
        return organizations;
    }

    private static async Task<List<User>> SeedUsers(IMongoDatabase database)
    {
        Console.WriteLine("👥 Seeding Users...");
        
        var collection = database.GetCollection<User>("Users");
        
        var users = new List<User>
        {
            new User
            {
                FirstName = "Alice",
                LastName = "Johnson",
                Email = "alice.johnson@email.com",
                PhoneNumber = "+1-555-0101",
                Skills = new List<string> { "Teaching", "Event Planning", "Communication" }
            },
            new User
            {
                FirstName = "Bob",
                LastName = "Smith",
                Email = "bob.smith@email.com",
                PhoneNumber = "+1-555-0102",
                Skills = new List<string> { "Construction", "Manual Labor", "Leadership" }
            },
            new User
            {
                FirstName = "Carol",
                LastName = "Davis",
                Email = "carol.davis@email.com",
                PhoneNumber = "+1-555-0103",
                Skills = new List<string> { "Nursing", "First Aid", "Patient Care" }
            },
            new User
            {
                FirstName = "David",
                LastName = "Wilson",
                Email = "david.wilson@email.com",
                PhoneNumber = "+1-555-0104",
                Skills = new List<string> { "IT Support", "Computer Skills", "Training" }
            },
            new User
            {
                FirstName = "Emma",
                LastName = "Brown",
                Email = "emma.brown@email.com",
                PhoneNumber = "+1-555-0105",
                Skills = new List<string> { "Cooking", "Food Service", "Organization" }
            },
            new User
            {
                FirstName = "Frank",
                LastName = "Miller",
                Email = "frank.miller@email.com",
                PhoneNumber = "+1-555-0106",
                Skills = new List<string> { "Animal Care", "Veterinary Assistant", "Compassion" }
            },
            new User
            {
                FirstName = "Grace",
                LastName = "Taylor",
                Email = "grace.taylor@email.com",
                PhoneNumber = "+1-555-0107",
                Skills = new List<string> { "Tutoring", "Mathematics", "Mentoring" }
            },
            new User
            {
                FirstName = "Henry",
                LastName = "Anderson",
                Email = "henry.anderson@email.com",
                PhoneNumber = "+1-555-0108",
                Skills = new List<string> { "Gardening", "Environmental Science", "Physical Labor" }
            },
            new User
            {
                FirstName = "Iris",
                LastName = "Thomas",
                Email = "iris.thomas@email.com",
                PhoneNumber = "+1-555-0109",
                Skills = new List<string> { "Social Work", "Counseling", "Elderly Care" }
            },
            new User
            {
                FirstName = "Jack",
                LastName = "Martinez",
                Email = "jack.martinez@email.com",
                PhoneNumber = "+1-555-0110",
                Skills = new List<string> { "Photography", "Social Media", "Event Documentation" }
            }
        };

        await collection.InsertManyAsync(users);
        Console.WriteLine($"✅ Created {users.Count} users");
        
        return users;
    }

    private static async Task<List<VolunteerTask>> SeedVolunteerTasks(IMongoDatabase database, List<Organization> organizations)
    {
        Console.WriteLine("📋 Seeding Volunteer Tasks...");
        
        var collection = database.GetCollection<VolunteerTask>("VolunteerTasks");
        
        var tasks = new List<VolunteerTask>
        {
            new VolunteerTask
            {
                Title = "Community Garden Cleanup",
                Description = "Help clean and maintain our community garden spaces",
                OrganizationId = organizations[0].Id!, // Green Earth Foundation
                RequiredSkills = new List<string> { "Gardening", "Physical Labor" },
                EventDate = DateTime.UtcNow.AddDays(7),
                MaxVolunteers = 15,
                Location = "Central Community Garden, Main Street"
            },
            new VolunteerTask
            {
                Title = "Food Bank Sorting",
                Description = "Sort and organize food donations for distribution",
                OrganizationId = organizations[1].Id!, // Community Food Bank
                RequiredSkills = new List<string> { "Organization", "Physical Labor" },
                EventDate = DateTime.UtcNow.AddDays(3),
                MaxVolunteers = 10,
                Location = "Food Bank Warehouse, Industrial District"
            },
            new VolunteerTask
            {
                Title = "After-School Tutoring",
                Description = "Provide educational support to elementary school children",
                OrganizationId = organizations[2].Id!, // Youth Education Alliance
                RequiredSkills = new List<string> { "Teaching", "Tutoring", "Mathematics" },
                EventDate = DateTime.UtcNow.AddDays(1),
                MaxVolunteers = 8,
                Location = "Lincoln Elementary School"
            },
            new VolunteerTask
            {
                Title = "Senior Center Activities",
                Description = "Lead recreational activities and provide companionship",
                OrganizationId = organizations[3].Id!, // Senior Care Network
                RequiredSkills = new List<string> { "Social Work", "Elderly Care", "Communication" },
                EventDate = DateTime.UtcNow.AddDays(5),
                MaxVolunteers = 6,
                Location = "Sunset Senior Center"
            },
            new VolunteerTask
            {
                Title = "Animal Shelter Care",
                Description = "Help care for rescued animals and assist with adoptions",
                OrganizationId = organizations[4].Id!, // Animal Rescue Haven
                RequiredSkills = new List<string> { "Animal Care", "Compassion" },
                EventDate = DateTime.UtcNow.AddDays(2),
                MaxVolunteers = 12,
                Location = "Animal Rescue Haven Shelter"
            },
            new VolunteerTask
            {
                Title = "Environmental Awareness Workshop",
                Description = "Help organize and present environmental education workshops",
                OrganizationId = organizations[0].Id!, // Green Earth Foundation
                RequiredSkills = new List<string> { "Teaching", "Environmental Science", "Event Planning" },
                EventDate = DateTime.UtcNow.AddDays(14),
                MaxVolunteers = 5,
                Location = "Community Center Auditorium"
            },
            new VolunteerTask
            {
                Title = "Holiday Food Drive",
                Description = "Coordinate collection and distribution of holiday meals",
                OrganizationId = organizations[1].Id!, // Community Food Bank
                RequiredSkills = new List<string> { "Event Planning", "Organization", "Communication" },
                EventDate = DateTime.UtcNow.AddDays(21),
                MaxVolunteers = 20,
                Location = "Multiple Collection Points"
            },
            new VolunteerTask
            {
                Title = "Computer Skills Workshop",
                Description = "Teach basic computer skills to youth and seniors",
                OrganizationId = organizations[2].Id!, // Youth Education Alliance
                RequiredSkills = new List<string> { "IT Support", "Computer Skills", "Training" },
                EventDate = DateTime.UtcNow.AddDays(10),
                MaxVolunteers = 4,
                Location = "Public Library Computer Lab"
            },
            new VolunteerTask
            {
                Title = "Senior Health Fair",
                Description = "Assist with health screenings and wellness activities",
                OrganizationId = organizations[3].Id!, // Senior Care Network
                RequiredSkills = new List<string> { "Nursing", "First Aid", "Patient Care" },
                EventDate = DateTime.UtcNow.AddDays(28),
                MaxVolunteers = 8,
                Location = "Community Health Center"
            },
            new VolunteerTask
            {
                Title = "Pet Adoption Event",
                Description = "Help organize and run pet adoption events",
                OrganizationId = organizations[4].Id!, // Animal Rescue Haven
                RequiredSkills = new List<string> { "Animal Care", "Event Planning", "Social Media" },
                EventDate = DateTime.UtcNow.AddDays(12),
                MaxVolunteers = 10,
                Location = "City Park Pavilion"
            }
        };

        await collection.InsertManyAsync(tasks);
        Console.WriteLine($"✅ Created {tasks.Count} volunteer tasks");
        
        return tasks;
    }

    private static async Task SeedTaskRegistrations(IMongoDatabase database, List<VolunteerTask> tasks, List<User> users)
    {
        Console.WriteLine("📝 Seeding Task Registrations...");
        
        var collection = database.GetCollection<TaskRegistration>("TaskRegistrations");
        var registrations = new List<TaskRegistration>();
        var random = new Random();

        // Create realistic registrations
        foreach (var task in tasks)
        {
            // Randomly assign 30-80% of max volunteers to each task
            var numVolunteers = random.Next((int)(task.MaxVolunteers * 0.3), (int)(task.MaxVolunteers * 0.8) + 1);
            var selectedUsers = users.OrderBy(x => random.Next()).Take(numVolunteers);

            foreach (var user in selectedUsers)
            {
                registrations.Add(new TaskRegistration
                {
                    TaskId = task.Id!,
                    UserId = user.Id!,
                    RegisteredAt = DateTime.UtcNow.AddDays(-random.Next(1, 10)), // Registered 1-10 days ago
                    Status = random.Next(100) < 90 ? "Registered" : "Completed" // 90% registered, 10% completed
                });
            }
        }

        if (registrations.Any())
        {
            await collection.InsertManyAsync(registrations);
        }
        
        Console.WriteLine($"✅ Created {registrations.Count} task registrations");
    }
}
