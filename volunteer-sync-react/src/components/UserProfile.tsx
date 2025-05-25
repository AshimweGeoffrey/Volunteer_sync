import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import Header from "./Header";
import volunteerRegistrationsService from "../services/volunteerRegistrationsService";
import tasksService from "../services/tasksService";
import "../css/user-profile.css";
import "../css/notification.css";

interface ContributionHistory {
  id: string;
  title: string;
  image: string;
  startDate: string;
  endDate: string;
  description: string;
  status: string;
}

const UserProfile: React.FC = () => {
  const { currentUser, notifications } = useUser();
  const [contributions, setContributions] = useState<ContributionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserContributions = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user's registrations
        const registrationsResponse =
          await volunteerRegistrationsService.getUserRegistrations(
            currentUser.id,
            { page: 1, pageSize: 10 }
          );

        // Fetch detailed task information for each registration
        const contributionsData: ContributionHistory[] = [];

        // Check if registrationsResponse has items array and handle different response formats
        let registrations: any[] = [];
        if (
          registrationsResponse?.items &&
          Array.isArray(registrationsResponse.items)
        ) {
          registrations = registrationsResponse.items;
        } else if (Array.isArray(registrationsResponse)) {
          // Handle case where API returns array directly
          registrations = registrationsResponse;
        } else {
          console.warn(
            "Unexpected registrations response format:",
            registrationsResponse
          );
          registrations = [];
        }

        for (const registration of registrations) {
          try {
            const task = await tasksService.getTask(registration.taskId);
            contributionsData.push({
              id: registration.id,
              title: task.title,
              image: task.organizationLogo || "/assets/Rectangle 2.png",
              startDate: new Date(task.startDate).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              endDate: new Date(task.endDate).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              description: task.description,
              status: registration.status,
            });
          } catch (taskError) {
            console.error(
              `Failed to fetch task ${registration.taskId}:`,
              taskError
            );
            // Still add the registration with basic info if task fetch fails
            contributionsData.push({
              id: registration.id,
              title: registration.taskTitle || "Unknown Task",
              image: "/assets/Rectangle 2.png",
              startDate: new Date(
                registration.registrationDate
              ).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              endDate: "Unknown",
              description:
                registration.applicationMessage || "No description available",
              status: registration.status,
            });
          }
        }

        setContributions(contributionsData);
      } catch (err) {
        console.error("Failed to fetch user contributions:", err);
        setError("Failed to load contribution history");
      } finally {
        setLoading(false);
      }
    };

    fetchUserContributions();
  }, [currentUser?.id]);

  // If currentUser is null, this shouldn't happen in a protected route
  // but we'll add a safety check
  if (!currentUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Loading user profile...
      </div>
    );
  }

  // Use currentUser data with fallback properties for missing fields
  const user = {
    ...currentUser,
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    age: currentUser.age || 28,
    gender: currentUser.gender || "Not specified",
    bio: currentUser.bio || "No bio available yet.",
    badges: currentUser.badges || [],
  };

  // Get recent notifications for display
  const recentNotifications = notifications.slice(0, 3);

  return (
    <div className="profile-page">
      {/* Header with Notifications */}
      <Header showSearch={true} searchPlaceholder="Search profile..." />

      <div className="profile-container">
        <div className="profile-sidebar-main">
          <div className="profile-sidebar">
            <div>
              <img
                src={
                  currentUser.profileImage ||
                  currentUser.profilePictureUrl ||
                  "/assets/1.jpeg"
                }
                alt=""
              />
              <div>
                <h1>{user.name}</h1>
                <img src="assets/badge.svg" alt="" />
                <p>Joined September 2023</p>
              </div>
              <Link to="/profile/edit">
                <img src="assets/edit.svg" alt="Edit Profile" />
              </Link>
            </div>
            <div>
              <div>
                <div>
                  <img src="assets/profile.svg" alt="" />
                  <div>
                    <h1>Profile</h1>
                    <p>Email,Location,Badges....</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-personal-info">
            <h1>Personal Info</h1>
            <div>
              <div>
                <p>name</p>
                <h3>{user.name}</h3>
              </div>
              <div>
                <p>gender</p>
                <h3>{user.gender}</h3>
              </div>
              <div>
                <p>location</p>
                <h3>{user.location}</h3>
              </div>
              <div>
                <p>age</p>
                <h3>{user.age}</h3>
              </div>
              <div>
                <p>email</p>
                <h3>{user.email}</h3>
              </div>
            </div>
          </div>

          <div className="profile-bio">
            <h1>Bio</h1>
            <p>{user.bio}</p>
          </div>

          <div className="profile-badges">
            <h1>Badges</h1>
            {user.badges.map((badge, index) => (
              <div key={index}>
                <img src={badge.icon} alt="" />
                <p>{badge.name}</p>
                <p>{badge.description}</p>
              </div>
            ))}
          </div>

          <div className="profile-contribution">
            <h1>Contribution History</h1>
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <p>Loading contribution history...</p>
              </div>
            ) : error ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#ef4444",
                }}
              >
                <p>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    backgroundColor: "var(--magic-mint-500)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              </div>
            ) : contributions.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#6b7280",
                }}
              >
                <p>No volunteer activities yet. Start by joining a task!</p>
                <Link
                  to="/tasks"
                  style={{
                    display: "inline-block",
                    marginTop: "10px",
                    padding: "8px 16px",
                    backgroundColor: "var(--magic-mint-500)",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "4px",
                  }}
                >
                  Browse Tasks
                </Link>
              </div>
            ) : (
              contributions.map((contribution, index) => (
                <div
                  key={contribution.id || index}
                  className="profile-contribution-card"
                >
                  <div>
                    <img src={contribution.image} alt="" />
                    <div>
                      <h2>{contribution.title}</h2>
                      <div>
                        <p>{contribution.startDate}</p>
                        <p>{contribution.endDate}</p>
                      </div>
                      <div style={{ marginTop: "8px" }}>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor:
                              contribution.status === "Approved"
                                ? "#dcfce7"
                                : contribution.status === "Rejected"
                                ? "#fef2f2"
                                : "#fef3c7",
                            color:
                              contribution.status === "Approved"
                                ? "#166534"
                                : contribution.status === "Rejected"
                                ? "#dc2626"
                                : "#92400e",
                          }}
                        >
                          {contribution.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p>{contribution.description}</p>
                </div>
              ))
            )}
          </div>

          {/* Recent Notifications Section */}
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              backgroundColor: "#fafafa",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "15px",
                color: "#374151",
              }}
            >
              Recent Notifications
            </h2>
            {recentNotifications.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {recentNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: "12px",
                      backgroundColor: notification.isRead
                        ? "#f9fafb"
                        : "#ecfdf5",
                      border: `1px solid ${
                        notification.isRead ? "#e5e7eb" : "#a7f3d0"
                      }`,
                      borderRadius: "6px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "start",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: notification.isRead
                            ? "#9ca3af"
                            : "#10b981",
                          marginTop: "6px",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            margin: "0 0 4px 0",
                            color: "#374151",
                          }}
                        >
                          {notification.title}
                        </h4>
                        <p
                          style={{
                            fontSize: "13px",
                            margin: "0 0 4px 0",
                            color: "#6b7280",
                            lineHeight: "1.4",
                          }}
                        >
                          {notification.message}
                        </p>
                        <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                          {new Date(
                            notification.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#6b7280", fontStyle: "italic", margin: 0 }}>
                No recent notifications
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
