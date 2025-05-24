import React from "react";

const UserProfile = ({ user }) => {
  // Other code...

  const dribbbleUrl = user?.social?.dribbble;

  // Other code...

  return (
    <div>
      {/* Other JSX... */}
      {dribbbleUrl && (
        <a href={dribbbleUrl} target="_blank" rel="noopener noreferrer">
          Dribbble Profile
        </a>
      )}
      {/* Other JSX... */}
    </div>
  );
};

export default UserProfile;
