import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { verifyEmail } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      // Get token from URL query parameters
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');

      if (!token) {
        setVerifying(false);
        setErrorMessage('Verification token is missing');
        return;
      }

      try {
        await verifyEmail(token);
        setSuccess(true);
      } catch (err) {
        setErrorMessage('Email verification failed. The token may be invalid or expired.');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [location.search, verifyEmail]);

  if (verifying) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Verifying Email</h2>
          <div className="loading-spinner">Loading...</div>
          <p>Please wait while we verify your email address...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card success-card">
          <h2>Email Verified!</h2>
          <p>
            Your email has been successfully verified. You can now log in to your account.
          </p>
          <div className="auth-links">
            <Link to="/login" className="btn btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card error-card">
        <h2>Verification Failed</h2>
        <p className="error-message">{errorMessage}</p>
        <div className="auth-links">
          <Link to="/login">Go to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 