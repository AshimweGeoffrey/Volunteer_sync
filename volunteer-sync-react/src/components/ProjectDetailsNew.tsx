import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import tasksService, { Task } from "../services/tasksService";
import { DataTransformer } from "../utils/dataTransformer";
import { VolunteerProject } from "../types";
import { useUser } from "../contexts/UserContext";
import Header from "./Header";

interface ProjectDetailsProps {
  // No props needed since we'll use useParams
}

const ProjectDetails: React.FC<ProjectDetailsProps> = () => {
  const { id } = useParams<{ id: string }>();
  const { addNotification } = useUser();
  const [project, setProject] = useState<VolunteerProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError("Project ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const taskData: Task = await tasksService.getTask(id);
        const transformedProject: VolunteerProject =
          DataTransformer.transformTask(taskData);
        setProject(transformedProject);
      } catch (err) {
        console.error("Failed to load project:", err);
        setError("Failed to load project details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const handleApply = async () => {
    if (!project || applying) return;

    try {
      setApplying(true);
      await tasksService.registerForTask(project.id, {
        applicationMessage: "I would like to volunteer for this project.",
      });
      setIsApplied(true);

      // Add notification when user applies
      addNotification({
        title: "Application Submitted",
        message: `Your application for "${project.title}" has been submitted successfully.`,
        type: "Success",
        isRead: false,
        projectId: project.id,
        actionUrl: `/projects/${project.id}`,
      });
    } catch (err) {
      console.error("Failed to apply for project:", err);
      addNotification({
        title: "Application Failed",
        message: "Failed to submit your application. Please try again.",
        type: "Error",
        isRead: false,
      });
    } finally {
      setApplying(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "Inter, sans-serif",
          background: "var(--magic-mint-50)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid var(--magic-mint-200)",
              borderTop: "3px solid var(--magic-mint-600)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "var(--primary-200)", fontSize: "16px" }}>
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "Inter, sans-serif",
          background: "var(--magic-mint-50)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{ textAlign: "center", maxWidth: "400px", padding: "20px" }}
        >
          <h2 style={{ color: "var(--primary-200)", marginBottom: "16px" }}>
            Error Loading Project
          </h2>
          <p style={{ color: "#666", marginBottom: "24px" }}>{error}</p>
          <Link
            to="/projects"
            style={{
              display: "inline-block",
              background: "var(--magic-mint-600)",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // Project not found
  if (!project) {
    return (
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "Inter, sans-serif",
          background: "var(--magic-mint-50)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{ textAlign: "center", maxWidth: "400px", padding: "20px" }}
        >
          <h2 style={{ color: "var(--primary-200)", marginBottom: "16px" }}>
            Project Not Found
          </h2>
          <p style={{ color: "#666", marginBottom: "24px" }}>
            The project you're looking for doesn't exist or may have been
            removed.
          </p>
          <Link
            to="/projects"
            style={{
              display: "inline-block",
              background: "var(--magic-mint-600)",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: "var(--magic-mint-50)",
        minHeight: "100vh",
      }}
    >
      <Header />

      {/* Main Container */}
      <div style={{ display: "flex", gap: "30px", padding: "30px 120px" }}>
        {/* Sidebar */}
        <div style={{ width: "300px" }}>
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "30px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              border: "1px solid var(--magic-mint-200)",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                margin: "0 0 10px 0",
                color: "var(--primary-200)",
              }}
            >
              {project.title}
            </h2>
            <h4
              style={{
                fontSize: "16px",
                fontWeight: "400",
                margin: "0 0 25px 0",
                color: "var(--magic-mint-600)",
              }}
            >
              {project.organization}
            </h4>
            <button
              onClick={handleApply}
              disabled={isApplied || applying}
              style={{
                width: "100%",
                background: isApplied
                  ? "var(--magic-mint-200)"
                  : applying
                  ? "var(--magic-mint-400)"
                  : "var(--magic-mint-600)",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: isApplied || applying ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {applying && (
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid transparent",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
              )}
              {isApplied ? "Applied" : applying ? "Applying..." : "Apply"}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {/* Projects Home */}
          <div style={{ marginBottom: "25px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link to="/onmap" style={{ textDecoration: "none" }}>
                <img
                  src="/assets/arrow.svg"
                  alt="back"
                  style={{ width: "20px", cursor: "pointer" }}
                />
              </Link>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  margin: 0,
                  color: "var(--primary-200)",
                }}
              >
                Project Details
              </h2>
            </div>
          </div>

          {/* Details Main */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "40px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              border: "1px solid var(--magic-mint-200)",
            }}
          >
            {/* Project Title */}
            <div style={{ marginBottom: "30px" }}>
              <h5
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  margin: "0 0 8px 0",
                  color: "var(--magic-mint-600)",
                  textTransform: "uppercase",
                }}
              >
                Project Title
              </h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "15px",
                }}
              >
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    margin: 0,
                    color: "var(--primary-200)",
                    lineHeight: "1.3",
                    maxWidth: "70%",
                  }}
                >
                  {project.title}
                </h2>
                <span
                  style={{
                    background:
                      project.status === "active"
                        ? "var(--magic-mint-200)"
                        : "#f0f0f0",
                    color:
                      project.status === "active"
                        ? "var(--primary-200)"
                        : "#666",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {project.status}
                </span>
              </div>
            </div>

            {/* Organized By */}
            <div style={{ marginBottom: "30px" }}>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  margin: "0 0 8px 0",
                  color: "var(--magic-mint-600)",
                  textTransform: "uppercase",
                }}
              >
                Organized By
              </p>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  margin: 0,
                  color: "var(--primary-200)",
                }}
              >
                {project.organization}
              </h3>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "30px" }}>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  margin: "0 0 8px 0",
                  color: "var(--magic-mint-600)",
                  textTransform: "uppercase",
                }}
              >
                Description
              </p>
              <h3
                style={{
                  fontSize: "16px",
                  lineHeight: "1.6",
                  margin: 0,
                  color: "var(--primary-200)",
                  fontWeight: "400",
                }}
              >
                {project.description}
              </h3>
            </div>

            {/* Goals */}
            <div style={{ marginBottom: "30px" }}>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  margin: "0 0 8px 0",
                  color: "var(--magic-mint-600)",
                  textTransform: "uppercase",
                }}
              >
                Goals
              </p>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.6",
                  margin: 0,
                  color: "var(--primary-200)",
                }}
              >
                Our primary goal is to create meaningful impact in the community
                through dedicated volunteer efforts. We aim to address local
                challenges while providing volunteers with valuable experience
                and skill development opportunities.
              </p>
            </div>

            {/* Location */}
            <div style={{ marginBottom: "30px" }}>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  margin: "0 0 12px 0",
                  color: "var(--magic-mint-600)",
                  textTransform: "uppercase",
                }}
              >
                Location
              </p>
              <button
                style={{
                  background: "var(--magic-mint-500)",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                View On Map
              </button>
            </div>

            {/* Time Commitment */}
            <div style={{ marginBottom: "30px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    margin: 0,
                    color: "var(--magic-mint-600)",
                    textTransform: "uppercase",
                  }}
                >
                  Time Commitment
                </p>
                <div
                  style={{
                    display: "flex",
                    background: "var(--magic-mint-300)",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      padding: "8px 12px",
                      fontSize: "12px",
                      background: project.duration?.includes("week")
                        ? "transparent"
                        : "var(--magic-mint-500)",
                      color: project.duration?.includes("week")
                        ? "var(--primary-200)"
                        : "white",
                    }}
                  >
                    Long
                  </span>
                  <span
                    style={{
                      padding: "8px 12px",
                      fontSize: "12px",
                      background: !project.duration?.includes("week")
                        ? "var(--magic-mint-500)"
                        : "transparent",
                      color: !project.duration?.includes("week")
                        ? "white"
                        : "var(--primary-200)",
                    }}
                  >
                    Short
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "150px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      margin: 0,
                      color: "var(--magic-mint-600)",
                      textTransform: "uppercase",
                    }}
                  >
                    Start Date
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/assets/Calendar.svg"
                      alt="calendar"
                      style={{ width: "16px" }}
                    />
                    <p
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        color: "var(--primary-200)",
                      }}
                    >
                      {project.startDate}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      margin: 0,
                      color: "var(--magic-mint-600)",
                      textTransform: "uppercase",
                    }}
                  >
                    End Date
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/assets/Calendar.svg"
                      alt="calendar"
                      style={{ width: "16px" }}
                    />
                    <p
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        color: "var(--primary-200)",
                      }}
                    >
                      {project.endDate || "01/01/2024"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Button */}
            <div style={{ marginBottom: "30px" }}>
              <button
                style={{
                  background: "transparent",
                  color: "var(--primary-200)",
                  border: "1px solid var(--magic-mint-400)",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                {typeof project.location === "string"
                  ? project.location
                  : `${project.location.city}, ${project.location.state}`}
              </button>
            </div>

            {/* Volunteers */}
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      margin: 0,
                      color: "var(--magic-mint-600)",
                      textTransform: "uppercase",
                    }}
                  >
                    Volunteers Needed
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      margin: 0,
                      color: "white",
                      background: "var(--magic-mint-700)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      width: "fit-content",
                    }}
                  >
                    {project.volunteersNeeded}
                  </p>
                </div>
              </div>

              <div>
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    margin: "0 0 10px 0",
                    color: "var(--primary-200)",
                  }}
                >
                  Extended Message
                </h4>
                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.6",
                    margin: 0,
                    color: "var(--primary-200)",
                    background: "var(--magic-mint-300)",
                    padding: "20px",
                    borderRadius: "10px",
                  }}
                >
                  We welcome volunteers of all backgrounds and skill levels.
                  Whether you have specific expertise or simply a willingness to
                  help, your contribution will make a meaningful difference.
                  Join our team and be part of positive change in our community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
