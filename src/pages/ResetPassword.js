import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const { resetPassword, loading, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Get token from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    // Check if token exists
    if (!token) {
      setFormError("Reset token is missing");
      return false;
    }

    // Check if passwords match
    if (formData.new_password !== formData.confirm_password) {
      setFormError("Passwords do not match");
      return false;
    }

    // Check password length
    if (formData.new_password.length < 8) {
      setFormError("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      await resetPassword(
        token,
        formData.new_password,
        formData.confirm_password
      );
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      // Error is already handled in the auth context
      console.error("Password reset error:", err);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card error-card">
          <h2>Invalid Reset Link</h2>
          <p className="error-message">
            The password reset link is invalid or has expired.
          </p>
          <div className="auth-links">
            <Link to="/forgot-password">Request a new reset link</Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card success-card">
          <h2>Password Reset Successful!</h2>
          <p>
            Your password has been successfully reset. You will be redirected to
            the login page in a few seconds.
          </p>
          <div className="auth-links">
            <Link to="/login">Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>

        {(error || formError) && (
          <div className="error-message">{formError || error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="new_password">New Password</label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>

        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
