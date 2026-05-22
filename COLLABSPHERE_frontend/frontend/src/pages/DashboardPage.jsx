import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useContexts';
import { useDashboard } from '../hooks/useContexts';
import './Pages.css';

const DashboardPage = () => {
  const { token, user } = useAuth();
  const { dashboard, fetchDashboard, loading } = useDashboard();

  useEffect(() => {
    if (token) {
      fetchDashboard(token);
    }
  }, [token, fetchDashboard]);

  if (loading) return <div className="page-wrapper"><div className="loading-spinner"><div className="spinner"></div></div></div>;
  if (!dashboard) return <div className="page-wrapper"><div className="error-container"><div className="error-title">Error Loading Dashboard</div></div></div>;

  const { stats, recentProjects, recentTeams, pendingTasks, unreadNotifications, pendingRequests } = dashboard;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">📊 Welcome, {user?.name}!</h1>
        <p className="page-subtitle">Here's your project overview</p>
      </div>

      {/* Stats Section */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats.totalProjects}</h3>
          <p>Projects Created</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalTeams}</h3>
          <p>Teams Created</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalMembers}</h3>
          <p>Team Members</p>
        </div>
        <div className="stat-card highlight">
          <h3>{stats.unreadNotifications}</h3>
          <p>Unread Notifications</p>
        </div>
        <div className="stat-card highlight">
          <h3>{stats.pendingRequests}</h3>
          <p>Pending Requests</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Recent Projects */}
        <div className="dashboard-section">
          <h2>Recent Projects</h2>
          {recentProjects.length > 0 ? (
            <div className="project-list">
              {recentProjects.map(project => (
                <div key={project._id} className="dashboard-item">
                  <h4>{project.title}</h4>
                  <p>{project.description.substring(0, 100)}...</p>
                  <div className="item-meta">
                    <span className={`status ${project.status}`}>{project.status}</span>
                    <span className="members">{project.members?.length || 0} members</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No projects yet. Create your first project!</p>
          )}
        </div>

        {/* Recent Teams */}
        <div className="dashboard-section">
          <h2>Recent Teams</h2>
          {recentTeams.length > 0 ? (
            <div className="team-list">
              {recentTeams.map(team => (
                <div key={team._id} className="dashboard-item">
                  <h4>{team.name}</h4>
                  <p>{team.description || 'No description'}</p>
                  <div className="item-meta">
                    <span className={`status ${team.status}`}>{team.status}</span>
                    <span className="members">{team.members?.length || 0} members</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No teams yet. Create your first team!</p>
          )}
        </div>

        {/* Pending Tasks */}
        <div className="dashboard-section full-width">
          <h2>Your Pending Tasks</h2>
          {pendingTasks.length > 0 ? (
            <div className="task-list">
              {pendingTasks.map(task => (
                <div key={task._id} className="dashboard-item">
                  <div className="task-info">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                  </div>
                  <div className="task-meta">
                    <span className="project">{task.projectId?.title}</span>
                    <span className={`priority ${task.priority}`}>{task.priority}</span>
                    <span className={`status ${task.status}`}>{task.status}</span>
                    {task.dueDate && (
                      <span className="due-date">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No pending tasks. Great job!</p>
          )}
        </div>

        {/* Unread Notifications */}
        <div className="dashboard-section full-width">
          <h2>Recent Notifications</h2>
          {unreadNotifications.length > 0 ? (
            <div className="notifications-list">
              {unreadNotifications.slice(0, 5).map(notif => (
                <div key={notif._id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                  <div className="notification-content">
                    <h4>{notif.title}</h4>
                    <p>{notif.description}</p>
                  </div>
                  <span className={`notification-type ${notif.type}`}>{notif.type.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No recent notifications</p>
          )}
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="dashboard-section full-width">
            <h2>Pending Join Requests</h2>
            <div className="requests-list">
              {pendingRequests.map(req => (
                <div key={req._id} className="dashboard-item">
                  <div className="request-user">
                    <h4>{req.userId?.name}</h4>
                    <p>{req.userId?.email}</p>
                  </div>
                  <div className="request-meta">
                    <span className="skills">{req.userId?.skills?.join(', ')}</span>
                    <span className="date">Requested {new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
