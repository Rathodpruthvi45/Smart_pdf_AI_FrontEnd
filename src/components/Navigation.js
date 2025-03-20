import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navigation.css";

function Navigation() {
  const { authToken, user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin =
    user && (user.is_admin || (user.email && user.email.includes("admin")));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">Smart PDF Q&A</Link>
        </div>

        {authToken ? (
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/upload">Upload PDF</Link>
            {isAdmin && (
              <Link to="/admin" className="admin-link">
                Admin
              </Link>
            )}
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <div className="nav-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
