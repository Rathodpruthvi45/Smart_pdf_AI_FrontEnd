import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protected route component that requires authentication
const ProtectedRoute = ({
  requiredRole = null,
  redirectPath = "/login",
  children,
}) => {
  const { user, loading, isAdmin, isModerator, hasRole } = useAuth();

  // Show loading state
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check if user has required role
  if (requiredRole) {
    let hasRequiredRole = false;

    if (requiredRole === "admin") {
      hasRequiredRole = isAdmin();
    } else if (requiredRole === "moderator") {
      hasRequiredRole = isModerator();
    } else {
      hasRequiredRole = hasRole(requiredRole);
    }

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render children or outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
