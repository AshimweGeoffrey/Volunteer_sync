import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import "../css/auth-scoped.css";

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validation
    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Using the correct request format as specified in the backend API documentation
      const success = await signup({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
      });

      if (success) {
        // Redirect to home page after successful signup
        navigate("/", { replace: true });
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during signup. Please try again.");
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
              {error && (
                <div
                  style={{
                    color: "#dc3545",
                    backgroundColor: "#f8d7da",
                    border: "1px solid #f5c6cb",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    marginBottom: "16px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}
              <div className="auth-name-fields">
                <div className="auth-form-group">
                  <label htmlFor="firstName">First Name</label>
                  <div className="auth-input-field">
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={isSubmitting}
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
                      required
                      disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="auth-form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <div className="auth-input-field">
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+123456789"
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
              <div className="auth-form-group">
                <label htmlFor="repeatPassword">Repeat password</label>
                <div className="auth-input-field">
                  <input
                    type="password"
                    id="repeatPassword"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="auth-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Sign up"}
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
