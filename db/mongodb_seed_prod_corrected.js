// MongoDB seed script for VolunteerSync Production Database
// This creates all necessary collections with the correct structure matching C# entities

// Connect to the VolunteerSyncDB_Prod database
var db = db.getSiblingDB('VolunteerSyncDB_Prod');

// Drop existing collections if they exist
db.organizations.drop();
db.users.drop();
db.volunteer_tasks.drop();
db.task_registrations.drop();

print("🧹 Cleared existing data");

// Create Organizations with correct structure matching C# entities
var organizations = [
    {
        name: "Green Earth Foundation",
        description: "Environmental conservation and sustainability organization focused on protecting natural resources and promoting eco-friendly practices.",
        contactInfo: {
            email: "contact@greenearth.org",
            phone: "+1-555-0101",
            website: "https://greenearth.org",
            socialMedia: {
                "facebook": "https://facebook.com/greenearth",
                "twitter": "https://twitter.com/greenearth"
            }
        },
        address: {
            street: "123 Eco Street",
            city: "Green Valley",
            state: "CA",
            zipCode: "90210",
            country: "USA",
            latitude: 34.0522,
            longitude: -118.2437
        },
        website: "https://greenearth.org",
        logoUrl: "",
        categories: ["Environment", "Conservation"],
        isVerified: true,
        isActive: true,
        memberCount: 0,
        taskCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Community Food Bank",
        description: "Fighting hunger in our community by providing food assistance to families and individuals in need.",
        contactInfo: {
            email: "help@communityfoodbank.org",
            phone: "+1-555-0102",
            website: "https://communityfoodbank.org",
            socialMedia: {
                "facebook": "https://facebook.com/communityfoodbank",
                "instagram": "https://instagram.com/communityfoodbank"
            }
        },
        address: {
            street: "456 Helping Hand Ave",
            city: "Downtown",
            state: "CA",
            zipCode: "90211",
            country: "USA",
            latitude: 34.0522,
            longitude: -118.2437
        },
        website: "https://communityfoodbank.org",
        logoUrl: "",
        categories: ["Community Service", "Food Security"],
        isVerified: true,
        isActive: true,
        memberCount: 0,
        taskCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Youth Education Alliance",
        description: "Empowering youth through educational programs, mentorship, and skill development initiatives.",
        contactInfo: {
            email: "info@youthalliance.org",
            phone: "+1-555-0103",
            website: "https://youthalliance.org",
            socialMedia: {
                "linkedin": "https://linkedin.com/company/youthalliance",
                "twitter": "https://twitter.com/youthalliance"
            }
        },
        address: {
            street: "789 Learning Lane",
            city: "Education District",
            state: "CA",
            zipCode: "90212",
            country: "USA",
            latitude: 34.0522,
            longitude: -118.2437
        },
        website: "https://youthalliance.org",
        logoUrl: "",
        categories: ["Education", "Youth Development"],
        isVerified: true,
        isActive: true,
        memberCount: 0,
        taskCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Senior Care Network",
        description: "Providing support and companionship to elderly community members through various assistance programs.",
        contactInfo: {
            email: "support@seniorcare.org",
            phone: "+1-555-0104",
            website: "https://seniorcare.org",
            socialMedia: {
                "facebook": "https://facebook.com/seniorcare"
            }
        },
        address: {
            street: "321 Care Circle",
            city: "Sunset Hills",
            state: "CA",
            zipCode: "90213",
            country: "USA",
            latitude: 34.0522,
            longitude: -118.2437
        },
        website: "https://seniorcare.org",
        logoUrl: "",
        categories: ["Healthcare", "Senior Services"],
        isVerified: true,
        isActive: true,
        memberCount: 0,
        taskCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Animal Rescue Alliance",
        description: "Rescuing, rehabilitating, and finding homes for abandoned and abused animals in our community.",
        contactInfo: {
            email: "rescue@animalalliance.org",
            phone: "+1-555-0105",
            website: "https://animalalliance.org",
            socialMedia: {
                "facebook": "https://facebook.com/animalrescue",
                "instagram": "https://instagram.com/animalrescue"
            }
        },
        address: {
            street: "654 Paw Print Drive",
            city: "Pet Haven",
            state: "CA",
            zipCode: "90214",
            country: "USA",
            latitude: 34.0522,
            longitude: -118.2437
        },
        website: "https://animalalliance.org",
        logoUrl: "",
        categories: ["Animal Welfare", "Rescue"],
        isVerified: true,
        isActive: true,
        memberCount: 0,
        taskCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

// Insert organizations and keep their IDs
var orgIds = [];
organizations.forEach(function(org) {
    var result = db.organizations.insertOne(org);
    orgIds.push(result.insertedId);
});

print("✅ Created " + organizations.length + " organizations");

// Create Users with correct structure
var users = [
    {
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice.johnson@email.com",
        phone: "+1-555-1001",
        skills: ["Teaching", "Environmental Science", "Event Planning"],
        preferences: {
            categories: ["Education", "Environment"],
            maxDistance: 25,
            availableDays: ["Monday", "Wednesday", "Friday"]
        },
        role: 0, // User role
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi", // hashed "password123"
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        firstName: "Bob",
        lastName: "Smith",
        email: "bob.smith@email.com",
        phone: "+1-555-1002",
        skills: ["Construction", "Project Management", "Leadership"],
        preferences: {
            categories: ["Community Service", "Environment"],
            maxDistance: 30,
            availableDays: ["Saturday", "Sunday"]
        },
        role: 0,
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        firstName: "Carol",
        lastName: "Davis",
        email: "carol.davis@email.com",
        phone: "+1-555-1003",
        skills: ["Cooking", "Food Service", "Organization"],
        preferences: {
            categories: ["Community Service"],
            maxDistance: 20,
            availableDays: ["Tuesday", "Thursday", "Saturday"]
        },
        role: 0,
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        firstName: "David",
        lastName: "Wilson",
        email: "david.wilson@email.com",
        phone: "+1-555-1004",
        skills: ["Healthcare", "First Aid", "Elder Care"],
        preferences: {
            categories: ["Healthcare", "Senior Services"],
            maxDistance: 15,
            availableDays: ["Monday", "Tuesday", "Wednesday"]
        },
        role: 0,
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        firstName: "Emma",
        lastName: "Brown",
        email: "emma.brown@email.com",
        phone: "+1-555-1005",
        skills: ["Animal Care", "Veterinary Assistant", "Training"],
        preferences: {
            categories: ["Animal Welfare"],
            maxDistance: 40,
            availableDays: ["Friday", "Saturday", "Sunday"]
        },
        role: 0,
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        firstName: "Frank",
        lastName: "Miller",
        email: "frank.miller@email.com",
        phone: "+1-555-1006",
        skills: ["Tutoring", "Mathematics", "Mentoring"],
        preferences: {
            categories: ["Education"],
            maxDistance: 25,
            availableDays: ["Monday", "Wednesday", "Friday"]
        },
        role: 0,
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        firstName: "Grace",
        lastName: "Taylor",
        email: "grace.taylor@email.com",
        phone: "+1-555-1007",
        skills: ["Gardening", "Landscaping", "Environmental Education"],
        preferences: {
            categories: ["Environment", "Education"],
            maxDistance: 35,
            availableDays: ["Thursday", "Friday", "Saturday"]
        },
        role: 0,
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        firstName: "Henry",
        lastName: "Anderson",
        email: "henry.anderson@email.com",
        phone: "+1-555-1008",
        skills: ["Technology", "Computer Skills", "Digital Literacy"],
        preferences: {
            categories: ["Education", "Technology"],
            maxDistance: 20,
            availableDays: ["Tuesday", "Thursday"]
        },
        role: 0,
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        firstName: "Ivy",
        lastName: "Thomas",
        email: "ivy.thomas@email.com",
        phone: "+1-555-1009",
        skills: ["Art", "Creative Writing", "Workshop Facilitation"],
        preferences: {
            categories: ["Arts", "Education"],
            maxDistance: 30,
            availableDays: ["Saturday", "Sunday"]
        },
        role: 0,
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        firstName: "Jack",
        lastName: "Martinez",
        email: "jack.martinez@email.com",
        phone: "+1-555-1010",
        skills: ["Sports", "Youth Coaching", "Team Building"],
        preferences: {
            categories: ["Sports", "Youth Development"],
            maxDistance: 25,
            availableDays: ["Wednesday", "Saturday", "Sunday"]
        },
        role: 0,
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi",
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

// Insert users and keep their IDs
var userIds = [];
users.forEach(function(user) {
    var result = db.users.insertOne(user);
    userIds.push(result.insertedId);
});

print("✅ Created " + users.length + " users");

// Create volunteer tasks with correct structure
var now = new Date();
var tasks = [
    // Green Earth Foundation tasks
    {
        title: "Community Garden Setup",
        description: "Help establish a new community garden by preparing soil, planting seeds, and setting up irrigation systems.",
        organizationId: orgIds[0],
        category: 2, // Environment enum value
        startDate: new Date(now.getTime() + 7*24*60*60*1000),  // 7 days from now
        endDate: new Date(now.getTime() + 8*24*60*60*1000),    // 8 days from now
        maxVolunteers: 15,
        currentVolunteers: 0,
        requiredSkills: ["Gardening", "Physical Labor", "Environmental Science"],
        status: 1, // Active
        location: {
            street: "100 Garden Ave",
            city: "Green Valley",
            state: "CA",
            zipCode: "90210",
            country: "USA",
            latitude: 34.0522,
            longitude: -118.2437
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Beach Cleanup Drive",
        description: "Join us for a coastal cleanup to remove trash and debris from local beaches and waterways.",
        organizationId: orgIds[0],
        category: 2, // Environment
        startDate: new Date(now.getTime() + 14*24*60*60*1000), // 14 days from now
        endDate: new Date(now.getTime() + 14*24*60*60*1000),   // same day event
        maxVolunteers: 25,
        currentVolunteers: 0,
        requiredSkills: ["Environmental Education", "Physical Labor"],
        status: 1, // Active
        location: {
            street: "Pacific Coast Highway",
            city: "Malibu",
            state: "CA",
            zipCode: "90265",
            country: "USA",
            latitude: 34.0259,
            longitude: -118.7798
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    
    // Community Food Bank tasks
    {
        title: "Food Sorting and Packaging",
        description: "Sort donated food items and package them into family-sized portions for distribution.",
        organizationId: orgIds[1],
        category: 3, // CommunityService
        startDate: new Date(now.getTime() + 3*24*60*60*1000),  // 3 days from now
        endDate: new Date(now.getTime() + 3*24*60*60*1000),    // same day event
        maxVolunteers: 12,
        currentVolunteers: 0,
        requiredSkills: ["Organization", "Food Service", "Attention to Detail"],
        status: 1, // Active
        location: {
            street: "456 Helping Hand Ave",
            city: "Downtown",
            state: "CA",
            zipCode: "90211",
            country: "USA",
            latitude: 34.0522,
            longitude: -118.2437
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Mobile Food Distribution",
        description: "Help distribute food to families at various community locations using our mobile food truck.",
        organizationId: orgIds[1],
        category: 3, // CommunityService
        startDate: new Date(now.getTime() + 10*24*60*60*1000), // 10 days from now
        endDate: new Date(now.getTime() + 10*24*60*60*1000),   // same day event
        maxVolunteers: 8,
        currentVolunteers: 0,
        requiredSkills: ["Customer Service", "Physical Labor", "Driving"],
        status: 1, // Active
        location: {
            street: "Various Community Locations",
            city: "Downtown",
            state: "CA",
            zipCode: "90211",
            country: "USA",
            latitude: 34.0522,
            longitude: -118.2437
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    
    // Youth Education Alliance tasks
    {
        title: "After-School Tutoring Program",
        description: "Provide one-on-one tutoring support for elementary and middle school students in various subjects.",
        organizationId: orgIds[2],
        category: 0, // Education
        startDate: new Date(now.getTime() + 5*24*60*60*1000),  // 5 days from now
        endDate: new Date(now.getTime() + 35*24*60*60*1000),   // 35 days from now (long program)
        maxVolunteers: 10,
        currentVolunteers: 0,
        requiredSkills: ["Teaching", "Mathematics", "Tutoring", "Mentoring"],
        status: 1, // Active
        location: {
            street: "789 Learning Lane",
            city: "Education District",
            state: "CA",
            zipCode: "90212",
            country: "USA",
            latitude: 34.0522,
            longitude: -118.2437
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "STEM Workshop Facilitator",
        description: "Lead hands-on science, technology, engineering, and math workshops for high school students.",
        organizationId: orgIds[2],
        category: 0, // Education
        startDate: new Date(now.getTime() + 21*24*60*60*1000), // 21 days from now
        endDate: new Date(now.getTime() + 22*24*60*60*1000),   // 22 days from now
        maxVolunteers: 6,
        currentVolunteers: 0,
        requiredSkills: ["Technology", "Workshop Facilitation", "STEM Education"],
        status: 1, // Active
        location: {
            street: "789 Learning Lane",
            city: "Education District",
            state: "CA",
            zipCode: "90212",
            country: "USA",
            latitude: 34.0522,
            longitude: -118.2437
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    
    // Senior Care Network tasks
    {
        title: "Senior Companion Visits",
        description: "Spend time with elderly residents, engaging in conversation, games, and light activities.",
        organizationId: orgIds[3],
        category: 1, // Healthcare
        startDate: new Date(now.getTime() + 2*24*60*60*1000),  // 2 days from now
        endDate: new Date(now.getTime() + 30*24*60*60*1000),   // 30 days from now (ongoing)
        maxVolunteers: 15,
        currentVolunteers: 0,
        requiredSkills: ["Elder Care", "Communication", "Patience"],
        status: 1, // Active
        location: {
            street: "321 Care Circle",
            city: "Sunset Hills",
            state: "CA",
            zipCode: "90213",
            country: "USA",
            latitude: 34.0522,
            longitude: -118.2437
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Technology Training for Seniors",
        description: "Teach seniors how to use smartphones, tablets, and computers to stay connected with family.",
        organizationId: orgIds[3],
        category: 0, // Education
        startDate: new Date(now.getTime() + 12*24*60*60*1000), // 12 days from now
        endDate: new Date(now.getTime() + 19*24*60*60*1000),   // 19 days from now
        maxVolunteers: 5,
        currentVolunteers: 0,
        requiredSkills: ["Technology", "Teaching", "Digital Literacy", "Patience"],
        status: 1, // Active
        location: {
            street: "321 Care Circle",
            city: "Sunset Hills",
            state: "CA",
            zipCode: "90213",
            country: "USA",
            latitude: 34.0522,
            longitude: -118.2437
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    
    // Animal Rescue Alliance tasks
    {
        title: "Dog Walking and Exercise",
        description: "Help exercise our rescue dogs by taking them on walks and providing playtime.",
        organizationId: orgIds[4],
        category: 4, // AnimalWelfare
        startDate: new Date(now.getTime() + 1*24*60*60*1000),  // 1 day from now
        endDate: new Date(now.getTime() + 60*24*60*60*1000),   // 60 days from now (ongoing)
        maxVolunteers: 20,
        currentVolunteers: 0,
        requiredSkills: ["Animal Care", "Physical Activity", "Reliability"],
        status: 1, // Active
        location: {
            street: "654 Paw Print Drive",
            city: "Pet Haven",
            state: "CA",
            zipCode: "90214",
            country: "USA",
            latitude: 34.0522,
            longitude: -118.2437
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "Animal Shelter Cleaning",
        description: "Help maintain clean and sanitary conditions at our animal shelter facilities.",
        organizationId: orgIds[4],
        category: 4, // AnimalWelfare
        startDate: new Date(now.getTime() + 6*24*60*60*1000),  // 6 days from now
        endDate: new Date(now.getTime() + 6*24*60*60*1000),    // same day event
        maxVolunteers: 8,
        currentVolunteers: 0,
        requiredSkills: ["Animal Care", "Cleaning", "Physical Labor"],
        status: 1, // Active
        location: {
            street: "654 Paw Print Drive",
            city: "Pet Haven",
            state: "CA",
            zipCode: "90214",
            country: "USA",
            latitude: 34.0522,
            longitude: -118.2437
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

// Insert tasks and keep their IDs
var taskIds = [];
tasks.forEach(function(task) {
    var result = db.volunteer_tasks.insertOne(task);
    taskIds.push(result.insertedId);
});

print("✅ Created " + tasks.length + " volunteer tasks");

// Create Task Registrations with correct structure
var registrations = [];
var random = Math.random;

// Create realistic registrations - each user registers for 1-3 tasks
users.forEach(function(user, userIndex) {
    var numberOfRegistrations = Math.floor(random() * 3) + 1; // 1-3 registrations per user
    var shuffledTaskIds = [...taskIds].sort(() => 0.5 - random()); // Shuffle tasks
    
    for (var i = 0; i < numberOfRegistrations && i < shuffledTaskIds.length; i++) {
        registrations.push({
            userId: userIds[userIndex],
            taskId: shuffledTaskIds[i],
            status: random() < 0.8 ? 1 : 0, // 80% approved (1), 20% pending (0)
            registeredAt: new Date(now.getTime() - (Math.floor(random() * 10) + 1) * 24*60*60*1000), // 1-10 days ago
            approvedAt: random() < 0.8 ? new Date(now.getTime() - (Math.floor(random() * 5) + 1) * 24*60*60*1000) : null,
            notes: "",
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
});

// Add a few completed registrations for past tasks
for (var i = 0; i < 5; i++) {
    var userIdx = Math.floor(random() * users.length);
    var taskIdx = Math.floor(random() * tasks.length);
    
    registrations.push({
        userId: userIds[userIdx],
        taskId: taskIds[taskIdx],
        status: 3, // Completed
        registeredAt: new Date(now.getTime() - (Math.floor(random() * 30) + 30) * 24*60*60*1000), // 30-60 days ago
        approvedAt: new Date(now.getTime() - (Math.floor(random() * 25) + 25) * 24*60*60*1000), // 25-55 days ago
        completedAt: new Date(now.getTime() - (Math.floor(random() * 5) + 1) * 24*60*60*1000), // 1-5 days ago
        notes: "Task completed successfully",
        createdAt: new Date(),
        updatedAt: new Date()
    });
}

// Insert all registrations
if (registrations.length > 0) {
    db.task_registrations.insertMany(registrations);
}

print("✅ Created " + registrations.length + " task registrations");
print("🎉 Production database seeding completed successfully with correct structure!");

// Create indexes for better performance
db.organizations.createIndex({ "name": 1 });
db.organizations.createIndex({ "contactInfo.email": 1 });
db.organizations.createIndex({ "isActive": 1 });
db.organizations.createIndex({ "isVerified": 1 });

db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "firstName": 1, "lastName": 1 });
db.users.createIndex({ "isActive": 1 });

db.volunteer_tasks.createIndex({ "organizationId": 1 });
db.volunteer_tasks.createIndex({ "category": 1 });
db.volunteer_tasks.createIndex({ "status": 1 });
db.volunteer_tasks.createIndex({ "startDate": 1 });
db.volunteer_tasks.createIndex({ "isActive": 1 });

db.task_registrations.createIndex({ "userId": 1 });
db.task_registrations.createIndex({ "taskId": 1 });
db.task_registrations.createIndex({ "status": 1 });
db.task_registrations.createIndex({ "userId": 1, "taskId": 1 }, { unique: true });

print("✅ Created database indexes for optimal performance");
