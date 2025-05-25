import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import NotificationComponent from "./NotificationComponent";
import "../css/header.css";

interface HeaderProps {
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

const Header: React.FC<HeaderProps> = ({
  showSearch = true,
  searchPlaceholder = "Search",
  onSearchChange,
  searchValue = "",
}) => {
  const {
    currentUser,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    logout,
    isAuthenticated,
  } = useUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app-header">
      <div className="header-left">
        <Link to="/" className="logo">
          <img src="/assets/logo-black.svg" alt="VolunteerSync" />
          <span>VolunteerSync</span>
        </Link>
      </div>

      <div className="header-center">
        {showSearch && (
          <div className="header-search">
            <img src="/assets/search.svg" alt="search" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="header-right">
        {isAuthenticated && currentUser ? (
          <>
            <NotificationComponent
              notifications={notifications}
              unreadCount={unreadNotificationsCount}
              onMarkAsRead={markNotificationAsRead}
              onMarkAllAsRead={markAllNotificationsAsRead}
            />

            <div className="header-separator">|</div>

            <Link to="/profile" className="header-profile">
              <img
                src={
                  currentUser.profileImage ||
                  currentUser.profilePictureUrl ||
                  "/assets/1.jpeg"
                }
                alt={currentUser.name}
                className="profile-image"
              />
              <span className="profile-name">{currentUser.name}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="header-logout-btn"
              style={{
                marginLeft: "10px",
                padding: "6px 12px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              to="/login"
              style={{
                padding: "6px 12px",
                backgroundColor: "#007bff",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              style={{
                padding: "6px 12px",
                backgroundColor: "#28a745",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
