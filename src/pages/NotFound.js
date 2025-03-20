import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="auth-container">
      <div className="auth-card error-card">
        <h2>404 - Page Not Found</h2>
        <p className="error-message">
          The page you are looking for does not exist.
        </p>
        <div className="auth-links">
          <Link to="/" className="btn btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
