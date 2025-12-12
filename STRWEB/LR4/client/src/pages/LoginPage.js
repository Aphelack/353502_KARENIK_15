import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { isValidEmail } from '../utils/helpers';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithYandex } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
            setError(result.error);
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
      console.error('Yandex login error:', err);
      setError('Yandex authentication failed');
    }
  };

  return (
    <div className="login-page">
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
