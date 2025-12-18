import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { isValidEmail } from '../utils/helpers';
import YandexDataReview from '../components/YandexDataReview';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login, setAuthData } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  // Event Handler 23: onInputChange
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  // Event Handler 24: onSubmit (with validation)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Event Handler 25: onYandexLogin
  const handleYandexLogin = async () => {
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
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const result = await authAPI.yandexCallback(code, timezone);
            
            if (result.data.success) {
              if (result.data.isLogin) {
                // Existing user - login directly
                setAuthData(result.data.token, result.data.user);
                navigate('/');
              } else {
                // New user - show registration form
                setYandexData(result.data.userData);
              }
            } else {
              setError('Failed to get user data from Yandex');
            }
          } catch (err) {
            setError(err.response?.data?.message || 'Yandex authentication failed. Please try again.');
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
      console.error('Yandex login error:', err);
      setError('Yandex authentication failed. Please try again.');
    }
  };

  // Handle Yandex data confirmation
  const handleYandexConfirm = (data) => {
    // User is now logged in
    setYandexData(null);
    setAuthData(data.token, data.user);
    navigate('/');
  };

  const handleYandexCancel = () => {
    setYandexData(null);
  };

  return (
    <div className="login-page">
      {yandexData && (
        <YandexDataReview 
          userData={yandexData}
          onConfirm={handleYandexConfirm}
          onCancel={handleYandexCancel}
        />
      )}
      
      <div className="login-container">
        <div className="login-header">
          <h1>🍕 Welcome Back!</h1>
          <p>Login to order delicious pizza</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
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
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button 
          onClick={handleYandexLogin}
          className="btn btn-yandex btn-block"
          disabled={loading}
        >
          <span className="yandex-icon">Я</span>
          Continue with Yandex
        </button>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
