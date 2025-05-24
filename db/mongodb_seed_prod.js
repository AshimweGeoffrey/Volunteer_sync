// MongoDB seed script for VolunteerSync Production Database
// This creates all necessary collections with the correct naming conventions

// Connect to the VolunteerSyncDB_Prod database
var db = db.getSiblingDB('VolunteerSyncDB_Prod');

// Drop existing collections if they exist
db.organizations.drop();
db.users.drop();
db.volunteer_tasks.drop();
db.task_registrations.drop();

print("🧹 Cleared existing data from VolunteerSyncDB_Prod");

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
    },
    {
        name: "Tech for Good Initiative",
        description: "Bridging the digital divide by providing technology education and resources to underserved communities.",
        email: "contact@techforgood.org",
        phone: "+1-555-0106",
        address: "987 Innovation Blvd, Tech Valley, CA 90215",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isVerified: true
    },
    {
        name: "Healthcare Heroes Foundation",
        description: "Supporting healthcare workers and providing medical assistance to those in need through volunteer programs.",
        email: "info@healthcareheroes.org",
        phone: "+1-555-0107",
        address: "246 Medical Center Dr, Health District, CA 90216",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isVerified: true
    },
    {
        name: "Arts & Culture Collective",
        description: "Promoting arts education and cultural enrichment through community workshops and events.",
        email: "hello@artsculture.org",
        phone: "+1-555-0108",
        address: "135 Creative Commons, Arts Quarter, CA 90217",
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
    },
    {
        firstName: "Kelly",
        lastName: "Garcia",
        email: "kelly.garcia@email.com",
        phone: "+1-555-1011",
        skills: ["Photography", "Social Media", "Marketing"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi"
    },
    {
        firstName: "Liam",
        lastName: "Rodriguez",
        email: "liam.rodriguez@email.com",
        phone: "+1-555-1012",
        skills: ["Music", "Sound Engineering", "Event Production"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi"
    },
    {
        firstName: "Maya",
        lastName: "Patel",
        email: "maya.patel@email.com",
        phone: "+1-555-1013",
        skills: ["Nursing", "Patient Care", "Health Education"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi"
    },
    {
        firstName: "Noah",
        lastName: "Kim",
        email: "noah.kim@email.com",
        phone: "+1-555-1014",
        skills: ["Web Development", "Programming", "Technical Support"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi"
    },
    {
        firstName: "Olivia",
        lastName: "Chen",
        email: "olivia.chen@email.com",
        phone: "+1-555-1015",
        skills: ["Dance", "Choreography", "Youth Mentoring"],
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
    {
        title: "Tree Planting Initiative",
        description: "Help plant native trees in local parks and public spaces to improve air quality and urban forestry.",
        organizationId: orgIds[0],
        startDate: new Date(now.getTime() + 21*24*60*60*1000), // 21 days from now
        endDate: new Date(now.getTime() + 21*24*60*60*1000),   // same day event
        maxVolunteers: 30,
        requiredSkills: ["Gardening", "Landscaping", "Environmental Education"],
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
    {
        title: "Community Kitchen Volunteer",
        description: "Prepare and serve meals for homeless individuals and families in our community kitchen.",
        organizationId: orgIds[1],
        startDate: new Date(now.getTime() + 17*24*60*60*1000), // 17 days from now
        endDate: new Date(now.getTime() + 17*24*60*60*1000),   // same day event
        maxVolunteers: 10,
        requiredSkills: ["Cooking", "Food Service", "Customer Service"],
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
    {
        title: "Reading Buddy Program",
        description: "Work with young children to improve their reading skills through one-on-one reading sessions.",
        organizationId: orgIds[2],
        startDate: new Date(now.getTime() + 12*24*60*60*1000), // 12 days from now
        endDate: new Date(now.getTime() + 42*24*60*60*1000),   // 42 days from now (ongoing)
        maxVolunteers: 15,
        requiredSkills: ["Teaching", "Reading", "Mentoring", "Patience"],
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
    {
        title: "Senior Transportation Service",
        description: "Provide transportation for elderly community members to medical appointments and errands.",
        organizationId: orgIds[3],
        startDate: new Date(now.getTime() + 6*24*60*60*1000),  // 6 days from now
        endDate: new Date(now.getTime() + 90*24*60*60*1000),   // 90 days from now (ongoing)
        maxVolunteers: 8,
        requiredSkills: ["Driving", "Elder Care", "Communication", "Reliability"],
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
    },
    {
        title: "Pet Adoption Event Assistant",
        description: "Help organize and run pet adoption events to find homes for rescue animals.",
        organizationId: orgIds[4],
        startDate: new Date(now.getTime() + 28*24*60*60*1000), // 28 days from now
        endDate: new Date(now.getTime() + 28*24*60*60*1000),   // same day event
        maxVolunteers: 12,
        requiredSkills: ["Animal Care", "Customer Service", "Event Organization"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: "Open"
    },
    
    // Tech for Good Initiative tasks
    {
        title: "Digital Literacy Workshop",
        description: "Teach basic computer skills and internet safety to community members of all ages.",
        organizationId: orgIds[5],
        startDate: new Date(now.getTime() + 9*24*60*60*1000),  // 9 days from now
        endDate: new Date(now.getTime() + 16*24*60*60*1000),   // 16 days from now
        maxVolunteers: 8,
        requiredSkills: ["Technology", "Teaching", "Digital Literacy", "Computer Skills"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: "Open"
    },
    {
        title: "Computer Refurbishment Project",
        description: "Help refurbish donated computers for distribution to low-income families and students.",
        organizationId: orgIds[5],
        startDate: new Date(now.getTime() + 15*24*60*60*1000), // 15 days from now
        endDate: new Date(now.getTime() + 22*24*60*60*1000),   // 22 days from now
        maxVolunteers: 6,
        requiredSkills: ["Technology", "Computer Repair", "Technical Support"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: "Open"
    },
    
    // Healthcare Heroes Foundation tasks
    {
        title: "Health Screening Assistant",
        description: "Assist healthcare professionals in conducting community health screenings and checkups.",
        organizationId: orgIds[6],
        startDate: new Date(now.getTime() + 11*24*60*60*1000), // 11 days from now
        endDate: new Date(now.getTime() + 11*24*60*60*1000),   // same day event
        maxVolunteers: 10,
        requiredSkills: ["Healthcare", "Patient Care", "Communication", "First Aid"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: "Open"
    },
    {
        title: "Medical Supply Organization",
        description: "Help organize and inventory medical supplies for distribution to community health centers.",
        organizationId: orgIds[6],
        startDate: new Date(now.getTime() + 18*24*60*60*1000), // 18 days from now
        endDate: new Date(now.getTime() + 18*24*60*60*1000),   // same day event
        maxVolunteers: 7,
        requiredSkills: ["Organization", "Attention to Detail", "Healthcare Knowledge"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: "Open"
    },
    
    // Arts & Culture Collective tasks
    {
        title: "Community Mural Project",
        description: "Help design and paint a community mural that celebrates local culture and diversity.",
        organizationId: orgIds[7],
        startDate: new Date(now.getTime() + 25*24*60*60*1000), // 25 days from now
        endDate: new Date(now.getTime() + 32*24*60*60*1000),   // 32 days from now
        maxVolunteers: 20,
        requiredSkills: ["Art", "Painting", "Creative Design", "Community Engagement"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        status: "Open"
    },
    {
        title: "Art Workshop for Kids",
        description: "Lead creative art workshops for children in underserved communities.",
        organizationId: orgIds[7],
        startDate: new Date(now.getTime() + 13*24*60*60*1000), // 13 days from now
        endDate: new Date(now.getTime() + 20*24*60*60*1000),   // 20 days from now
        maxVolunteers: 8,
        requiredSkills: ["Art", "Teaching", "Creative Writing", "Workshop Facilitation"],
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
for (var i = 0; i < 8; i++) {
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

// Create indexes for better performance
db.organizations.createIndex({ "name": 1 });
db.organizations.createIndex({ "isActive": 1, "isVerified": 1 });

db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "isActive": 1 });
db.users.createIndex({ "skills": 1 });

db.volunteer_tasks.createIndex({ "organizationId": 1 });
db.volunteer_tasks.createIndex({ "status": 1 });
db.volunteer_tasks.createIndex({ "startDate": 1 });
db.volunteer_tasks.createIndex({ "isActive": 1 });
db.volunteer_tasks.createIndex({ "requiredSkills": 1 });

db.task_registrations.createIndex({ "userId": 1 });
db.task_registrations.createIndex({ "taskId": 1 });
db.task_registrations.createIndex({ "status": 1 });
db.task_registrations.createIndex({ "userId": 1, "taskId": 1 }, { unique: true });

print("✅ Created database indexes for performance optimization");
print("🎉 VolunteerSyncDB_Prod database seeding completed successfully!");
print("📊 Database Summary:");
print("   - " + organizations.length + " Organizations");
print("   - " + users.length + " Users");
print("   - " + tasks.length + " Volunteer Tasks");
print("   - " + registrations.length + " Task Registrations");
