import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/AdminDashboard.css";

// Dashboard Stat Card Component
const StatCard = ({ title, value, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
};

// User Table Component
const UserTable = ({ users, onDeleteUser }) => {
  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Subscription</th>
            <th>PDFs</th>
            <th>Questions</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                <span className={`badge tier-${user.subscription_tier}`}>
                  {user.subscription_tier}
                </span>
              </td>
              <td>{user.pdf_count}</td>
              <td>{user.question_count}</td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn-view"
                  onClick={() => window.alert(`View user ${user.id}`)}
                >
                  View
                </button>
                <button
                  className="btn-delete"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this user?"
                      )
                    ) {
                      onDeleteUser(user.id);
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// PDF Table Component
const PdfTable = ({ pdfs, onDeletePdf }) => {
  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Filename</th>
            <th>User</th>
            <th>Size</th>
            <th>Uploaded</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pdfs.map((pdf) => (
            <tr key={pdf.id}>
              <td>{pdf.filename}</td>
              <td>{pdf.user_email}</td>
              <td>{pdf.size_kb.toFixed(1)} KB</td>
              <td>{new Date(pdf.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn-view"
                  onClick={() => window.alert(`View PDF ${pdf.id}`)}
                >
                  View
                </button>
                <button
                  className="btn-delete"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this PDF?"
                      )
                    ) {
                      onDeletePdf(pdf.id);
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Activity Feed Component
const ActivityFeed = ({ activities }) => {
  return (
    <div className="activity-feed">
      <h3>Recent Activity</h3>
      <ul>
        {activities.map((activity, index) => (
          <li key={index} className={`activity-item ${activity.type}`}>
            <div className="activity-time">
              {new Date(activity.timestamp).toLocaleTimeString()}
            </div>
            <div className="activity-content">
              <strong>{activity.user_email}</strong> {activity.details}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verify user is admin, redirect otherwise
    const checkAdmin = async () => {
      try {
        // This could be a specific endpoint to verify admin status
        await axios.get("http://localhost:8000/api/admin/stats", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch (err) {
        console.error("Not authorized as admin:", err);
        navigate("/");
      }
    };

    checkAdmin();
  }, [authToken, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (activeTab === "overview" || activeTab === "activity") {
          const statsResponse = await axios.get(
            "http://localhost:8000/api/admin/stats",
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );
          setStats(statsResponse.data);
        }

        if (activeTab === "users") {
          const usersResponse = await axios.get(
            "http://localhost:8000/api/admin/users",
            {
              headers: { Authorization: `Bearer ${authToken}` },
              params: { search: searchTerm },
            }
          );
          setUsers(usersResponse.data);
        }

        if (activeTab === "pdfs") {
          const pdfsResponse = await axios.get(
            "http://localhost:8000/api/admin/pdfs",
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );
          setPdfs(pdfsResponse.data);
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, authToken, searchTerm]);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Remove user from the list
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
    }
  };

  const handleDeletePdf = async (pdfId) => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/pdfs/${pdfId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Remove PDF from the list
      setPdfs(pdfs.filter((pdf) => pdf.id !== pdfId));
    } catch (err) {
      console.error("Error deleting PDF:", err);
      setError("Failed to delete PDF. Please try again.");
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return <div className="loading">Loading data...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    switch (activeTab) {
      case "overview":
        return stats ? (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <StatCard
                title="Total Users"
                value={stats.total_users}
                icon="👥"
              />
              <StatCard
                title="Active Users"
                value={stats.active_users}
                icon="✓"
              />
              <StatCard title="Total PDFs" value={stats.total_pdfs} icon="📄" />
              <StatCard
                title="Questions Generated"
                value={stats.total_questions_generated}
                icon="❓"
              />
            </div>

            <div className="dashboard-charts">
              <div className="chart-container">
                <h3>Users by Subscription</h3>
                <div className="tier-distribution">
                  <div className="tier-bar">
                    <div
                      className="tier-segment tier-free"
                      style={{
                        width: `${
                          (stats.users_by_tier.free / stats.total_users) * 100
                        }%`,
                      }}
                    >
                      Free ({stats.users_by_tier.free})
                    </div>
                    <div
                      className="tier-segment tier-pro"
                      style={{
                        width: `${
                          (stats.users_by_tier.pro / stats.total_users) * 100
                        }%`,
                      }}
                    >
                      Pro ({stats.users_by_tier.pro})
                    </div>
                    <div
                      className="tier-segment tier-enterprise"
                      style={{
                        width: `${
                          (stats.users_by_tier.enterprise / stats.total_users) *
                          100
                        }%`,
                      }}
                    >
                      Enterprise ({stats.users_by_tier.enterprise})
                    </div>
                  </div>
                </div>
              </div>

              <ActivityFeed activities={stats.recent_activity} />
            </div>
          </div>
        ) : null;

      case "users":
        return (
          <div className="users-tab">
            <div className="actions-bar">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <UserTable users={users} onDeleteUser={handleDeleteUser} />
          </div>
        );

      case "pdfs":
        return (
          <div className="pdfs-tab">
            <div className="actions-bar">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search PDFs..."
                  className="search-input"
                />
              </div>
            </div>
            <PdfTable pdfs={pdfs} onDeletePdf={handleDeletePdf} />
          </div>
        );

      case "activity":
        return stats ? (
          <div className="activity-tab">
            <h2>System Activity</h2>
            <ActivityFeed activities={stats.recent_activity} />
          </div>
        ) : null;

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>

      <div className="dashboard-container">
        <nav className="dashboard-nav">
          <ul>
            <li
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </li>
            <li
              className={activeTab === "users" ? "active" : ""}
              onClick={() => setActiveTab("users")}
            >
              Users
            </li>
            <li
              className={activeTab === "pdfs" ? "active" : ""}
              onClick={() => setActiveTab("pdfs")}
            >
              PDFs
            </li>
            <li
              className={activeTab === "activity" ? "active" : ""}
              onClick={() => setActiveTab("activity")}
            >
              Activity
            </li>
          </ul>
        </nav>

        <main className="dashboard-content">{renderTabContent()}</main>
      </div>
    </div>
  );
}

export default AdminDashboard;
