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
  } = useUser();

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
        <NotificationComponent
          notifications={notifications}
          unreadCount={unreadNotificationsCount}
          onMarkAsRead={markNotificationAsRead}
          onMarkAllAsRead={markAllNotificationsAsRead}
        />

        <div className="header-separator">|</div>

        <Link to="/profile" className="header-profile">
          <img
            src={currentUser.profileImage}
            alt={currentUser.name}
            className="profile-image"
          />
          <span className="profile-name">{currentUser.name}</span>
        </Link>
      </div>
    </div>
  );
};

export default Header;
