import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { isValidEmail } from '../utils/helpers';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const { register, loginWithYandex } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Event Handler 26: onInputChange
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    setErrors(prev => ({
      ...prev,
      [name]: '',
    }));
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Event Handler 27: onSubmit (with validation)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const result = await register(
        formData.email,
        formData.password,
        formData.name,
        timezone
      );

      if (result.success) {
        alert('Registration successful! Welcome to Pizzeria.');
        navigate('/');
      } else {
        setErrors({ general: result.error });
      }
    } catch (err) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  // Event Handler 28: onYandexRegister
  const handleYandexRegister = async () => {
    try {
      const response = await authAPI.getYandexUrl();
      const authUrl = response.data.authUrl;
      
      // Open Yandex OAuth in a popup
      const popup = window.open(
        authUrl,
        'Yandex OAuth',
        'width=600,height=700'
      );

      // Listen for OAuth callback
      const handleMessage = async (event) => {
        if (event.data.type === 'yandex-oauth') {
          const code = event.data.code;
          popup?.close();

          setLoading(true);
          const result = await loginWithYandex(code);
          
          if (result.success) {
            navigate('/');
          } else {
            setErrors({ general: result.error });
          }
          setLoading(false);
        }
      };

      window.addEventListener('message', handleMessage);

      // Cleanup
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    } catch (err) {
      console.error('Yandex register error:', err);
      setErrors({ general: 'Yandex authentication failed' });
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>🍕 Join Pizzeria</h1>
          <p>Create an account to start ordering</p>
        </div>

        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
              minLength="2"
              autoComplete="name"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              minLength="6"
              autoComplete="new-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
            <small className="field-hint">Minimum 6 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              minLength="6"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button 
          onClick={handleYandexRegister}
          className="btn btn-yandex btn-block"
          disabled={loading}
        >
          <span className="yandex-icon">Я</span>
          Register with Yandex
        </button>

        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
