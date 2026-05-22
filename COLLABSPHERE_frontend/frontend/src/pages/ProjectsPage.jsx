import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import ProjectCard from '../components/Projects/ProjectCard';
import CreateProject from '../components/Projects/CreateProject';
import '../components/Projects/Projects.css';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.getAllProjects();
      setProjects(data || []);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    await fetchProjects();
  };

  const handleJoinProject = async () => {
    await fetchProjects();
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">📁 Projects</h1>
        <p className="page-subtitle">Manage and collaborate on your projects</p>
      </div>

      {error && <div className="error-container"><div className="error-title">Error</div>{error}</div>}

      <div style={{ marginBottom: '24px', textAlign: 'right' }}>
        {token && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            ➕ Create Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📁</div>
          <div className="empty-state-title">No Projects Yet</div>
          <div className="empty-state-description">
            Be the first to create a project or join an existing one!
          </div>
        </div>
      ) : (
        <div className="content-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onJoin={handleJoinProject}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CreateProject
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateProject}
        />
      )}
    </div>
  );
}

export default ProjectsPage;
