import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import tasksService from "../services/tasksService";
import { DataTransformer } from "../utils/dataTransformer";
import { VolunteerProject } from "../types";
import Header from "./Header";

interface ProjectDetailsProps {
  // No props needed since we'll use useParams
}

const ProjectDetails: React.FC<ProjectDetailsProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<VolunteerProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError("No project ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const taskData = await tasksService.getTask(id);
        const transformedProject = DataTransformer.transformTask(taskData);
        setProject(transformedProject);
      } catch (err) {
        console.error("Error loading project:", err);
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const handleApply = async () => {
    if (!project || !id) return;

    try {
      setApplying(true);
      await tasksService.registerForTask(id, {
        applicationMessage: "I would like to volunteer for this project.",
      });
      setIsApplied(true);
    } catch (err) {
      console.error("Error applying for project:", err);
      alert(err instanceof Error ? err.message : "Failed to apply for project");
    } finally {
      setApplying(false);
    }
  };

  const openMapModal = () => {
    setIsMapModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeMapModal = () => {
    setIsMapModalOpen(false);
    document.body.style.overflow = "auto";
  };

  // Initialize Google Map when modal opens
  useEffect(() => {
    if (
      isMapModalOpen &&
      mapRef.current &&
      !mapInstanceRef.current &&
      project
    ) {
      const projectLocation = project.coordinates || {
        lat: -1.9706,
        lng: 30.1044,
      }; // Default to Kigali

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: projectLocation,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ color: "#f5f4f1" }],
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{ color: "#77deb3" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1dac7a" }],
          },
        ],
      });

      // Add marker for project location
      const marker = new window.google.maps.Marker({
        position: projectLocation,
        map: map,
        title: `Project Location: ${project.location}`,
        animation: window.google.maps.Animation.DROP,
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#1dac7a" stroke="#ffffff" stroke-width="4"/>
              <circle cx="20" cy="20" r="8" fill="#ffffff"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20),
        },
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; font-family: 'Inter', sans-serif;">
            <h4 style="margin: 0 0 5px 0; color: #313d44;">Project Location</h4>
            <p style="margin: 0; color: #1dac7a;">${project.title}</p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      mapInstanceRef.current = map;

      // Trigger map resize to ensure proper rendering
      setTimeout(() => {
        if (map) {
          window.google.maps.event.trigger(map, "resize");
          map.setCenter(projectLocation);
        }
      }, 300);
    }
  }, [isMapModalOpen, project]);

  // Handle ESC key and outside clicks
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMapModalOpen) {
        closeMapModal();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isMapModalOpen]);

  const openDirections = () => {
    if (!project) return;
    const projectLocation = project.coordinates || {
      lat: -1.9706,
      lng: 30.1044,
    };
    const destination = `${projectLocation.lat},${projectLocation.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, "_blank");
  };

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          background: "var(--magic-mint-50)",
          minHeight: "100vh",
        }}
      >
        <Header />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            fontSize: "18px",
            color: "#666",
          }}
        >
          Loading project details...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          background: "var(--magic-mint-50)",
          minHeight: "100vh",
        }}
      >
        <Header />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            fontSize: "18px",
            color: "#e74c3c",
            textAlign: "center",
            gap: "20px",
          }}
        >
          <div>Error: {error}</div>
          <Link
            to="/projects"
            style={{
              padding: "12px 24px",
              backgroundColor: "#1dac7a",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "16px",
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
          fontFamily: "Inter, sans-serif",
          background: "var(--magic-mint-50)",
          minHeight: "100vh",
        }}
      >
        <Header />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            fontSize: "18px",
            color: "#666",
            textAlign: "center",
            gap: "20px",
          }}
        >
          <div>Project not found</div>
          <Link
            to="/projects"
            style={{
              padding: "12px 24px",
              backgroundColor: "#1dac7a",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "16px",
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
      {/* Header */}
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
              }}
            >
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
                onClick={openMapModal}
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
                    minWidth: "100px",
                  }}
                >
                  <span
                    style={{
                      padding: "8px 16px",
                      fontSize: "12px",
                      background:
                        (project.duration && parseInt(project.duration) >= 6) ||
                        (project.duration && project.duration.includes("year"))
                          ? "var(--magic-mint-500)"
                          : "transparent",
                      color:
                        (project.duration && parseInt(project.duration) >= 6) ||
                        (project.duration && project.duration.includes("year"))
                          ? "white"
                          : "var(--primary-200)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Long
                  </span>
                  <span
                    style={{
                      padding: "8px 16px",
                      fontSize: "12px",
                      background:
                        project.duration &&
                        parseInt(project.duration) < 6 &&
                        project.duration &&
                        !project.duration.includes("year")
                          ? "var(--magic-mint-500)"
                          : "transparent",
                      color:
                        project.duration &&
                        parseInt(project.duration) < 6 &&
                        project.duration &&
                        !project.duration.includes("year")
                          ? "white"
                          : "var(--primary-200)",
                      whiteSpace: "nowrap",
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

      {/* Google Maps Modal */}
      {isMapModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeMapModal();
            }
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "800px",
              height: "80%",
              maxHeight: "600px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                borderBottom: "1px solid var(--magic-mint-200)",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "var(--primary-200)",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                Project Location
              </h3>
              <button
                onClick={closeMapModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "var(--primary-200)",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Map Container */}
              <div style={{ flex: 1, position: "relative" }}>
                <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
              </div>

              {/* Location Details */}
              <div
                style={{
                  padding: "20px",
                  borderTop: "1px solid var(--magic-mint-200)",
                  backgroundColor: "var(--magic-mint-50)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <img
                      src="/assets/location.svg"
                      alt="Location"
                      style={{ width: "20px" }}
                    />
                    <div>
                      <h4
                        style={{
                          margin: "0 0 4px 0",
                          color: "var(--primary-200)",
                          fontSize: "16px",
                        }}
                      >
                        {typeof project.location === "string"
                          ? project.location
                          : `${project.location.city}, ${project.location.state}`}
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          color: "var(--magic-mint-600)",
                          fontSize: "14px",
                        }}
                      >
                        {project.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={openDirections}
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
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
