import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, authToken, logout, isAdmin, isModerator } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          PR Smart PDF AI
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isOpen ? "fas fa-times" : "fas fa-bars"} />
        </div>

        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>

          {authToken ? (
            <>
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className="nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/pdf-upload"
                  className="nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  Upload PDF
                </Link>
              </li>

              {isAdmin() && (
                <li className="nav-item">
                  <Link
                    to="/admin"
                    className="nav-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                </li>
              )}

              {isModerator() && (
                <li className="nav-item">
                  <Link
                    to="/moderator"
                    className="nav-link"
                    onClick={() => setIsOpen(false)}
                  >
                    Moderator
                  </Link>
                </li>
              )}

              <li className="nav-item">
                <button className="nav-link btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link
                  to="/login"
                  className="nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/register"
                  className="nav-link nav-link-highlight"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
