import React from 'react';
import Profile from '../components/Users/Profile';
import './Pages-Updated.css';

function ProfilePage() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">👤 Profile</h1>
        <p className="page-subtitle">Manage your profile information</p>
      </div>
      <Profile />
    </div>
  );
}

export default ProfilePage;
