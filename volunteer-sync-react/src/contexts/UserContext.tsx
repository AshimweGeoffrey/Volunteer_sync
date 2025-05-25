import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User, Notification } from "../types";
import {
  authService,
  usersService,
  notificationsService,
  type RegisterRequest,
} from "../services";
import { DataTransformer } from "../utils/dataTransformer";
import imageService from "../services/imageService";

interface UserContextType {
  currentUser: User | null;
  notifications: Notification[];
  unreadNotificationsCount: number;
  isAuthenticated: boolean;
  isLoading: boolean;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt" | "userId">
  ) => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updateProfilePicture: (imageBase64: string) => Promise<void>;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;
  signup: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  loadNotifications: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Transform backend user to frontend user format
  const transformUser = (backendUser: any): User => {
    return DataTransformer.transformUser(backendUser);
  };

  // Check for existing authentication on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = authService.getCurrentUser();
          if (user) {
            const transformedUser = transformUser(user);
            setCurrentUser(transformedUser);
            setIsAuthenticated(true);

            // Load notifications
            await loadNotifications();
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid auth data
        await authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for storage events (to sync logout across tabs)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "volunteerSyncToken" && !event.newValue) {
        // Token was removed in another tab
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const unreadNotificationsCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  const loadNotifications = async () => {
    try {
      const response = await notificationsService.getNotifications({
        pageSize: 50,
      });
      setNotifications(response.items);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const addNotification = (
    notificationData: Omit<Notification, "id" | "createdAt" | "userId">
  ) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      userId: currentUser?.id || "",
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!currentUser) {
        throw new Error("No current user found");
      }

      // Convert frontend user format to backend format using DataTransformer
      const backendUpdates = DataTransformer.transformUserUpdates(
        updates,
        currentUser
      );

      const updatedUser = await usersService.updateProfile(backendUpdates);
      const transformedUser = transformUser(updatedUser);
      setCurrentUser(transformedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  // Add a new function to update the profile picture locally
  const updateProfilePicture = async (imageBase64: string) => {
    try {
      if (!currentUser) {
        throw new Error("No current user found");
      }

      // Save the image to local storage
      imageService.saveProfileImage(currentUser.id, imageBase64);

      // Update the current user with the new profile image
      setCurrentUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          profileImage: imageBase64,
          profilePictureUrl: imageBase64,
        };
      });

      // Update the user data in local/session storage
      const storage = localStorage.getItem("volunteerSyncUser")
        ? localStorage
        : sessionStorage;

      const userStr = storage.getItem("volunteerSyncUser");
      if (userStr) {
        const user = JSON.parse(userStr);
        user.profilePictureUrl = imageBase64;
        storage.setItem("volunteerSyncUser", JSON.stringify(user));
      }

      return;
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    try {
      const user = await usersService.getProfile();
      const transformedUser = transformUser(user);
      setCurrentUser(transformedUser);
    } catch (error) {
      console.error("Error refreshing profile:", error);
      throw error;
    }
  };

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Call the login endpoint as specified in the backend API docs (POST /api/auth/login)
      const authResponse = await authService.login({
        email,
        password,
        rememberMe, // Pass the remember me flag to the auth service
      });

      if (!authResponse || !authResponse.user) {
        console.error("Invalid response format from login API");
        return false;
      }

      // Transform and store user data in state
      const transformedUser = transformUser(authResponse.user);
      setCurrentUser(transformedUser);
      setIsAuthenticated(true);

      // Load notifications after successful login
      await loadNotifications();

      return true;
    } catch (error: any) {
      // Log the specific error for debugging
      if (error.response) {
        console.error("Login API error response:", error.response.data);
      } else {
        console.error("Login error:", error);
      }

      // Let the component handle the error display
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: RegisterRequest): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Call the register endpoint as specified in backend API docs (POST /api/auth/register)
      const authResponse = await authService.register(userData);

      // Transform and store user data in state
      const transformedUser = transformUser(authResponse.user);
      setCurrentUser(transformedUser);
      setIsAuthenticated(true);

      // Load notifications after successful signup
      await loadNotifications();

      return true;
    } catch (error: any) {
      // Improved error handling with better messaging
      console.error("Signup error:", error);
      // You can add specific error handling here based on error responses from the API
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setCurrentUser(null);
      setNotifications([]);
      setIsAuthenticated(false);
    }
  };

  const value: UserContextType = {
    currentUser,
    notifications,
    unreadNotificationsCount,
    isAuthenticated,
    isLoading,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addNotification,
    updateUser,
    updateProfilePicture,
    login,
    signup,
    logout,
    refreshProfile,
    loadNotifications,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
