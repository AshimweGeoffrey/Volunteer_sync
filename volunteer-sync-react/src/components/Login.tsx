import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import "../css/auth-scoped.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, default to home
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Call the login endpoint using the UserContext login method
      // This will connect to the backend API endpoint at /api/auth/login
      await login(email, password, rememberMe);

      // If we reach here, login was successful

      // Optional: Show a success message or notification if you have a notification system
      // For example: addNotification({ title: "Login Successful", message: "Welcome back!", type: "Success" });

      // Redirect to the intended destination or home page
      navigate(from, { replace: true });
    } catch (err: any) {
      // Handle different error types from the backend API
      if (err.response) {
        // The request was made and the server responded with an error status
        const status = err.response.status;
        const errorData = err.response.data;

        // Handle API error responses
        if (status === 400) {
          // Bad request - typically validation errors
          if (errorData.errors && Object.keys(errorData.errors).length > 0) {
            // Format validation errors
            const errorMessages = Object.values(errorData.errors).flat();
            setError(errorMessages.join(", "));
          } else {
            setError(
              errorData.message || "Please check your email and password"
            );
          }
        } else if (status === 401) {
          // Unauthorized - wrong credentials
          setError("Invalid email or password. Please try again.");
        } else if (status === 429) {
          // Too many attempts
          setError("Too many login attempts. Please try again later.");
        } else {
          // Other errors
          setError(errorData.message || "Login failed. Please try again.");
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your connection.");
      } else {
        // Something else caused the error
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
              {error && (
                <div
                  style={{
                    color: "#dc3545",
                    backgroundColor: "#f8d7da",
                    border: "1px solid #f5c6cb",
                    borderRadius: "4px",
                    padding: "12px 16px",
                    marginBottom: "16px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ marginRight: "8px" }}>⚠️</span>
                  {error}
                </div>
              )}
              <div className="auth-form-group">
                <label htmlFor="email">Email</label>
                <div className="auth-input-field">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
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
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="auth-form-group" style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ width: "auto", marginRight: "8px" }}
                    />
                    <label
                      htmlFor="rememberMe"
                      style={{ margin: 0, fontSize: "14px" }}
                    >
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Password reset functionality will be implemented soon!"
                      )
                    }
                    style={{
                      fontSize: "14px",
                      color: "#1dac7a",
                      textDecoration: "none",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="auth-button"
                disabled={isSubmitting}
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting && (
                  <span
                    style={{
                      display: "inline-block",
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      marginRight: "8px",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                )}
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              {/* Add loading spinner animation */}
              {isSubmitting && (
                <style>
                  {`
                    @keyframes spin {
                      to { transform: rotate(360deg); }
                    }
                  `}
                </style>
              )}
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
