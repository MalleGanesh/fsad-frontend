import React, { useState } from 'react';
import axios from 'axios';
import './auth.css';

export default function ForgotPassword({ switchMode }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSuccess('Password reset link sent to your email.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container fade-in">
      <h2 className="auth-title">Reset Password</h2>
      <p className="auth-subtitle">Enter your email to receive a reset link</p>
      
      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-input-group">
          <label>Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="auth-input"
            placeholder="you@example.com"
            required
          />
        </div>

        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? <span className="auth-loader"></span> : "Send Reset Link"}
        </button>
      </form>

      <div className="auth-switch-mode">
        <button type="button" onClick={() => switchMode('signin')} className="auth-link-button">
          Back to Sign In
        </button>
      </div>
    </div>
  );
}
