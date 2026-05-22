import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import './Pages-Updated.css';

function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    projectInvites: true,
    teamInvites: true,
    taskReminders: true,
    messageNotifications: true,
    theme: 'light',
    language: 'en',
  });

  const [saveStatus, setSaveStatus] = useState('');

  const handleSettingChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: value,
    });
  };

  const handleSaveSettings = async () => {
    try {
      setSaveStatus('saving');
      // Simulate API call
      setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 3000);
      }, 500);
    } catch (error) {
      setSaveStatus('error');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">⚙️ Settings</h1>
        <p className="page-subtitle">Manage your account preferences and notifications</p>
      </div>

      <div className="content-grid-2col">
        {/* Notification Settings */}
        <div className="card">
          <h2 className="card-header">📬 Notification Settings</h2>
          <div className="card-content">
            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    handleSettingChange('emailNotifications', e.target.checked)
                  }
                  className="setting-checkbox"
                />
                <span>Email Notifications</span>
              </label>
              <p className="setting-description">
                Receive email notifications for important updates
              </p>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.projectInvites}
                  onChange={(e) =>
                    handleSettingChange('projectInvites', e.target.checked)
                  }
                  className="setting-checkbox"
                />
                <span>Project Invites</span>
              </label>
              <p className="setting-description">Get notified when invited to a project</p>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.teamInvites}
                  onChange={(e) =>
                    handleSettingChange('teamInvites', e.target.checked)
                  }
                  className="setting-checkbox"
                />
                <span>Team Invites</span>
              </label>
              <p className="setting-description">Get notified when invited to a team</p>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.taskReminders}
                  onChange={(e) =>
                    handleSettingChange('taskReminders', e.target.checked)
                  }
                  className="setting-checkbox"
                />
                <span>Task Reminders</span>
              </label>
              <p className="setting-description">
                Receive reminders for tasks assigned to you
              </p>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={settings.messageNotifications}
                  onChange={(e) =>
                    handleSettingChange('messageNotifications', e.target.checked)
                  }
                  className="setting-checkbox"
                />
                <span>Message Notifications</span>
              </label>
              <p className="setting-description">Get notified when you receive messages</p>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="card">
          <h2 className="card-header">🎨 Appearance</h2>
          <div className="card-content">
            <div className="setting-item">
              <label className="setting-label">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="setting-select"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="auto">Auto (System)</option>
              </select>
              <p className="setting-description">Choose your preferred theme</p>
            </div>

            <div className="setting-item">
              <label className="setting-label">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="setting-select"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
              <p className="setting-description">Select your preferred language</p>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="card">
          <h2 className="card-header">🔐 Account Settings</h2>
          <div className="card-content">
            <div className="account-info">
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Username:</strong> {user?.name}
              </p>
              <p>
                <strong>Account Created:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>

            <button className="btn btn-secondary" style={{ marginTop: '16px' }}>
              Change Password
            </button>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="card">
          <h2 className="card-header">🔒 Privacy & Security</h2>
          <div className="card-content">
            <div className="setting-item">
              <label className="setting-label">
                <input type="checkbox" defaultChecked className="setting-checkbox" />
                <span>Profile Visibility</span>
              </label>
              <p className="setting-description">Allow others to see your profile</p>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                <input type="checkbox" defaultChecked className="setting-checkbox" />
                <span>Activity Status</span>
              </label>
              <p className="setting-description">Show when you're online</p>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                <input type="checkbox" defaultChecked className="setting-checkbox" />
                <span>Message Privacy</span>
              </label>
              <p className="setting-description">Only team members can message you</p>
            </div>

            <button className="btn btn-danger" style={{ marginTop: '16px' }}>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button
          className={`btn btn-primary ${saveStatus === 'saving' ? 'loading' : ''}`}
          onClick={handleSaveSettings}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving'
            ? '💾 Saving...'
            : saveStatus === 'saved'
            ? '✓ Saved!'
            : '💾 Save Settings'}
        </button>
        {saveStatus === 'saved' && (
          <p style={{ color: '#27ae60', marginTop: '10px', fontWeight: '600' }}>
            Settings saved successfully!
          </p>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;
