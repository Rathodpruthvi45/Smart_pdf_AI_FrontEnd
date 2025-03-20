import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, loading } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to PR Smart PDF AI</h1>
        <p className="hero-text">
          An intelligent PDF question generator powered by AI
        </p>

        <div className="hero-actions">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : user ? (
            <>
              <Link to="/pdf-upload" className="btn btn-primary">
                Upload Documents
              </Link>
              <Link to="/genrated-quations" className="btn btn-secondary">
                Generated Questions History
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>PDF Processing</h3>
            <p>
              Upload any PDF document and our AI will analyze its content
              intelligently
            </p>
          </div>

          <div className="feature-card">
            <h3>Smart Question Generation</h3>
            <p>
              AI-powered system generates relevant questions from PDF chapters
              and content
            </p>
          </div>

          <div className="feature-card">
            <h3>Multiple Question Types</h3>
            <p>
              Generate multiple choice, true/false, and open-ended questions
            </p>
          </div>

          <div className="feature-card">
            <h3>Chapter-wise Analysis</h3>
            <p>Break down PDFs by chapters for targeted question generation</p>
          </div>

          <div className="feature-card">
            <h3>Export Options</h3>
            <p>Download generated questions in multiple formats for easy use</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
