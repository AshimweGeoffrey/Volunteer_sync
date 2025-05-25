import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { User } from "../types";
import Header from "./Header";

const EditProfile: React.FC = () => {
  const { currentUser, updateUser, updateProfilePicture, addNotification } =
    useUser();

  const [profileData, setProfileData] = useState({
    firstName: currentUser?.name?.split(" ")[0] || currentUser?.firstName || "",
    lastName:
      currentUser?.name?.split(" ").slice(1).join(" ") ||
      currentUser?.lastName ||
      "",
    bio: currentUser?.bio || "",
    gender: currentUser?.gender || "",
    age: currentUser?.age?.toString() || "",
    email: currentUser?.email || "",
    location: currentUser?.location || "",
    profileImage: currentUser?.profileImage || "/assets/1.jpeg",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare the update data in the frontend User format (DataTransformer will convert to backend format)
      const updateData: Partial<User> = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        bio: profileData.bio,
        gender: profileData.gender,
        age: profileData.age ? parseInt(profileData.age) : undefined,
        location: profileData.location,
      };

      // Remove undefined values
      const cleanUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(
          ([_, value]) => value !== undefined && value !== ""
        )
      );

      // Use the UserContext's updateUser method which calls the API
      await updateUser(cleanUpdateData);

      // Add success notification
      addNotification({
        title: "Profile Updated Successfully!",
        message: "Your profile information has been updated and saved.",
        type: "Success",
        isRead: false,
        actionUrl: "/profile",
      });

      setIsLoading(false);
    } catch (error: any) {
      setError(error.message || "Failed to update profile");
      setIsLoading(false);

      // Add error notification
      addNotification({
        title: "Profile Update Failed",
        message:
          error.message ||
          "There was an error updating your profile. Please try again.",
        type: "Error",
        isRead: false,
      });
    }
  };

  const handleCancel = () => {
    // Check if there are unsaved changes
    const hasChanges =
      profileData.firstName !==
        (currentUser?.name?.split(" ")[0] || currentUser?.firstName || "") ||
      profileData.lastName !==
        (currentUser?.name?.split(" ").slice(1).join(" ") ||
          currentUser?.lastName ||
          "") ||
      profileData.bio !== (currentUser?.bio || "") ||
      profileData.gender !== (currentUser?.gender || "") ||
      profileData.age !== (currentUser?.age?.toString() || "") ||
      profileData.location !== (currentUser?.location || "") ||
      profileData.profileImage !==
        (currentUser?.profileImage || "/assets/1.jpeg");

    if (hasChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to discard them?"
        )
      ) {
        // Reset to original values
        setProfileData({
          firstName:
            currentUser?.name?.split(" ")[0] || currentUser?.firstName || "",
          lastName:
            currentUser?.name?.split(" ").slice(1).join(" ") ||
            currentUser?.lastName ||
            "",
          bio: currentUser?.bio || "",
          gender: currentUser?.gender || "",
          age: currentUser?.age?.toString() || "",
          email: currentUser?.email || "",
          location: currentUser?.location || "",
          profileImage: currentUser?.profileImage || "/assets/1.jpeg",
        });
        setError(null);
      }
    } else {
      // No changes, can safely go back
      window.history.back();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file size must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          const imageBase64 = e.target!.result as string;

          // Update state for immediate UI feedback
          setProfileData((prev) => ({
            ...prev,
            profileImage: imageBase64,
          })); // Save profile image to localStorage via UserContext
          try {
            await updateProfilePicture(imageBase64);
            setError(null); // Clear any previous errors

            // Add success notification
            addNotification({
              title: "Profile Picture Updated",
              message: "Your profile picture has been updated successfully.",
              type: "Success",
              isRead: false,
            });
          } catch (error) {
            setError("Failed to save profile image");
          }
        }
      };
      reader.onerror = () => {
        setError("Failed to read the image file");
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
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
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
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
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
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
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
                      disabled
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid var(--magic-mint-200)",
                        borderRadius: "6px",
                        fontSize: "16px",
                        outline: "none",
                        backgroundColor: "#f5f5f5",
                        color: "#666",
                      }}
                    />
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
                      min="16"
                      max="100"
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
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="City, Country"
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
              </div>

              {/* Error Display */}
              {error && (
                <div
                  style={{
                    backgroundColor: "#fee",
                    color: "#c33",
                    padding: "12px",
                    borderRadius: "6px",
                    marginBottom: "20px",
                    border: "1px solid #fcc",
                  }}
                >
                  {error}
                </div>
              )}

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
