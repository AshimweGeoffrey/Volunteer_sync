export interface VolunteerProject {
  id: string;
  title: string;
  organization: string;
  location: string;
  district: string;
  sector: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  duration: string;
  startDate: string;
  endDate: string;
  volunteersNeeded: number;
  volunteersRegistered: number;
  categories: string[];
  image: string;
  status: "active" | "completed" | "upcoming";
  requirements: string[];
  benefits: string[];
  contactEmail: string;
  contactPhone: string;
}

export interface Organization {
  id: string;
  name: string;
  type: "NGO" | "Government" | "Community" | "International" | "Religious";
  location: string;
  description: string;
  website?: string;
  email: string;
  phone: string;
  logo: string;
  projectsCount: number;
  volunteersCount: number;
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
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "project" | "application";
  isRead: boolean;
  createdAt: string;
  projectId?: string;
  actionUrl?: string;
  icon?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  joinedDate: string;
  bio: string;
  age: number;
  gender: string;
  interests: string[];
  availability: string[];
  badges: Badge[];
  completedProjects: number;
  rating: number;
  notifications: Notification[];
  unreadNotifications: number;
}
