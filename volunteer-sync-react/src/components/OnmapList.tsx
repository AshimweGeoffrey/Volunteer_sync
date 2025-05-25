import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import tasksService, { Task } from "../services/tasksService";
import { DataTransformer } from "../utils/dataTransformer";
import { VolunteerProject } from "../types";
import { loadGoogleMapsAPI } from "../utils/googleMapsLoader";
import Header from "./Header";

// Helper functions for status styling
const getStatusColor = (status?: string) => {
  switch (status) {
    case "active":
      return "var(--magic-mint-100)";
    case "upcoming":
      return "#e3f2fd";
    case "completed":
      return "#f3e5f5";
    default:
      return "#f0f0f0";
  }
};

const getStatusTextColor = (status?: string) => {
  switch (status) {
    case "active":
      return "var(--magic-mint-700)";
    case "upcoming":
      return "#1976d2";
    case "completed":
      return "#7b1fa2";
    default:
      return "#666";
  }
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case "active":
      return "Ongoing";
    case "upcoming":
      return "Upcoming";
    case "completed":
      return "Completed";
    default:
      return "Unknown";
  }
};

// Map Component with async loading
const MapComponent: React.FC<{ projects: VolunteerProject[] }> = ({
  projects,
}) => {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();
  const [isMapLoaded, setIsMapLoaded] = React.useState(false);
  const [mapError, setMapError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const initializeMap = async () => {
      try {
        await loadGoogleMapsAPI({
          libraries: ["places"],
        });

        if (mapRef.current && !map) {
          const newMap = new window.google.maps.Map(mapRef.current, {
            center: { lat: -1.9706, lng: 30.1044 }, // Kigali center
            zoom: 12,
          });
          setMap(newMap);
          setIsMapLoaded(true);
        }
      } catch (error) {
        console.error("Failed to load Google Maps:", error);
        setMapError("Failed to load map");
      }
    };

    initializeMap();
  }, [mapRef, map]);

  React.useEffect(() => {
    if (map && isMapLoaded) {
      // Clear existing markers and add new ones
      projects.forEach((project) => {
        if (project.coordinates) {
          const marker = new window.google.maps.Marker({
            position: project.coordinates,
            map: map,
            title: project.title,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; max-width: 300px;">
                <h3 style="margin: 0 0 10px 0; color: #333;">${project.title}</h3>
                <p style="margin: 5px 0; color: #666;"><strong>Location:</strong> ${project.location}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Volunteers:</strong> ${project.volunteersRegistered}/${project.volunteersNeeded}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Duration:</strong> ${project.duration}</p>
                <div style="margin-top: 10px;">
                  <a href="/project-details/${project.id}" style="background: var(--magic-mint-600); color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 500;">View Details</a>
                </div>
              </div>
            `,
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        }
      });
    }
  }, [map, projects, isMapLoaded]);

  if (mapError) {
    return (
      <div
        style={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
          color: "#666",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p>Unable to load map</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "var(--magic-mint-600)",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

const OnmapList: React.FC = () => {
  const [projects, setProjects] = useState<VolunteerProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await tasksService.getTasks();
        const transformedProjects = response.items.map((task: Task) =>
          DataTransformer.transformTask(task)
        );

        setProjects(transformedProjects);
      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;

    return projects.filter((project) => {
      const titleMatch = project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const descMatch = project.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Handle location search - check both legacy string format and new object format
      let locationMatch = false;
      if (project.district) {
        locationMatch = project.district
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else if (project.location && typeof project.location === "object") {
        const locationStr =
          `${project.location.city} ${project.location.state}`.toLowerCase();
        locationMatch = locationStr.includes(searchTerm.toLowerCase());
      }

      return titleMatch || descMatch || locationMatch;
    });
  }, [projects, searchTerm]);

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
        <div
          style={{ textAlign: "center", maxWidth: "400px", padding: "20px" }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid var(--magic-mint-200)",
              borderTop: "4px solid var(--magic-mint-600)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <p style={{ color: "var(--primary-200)", fontSize: "16px" }}>
            Loading projects...
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
            Error Loading Projects
          </h2>
          <p style={{ color: "#666", marginBottom: "24px" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "var(--magic-mint-600)",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
        background: "var(--magic-mint-50)",
      }}
    >
      <Header />

      <div style={{ padding: "30px 120px" }}>
        {/* Header */}
        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              margin: "0 0 10px 0",
              color: "var(--primary-200)",
            }}
          >
            Projects Map
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "var(--magic-mint-600)",
              margin: "0 0 20px 0",
            }}
          >
            Discover volunteer opportunities near you
          </p>

          {/* Search */}
          <div style={{ maxWidth: "400px" }}>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid var(--magic-mint-200)",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Map */}
        <div style={{ marginBottom: "40px" }}>
          <MapComponent projects={filteredProjects} />
        </div>

        {/* Projects List */}
        <div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "600",
              margin: "0 0 20px 0",
              color: "var(--primary-200)",
            }}
          >
            Available Projects ({filteredProjects.length})
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    border: "1px solid var(--magic-mint-200)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    height: "100%",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "var(--primary-200)",
                      marginBottom: "10px",
                      lineHeight: "1.4",
                    }}
                  >
                    {project.title}
                  </h3>

                  <p
                    style={{
                      color: "#666",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      marginBottom: "15px",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {project.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        color: "var(--magic-mint-600)",
                      }}
                    >
                      📍
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      {typeof project.location === "string"
                        ? project.location
                        : `${project.location?.city}, ${project.location?.state}`}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        color: "var(--magic-mint-600)",
                      }}
                    >
                      {project.volunteersRegistered}/{project.volunteersNeeded}{" "}
                      volunteers
                    </span>

                    <div
                      style={{
                        padding: "4px 8px",
                        background: getStatusColor(project.status),
                        borderRadius: "4px",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          color: getStatusTextColor(project.status),
                          fontWeight: "500",
                          textTransform: "uppercase",
                        }}
                      >
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px",
                color: "#666",
              }}
            >
              <h3>No projects found</h3>
              <p>Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnmapList;
