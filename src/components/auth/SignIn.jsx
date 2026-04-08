import React, { useState } from 'react';
import axios from 'axios';
import Captcha from './Captcha';
import './auth.css';

export default function SignIn({ switchMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isCaptchaValid) {
      setError('Invalid CAPTCHA. Please verify.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const user = response.data;
      localStorage.setItem(
        'authUser',
        JSON.stringify({ name: user.name, email: user.email, course: user.course })
      );
      sessionStorage.setItem('studentLoggedIn', 'true');
      sessionStorage.setItem('studentName', user.name);
      window.location.href = '/feedback-form';
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to server. Make sure the backend is running on port 8080.');
      } else {
        setError(err.response?.data?.message || `Server error ${err.response.status}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container fade-in">
      <h2 className="auth-title">Welcome Back</h2>
      <p className="auth-subtitle">Sign in to your account</p>

      {error && <div className="auth-error">{error}</div>}

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

        <div className="auth-input-group">
          <label>Password</label>
          <div className="auth-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="auth-toggle-pwd"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="auth-forgot-link">
          <button type="button" onClick={() => switchMode('forgot')} className="auth-link-button">
            Forgot Password?
          </button>
        </div>

        <Captcha onVerify={setIsCaptchaValid} />

        <button type="submit" className="auth-submit-btn" disabled={isLoading || !isCaptchaValid}>
          {isLoading ? <span className="auth-loader"></span> : "Sign In"}
        </button>
      </form>

      <div className="auth-switch-mode">
        Don't have an account?{' '}
        <button type="button" onClick={() => switchMode('signup')} className="auth-link-button">
          Sign Up
        </button>
      </div>
    </div>
  );
}
