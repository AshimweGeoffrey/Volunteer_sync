import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { mockProjects } from "../data/mockData";
import { VolunteerProject } from "../types";
import Header from "./Header";
import { useUser } from "../contexts/UserContext";

const GOOGLE_MAPS_API_KEY = "AIzaSyAk2NlJaP3zmlm2csl0xDrf_-WeRyYpgwU";

// Map Component
const MapComponent: React.FC<{ projects: VolunteerProject[] }> = ({
  projects,
}) => {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  React.useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: -1.9706, lng: 30.1044 }, // Kigali center
        zoom: 12,
      });
      setMap(newMap);
    }
  }, [mapRef, map]);

  React.useEffect(() => {
    if (map) {
      // Clear existing markers
      projects.forEach((project) => {
        const marker = new window.google.maps.Marker({
          position: project.coordinates,
          map: map,
          title: project.title,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 300px;">
              <h3 style="margin: 0 0 10px 0; color: #333;">${project.title}</h3>
              <p style="margin: 5px 0; color: #666;"><strong>Location:</strong> ${
                project.location
              }</p>
              <p style="margin: 5px 0; color: #666;"><strong>Volunteers:</strong> ${
                project.volunteersRegistered
              }/${project.volunteersNeeded}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Duration:</strong> ${
                project.duration
              }</p>
              <div style="margin-top: 10px;">
                ${project.categories
                  .map(
                    (cat) =>
                      `<span style="background: var(--magic-mint-400); color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px; margin-right: 5px;">${cat}</span>`
                  )
                  .join("")}
              </div>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });
    }
  }, [map, projects]);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
};

const OnmapList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { addNotification } = useUser();

  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.categories.some((cat) =>
          cat.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Only show active and upcoming projects
      const isAvailable =
        project.status === "active" || project.status === "upcoming";
      return matchesSearch && isAvailable;
    });
  }, [searchTerm]);

  const handleJoinProject = (projectId: string) => {
    addNotification({
      title: "Application Submitted",
      message: "Your application has been submitted successfully!",
      type: "success",
      isRead: false,
      projectId: projectId,
      actionUrl: `/project/${projectId}`,
    });
  };

  const render = (status: Status): React.ReactElement => {
    if (status === Status.LOADING) return <div>Loading map...</div>;
    if (status === Status.FAILURE) return <div>Error loading map</div>;
    return <div>Map loaded successfully</div>;
  };

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
          <div
            style={{
              marginBottom: "30px",
            }}
          >
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
            <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render}>
              <MapComponent projects={filteredProjects} />
            </Wrapper>
          </div>

          {/* Projects Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    border: "1px solid #f0f0f0",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0,0,0,0.1)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "15px",
                      marginBottom: "15px",
                    }}
                  >
                    <img
                      src="/assets/pinish.svg"
                      alt="project"
                      style={{ width: "40px", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#333",
                        }}
                      >
                        {project.title}
                      </h3>
                      <p
                        style={{
                          margin: "0 0 8px 0",
                          color: "#666",
                          fontSize: "14px",
                        }}
                      >
                        {project.location}
                      </p>
                      <p
                        style={{
                          margin: "0 0 15px 0",
                          color: "#555",
                          lineHeight: "1.4",
                          fontSize: "14px",
                        }}
                      >
                        {project.description.substring(0, 120)}...
                      </p>
                    </div>
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    {project.categories.map((category, index) => (
                      <span
                        key={index}
                        style={{
                          display: "inline-block",
                          background: "var(--magic-mint-400)",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          marginRight: "6px",
                          marginBottom: "6px",
                        }}
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "15px",
                      borderTop: "1px solid #f0f0f0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#666",
                        background: "#f8f9fa",
                        padding: "4px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {project.duration} • {project.startDate}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "var(--magic-mint-600)",
                        fontWeight: "600",
                      }}
                    >
                      {project.volunteersRegistered}/{project.volunteersNeeded}{" "}
                      volunteers
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
