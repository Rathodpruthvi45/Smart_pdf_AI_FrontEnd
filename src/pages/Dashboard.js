import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleUploadPDF = () => {
    navigate("/pdf-upload");
  };

  const handleViewQuestions = () => {
    navigate("/genrated-quations");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>AI PDF Question Generator</h1>
        <button className="btn btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="user-info-card">
          <h2>Welcome, {user.username}!</h2>
          <div className="user-details">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Full Name:</strong> {user.full_name || "Not provided"}
            </p>
          </div>
        </div>

        <div className="dashboard-actions">
          <h3>PDF Actions</h3>
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleUploadPDF}>
              Upload New PDF
            </button>
            <button className="btn btn-secondary" onClick={handleViewQuestions}>
              View Generated Questions
            </button>
          </div>
        </div>

        <div className="features-section">
          <h3>Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <h4>Upload PDF</h4>
              <p>Upload your PDF documents to generate questions automatically</p>
            </div>
            <div className="feature-card">
              <h4>AI Question Generation</h4>
              <p>Advanced AI algorithms analyze your PDF and create relevant questions</p>
            </div>
            <div className="feature-card">
              <h4>Review Questions</h4>
              <p>View and manage all generated questions from your PDFs</p>
            </div>
            <div className="feature-card">
              <h4>Export Options</h4>
              <p>Download questions in various formats for your use</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
