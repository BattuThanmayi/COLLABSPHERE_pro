import React, { createContext, useState, useCallback } from 'react';
import { api } from '../services/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Dashboard
  const [dashboard, setDashboard] = useState(null);

  // Teams
  const [teams, setTeams] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [teamRequests, setTeamRequests] = useState([]);

  // Tasks
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ========== DASHBOARD ==========
  const fetchDashboard = useCallback(async (token) => {
    setLoading(true);
    try {
      const data = await api.getDashboard(token);
      setDashboard(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== TEAMS ==========
  const fetchTeams = useCallback(async (token = null) => {
    setLoading(true);
    try {
      const data = await api.getAllTeams();
      setTeams(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeamById = useCallback(async (teamId) => {
    setLoading(true);
    try {
      const data = await api.getTeamById(teamId);
      setCurrentTeam(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching team:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTeam = useCallback(async (teamData, token) => {
    setLoading(true);
    try {
      const data = await api.createTeam(teamData, token);
      setTeams([...teams, data]);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating team:', err);
    } finally {
      setLoading(false);
    }
  }, [teams]);

  const deleteTeam = useCallback(async (teamId, token) => {
    setLoading(true);
    try {
      await api.deleteTeam(teamId, token);
      setTeams(teams.filter(t => t._id !== teamId));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting team:', err);
    } finally {
      setLoading(false);
    }
  }, [teams]);

  const joinTeam = useCallback(async (teamId, message, token) => {
    setLoading(true);
    try {
      const data = await api.joinTeam(teamId, message, token);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error joining team:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeamRequests = useCallback(async (teamId, token) => {
    setLoading(true);
    try {
      const data = await api.getTeamRequests(teamId, token);
      setTeamRequests(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching team requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptTeamRequest = useCallback(async (requestId, token) => {
    setLoading(true);
    try {
      const data = await api.acceptTeamRequest(requestId, token);
      setTeamRequests(teamRequests.filter(r => r._id !== requestId));
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error accepting request:', err);
    } finally {
      setLoading(false);
    }
  }, [teamRequests]);

  const rejectTeamRequest = useCallback(async (requestId, token) => {
    setLoading(true);
    try {
      const data = await api.rejectTeamRequest(requestId, token);
      setTeamRequests(teamRequests.filter(r => r._id !== requestId));
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error rejecting request:', err);
    } finally {
      setLoading(false);
    }
  }, [teamRequests]);

  // ========== TASKS ==========
  const fetchTasks = useCallback(async (projectId = '', token) => {
    setLoading(true);
    try {
      const data = await api.getAllTasks(projectId, token);
      setTasks(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTaskById = useCallback(async (taskId, token) => {
    setLoading(true);
    try {
      const data = await api.getTaskById(taskId, token);
      setCurrentTask(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching task:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData, token) => {
    setLoading(true);
    try {
      const data = await api.createTask(taskData, token);
      setTasks([...tasks, data]);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  }, [tasks]);

  const updateTask = useCallback(async (taskId, taskData, token) => {
    setLoading(true);
    try {
      const data = await api.updateTask(taskId, taskData, token);
      setTasks(tasks.map(t => t._id === taskId ? data : t));
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  }, [tasks]);

  const deleteTask = useCallback(async (taskId, token) => {
    setLoading(true);
    try {
      await api.deleteTask(taskId, token);
      setTasks(tasks.filter(t => t._id !== taskId));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting task:', err);
    } finally {
      setLoading(false);
    }
  }, [tasks]);

  const completeTask = useCallback(async (taskId, token) => {
    setLoading(true);
    try {
      const data = await api.completeTask(taskId, token);
      setTasks(tasks.map(t => t._id === taskId ? data.task : t));
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error completing task:', err);
    } finally {
      setLoading(false);
    }
  }, [tasks]);

  // ========== NOTIFICATIONS ==========
  const fetchNotifications = useCallback(async (token, read = '') => {
    setLoading(true);
    try {
      const data = await api.getNotifications(read, token);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markNotificationAsRead = useCallback(async (notificationId, token) => {
    try {
      const data = await api.markNotificationAsRead(notificationId, token);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? data : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error marking notification as read:', err);
    }
  }, [notifications, unreadCount]);

  const markAllNotificationsAsRead = useCallback(async (token) => {
    try {
      await api.markAllNotificationsAsRead(token);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error marking all as read:', err);
    }
  }, [notifications]);

  const deleteNotification = useCallback(async (notificationId, token) => {
    try {
      await api.deleteNotification(notificationId, token);
      setNotifications(notifications.filter(n => n._id !== notificationId));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting notification:', err);
    }
  }, [notifications]);

  const value = {
    // Dashboard
    dashboard,
    fetchDashboard,

    // Teams
    teams,
    currentTeam,
    teamRequests,
    fetchTeams,
    fetchTeamById,
    createTeam,
    deleteTeam,
    joinTeam,
    fetchTeamRequests,
    acceptTeamRequest,
    rejectTeamRequest,

    // Tasks
    tasks,
    currentTask,
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    completeTask,

    // Notifications
    notifications,
    unreadCount,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,

    // General
    loading,
    error,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
