// MongoDB seed script for VolunteerSync
// This creates all necessary collections with the correct naming conventions

// Connect to the VolunteerSync database
var db = db.getSiblingDB('VolunteerSync');

// Drop existing collections if they exist
db.organizations.drop();
db.users.drop();
db.volunteer_tasks.drop();
db.task_registrations.drop();

print("🧹 Cleared existing data");

// Create Organizations
var organizations = [
    {
        name: "Green Earth Foundation",
        description: "Environmental conservation and sustainability organization focused on protecting natural resources and promoting eco-friendly practices.",
        email: "contact@greenearth.org",
        phone: "+1-555-0101",
        address: "123 Eco Street, Green Valley, CA 90210",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isVerified: true
    },
    {
        name: "Community Food Bank",
        description: "Fighting hunger in our community by providing food assistance to families and individuals in need.",
        email: "help@communityfoodbank.org",
        phone: "+1-555-0102",
        address: "456 Helping Hand Ave, Downtown, CA 90211",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isVerified: true
    },
    {
        name: "Youth Education Alliance",
        description: "Empowering youth through educational programs, mentorship, and skill development initiatives.",
        email: "info@youthalliance.org",
        phone: "+1-555-0103",
        address: "789 Learning Lane, Education District, CA 90212",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isVerified: true
    },
    {
        name: "Senior Care Network",
        description: "Providing support and companionship to elderly community members through various assistance programs.",
        email: "support@seniorcare.org",
        phone: "+1-555-0104",
        address: "321 Care Circle, Sunset Hills, CA 90213",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isVerified: true
    },
    {
        name: "Animal Rescue Alliance",
        description: "Rescuing, rehabilitating, and finding homes for abandoned and abused animals in our community.",
        email: "rescue@animalalliance.org",
        phone: "+1-555-0105",
        address: "654 Paw Print Drive, Pet Haven, CA 90214",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isVerified: true
    }
];

// Insert organizations and keep their IDs
var orgIds = [];
organizations.forEach(function(org) {
    var result = db.organizations.insertOne(org);
    orgIds.push(result.insertedId);
});

print("✅ Created " + organizations.length + " organizations");

// Create Users
var users = [
    {
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice.johnson@email.com",
        phone: "+1-555-1001",
        skills: ["Teaching", "Environmental Science", "Event Planning"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi" // hashed "password123"
    },
    {
        firstName: "Bob",
        lastName: "Smith",
        email: "bob.smith@email.com",
        phone: "+1-555-1002",
        skills: ["Construction", "Project Management", "Leadership"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi" 
    },
    {
        firstName: "Carol",
        lastName: "Davis",
        email: "carol.davis@email.com",
        phone: "+1-555-1003",
        skills: ["Cooking", "Food Service", "Organization"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi"
    },
    {
        firstName: "David",
        lastName: "Wilson",
        email: "david.wilson@email.com",
        phone: "+1-555-1004",
        skills: ["Healthcare", "First Aid", "Elder Care"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi"
    },
    {
        firstName: "Emma",
        lastName: "Brown",
        email: "emma.brown@email.com",
        phone: "+1-555-1005",
        skills: ["Animal Care", "Veterinary Assistant", "Training"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi"
    },
    {
        firstName: "Frank",
        lastName: "Miller",
        email: "frank.miller@email.com",
        phone: "+1-555-1006",
        skills: ["Tutoring", "Mathematics", "Mentoring"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi"
    },
    {
        firstName: "Grace",
        lastName: "Taylor",
        email: "grace.taylor@email.com",
        phone: "+1-555-1007",
        skills: ["Gardening", "Landscaping", "Environmental Education"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi"
    },
    {
        firstName: "Henry",
        lastName: "Anderson",
        email: "henry.anderson@email.com",
        phone: "+1-555-1008",
        skills: ["Technology", "Computer Skills", "Digital Literacy"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi"
    },
    {
        firstName: "Ivy",
        lastName: "Thomas",
        email: "ivy.thomas@email.com",
        phone: "+1-555-1009",
        skills: ["Art", "Creative Writing", "Workshop Facilitation"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi"
    },
    {
        firstName: "Jack",
        lastName: "Martinez",
        email: "jack.martinez@email.com",
        phone: "+1-555-1010",
        skills: ["Sports", "Youth Coaching", "Team Building"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi"
    }
];

// Insert users and keep their IDs
var userIds = [];
users.forEach(function(user) {
    var result = db.users.insertOne(user);
    userIds.push(result.insertedId);
});

print("✅ Created " + users.length + " users");

// Create volunteer tasks
var now = new Date();
var tasks = [
    // Green Earth Foundation tasks
    {
        title: "Community Garden Setup",
        description: "Help establish a new community garden by preparing soil, planting seeds, and setting up irrigation systems.",
        organizationId: orgIds[0],
        startDate: new Date(now.getTime() + 7*24*60*60*1000),  // 7 days from now
        endDate: new Date(now.getTime() + 8*24*60*60*1000),    // 8 days from now
        maxVolunteers: 15,
        requiredSkills: ["Gardening", "Physical Labor", "Environmental Science"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: "Open"
    },
    {
        title: "Beach Cleanup Drive",
        description: "Join us for a coastal cleanup to remove trash and debris from local beaches and waterways.",
        organizationId: orgIds[0],
        startDate: new Date(now.getTime() + 14*24*60*60*1000), // 14 days from now
        endDate: new Date(now.getTime() + 14*24*60*60*1000),   // same day event
        maxVolunteers: 25,
        requiredSkills: ["Environmental Education", "Physical Labor"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: "Open"
    },
    
    // Community Food Bank tasks
    {
        title: "Food Sorting and Packaging",
        description: "Sort donated food items and package them into family-sized portions for distribution.",
        organizationId: orgIds[1],
        startDate: new Date(now.getTime() + 3*24*60*60*1000),  // 3 days from now
        endDate: new Date(now.getTime() + 3*24*60*60*1000),    // same day event
        maxVolunteers: 12,
        requiredSkills: ["Organization", "Food Service", "Attention to Detail"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: "Open"
    },
    {
        title: "Mobile Food Distribution",
        description: "Help distribute food to families at various community locations using our mobile food truck.",
        organizationId: orgIds[1],
        startDate: new Date(now.getTime() + 10*24*60*60*1000), // 10 days from now
        endDate: new Date(now.getTime() + 10*24*60*60*1000),   // same day event
        maxVolunteers: 8,
        requiredSkills: ["Customer Service", "Physical Labor", "Driving"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: "Open"
    },
    
    // Youth Education Alliance tasks
    {
        title: "After-School Tutoring Program",
        description: "Provide one-on-one tutoring support for elementary and middle school students in various subjects.",
        organizationId: orgIds[2],
        startDate: new Date(now.getTime() + 5*24*60*60*1000),  // 5 days from now
        endDate: new Date(now.getTime() + 35*24*60*60*1000),   // 35 days from now (long program)
        maxVolunteers: 10,
        requiredSkills: ["Teaching", "Mathematics", "Tutoring", "Mentoring"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: "Open"
    },
    {
        title: "STEM Workshop Facilitator",
        description: "Lead hands-on science, technology, engineering, and math workshops for high school students.",
        organizationId: orgIds[2],
        startDate: new Date(now.getTime() + 21*24*60*60*1000), // 21 days from now
        endDate: new Date(now.getTime() + 22*24*60*60*1000),   // 22 days from now
        maxVolunteers: 6,
        requiredSkills: ["Technology", "Workshop Facilitation", "STEM Education"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: "Open"
    },
    
    // Senior Care Network tasks
    {
        title: "Senior Companion Visits",
        description: "Spend time with elderly residents, engaging in conversation, games, and light activities.",
        organizationId: orgIds[3],
        startDate: new Date(now.getTime() + 2*24*60*60*1000),  // 2 days from now
        endDate: new Date(now.getTime() + 30*24*60*60*1000),   // 30 days from now (ongoing)
        maxVolunteers: 15,
        requiredSkills: ["Elder Care", "Communication", "Patience"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: "Open"
    },
    {
        title: "Technology Training for Seniors",
        description: "Teach seniors how to use smartphones, tablets, and computers to stay connected with family.",
        organizationId: orgIds[3],
        startDate: new Date(now.getTime() + 12*24*60*60*1000), // 12 days from now
        endDate: new Date(now.getTime() + 19*24*60*60*1000),   // 19 days from now
        maxVolunteers: 5,
        requiredSkills: ["Technology", "Teaching", "Digital Literacy", "Patience"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: "Open"
    },
    
    // Animal Rescue Alliance tasks
    {
        title: "Dog Walking and Exercise",
        description: "Help exercise our rescue dogs by taking them on walks and providing playtime.",
        organizationId: orgIds[4],
        startDate: new Date(now.getTime() + 1*24*60*60*1000),  // 1 day from now
        endDate: new Date(now.getTime() + 60*24*60*60*1000),   // 60 days from now (ongoing)
        maxVolunteers: 20,
        requiredSkills: ["Animal Care", "Physical Activity", "Reliability"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: "Open"
    },
    {
        title: "Animal Shelter Cleaning",
        description: "Help maintain clean and sanitary conditions at our animal shelter facilities.",
        organizationId: orgIds[4],
        startDate: new Date(now.getTime() + 6*24*60*60*1000),  // 6 days from now
        endDate: new Date(now.getTime() + 6*24*60*60*1000),    // same day event
        maxVolunteers: 8,
        requiredSkills: ["Animal Care", "Cleaning", "Physical Labor"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: "Open"
    }
];

// Insert tasks and keep their IDs
var taskIds = [];
tasks.forEach(function(task) {
    var result = db.volunteer_tasks.insertOne(task);
    taskIds.push(result.insertedId);
});

print("✅ Created " + tasks.length + " volunteer tasks");

// Create Task Registrations
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
            registeredAt: new Date(now.getTime() - (Math.floor(random() * 10) + 1) * 24*60*60*1000), // 1-10 days ago
            status: random() < 0.8 ? "Confirmed" : "Registered", // 80% confirmed
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
        registeredAt: new Date(now.getTime() - (Math.floor(random() * 30) + 30) * 24*60*60*1000), // 30-60 days ago
        status: "Completed",
        createdAt: new Date(),
        updatedAt: new Date()
    });
}

// Insert all registrations
if (registrations.length > 0) {
    db.task_registrations.insertMany(registrations);
}

print("✅ Created " + registrations.length + " task registrations");
print("🎉 Database seeding completed successfully!");
