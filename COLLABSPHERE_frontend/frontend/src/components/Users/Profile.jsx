import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import './Profile.css';

function Profile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.getUserProfile(token);
      setProfile(data);
      setFormData(data);
    } catch (err) {
      setError('Failed to fetch profile');
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const data = await api.updateUserProfile(formData, token);
      if (!data.error) {
        setProfile(data);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
      console.error('Failed to update profile:', err);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="error-message">{error || 'Failed to load profile'}</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{profile.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h1>{profile.name}</h1>
            <p className="email">{profile.email}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="edit-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={formData.name || ''}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                placeholder="Tell us about yourself"
                value={formData.bio || ''}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>GitHub Link</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={formData.githubLink || ''}
                onChange={(e) =>
                  setFormData({ ...formData, githubLink: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <input
                type="text"
                value={formData.skills ? formData.skills.join(', ') : ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skills: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(profile);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-section">
              <h3>Bio</h3>
              <p>{profile.bio || 'No bio added yet'}</p>
            </div>

            <div className="info-section">
              <h3>GitHub</h3>
              {profile.githubLink ? (
                <a
                  href={profile.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link"
                >
                  {profile.githubLink}
                </a>
              ) : (
                <p>Not added</p>
              )}
            </div>

            <div className="info-section">
              <h3>Skills</h3>
              <div className="skills-list">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, idx) => (
                    <span key={idx} className="skill-badge">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p>No skills added yet</p>
                )}
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
