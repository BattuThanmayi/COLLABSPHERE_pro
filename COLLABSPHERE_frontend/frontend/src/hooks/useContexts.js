import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const useTeams = () => {
  const { 
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
    loading,
    error
  } = useData();

  return {
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
    loading,
    error
  };
};

export const useTasks = () => {
  const {
    tasks,
    currentTask,
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    loading,
    error
  } = useData();

  return {
    tasks,
    currentTask,
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    loading,
    error
  };
};

export const useNotifications = () => {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    loading,
    error
  } = useData();

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    loading,
    error
  };
};

export const useDashboard = () => {
  const {
    dashboard,
    fetchDashboard,
    loading,
    error
  } = useData();

  return {
    dashboard,
    fetchDashboard,
    loading,
    error
  };
};
