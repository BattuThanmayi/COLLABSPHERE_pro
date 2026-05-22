import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import './ProjectCard.css';

function ProjectCard({ project, onJoin }) {
  const [joined, setJoined] = useState(false);
  const { token } = useAuth();

  const handleJoinRequest = async () => {
    if (!token) {
      alert('Please login to join projects');
      return;
    }

    try {
      const data = await api.joinProject(
        project._id,
        'I want to join this project',
        token
      );

      if (!data.error) {
        setJoined(true);
        if (onJoin) onJoin();
        alert('Join request sent!');
      } else {
        alert(data.message || 'Failed to join project');
      }
    } catch (err) {
      console.error('Failed to join project:', err);
      alert('Error joining project');
    }
  };

  return (
    <div className="project-card">
      <div className="card-header">
        <h3>{project.title}</h3>
        <span className="project-badge">{project.contributors?.length || 0} members</span>
      </div>

      <p className="description">{project.description}</p>

      <div className="skills-container">
        <strong>Required Skills:</strong>
        <div className="skills-list">
          {project.requiredSkills?.map((skill, idx) => (
            <span key={idx} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <small>Created by: {project.createdBy?.name || 'Unknown'}</small>
      </div>

      <button
        className={`btn-join ${joined ? 'joined' : ''}`}
        onClick={handleJoinRequest}
        disabled={joined}
      >
        {joined ? '✓ Request Sent' : 'Join Project'}
      </button>
    </div>
  );
}

export default ProjectCard;
