import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/auth-scoped.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
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
        <div className="auth-form-container auth-sizing-component">
          <div className="auth-form-header">
            <h1>Welcome Back</h1>
            <p>Enter Your Credentials to login</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="auth-form-fields">
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
              <button type="submit" className="auth-button">
                login
              </button>
            </div>
          </form>
          <div className="auth-login-link">
            Don't have an account? <Link to="/signup">SignUp</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
