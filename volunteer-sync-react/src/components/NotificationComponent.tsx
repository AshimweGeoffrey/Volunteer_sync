import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Notification } from "../types";
import "../css/notification.css";

interface NotificationProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationComponent: React.FC<NotificationProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    if (notification.icon) return notification.icon;

    switch (notification.type) {
      case "Success":
        return "/assets/badge.svg";
      case "Warning":
        return "/assets/Calendar.svg";
      case "Error":
        return "/assets/notification icon.svg";
      case "TaskUpdate":
        return "/assets/notification icon.svg";
      case "RegistrationUpdate":
        return "/assets/profile.svg";
      default:
        return "/assets/notification icon.svg";
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    setIsOpen(false);
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      <div className="notification-bell" onClick={() => setIsOpen(!isOpen)}>
        <img src="/assets/notification icon.svg" alt="notifications" />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={onMarkAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    !notification.isRead ? "unread" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {notification.actionUrl ? (
                    <Link
                      to={notification.actionUrl}
                      className="notification-link"
                    >
                      <div className="notification-content">
                        <div className="notification-icon">
                          <img
                            src={getNotificationIcon(notification)}
                            alt="notification"
                          />
                        </div>
                        <div className="notification-text">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="notification-time">
                            {getTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                        {!notification.isRead && (
                          <div className="unread-dot"></div>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div className="notification-content">
                      <div className="notification-icon">
                        <img
                          src={getNotificationIcon(notification)}
                          alt="notification"
                        />
                      </div>
                      <div className="notification-text">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <span className="notification-time">
                          {getTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      {!notification.isRead && (
                        <div className="unread-dot"></div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {notifications.length > 5 && (
            <div className="notification-footer">
              <Link to="/notifications" onClick={() => setIsOpen(false)}>
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
