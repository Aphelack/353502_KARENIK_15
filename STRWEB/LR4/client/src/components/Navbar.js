import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCurrentTime } from '../utils/helpers';
import './Navbar.css';

// Functional Component with declarative function
function Navbar({ timezone }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Event Handler 1: onTimeUpdate
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getCurrentTime(timezone));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  // Event Handler 2: onLogout
  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  // Event Handler 3: onMenuToggle
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // Event Handler 4: onLinkClick
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={handleLinkClick}>
          🍕 Pizzeria
        </Link>
        
        <div className="navbar-info">
          <span className="navbar-timezone">
            {timezone} - {currentTime}
          </span>
        </div>

        <button 
          className={`menu-toggle ${menuOpen ? 'active' : ''}`}
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" onClick={handleLinkClick}>Home</Link>
          </li>
          <li>
            <Link to="/menu" onClick={handleLinkClick}>Menu</Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/customize" onClick={handleLinkClick}>Customize Pizza</Link>
              </li>
              <li>
                <Link to="/orders" onClick={handleLinkClick}>My Orders</Link>
              </li>
            </>
          )}
          {user ? (
            <>
              <li className="navbar-user">
                <span>👤 {user.name}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="navbar-button logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={handleLinkClick}>
                  <button className="navbar-button login">Login</button>
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={handleLinkClick}>
                  <button className="navbar-button register">Register</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
