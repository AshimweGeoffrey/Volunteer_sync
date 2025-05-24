import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import Header from "./Header";
import "../css/user-profile.css";

const UserProfile: React.FC = () => {
  const { currentUser } = useUser();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Mock contribution history - in real app this would come from API
  const contributions = [
    {
      title: "Beach Cleanup Project",
      image: "/assets/Rectangle 2.png",
      startDate: "2023-03-15",
      endDate: "2023-03-22",
      description:
        "Participated in a community beach cleanup initiative, helping to remove plastic waste and protect marine life.",
    },
    {
      title: "Tree Planting Initiative",
      image: "/assets/Rectangle 2.png",
      startDate: "2023-05-10",
      endDate: "2023-05-15",
      description:
        "Contributed to urban reforestation efforts by planting native trees in local parks and green spaces.",
    },
    {
      title: "Digital Literacy Training",
      image: "/assets/Rectangle 2.png",
      startDate: "2023-07-01",
      endDate: "2023-07-30",
      description:
        "Assisted in teaching basic computer skills to elderly community members and disadvantaged youth.",
    },
  ];

  return (
    <div className="profile-page">
      <Header showSearch={false} />

      <div className="profile-container">
        <div className="profile-sidebar-main">
          <div className="profile-sidebar">
            <div>
              <img src={currentUser.profileImage} alt={currentUser.name} />
              <div>
                <h1>{currentUser.name}</h1>
                <img src="/assets/badge.svg" alt="verified" />
                <p>Joined {formatDate(currentUser.joinedDate)}</p>
              </div>
              <Link to="/profile/edit">
                <img src="/assets/edit.svg" alt="Edit Profile" />
              </Link>
            </div>

            <div>
              <div>
                <div>
                  <img src="/assets/profile.svg" alt="profile stats" />
                  <div>
                    <h1>Profile Stats</h1>
                    <p>
                      Projects: {currentUser.completedProjects} • Rating:{" "}
                      {currentUser.rating}/5
                    </p>
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
                <h3>{currentUser.name}</h3>
              </div>
              <div>
                <p>gender</p>
                <h3>{currentUser.gender}</h3>
              </div>
              <div>
                <p>location</p>
                <h3>{currentUser.location}</h3>
              </div>
              <div>
                <p>age</p>
                <h3>{currentUser.age}</h3>
              </div>
              <div>
                <p>email</p>
                <h3>{currentUser.email}</h3>
              </div>
              <div>
                <p>phone</p>
                <h3>{currentUser.phone}</h3>
              </div>
            </div>
          </div>

          <div className="profile-bio">
            <h1>Bio</h1>
            <p>{currentUser.bio}</p>
          </div>

          <div className="profile-interests">
            <h1>Interests</h1>
            <div className="interests-container">
              {currentUser.interests.map((interest, index) => (
                <span key={index} className="interest-tag">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="profile-badges">
            <h1>Badges</h1>
            <div className="badges-container">
              {currentUser.badges.map((badge) => (
                <div key={badge.id} className="badge-item">
                  <img src={badge.icon} alt={badge.name} />
                  <div>
                    <p className="badge-name">{badge.name}</p>
                    <p className="badge-description">{badge.description}</p>
                    <p className="badge-date">
                      Earned {formatDate(badge.earnedDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="profile-contribution">
            <h1>Contribution History</h1>
            {contributions.map((contribution, index) => (
              <div key={index} className="profile-contribution-card">
                <div>
                  <img src={contribution.image} alt={contribution.title} />
                  <div>
                    <h2>{contribution.title}</h2>
                    <div>
                      <p>{formatDate(contribution.startDate)}</p>
                      <p>{formatDate(contribution.endDate)}</p>
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
