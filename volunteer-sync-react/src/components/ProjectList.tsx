import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tasksService } from "../services";
import { VolunteerProject } from "../types";
import { DataTransformer } from "../utils/dataTransformer";
import { useUser } from "../contexts/UserContext";
import Header from "./Header";

const ProjectList: React.FC = () => {
  const { currentUser } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<VolunteerProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goals: "",
    location: "",
    startDate: "",
    endDate: "",
    skills: [
      { weight: "", name: "" },
      { weight: "", name: "" },
    ],
  });

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await tasksService.getTasks({ pageSize: 100 });
      const transformedProjects = response.items.map(
        DataTransformer.transformTask
      );
      setProjects(transformedProjects);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError("Failed to load projects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter projects by status and search
  const ongoingProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return project.status === "active" && matchesSearch;
  });

  const finishedProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return project.status === "completed" && matchesSearch;
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillChange = (index: number, field: string, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setFormData((prev) => ({ ...prev, skills: newSkills }));
  };

  // Check if user has permission to create tasks
  const canCreateTasks = () => {
    if (!currentUser) return false;
    const allowedRoles = [
      "SuperAdmin",
      "OrganizationAdmin",
      "OrganizationMember",
    ];
    return allowedRoles.includes(currentUser.role);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check permissions before attempting to create
      if (!canCreateTasks()) {
        setError(
          "You don't have permission to create tasks. Contact your organization administrator."
        );
        return;
      }

      // Create task data for the API following the CreateTaskRequest interface
      const taskData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: {
          street: formData.location,
          city: "Kigali",
          state: "Kigali",
          zipCode: "00000",
          country: "Rwanda",
          latitude: -1.9706,
          longitude: 30.1044,
        },
        maxVolunteers: 10,
        category: 1, // Default category
        requirements: formData.goals ? [formData.goals] : [],
        skills: formData.skills
          .filter((skill) => skill.name && skill.weight)
          .map((skill) => skill.name),
        tags: [],
        isUrgent: false,
        applicationDeadline: formData.endDate || new Date().toISOString(),
      };

      await tasksService.createTask(taskData);

      // Reset form and close modal
      setFormData({
        title: "",
        description: "",
        goals: "",
        location: "",
        startDate: "",
        endDate: "",
        skills: [
          { weight: "", name: "" },
          { weight: "", name: "" },
        ],
      });
      setShowCreateModal(false);

      // Reload projects to show the new one
      await loadProjects();
    } catch (err) {
      console.error("Failed to create project:", err);
      setError("Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowCreateModal(false);
    setFormData({
      title: "",
      description: "",
      goals: "",
      location: "",
      startDate: "",
      endDate: "",
      skills: [
        { weight: "", name: "" },
        { weight: "", name: "" },
      ],
    });
  };

  const renderProjectCard = (project: any) => (
    <div
      key={project.id}
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        border: "1px solid var(--magic-mint-200)",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
      }}
    >
      <Link
        to={`/project/${project.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            margin: "0 0 20px 0",
            color: "var(--primary-200)",
          }}
        >
          {project.title}
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "var(--magic-mint-600)",
              fontWeight: "500",
            }}
          >
            +{project.volunteersRegistered} Volunteers
          </p>
        </div>

        <p
          style={{
            fontSize: "16px",
            lineHeight: "1.5",
            color: "var(--primary-200)",
            margin: 0,
            opacity: 0.8,
          }}
        >
          {project.description}
        </p>
      </Link>
    </div>
  );

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: "var(--magic-mint-50)",
        minHeight: "100vh",
      }}
    >
      <Header
        showSearch={true}
        searchPlaceholder="Search projects..."
        onSearchChange={setSearchTerm}
        searchValue={searchTerm}
      />

      {/* Main Container */}
      <div style={{ display: "flex", gap: "30px", padding: "30px 120px" }}>
        {/* Sidebar */}
        <div style={{ width: "300px" }}>
          {/* Group Info */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "30px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              border: "1px solid var(--magic-mint-200)",
              marginBottom: "20px",
            }}
          >
            <img
              src="/assets/Logo Shapes 16.svg"
              alt="group logo"
              style={{ width: "60px", marginBottom: "15px" }}
            />
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "600",
                margin: "0 0 15px 0",
                color: "var(--primary-200)",
              }}
            >
              Group A
            </h1>
            <div style={{ fontSize: "14px", color: "var(--magic-mint-600)" }}>
              <p style={{ margin: "0 0 5px 0" }}>Kigali</p>
              <p style={{ margin: 0 }}>Joined Sept 2024</p>
            </div>
          </div>

          {/* Projects Stats */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "30px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              border: "1px solid var(--magic-mint-200)",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <img
              src="/assets/profile.svg"
              alt="projects"
              style={{ width: "40px" }}
            />
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  margin: "0 0 5px 0",
                  color: "var(--primary-200)",
                }}
              >
                Projects
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "var(--magic-mint-600)",
                }}
              >
                {ongoingProjects.length} Ongoing {finishedProjects.length}{" "}
                Finished
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {/* Error Message */}
          {error && (
            <div
              style={{
                backgroundColor: "#f8d7da",
                border: "1px solid #f5c6cb",
                color: "#721c24",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading && !projects.length && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
                fontSize: "18px",
                color: "var(--magic-mint-600)",
              }}
            >
              Loading projects...
            </div>
          )}

          {/* Projects Header */}
          <div style={{ marginBottom: "30px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  margin: 0,
                  color: "var(--primary-200)",
                }}
              >
                Projects
              </h1>
              <button
                onClick={() => {
                  if (canCreateTasks()) {
                    setShowCreateModal(true);
                  } else {
                    setError(
                      "You don't have permission to create tasks. Only organization members can create tasks."
                    );
                  }
                }}
                disabled={isLoading}
                style={{
                  background: canCreateTasks()
                    ? "var(--magic-mint-500)"
                    : "#ccc",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: canCreateTasks() ? "pointer" : "not-allowed",
                  transition: "background-color 0.2s",
                  opacity: canCreateTasks() ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  if (canCreateTasks()) {
                    e.currentTarget.style.background = "var(--magic-mint-600)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (canCreateTasks()) {
                    e.currentTarget.style.background = "var(--magic-mint-500)";
                  }
                }}
                title={
                  canCreateTasks()
                    ? "Create new Project"
                    : "You need organization permissions to create tasks"
                }
              >
                Create new Project
              </button>
            </div>
            <p
              style={{
                fontSize: "18px",
                fontWeight: "500",
                margin: 0,
                color: "var(--primary-200)",
              }}
            >
              Ongoing Projects
            </p>
          </div>

          {/* Ongoing Projects Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
              marginBottom: "40px",
            }}
          >
            {ongoingProjects.map(renderProjectCard)}
          </div>

          {/* Finished Projects Section */}
          {finishedProjects.length > 0 && (
            <div>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  margin: "0 0 20px 0",
                  color: "var(--primary-200)",
                }}
              >
                Finished
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "24px",
                }}
              >
                {finishedProjects.map(renderProjectCard)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "40px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "600",
                margin: "0 0 30px 0",
                color: "var(--primary-200)",
              }}
            >
              Add new project
            </h1>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Project Title */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    color: "var(--primary-200)",
                  }}
                >
                  Project title
                </label>
                <input
                  type="text"
                  placeholder="Enter project title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid var(--magic-mint-200)",
                    borderRadius: "6px",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    color: "var(--primary-200)",
                  }}
                >
                  Description
                </label>
                <textarea
                  placeholder="Enter some long form content"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid var(--magic-mint-200)",
                    borderRadius: "6px",
                    fontSize: "16px",
                    outline: "none",
                    minHeight: "100px",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Goals */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "4px",
                    color: "var(--primary-200)",
                  }}
                >
                  Goals
                </label>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--magic-mint-600)",
                    marginBottom: "8px",
                  }}
                >
                  Enter one goal in one line using bulleted lists.
                </div>
                <textarea
                  placeholder="Enter some long form content"
                  value={formData.goals}
                  onChange={(e) => handleInputChange("goals", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid var(--magic-mint-200)",
                    borderRadius: "6px",
                    fontSize: "16px",
                    outline: "none",
                    minHeight: "100px",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Location */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    color: "var(--primary-200)",
                  }}
                >
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid var(--magic-mint-200)",
                    borderRadius: "6px",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Time Commitment Section */}
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  margin: "20px 0 10px 0",
                  color: "var(--primary-200)",
                }}
              >
                Time Commitment
              </h2>

              {/* Date Fields */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "var(--primary-200)",
                    }}
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid var(--magic-mint-200)",
                      borderRadius: "6px",
                      fontSize: "16px",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "var(--primary-200)",
                    }}
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid var(--magic-mint-200)",
                      borderRadius: "6px",
                      fontSize: "16px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Skills Required Section */}
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  margin: "20px 0 10px 0",
                  color: "var(--primary-200)",
                }}
              >
                Skills required
              </h2>

              {formData.skills.map((skill, index) => (
                <div key={index} style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    placeholder="12"
                    value={skill.weight}
                    onChange={(e) =>
                      handleSkillChange(index, "weight", e.target.value)
                    }
                    style={{
                      width: "80px",
                      padding: "12px",
                      border: "1px solid var(--magic-mint-200)",
                      borderRadius: "6px",
                      fontSize: "16px",
                      outline: "none",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Enter skill"
                    value={skill.name}
                    onChange={(e) =>
                      handleSkillChange(index, "name", e.target.value)
                    }
                    style={{
                      flex: 1,
                      padding: "12px",
                      border: "1px solid var(--magic-mint-200)",
                      borderRadius: "6px",
                      fontSize: "16px",
                      outline: "none",
                    }}
                  />
                </div>
              ))}

              {/* Buttons */}
              <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                <button
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    background: "transparent",
                    color: "var(--magic-mint-600)",
                    border: "1px solid var(--magic-mint-300)",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  style={{
                    flex: 1,
                    background: "var(--magic-mint-500)",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
