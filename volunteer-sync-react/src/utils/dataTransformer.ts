// Data transformation utilities to convert between backend and frontend formats
import { User, VolunteerProject, Organization, Notification } from "../types";
import type {
  User as BackendUser,
  Task as BackendTask,
  Organization as BackendOrganization,
  Notification as BackendNotification,
} from "../services";
import imageService from "../services/imageService";

export class DataTransformer {
  // Transform backend user to frontend user
  static transformUser(backendUser: BackendUser): User {
    // Check if we have a locally stored profile image
    const localProfileImage = backendUser.id
      ? imageService.getProfileImage(backendUser.id)
      : null;

    // Use local profile image if available, otherwise use the backend URL
    const profileImage =
      localProfileImage || backendUser.profilePictureUrl || "/assets/1.jpeg";

    return {
      id: backendUser.id,
      firstName: backendUser.firstName,
      lastName: backendUser.lastName,
      email: backendUser.email,
      phone: backendUser.phone,
      bio: backendUser.bio,
      age: backendUser.age,
      gender: backendUser.gender,
      location: backendUser.location,
      interests: backendUser.interests,
      availability: backendUser.availability,
      skills: backendUser.skills,
      profilePictureUrl: profileImage,
      role: backendUser.role,
      isActive: backendUser.isActive,
      createdAt: backendUser.createdAt,
      lastLoginAt: backendUser.lastLoginAt,
      // Computed fields for compatibility
      name: `${backendUser.firstName} ${backendUser.lastName}`,
      profileImage: profileImage,
      joinedDate: backendUser.createdAt,
      badges: [],
      completedProjects: 0,
      rating: 0,
      notifications: [],
      unreadNotifications: 0,
    };
  }

  // Transform backend task to frontend project
  static transformTask(backendTask: BackendTask): VolunteerProject {
    // Calculate dynamic status based on current time and task dates
    const now = new Date();
    const startDate = new Date(backendTask.startDate);
    const endDate = new Date(backendTask.endDate);

    let status: "active" | "completed" | "upcoming";

    if (!backendTask.isActive) {
      status = "completed";
    } else if (now < startDate) {
      status = "upcoming";
    } else if (now >= startDate && now <= endDate) {
      status = "active"; // Currently ongoing
    } else {
      status = "completed"; // Past end date
    }

    return {
      id: backendTask.id,
      title: backendTask.title,
      description: backendTask.description,
      startDate: backendTask.startDate,
      endDate: backendTask.endDate,
      location: backendTask.location,
      maxVolunteers: backendTask.maxVolunteers,
      currentVolunteers: backendTask.currentVolunteers,
      category: backendTask.category,
      requirements: backendTask.requirements,
      requiredSkills: backendTask.requiredSkills,
      tags: backendTask.tags,
      isUrgent: backendTask.isUrgent,
      isActive: backendTask.isActive,
      applicationDeadline: backendTask.applicationDeadline,
      createdBy: backendTask.createdBy,
      organizationId: backendTask.organizationId,
      createdAt: backendTask.createdAt,
      updatedAt: backendTask.updatedAt,
      organizationName: backendTask.organizationName,
      organizationLogo: backendTask.organizationLogo,
      // Computed fields for compatibility
      organization: backendTask.organizationName || "Unknown Organization",
      district: backendTask.location.city,
      sector: backendTask.location.street,
      coordinates: {
        lat: backendTask.location.latitude,
        lng: backendTask.location.longitude,
      },
      duration: DataTransformer.calculateDuration(
        backendTask.startDate,
        backendTask.endDate
      ),
      volunteersNeeded: backendTask.maxVolunteers,
      volunteersRegistered: backendTask.currentVolunteers,
      categories: [`Category ${backendTask.category}`],
      image: "/assets/default-project.jpg",
      status: status,
      benefits: ["Certificate of completion", "Skills development"],
      contactEmail: "contact@organization.org",
      contactPhone: "+250788123456",
    };
  }

  // Transform backend organization to frontend organization
  static transformOrganization(backendOrg: BackendOrganization): Organization {
    return {
      id: backendOrg.id,
      name: backendOrg.name,
      description: backendOrg.description,
      contactInfo: backendOrg.contactInfo,
      address: backendOrg.address,
      logoUrl: backendOrg.logoUrl,
      categories: backendOrg.categories,
      isVerified: backendOrg.isVerified,
      isActive: backendOrg.isActive,
      memberCount: backendOrg.memberCount,
      taskCount: backendOrg.taskCount,
      createdAt: backendOrg.createdAt,
      // Computed fields for compatibility
      type: "NGO",
      location: `${backendOrg.address.city}, ${backendOrg.address.country}`,
      website: backendOrg.contactInfo.website,
      email: backendOrg.contactInfo.email,
      phone: backendOrg.contactInfo.phone,
      logo: backendOrg.logoUrl,
      projectsCount: backendOrg.taskCount,
      volunteersCount: backendOrg.memberCount,
    };
  }

  // Transform backend notification to frontend notification
  static transformNotification(
    backendNotification: BackendNotification
  ): Notification {
    return {
      id: backendNotification.id,
      userId: backendNotification.userId,
      title: backendNotification.title,
      message: backendNotification.message,
      type: backendNotification.type,
      isRead: backendNotification.isRead,
      createdAt: backendNotification.createdAt,
      projectId: backendNotification.projectId,
      actionUrl: backendNotification.actionUrl,
      icon: backendNotification.icon,
    };
  }

  // Helper function to calculate duration
  static calculateDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day";
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
    return `${Math.ceil(diffDays / 30)} months`;
  }

  // Convert frontend user updates to backend format
  static transformUserUpdates(
    frontendUser: Partial<User>,
    currentUser: User
  ): any {
    const backendUpdates: any = {
      // Include required fields from current user to satisfy validation
      email: currentUser.email,
      password: "", // Empty password means don't update it (backend handles this)
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      phoneNumber: currentUser.phone || "",
    };

    // Handle name field conversion
    if (frontendUser.name) {
      const nameParts = frontendUser.name.split(" ");
      backendUpdates.firstName = nameParts[0];
      backendUpdates.lastName = nameParts.slice(1).join(" ");
    }

    // Handle firstName and lastName directly (override defaults)
    if (frontendUser.firstName)
      backendUpdates.firstName = frontendUser.firstName;
    if (frontendUser.lastName) backendUpdates.lastName = frontendUser.lastName;

    // Map phone to phoneNumber for backend compatibility
    if (frontendUser.phone) backendUpdates.phoneNumber = frontendUser.phone;

    // Direct field mappings
    if (frontendUser.bio) backendUpdates.bio = frontendUser.bio;
    if (frontendUser.age) backendUpdates.age = frontendUser.age;
    if (frontendUser.gender) backendUpdates.gender = frontendUser.gender;
    if (frontendUser.location) backendUpdates.location = frontendUser.location;
    if (frontendUser.interests)
      backendUpdates.interests = frontendUser.interests;
    if (frontendUser.availability)
      backendUpdates.availability = frontendUser.availability;
    if (frontendUser.skills) backendUpdates.skills = frontendUser.skills;

    return backendUpdates;
  }

  // Convert frontend project to backend task format for creation
  static transformProjectToTask(
    frontendProject: Partial<VolunteerProject>
  ): any {
    return {
      title: frontendProject.title,
      description: frontendProject.description,
      startDate: frontendProject.startDate,
      endDate: frontendProject.endDate,
      location: frontendProject.location,
      maxVolunteers:
        frontendProject.maxVolunteers || frontendProject.volunteersNeeded,
      category: frontendProject.category || 1,
      requirements: frontendProject.requirements || [],
      skills: frontendProject.requiredSkills || [],
      tags: frontendProject.tags || [],
      isUrgent: frontendProject.isUrgent || false,
      applicationDeadline: frontendProject.applicationDeadline,
    };
  }
}
