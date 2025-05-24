import React from "react";
import { Link } from "react-router-dom";
import { mockVolunteers } from "../data/mockData";
import "../css/user-profile.css";

const UserProfile: React.FC = () => {
  // Mock user data - in a real app this would come from API/context
  const user = {
    ...mockVolunteers[0],
    age: 28,
    gender: "Male",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur, nunc et bibendum facilisis, nunc nisl aliquet nunc, eget aliquam nisl nunc eget nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur, nunc et bibendum facilisis, nunc nisl aliquet nunc, eget aliquam nisl nunc eget nunc.",
    socialLinks: {
      dribbble: "dribbble.com/johndoe",
      linkedin: "linkedin.com/in/johndoe",
      github: "github.com/johndoe",
    },
    badges: [
      { name: "Bronze", icon: "/assets/bronze.svg", tasks: "5 Tasks" },
      { name: "Silver", icon: "/assets/silver.svg", tasks: "10 Tasks" },
      { name: "Gold", icon: "/assets/gold.svg", tasks: "20 Tasks" },
    ],
    contributions: [
      {
        title: "Beach Cleanup Project",
        image: "/assets/Rectangle 2.png",
        startDate: "15 March 2023",
        endDate: "22 March 2023",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur, nunc et bibendum facilisis, nunc nisl aliquet nunc, eget aliquam nisl nunc eget nunc.",
      },
      {
        title: "Food Bank Volunteer",
        image: "/assets/Rectangle 2.png",
        startDate: "1 April 2023",
        endDate: "8 April 2023",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur, nunc et bibendum facilisis, nunc nisl aliquet nunc.",
      },
      {
        title: "Tree Planting Initiative",
        image: "/assets/Rectangle 2.png",
        startDate: "10 May 2023",
        endDate: "15 May 2023",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur, nunc et bibendum facilisis.",
      },
    ],
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="logo">
          <img src="assets/logo-black.svg" alt="" />
          <p>VolunteerSync</p>
        </div>
        <div className="profile-header-right">
          <div className="profile-header-right-search search">
            <img src="assets/search.svg" alt="" />
            <input type="text" placeholder="Search" />
          </div>
          <div className="profile-separator">|</div>
          <div className="profile-header-right-icon">
            <img src="assets/notification icon.svg" alt="" />
            <img src="assets/1.jpeg" alt="" />
          </div>
        </div>
      </div>

      <div className="profile-container">
        <div className="profile-sidebar-main">
          <div className="profile-sidebar">
            <div>
              <img src="assets/1.jpeg" alt="" />
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
              <p>Social Links</p>
              <div>
                <div>
                  <img src="assets/pinish.svg" alt="" />
                  <p>{user.socialLinks.dribbble}</p>
                </div>
                <div>
                  <img src="assets/linkedin-blue.svg" alt="" />
                  <p>{user.socialLinks.linkedin}</p>
                </div>
                <div>
                  <img src="assets/github.svg" alt="" />
                  <p>{user.socialLinks.github}</p>
                </div>
              </div>
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
                <p>{badge.tasks}</p>
              </div>
            ))}
          </div>

          <div className="profile-contribution">
            <h1>Contribution History</h1>
            {user.contributions.map((contribution, index) => (
              <div key={index} className="profile-contribution-card">
                <div>
                  <img src={contribution.image} alt="" />
                  <div>
                    <h2>{contribution.title}</h2>
                    <div>
                      <p>{contribution.startDate}</p>
                      <p>{contribution.endDate}</p>
                    </div>
                  </div>
                </div>
                <p>{contribution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
