import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './TopNavbar.css';

function TopNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  const handleNotificationsClick = () => {
    navigate('/notifications');
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="top-navbar">
      <div className="top-navbar-container">
        {/* Left Side - Logo/Title */}
        <div className="top-navbar-left">
          <h1 className="app-title">📊 CollabSphere</h1>
        </div>

        {/* Right Side - Notifications & Profile */}
        <div className="top-navbar-right">
          {/* Notifications Bell */}
          <button className="notification-btn" title="Notifications">
            🔔
            <span className="notification-badge">3</span>
          </button>

          {/* Profile Dropdown */}
          <div className="profile-dropdown-container">
            <button className="profile-btn" onClick={toggleDropdown}>
              <div className="profile-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || '👤'}
              </div>
              <span className="profile-name">{user?.name || 'User'}</span>
              <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▼</span>
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-user-info">
                    <div className="dropdown-avatar">
                      {user?.name?.charAt(0)?.toUpperCase() || '👤'}
                    </div>
                    <div className="dropdown-user-details">
                      <div className="dropdown-user-name">{user?.name || 'User'}</div>
                      <div className="dropdown-user-email">{user?.email || 'email@example.com'}</div>
                    </div>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <button className="dropdown-item" onClick={handleProfileClick}>
                  <span className="dropdown-icon">👤</span>
                  <span className="dropdown-text">My Profile</span>
                </button>

                <button className="dropdown-item" onClick={handleNotificationsClick}>
                  <span className="dropdown-icon">🔔</span>
                  <span className="dropdown-text">Notifications</span>
                </button>

                <button className="dropdown-item">
                  <span className="dropdown-icon">⚙️</span>
                  <span className="dropdown-text">Settings</span>
                </button>

                <div className="dropdown-divider"></div>

                <button className="dropdown-item logout" onClick={handleLogout}>
                  <span className="dropdown-icon">🚪</span>
                  <span className="dropdown-text">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopNavbar;
