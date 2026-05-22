import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          🚀 CollabSphere
        </Link>

        <div className="nav-links">
          <Link to="/projects" className="nav-link">
            Projects
          </Link>

          {user?.email ? (
            <>
              <Link to="/messages" className="nav-link">
                💬 Messages
              </Link>
              <Link to="/profile" className="nav-link">
                👤 {user?.name || 'Profile'}
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
