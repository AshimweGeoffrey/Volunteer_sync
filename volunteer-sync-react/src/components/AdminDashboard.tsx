import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../contexts/UserContext";
import Header from "./Header";
import Loading from "./Loading";

interface Organization {
  id: string;
  name: string;
  description: string;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  website: string;
  logoUrl: string;
  categories: string[];
  isVerified: boolean;
  isActive: boolean;
  memberCount: number;
  taskCount: number;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  maxVolunteers: number;
  currentVolunteers: number;
  status: number;
  category: number;
  requirements: string[];
  skills: string[];
  organizationId: string;
  createdById: string;
  imageUrls: string[];
  tags: string[];
  isUrgent: boolean;
  applicationDeadline: string | null;
  createdAt: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  errors: string[];
}

interface AdminStats {
  totalUsers: number;
  totalTasks: number;
  totalOrganizations: number;
  totalRegistrations: number;
  activeTasksCount: number;
  completedTasksCount: number;
  pendingRegistrationsCount: number;
  approvedRegistrationsCount: number;
  rejectedRegistrationsCount: number;
  recentActivities?: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

interface Registration {
  id: string;
  taskId: string;
  userId: string;
  taskTitle: string;
  userName: string;
  userEmail: string;
  applicationMessage: string;
  registrationDate: string;
  status: "pending" | "approved" | "rejected";
}

const AdminDashboard: React.FC = () => {
  const { currentUser, isAuthenticated } = useUser();
  const [activeTab, setActiveTab] = useState<
    "overview" | "registrations" | "organizations" | "tasks"
  >("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<
    string | null
  >(null);

  const getAuthHeaders = useCallback(
    () => ({
      Authorization: `Bearer ${localStorage.getItem("volunteerSyncToken")}`,
      "Content-Type": "application/json",
    }),
    []
  );

  const fetchDashboardStats = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(
        "http://localhost:5000/api/stats/dashboard",
        {
          headers: getAuthHeaders(),
          method: "GET",
        }
      );

      // First try to parse as JSON
      let errorData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data: ApiResponse<AdminStats> = await response.json();
        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load dashboard statistics"
          );
        }
        if (!data.isSuccess) {
          throw new Error(data.message || "Failed to load statistics");
        }
        setStats(data.data);
      } else {
        const text = await response.text();
        throw new Error(`Invalid response format: ${text}`);
      }
    } catch (err) {
      console.error("Dashboard stats error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const fetchRegistrations = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(
        "http://localhost:5000/api/volunteers/registrations?page=1&pageSize=50",
        {
          headers: getAuthHeaders(),
          method: "GET",
        }
      );

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data: ApiResponse<{ items: Registration[] }> =
          await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch registrations");
        }
        if (!data.isSuccess) {
          throw new Error(data.message || "Failed to load registrations");
        }
        setRegistrations(data.data.items || []);
      } else {
        const text = await response.text();
        throw new Error(`Invalid response format: ${text}`);
      }
    } catch (err) {
      console.error("Registrations error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load registrations"
      );
    }
  }, [getAuthHeaders]);

  const fetchOrganizations = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("http://localhost:5000/api/organizations", {
        headers: getAuthHeaders(),
        method: "GET",
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data: ApiResponse<{ items: Organization[] }> =
          await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch organizations");
        }
        if (!data.isSuccess) {
          throw new Error(data.message || "Failed to load organizations");
        }
        setOrganizations(data.data.items || []);
      } else {
        const text = await response.text();
        throw new Error(`Invalid response format: ${text}`);
      }
    } catch (err) {
      console.error("Organizations error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load organizations"
      );
    }
  }, [getAuthHeaders]);

  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("http://localhost:5000/api/tasks", {
        headers: getAuthHeaders(),
        method: "GET",
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data: ApiResponse<{ items: Task[] }> = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch tasks");
        }
        if (!data.isSuccess) {
          throw new Error(data.message || "Failed to load tasks");
        }
        setTasks(data.data.items || []);
      } else {
        const text = await response.text();
        throw new Error(`Invalid response format: ${text}`);
      }
    } catch (err) {
      console.error("Tasks error:", err);
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchDashboardStats();
    if (activeTab === "registrations") {
      fetchRegistrations();
    } else if (activeTab === "organizations") {
      fetchOrganizations();
    } else if (activeTab === "tasks") {
      fetchTasks();
    }
  }, [
    activeTab,
    fetchDashboardStats,
    fetchRegistrations,
    fetchOrganizations,
    fetchTasks,
  ]);

  const handleApproveRegistration = async (registrationId: string) => {
    try {
      setActionLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/volunteers/registrations/${registrationId}/approve`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to approve registration: ${errorText}`);
      }

      const data: ApiResponse<void> = await response.json();
      if (!data.isSuccess) throw new Error(data.message);

      await fetchRegistrations(); // Refresh the list
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to approve registration"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (registrationId: string) => {
    setSelectedRegistrationId(registrationId);
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedRegistrationId || !rejectReason.trim()) return;

    try {
      setActionLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/volunteers/registrations/${selectedRegistrationId}/reject`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ reason: rejectReason }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to reject registration: ${errorText}`);
      }

      const data: ApiResponse<void> = await response.json();
      if (!data.isSuccess) throw new Error(data.message);

      await fetchRegistrations(); // Refresh the list
      setShowRejectDialog(false);
      setRejectReason("");
      setSelectedRegistrationId(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reject registration"
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading admin dashboard..." />;
  }

  if (!isAuthenticated || Number(currentUser?.role) !== 3) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>
          You must be a SuperAdmin to access this page. Your current role is:{" "}
          {currentUser?.role}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--magic-mint-50)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Header />

      <div style={{ padding: "30px 120px" }}>
        {/* Page Title */}
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "20px",
            color: "var(--primary-200)",
          }}
        >
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {(
            ["overview", "registrations", "organizations", "tasks"] as const
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                background:
                  activeTab === tab ? "var(--magic-mint-500)" : "white",
                color: activeTab === tab ? "white" : "var(--primary-200)",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              borderRadius: "4px",
              color: "#721c24",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {[
              { label: "Total Users", value: stats.totalUsers },
              { label: "Total Tasks", value: stats.totalTasks },
              { label: "Total Organizations", value: stats.totalOrganizations },
              { label: "Active Tasks", value: stats.activeTasksCount },
              { label: "Completed Tasks", value: stats.completedTasksCount },
              { label: "Total Registrations", value: stats.totalRegistrations },
              {
                label: "Pending Registrations",
                value: stats.pendingRegistrationsCount,
              },
              {
                label: "Approved Registrations",
                value: stats.approvedRegistrationsCount,
              },
              {
                label: "Rejected Registrations",
                value: stats.rejectedRegistrationsCount,
              },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    color: "var(--magic-mint-600)",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {stat.label}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "var(--primary-200)",
                  }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === "registrations" && (
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid var(--magic-mint-200)",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "12px" }}>Task</th>
                  <th style={{ padding: "12px" }}>Volunteer</th>
                  <th style={{ padding: "12px" }}>Date</th>
                  <th style={{ padding: "12px" }}>Status</th>
                  <th style={{ padding: "12px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr
                    key={registration.id}
                    style={{ borderBottom: "1px solid var(--magic-mint-100)" }}
                  >
                    <td style={{ padding: "12px" }}>
                      {registration.taskTitle}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div>
                        <div>{registration.userName}</div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--magic-mint-600)",
                          }}
                        >
                          {registration.userEmail}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      {new Date(
                        registration.registrationDate
                      ).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor:
                            registration.status === "approved"
                              ? "#d4edda"
                              : registration.status === "rejected"
                              ? "#f8d7da"
                              : "#fff3cd",
                          color:
                            registration.status === "approved"
                              ? "#155724"
                              : registration.status === "rejected"
                              ? "#721c24"
                              : "#856404",
                        }}
                      >
                        {registration.status.charAt(0).toUpperCase() +
                          registration.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      {registration.status === "pending" && (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() =>
                              handleApproveRegistration(registration.id)
                            }
                            style={{
                              padding: "6px 12px",
                              borderRadius: "4px",
                              border: "none",
                              background: "var(--magic-mint-500)",
                              color: "white",
                              cursor: "pointer",
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectClick(registration.id)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "4px",
                              border: "1px solid var(--magic-mint-300)",
                              background: "white",
                              color: "var(--magic-mint-600)",
                              cursor: "pointer",
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Reject Confirmation Dialog */}
            {showRejectDialog && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1000,
                }}
              >
                <div
                  style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    width: "400px",
                    textAlign: "center",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: "16px",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "var(--magic-mint-600)",
                    }}
                  >
                    Confirm Rejection
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      marginBottom: "24px",
                      color: "#333",
                      fontSize: "14px",
                    }}
                  >
                    Are you sure you want to reject this registration? This
                    action cannot be undone.
                  </p>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter rejection reason"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid var(--magic-mint-300)",
                      marginBottom: "16px",
                      fontSize: "14px",
                      resize: "none",
                    }}
                    rows={3}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() => setShowRejectDialog(false)}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "4px",
                        border: "1px solid var(--magic-mint-300)",
                        background: "white",
                        color: "var(--magic-mint-600)",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRejectConfirm}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "4px",
                        border: "none",
                        background: "var(--magic-mint-500)",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      {actionLoading ? "Rejecting..." : "Confirm Reject"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === "organizations" && (
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid var(--magic-mint-200)",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "12px" }}>Name</th>
                  <th style={{ padding: "12px" }}>Categories</th>
                  <th style={{ padding: "12px" }}>Members</th>
                  <th style={{ padding: "12px" }}>Tasks</th>
                  <th style={{ padding: "12px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org) => (
                  <tr
                    key={org.id}
                    style={{ borderBottom: "1px solid var(--magic-mint-100)" }}
                  >
                    <td style={{ padding: "12px" }}>
                      <div>
                        <div style={{ fontWeight: "500" }}>{org.name}</div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--magic-mint-600)",
                          }}
                        >
                          {org.contactInfo.email}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          flexWrap: "wrap",
                        }}
                      >
                        {org.categories.map((category, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor: "var(--magic-mint-100)",
                              color: "var(--magic-mint-600)",
                              fontSize: "12px",
                            }}
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>{org.memberCount}</td>
                    <td style={{ padding: "12px" }}>{org.taskCount}</td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor: org.isVerified
                            ? "#d4edda"
                            : "#fff3cd",
                          color: org.isVerified ? "#155724" : "#856404",
                        }}
                      >
                        {org.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid var(--magic-mint-200)",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "12px" }}>Title</th>
                  <th style={{ padding: "12px" }}>Date</th>
                  <th style={{ padding: "12px" }}>Location</th>
                  <th style={{ padding: "12px" }}>Volunteers</th>
                  <th style={{ padding: "12px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    style={{ borderBottom: "1px solid var(--magic-mint-100)" }}
                  >
                    <td style={{ padding: "12px" }}>
                      <div>
                        <div style={{ fontWeight: "500" }}>{task.title}</div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--magic-mint-600)",
                            display: "flex",
                            gap: "4px",
                            flexWrap: "wrap",
                            marginTop: "4px",
                          }}
                        >
                          {task.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: "2px 6px",
                                borderRadius: "4px",
                                backgroundColor: "var(--magic-mint-100)",
                                color: "var(--magic-mint-600)",
                                fontSize: "11px",
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div>
                        <div>
                          {new Date(task.startDate).toLocaleDateString()}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--magic-mint-600)",
                          }}
                        >
                          {new Date(task.startDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div>
                        <div>{task.location.city}</div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--magic-mint-600)",
                          }}
                        >
                          {task.location.country}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      {task.currentVolunteers}/{task.maxVolunteers}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor:
                            task.status === 1
                              ? "#d4edda"
                              : task.status === 2
                              ? "#f8d7da"
                              : "#fff3cd",
                          color:
                            task.status === 1
                              ? "#155724"
                              : task.status === 2
                              ? "#721c24"
                              : "#856404",
                        }}
                      >
                        {task.status === 1
                          ? "Active"
                          : task.status === 2
                          ? "Completed"
                          : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
