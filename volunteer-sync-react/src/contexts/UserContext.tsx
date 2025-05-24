import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, Notification } from "../types";
import { mockCurrentUser, mockNotifications } from "../data/mockData";

interface UserContextType {
  currentUser: User;
  notifications: Notification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => void;
  updateUser: (updates: Partial<User>) => void;
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
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const unreadNotificationsCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const addNotification = (
    notificationData: Omit<Notification, "id" | "createdAt">
  ) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const updateUser = (updates: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  const value: UserContextType = {
    currentUser,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addNotification,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
