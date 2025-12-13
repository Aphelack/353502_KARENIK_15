import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { isValidEmail } from '../utils/helpers';
import YandexDataReview from '../components/YandexDataReview';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [yandexData, setYandexData] = useState(null);
  const messageHandlerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      if (messageHandlerRef.current) {
        window.removeEventListener('message', messageHandlerRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
    // Clean up any existing listeners
    if (messageHandlerRef.current) {
      window.removeEventListener('message', messageHandlerRef.current);
      messageHandlerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    try {
      const response = await authAPI.getYandexUrl();
      const authUrl = response.data.authUrl;
      
      // Open Yandex OAuth in a popup
      const popup = window.open(
        authUrl,
        'Yandex OAuth',
        'width=600,height=700'
      );

      // Flag to prevent duplicate processing
      let processed = false;

      // Listen for OAuth callback
      const handleMessage = async (event) => {
        if (event.data.type === 'yandex-oauth' && !processed) {
          processed = true; // Set flag immediately
          const code = event.data.code;
          popup?.close();

          // Remove listener immediately to prevent duplicates
          window.removeEventListener('message', handleMessage);
          messageHandlerRef.current = null;
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          setLoading(true);
          try {
            const result = await authAPI.yandexCallback(code);
            
            if (result.data.success) {
              if (result.data.isLogin) {
                // User already exists - login directly
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('user', JSON.stringify(result.data.user));
                navigate('/');
              } else {
                // New user - show review modal with user data
                setYandexData(result.data.userData);
              }
            } else {
              setErrors({ general: 'Failed to get user data from Yandex' });
            }
          } catch (err) {
            setErrors({ general: err.response?.data?.message || 'Yandex authentication failed. Please try again.' });
          } finally {
            setLoading(false);
          }
        }
      };

      messageHandlerRef.current = handleMessage;
      window.addEventListener('message', handleMessage);

      // Cleanup after 2 minutes (timeout for OAuth flow)
      timeoutRef.current = setTimeout(() => {
        if (messageHandlerRef.current) {
          window.removeEventListener('message', messageHandlerRef.current);
          messageHandlerRef.current = null;
        }
      }, 120000);
    } catch (err) {
      console.error('Yandex register error:', err);
      setErrors({ general: 'Yandex authentication failed. Please try again.' });
    }
  };

  // Handle Yandex data confirmation
  const handleYandexConfirm = (response) => {
    // User is now registered and logged in
    setYandexData(null);
    window.location.reload(); // Reload to update auth context
  };

  const handleYandexCancel = () => {
    setYandexData(null);
  };

  return (
    <div className="register-page">
      {yandexData && (
        <YandexDataReview 
          userData={yandexData}
          onConfirm={handleYandexConfirm}
          onCancel={handleYandexCancel}
        />
      )}
      
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
