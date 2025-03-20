import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <div className="auth-container">
      <div className="auth-card error-card">
        <h2>Access Denied</h2>
        <p className="error-message">
          You don't have permission to access this page.
        </p>
        <p>
          Your current role ({user?.role || "unknown"}) does not have the
          required permissions.
        </p>
        <div className="auth-links">
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
