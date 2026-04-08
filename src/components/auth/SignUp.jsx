import React, { useState } from 'react';
import axios from 'axios';
import Captcha from './Captcha';
import './auth.css';

export default function SignUp({ switchMode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    password: '',
    confirmPassword: ''
  });
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePasswordStrength = (pwd) => {
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return pwRegex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.course || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!validatePasswordStrength(formData.password)) {
      setError('Password must be at least 8 characters, with 1 uppercase, 1 lowercase, and 1 number.');
      return;
    }
    if (!isCaptchaValid) {
      setError('Invalid CAPTCHA. Please verify.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        course: formData.course,
        password: formData.password,
      });
      setSuccess('Account created successfully! You can now sign in.');
      setTimeout(() => switchMode('signin'), 2000);
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to server. Make sure the backend is running on port 8080.');
      } else {
        setError(err.response?.data?.message || `Error ${err.response.status}: Registration failed.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container fade-in">
      <h2 className="auth-title">Create an Account</h2>
      <p className="auth-subtitle">Join us today to get started</p>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-input-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="auth-input"
            placeholder="John Doe"
            required
          />
        </div>

        <div className="auth-input-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="auth-input"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="auth-input-group">
          <label>Course</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="auth-input"
            placeholder="e.g. B.Tech"
            required
          />
        </div>

        <div className="auth-input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="auth-input"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="auth-input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="auth-input"
            placeholder="••••••••"
            required
          />
        </div>

        <Captcha onVerify={setIsCaptchaValid} />

        <button type="submit" className="auth-submit-btn" disabled={isLoading || !isCaptchaValid}>
          {isLoading ? <span className="auth-loader"></span> : "Sign Up"}
        </button>
      </form>

      <div className="auth-switch-mode">
        Already have an account?{' '}
        <button type="button" onClick={() => switchMode('signin')} className="auth-link-button">
          Sign In
        </button>
      </div>
    </div>
  );
}
