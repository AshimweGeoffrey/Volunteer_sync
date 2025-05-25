export interface VolunteerProject {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location:
    | {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        latitude: number;
        longitude: number;
      }
    | string;
  maxVolunteers?: number;
  currentVolunteers?: number;
  category?: number | string;
  requirements?: string[];
  requiredSkills?: string[];
  tags?: string[];
  isUrgent?: boolean;
  isActive?: boolean;
  applicationDeadline?: string;
  createdBy?: string;
  organizationId?: string;
  createdAt?: string;
  updatedAt?: string;
  // Populated fields for display
  organizationName?: string;
  organizationLogo?: string;
  // Legacy fields for compatibility
  organization?: string;
  district?: string;
  sector?: string;
  coordinates?: { lat: number; lng: number };
  duration?: string;
  volunteersNeeded?: number;
  volunteersRegistered?: number;
  categories?: string[];
  image?: string;
  status?: "active" | "completed" | "upcoming";
  benefits?: string[];
  contactEmail?: string;
  contactPhone?: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  contactInfo?: {
    email: string;
    phone: string;
    website?: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  logoUrl?: string;
  categories?: string[];
  isVerified?: boolean;
  isActive?: boolean;
  memberCount?: number;
  taskCount?: number;
  createdAt?: string;
  // Legacy fields for compatibility
  type?: "NGO" | "Government" | "Community" | "International" | "Religious";
  location?: string;
  website?: string;
  email?: string;
  phone?: string;
  logo?: string;
  projectsCount?: number;
  volunteersCount?: number;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  interests: string[];
  availability: string[];
  profileImage: string;
  joinedDate: string;
  completedProjects: number;
  rating: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
  type: "bronze" | "silver" | "gold";
}

export interface Stats {
  totalProjects: number;
  totalVolunteers: number;
  totalOrganizations: number;
  completedProjects: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | "Info"
    | "Success"
    | "Warning"
    | "Error"
    | "TaskUpdate"
    | "RegistrationUpdate";
  isRead: boolean;
  createdAt: string;
  projectId?: string;
  actionUrl?: string;
  icon?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  age: number;
  gender: string;
  location: string;
  interests: string[];
  availability: string[];
  skills: string[];
  profilePictureUrl: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  // Legacy/computed fields for compatibility
  name?: string;
  profileImage?: string;
  joinedDate?: string;
  badges?: Badge[];
  completedProjects?: number;
  rating?: number;
  notifications?: Notification[];
  unreadNotifications?: number;
}
