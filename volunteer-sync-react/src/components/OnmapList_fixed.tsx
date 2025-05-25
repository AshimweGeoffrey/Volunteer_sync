import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import tasksService, { Task } from "../services/tasksService";
import { DataTransformer } from "../utils/dataTransformer";
import { VolunteerProject } from "../types";
import { loadGoogleMapsAPI } from "../utils/googleMapsLoader";
import Header from "./Header";

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

  return (
    <div style={{ position: "relative" }}>
      <div ref={mapRef} style={{ height: "400px", width: "100%" }} />
      {!isMapLoaded && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.8)",
            color: "#666",
          }}
        >
          Loading map...
        </div>
      )}
    </div>
  );
};

const OnmapList: React.FC = () => {
  const [projects, setProjects] = useState<VolunteerProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await tasksService.getTasks({
          pageSize: 100,
        });

        const backendTasks = response.items || [];
        const transformedProjects = backendTasks.map((task: Task) =>
          DataTransformer.transformTask(task)
        );

        setProjects(transformedProjects);
      } catch (err: any) {
        console.error("Error loading projects:", err);
        setError("Failed to load projects. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return projects;

    const searchLower = searchTerm.toLowerCase();
    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        (project.location && typeof project.location === "object"
          ? `${project.location.city}, ${project.location.state}`
              .toLowerCase()
              .includes(searchLower)
          : typeof project.location === "string"
          ? project.location.toLowerCase().includes(searchLower)
          : false) ||
        (project.categories && Array.isArray(project.categories)
          ? project.categories.some((cat) =>
              cat.toLowerCase().includes(searchLower)
            )
          : typeof project.category === "number"
          ? String(project.category).includes(searchLower)
          : typeof project.category === "string"
          ? project.category.toLowerCase().includes(searchLower)
          : false)
    );
  }, [projects, searchTerm]);

  // Loading state
  if (isLoading) {
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
      <Header
        showSearch={true}
        searchPlaceholder="Search projects..."
        onSearchChange={setSearchTerm}
        searchValue={searchTerm}
      />

      <div style={{ minHeight: "calc(100vh - 80px)" }}>
        {/* Main Content */}
        <div style={{ padding: "30px" }}>
          <div style={{ marginBottom: "30px" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
                color: "var(--primary-200)",
              }}
            >
              Volunteer Projects in Kigali
            </h1>
          </div>

          {/* Map Section */}
          <div
            style={{
              marginBottom: "30px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <MapComponent projects={filteredProjects} />
          </div>

          {/* Projects Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/project-details/${project.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                }}
              >
                <div
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid var(--magic-mint-200)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
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
                        color: "#666",
                      }}
                    >
                      📍{" "}
                      {typeof project.location === "string"
                        ? project.location
                        : `${project.location.city}, ${project.location.state}`}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        color: "var(--magic-mint-700)",
                        fontWeight: "500",
                      }}
                    >
                      {project.volunteersRegistered}/{project.volunteersNeeded}{" "}
                      volunteers
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        background: "var(--magic-mint-100)",
                        padding: "4px 8px",
                        borderRadius: "12px",
                      }}
                    >
                      {project.duration}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: "10px",
                      padding: "8px",
                      background:
                        project.status === "active"
                          ? "var(--magic-mint-100)"
                          : "#f0f0f0",
                      borderRadius: "4px",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color:
                          project.status === "active"
                            ? "var(--magic-mint-700)"
                            : "#666",
                        fontWeight: "500",
                        textTransform: "uppercase",
                      }}
                    >
                      {project.status}
                    </span>
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
              <p>Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnmapList;
