import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/auth-scoped.css";

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup attempt:", {
      firstName,
      lastName,
      email,
      username,
      location,
      password,
      repeatPassword,
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-left-side">
        <div className="auth-logo">
          <img src="assets/logo-black.svg" alt="logo" className="logo" />
          <h1>VolunteerSync</h1>
        </div>
        <div className="auth-left-message">
          <h1>
            "Volunteering is at the very core of being a human. No one has made
            it through life without someone else's help."
          </h1>
          <h6>- Heather French Henry</h6>
        </div>
      </div>
      <div className="auth-right-side">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1>Create an account</h1>
            <p>
              By creating an account you agree to our terms of service and
              privacy policy
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="auth-form-fields">
              <div className="auth-name-fields">
                <div className="auth-form-group">
                  <label htmlFor="firstName">First Name</label>
                  <div className="auth-input-field">
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="auth-form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <div className="auth-input-field">
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="auth-form-group">
                <label htmlFor="email">Email</label>
                <div className="auth-input-field">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="auth-form-group">
                <label htmlFor="username">Username</label>
                <div className="auth-input-field">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="auth-form-group">
                <label htmlFor="location">Location</label>
                <div className="auth-input-field auth-location-field">
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <div className="auth-dropdown-arrow"></div>
                </div>
              </div>
              <div className="auth-form-group">
                <label htmlFor="password">Password</label>
                <div className="auth-input-field">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="auth-form-group">
                <label htmlFor="repeatPassword">Repeat password</label>
                <div className="auth-input-field">
                  <input
                    type="password"
                    id="repeatPassword"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="auth-button">
                Sign up
              </button>
            </div>
          </form>
          <div className="auth-login-link">
            Already have an account? <Link to="/login">Login.</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
