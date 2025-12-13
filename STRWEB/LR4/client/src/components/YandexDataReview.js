import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import './YandexDataReview.css';

// Component to review and confirm Yandex OAuth data
function YandexDataReview({ userData, onConfirm, onCancel }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: '',
    gender: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Event Handler 34: Auto-fill form with Yandex data
  useEffect(() => {
    if (userData) {
      // Simulate filling process with delays for visual effect
      const fillSequence = async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        setFormData(prev => ({ ...prev, name: userData.name || '' }));
        
        await new Promise(resolve => setTimeout(resolve, 200));
        setFormData(prev => ({ ...prev, email: userData.email || '' }));
        
        await new Promise(resolve => setTimeout(resolve, 200));
        setFormData(prev => ({ ...prev, birthDate: userData.birthDate || '' }));
        
        await new Promise(resolve => setTimeout(resolve, 200));
        setFormData(prev => ({ ...prev, gender: userData.gender || '' }));
        
        await new Promise(resolve => setTimeout(resolve, 200));
        setFormData(prev => ({ ...prev, phone: userData.phone || '' }));
      };
      
      fillSequence();
    }
  }, [userData]);

  // Event Handler 35: onInputChange
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Event Handler 36: onConfirm
  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const confirmData = {
        yandexId: userData.yandexId,
        email: formData.email,
        name: formData.name,
        birthDate: formData.birthDate,
        gender: formData.gender,
        phone: formData.phone,
        avatar: userData.avatar,
      };

      const response = await authAPI.yandexConfirm(confirmData, timezone);
      
      // Save token and call onConfirm
      localStorage.setItem('token', response.data.token);
      onConfirm(response.data);
      navigate('/');
    } catch (err) {
      console.error('Confirmation error:', err);
      setError(err.response?.data?.message || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="yandex-review-overlay">
      <div className="yandex-review-modal">
        <div className="yandex-review-header">
          <h2>🎉 Welcome from Yandex!</h2>
          <p>Review and edit your information before continuing</p>
        </div>

        {userData?.avatar && (
          <div className="yandex-avatar">
            <img src={userData.avatar} alt="Profile" />
          </div>
        )}

        <div className="yandex-review-form">
          <div className="form-group animate-fill">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group animate-fill">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group animate-fill">
            <label htmlFor="birthDate">Birth Date (Optional)</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group animate-fill">
            <label htmlFor="gender">Gender (Optional)</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group animate-fill">
            <label htmlFor="phone">Phone (Optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 234 567 8900"
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="yandex-review-actions">
          <button 
            onClick={handleConfirm}
            className="btn btn-primary"
            disabled={loading || !formData.name || !formData.email}
          >
            {loading ? 'Creating Account...' : 'Confirm & Continue'}
          </button>
          <button 
            onClick={onCancel}
            className="btn btn-outline"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default YandexDataReview;
