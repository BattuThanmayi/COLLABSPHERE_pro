import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './SideNavbar.css';

function SideNavbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
      requireAuth: true,
    },
    {
      label: 'Projects',
      icon: '📁',
      path: '/projects',
      requireAuth: true,
    },
    {
      label: 'Teams',
      icon: '👥',
      path: '/teams',
      requireAuth: true,
    },
    {
      label: 'Tasks',
      icon: '✅',
      path: '/tasks',
      requireAuth: true,
    },
    {
      label: 'Messages',
      icon: '💬',
      path: '/messages',
      requireAuth: true,
    },
    {
      label: 'Notifications',
      icon: '🔔',
      path: '/notifications',
      requireAuth: true,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Only show sidebar if user is authenticated
  if (!user?.email) {
    return null;
  }

  return (
    <aside className={`side-navbar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Toggle Button */}
      <button
        className="toggle-btn"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? 'Expand' : 'Collapse'}
      >
        {isCollapsed ? '→' : '←'}
      </button>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Main</h3>
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path)}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.path === location.pathname && (
                    <span className="nav-active-indicator"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Additional Section */}
        <div className="nav-section">
          <h3 className="nav-section-title">User</h3>
          <ul className="nav-list">
            <li className="nav-item">
              <Link
                to="/profile"
                className={`nav-link ${isActive('/profile')}`}
                title={isCollapsed ? 'Profile' : ''}
              >
                <span className="nav-icon">👤</span>
                <span className="nav-label">Profile</span>
                {location.pathname === '/profile' && (
                  <span className="nav-active-indicator"></span>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/settings"
                className={`nav-link ${isActive('/settings')}`}
                title={isCollapsed ? 'Settings' : ''}
              >
                <span className="nav-icon">⚙️</span>
                <span className="nav-label">Settings</span>
                {location.pathname === '/settings' && (
                  <span className="nav-active-indicator"></span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="footer-content">
          <div className="footer-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || '👤'}
          </div>
          <div className="footer-info">
            <div className="footer-name">{user?.name || 'User'}</div>
            <div className="footer-status">Online</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SideNavbar;
