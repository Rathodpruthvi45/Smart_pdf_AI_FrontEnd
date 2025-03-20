import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import TodoPage from "./pages/TodoPage";
import Pdf_upload from "./pages/Pdf_upload";
import Genrated_quations from "./pages/Genrated_quations";
import Quations_types from "./pages/Quations_types";
import Subscription from "./pages/Subscription";
import QuestionTypes from "./pages/QuestionTypes";


import AdminDashboard from "./pages/AdminDashboard";

// Styles
import "./styles/index.css";

// Protected route wrapper
const ProtectedRouteComponent = () => {
  const { authToken } = useAuth();

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Admin route wrapper
const AdminRouteComponent = () => {
  const { authToken, user, isAdmin } = useAuth();

  // Check if user is logged in and has admin privileges
  if (!authToken || !user || !isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="subscription" element={<Subscription />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRouteComponent />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="todos" element={<TodoPage />} />
              <Route path="pdf-upload" element={<Pdf_upload />} />
              <Route path="genrated-quations" element={<Genrated_quations />} />
              <Route path="quations-types" element={<Quations_types />} />
              <Route path="question-types" element={<QuestionTypes />} />
              
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRouteComponent />}>
              <Route path="admin" element={<AdminDashboard />} />
              {/* Add more admin routes here if needed */}
            </Route>

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
