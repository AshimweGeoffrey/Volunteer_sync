// Connect to MongoDB and select the VolunteerSync database
db = db.getSiblingDB('VolunteerSync');

// Clear existing collections
db.organizations.drop();
db.users.drop();
db.volunteer_tasks.drop();
db.task_registrations.drop();

// Create an organization
var orgId = db.organizations.insertOne({
  name: "Green Earth Foundation",
  description: "Environmental conservation and sustainability organization focused on protecting natural resources.",
  contactInfo: {
    email: "contact@greenearth.org",
    phone: "+1-555-0101"
  },
  address: {
    street: "123 Eco Street",
    city: "Green Valley",
    state: "CA",
    zipCode: "90210",
    country: "USA"
  },
  website: "https://greenearth.org",
  logoUrl: "",
  categories: ["Environment", "Conservation", "Sustainability"],
  isVerified: true,
  isActive: true,
  memberCount: 5,
  taskCount: 2,
  createdAt: new Date(),
  updatedAt: new Date()
}).insertedId;

print("Created organization with ID: " + orgId);

// Create a user
var adminId = db.users.insertOne({
  firstName: "Admin",
  lastName: "User",
  email: "admin@example.com",
  passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi", // "password123"
  phoneNumber: "+1-555-1234",
  role: "Admin",
  dateJoined: new Date(),
  isActive: true,
  organizationId: orgId.toString(),
  profileImageUrl: "",
  skills: ["Management", "Leadership", "Environmental Science"],
  availability: ["Weekdays", "Evenings"],
  lastLoginAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
}).insertedId;

print("Created admin user with ID: " + adminId);

var userId = db.users.insertOne({
  firstName: "Regular",
  lastName: "User",
  email: "user@example.com",
  passwordHash: "$2a$12$kcZsQC0V3npOAF2f77pUquLQjPAz37dkzEJcEcKrRRRDFE8mJQ2mi", // "password123"
  phoneNumber: "+1-555-5678",
  role: "Volunteer",
  dateJoined: new Date(),
  isActive: true,
  profileImageUrl: "",
  skills: ["Gardening", "Teaching"],
  availability: ["Weekends"],
  lastLoginAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
}).insertedId;

print("Created regular user with ID: " + userId);

// Create volunteer tasks
var now = new Date();
var taskId = db.volunteer_tasks.insertOne({
  title: "Community Garden Cleanup",
  description: "Help clean up our community garden and prepare it for spring planting.",
  startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  endDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
  location: {
    street: "456 Garden Lane",
    city: "Green Valley",
    state: "CA",
    zipCode: "90210",
    country: "USA"
  },
  maxVolunteers: 20,
  currentVolunteers: 5,
  status: "Active",
  category: "Environment",
  requirements: ["Bring gloves", "Wear appropriate footwear"],
  skills: ["Gardening", "Physical Labor"],
  organizationId: orgId.toString(),
  createdById: adminId.toString(),
  imageUrls: [],
  tags: ["Garden", "Community", "Cleanup"],
  isUrgent: false,
  applicationDeadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
  createdAt: new Date(),
  updatedAt: new Date()
}).insertedId;

print("Created volunteer task with ID: " + taskId);

// Create a task registration
var registrationId = db.task_registrations.insertOne({
  userId: userId.toString(),
  volunteerTaskId: taskId.toString(),
  registrationDate: new Date(),
  status: "Confirmed",
  notes: "",
  applicationMessage: "I'm excited to help with the garden cleanup!",
  createdAt: new Date(),
  updatedAt: new Date()
}).insertedId;

print("Created task registration with ID: " + registrationId);
print("Database seeded successfully!");
