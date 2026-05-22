import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useContexts';
import { useNotifications } from '../hooks/useContexts';
import './Pages.css';

const NotificationsPage = () => {
  const { token } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    deleteNotification,
    loading, 
    error 
  } = useNotifications();

  useEffect(() => {
    if (token) {
      fetchNotifications(token);
    }
  }, [token, fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    await markNotificationAsRead(notificationId, token);
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead(token);
  };

  const handleDelete = async (notificationId) => {
    await deleteNotification(notificationId, token);
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'join_request': return '📋';
      case 'request_accepted': return '✅';
      case 'request_rejected': return '❌';
      case 'task_assignment': return '📝';
      case 'message': return '💬';
      case 'project_invite': return '🚀';
      case 'team_invite': return '👥';
      default: return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'join_request': return '#3498db';
      case 'request_accepted': return '#27ae60';
      case 'request_rejected': return '#e74c3c';
      case 'task_assignment': return '#f39c12';
      case 'message': return '#9b59b6';
      case 'project_invite': return '#1abc9c';
      case 'team_invite': return '#34495e';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="notifications-page">
      <h1>Notifications</h1>

      <div className="notifications-header">
        <div className="unread-badge">
          {unreadCount > 0 && (
            <span className="badge">{unreadCount} Unread</span>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button 
            className="btn btn-primary"
            onClick={handleMarkAllAsRead}
          >
            Mark All as Read
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading notifications...</div>
      ) : notifications.length > 0 ? (
        <div className="notifications-list">
          {notifications.map(notif => (
            <div 
              key={notif._id} 
              className={`notification-card ${notif.read ? 'read' : 'unread'}`}
              style={{ borderLeftColor: getNotificationColor(notif.type) }}
            >
              <div className="notification-icon">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="notification-content">
                <h3>{notif.title}</h3>
                <p>{notif.description}</p>
                
                <div className="notification-footer">
                  <span className="notification-type">
                    {notif.type.replace(/_/g, ' ')}
                  </span>
                  <span className="notification-time">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="notification-actions">
                {!notif.read && (
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleMarkAsRead(notif._id)}
                  >
                    Mark Read
                  </button>
                )}
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(notif._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>You're all caught up! No notifications.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
