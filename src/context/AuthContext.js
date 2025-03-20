import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create the authentication context
const AuthContext = createContext();

// API URL
const API_URL = "http://localhost:8000/api/v1";

// Create the authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);

  // Configure axios to include credentials
  axios.defaults.withCredentials = true;

  // Add auth token to all requests
  axios.interceptors.request.use(
    (config) => {
      if (authToken) {
        config.headers["Authorization"] = `Bearer ${authToken}`;
      }
      const csrfToken = getCookie("csrf_token");
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Function to get a cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (!authToken) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/users/me`);
        setUser(response.data);
        setError(null);
      } catch (err) {
        setUser(null);
        // Clear token if it's invalid
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('authToken');
          setAuthToken(null);
        }
        // Don't set error for 401 (not authenticated)
        if (err.response && err.response.status !== 401) {
          setError(err.response?.data?.detail || "An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [authToken]);

  // Register a new user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Login a user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/login/json`, {
        email,
        password,
      });
      
      // Save token to localStorage and state
      const token = response.data.access_token;
      localStorage.setItem('authToken', token);
      setAuthToken(token);

      // Get user info after successful login
      const userResponse = await axios.get(`${API_URL}/users/me`);
      setUser(userResponse.data);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout a user
  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/logout`);
      localStorage.removeItem('authToken');
      setAuthToken(null);
      setUser(null);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Logout failed";
      setError(errorMessage);
      // Still remove token on front-end even if server logout fails
      localStorage.removeItem('authToken');
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/auth/request-password-reset`,
        {
          email,
        }
      );
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Password reset request failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword, confirmPassword) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Password reset failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/verify-email`, {
        token,
      });
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Email verification failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (
    currentPassword,
    newPassword,
    confirmPassword
  ) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/users/me/change-password`, {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Password change failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/users/me`, userData);
      setUser(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Profile update failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Check if user is admin
  const isAdmin = () => hasRole("admin") || (user && user.email && user.email.includes("admin")) || (user && user.is_admin);

  // Check if user is moderator
  const isModerator = () => hasRole("moderator") || hasRole("admin");

  // Value to be provided by the context
  const value = {
    user,
    loading,
    error,
    authToken,
    register,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    changePassword,
    updateProfile,
    isAdmin,
    isModerator,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;