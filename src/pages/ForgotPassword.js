import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const { requestPasswordReset, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validate email
    if (!email) {
      setFormError("Please enter your email address");
      return;
    }

    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      // Error is already handled in the auth context
      console.error("Password reset request error:", err);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card success-card">
          <h2>Password Reset Email Sent</h2>
          <p>
            If an account exists with the email you provided, we've sent
            instructions to reset your password. Please check your inbox and
            follow the link in the email.
          </p>
          <div className="auth-links">
            <Link to="/login">Return to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>

        {(error || formError) && (
          <div className="error-message">{formError || error}</div>
        )}

        <p>
          Enter your email address and we'll send you instructions to reset your
          password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
