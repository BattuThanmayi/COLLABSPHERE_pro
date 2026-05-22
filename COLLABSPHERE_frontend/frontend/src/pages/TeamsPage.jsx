import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useContexts';
import { useTeams } from '../hooks/useContexts';
import './Pages.css';

const TeamsPage = () => {
  const { token } = useAuth();
  const { teams, fetchTeams, joinTeam, loading, error } = useTeams();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    skills: ''
  });

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    await api.createTeam({
      name: formData.name,
      description: formData.description,
      skills: formData.skills.split(',').map(s => s.trim())
    }, token);

    setFormData({ name: '', description: '', skills: '' });
    setShowCreateForm(false);
    fetchTeams();
  };

  const handleJoinTeam = async (teamId) => {
    await joinTeam(teamId, '', token);
    fetchTeams();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="teams-page">
      <h1>Teams</h1>

      <div className="page-header">
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Create Team'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && (
        <div className="form-section">
          <h2>Create New Team</h2>
          <form onSubmit={handleCreateTeam} className="team-form">
            <div className="form-group">
              <label>Team Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter team name"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What does your team do?"
              />
            </div>

            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g., React, Node.js, Python"
              />
            </div>

            <button type="submit" className="btn btn-success">
              Create Team
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading teams...</div>
      ) : teams.length > 0 ? (
        <div className="teams-grid">
          {teams.map(team => (
            <div key={team._id} className="team-card">
              <div className="team-header">
                <h3>{team.name}</h3>
                <span className={`status ${team.status}`}>{team.status}</span>
              </div>

              <p className="team-description">
                {team.description || 'No description provided'}
              </p>

              {team.skills?.length > 0 && (
                <div className="skills">
                  {team.skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              )}

              <div className="team-stats">
                <span>{team.members?.length || 0} members</span>
                <span>Created by {team.createdBy?.name}</span>
              </div>

              <div className="team-actions">
                <button className="btn btn-secondary">View Details</button>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleJoinTeam(team._id)}
                >
                  Join Team
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No teams found. Create one or wait for others to create teams!</p>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
