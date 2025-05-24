import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import Header from "./Header";

const EditProfile: React.FC = () => {
  const { currentUser, updateUser } = useUser();

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "User Name",
    bio: currentUser?.bio || "No bio available",
    gender: currentUser?.gender || "Not specified",
    age: currentUser?.age?.toString() || "Not specified",
    email: currentUser?.email || "user@example.com",
    location: currentUser?.location || "Location not set",
    profileImage: currentUser?.profileImage || "/assets/1.jpeg",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call and update user context
    setTimeout(() => {
      const updatedUser = {
        ...currentUser!,
        name: profileData.name,
        bio: profileData.bio,
        gender: profileData.gender,
        age: parseInt(profileData.age) || 0,
        email: profileData.email,
        location: profileData.location,
        profileImage: profileData.profileImage,
      };
      updateUser(updatedUser);
      setIsLoading(false);
      alert("Profile updated successfully!");
    }, 800);
  };

  const handleCancel = () => {
    if (window.confirm("Discard changes?")) {
      // Reset to original values or navigate back
      window.location.reload();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileData((prev) => ({
            ...prev,
            profileImage: e.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Header showSearch={false} />

      <div style={{ marginTop: "30px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "30px",
            color: "var(--primary-200)",
          }}
        >
          Edit Profile
        </h1>

        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          {/* Profile Sidebar */}
          <div
            style={{
              width: "280px",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid var(--magic-mint-200)",
              }}
            >
              {/* Profile Image Section */}
              <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={profileData.profileImage}
                    alt="profile"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "4px solid var(--magic-mint-200)",
                    }}
                  />
                  <label
                    style={{
                      position: "absolute",
                      bottom: "5px",
                      right: "5px",
                      background: "var(--magic-mint-500)",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      border: "2px solid white",
                    }}
                  >
                    <img
                      src="/assets/edit.svg"
                      alt="edit"
                      style={{ width: "16px" }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "30px",
                border: "1px solid var(--magic-mint-200)",
              }}
            >
              {/* Basic Information */}
              <div style={{ marginBottom: "30px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    margin: "0 0 20px 0",
                    color: "var(--primary-200)",
                  }}
                >
                  Basic Information
                </h3>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        marginBottom: "8px",
                        color: "var(--primary-200)",
                      }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
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
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        marginBottom: "8px",
                        color: "var(--primary-200)",
                      }}
                    >
                      Gender
                    </label>
                    <select
                      value={profileData.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid var(--magic-mint-200)",
                        borderRadius: "6px",
                        fontSize: "16px",
                        outline: "none",
                      }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "var(--primary-200)",
                    }}
                  >
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid var(--magic-mint-200)",
                      borderRadius: "6px",
                      fontSize: "16px",
                      minHeight: "120px",
                      resize: "vertical",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        marginBottom: "8px",
                        color: "var(--primary-200)",
                      }}
                    >
                      Age
                    </label>
                    <input
                      type="number"
                      value={profileData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
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
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        marginBottom: "8px",
                        color: "var(--primary-200)",
                      }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
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
                <div style={{ marginTop: "15px" }}>
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
                    value={profileData.location}
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
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "15px" }}>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    background: "var(--magic-mint-500)",
                    color: "white",
                    border: "none",
                    padding: "14px 24px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    background: "transparent",
                    color: "var(--primary-200)",
                    border: "1px solid var(--magic-mint-200)",
                    padding: "14px 24px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
