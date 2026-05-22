const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` }),
});

export const api = {
  // ============ AUTHENTICATION ============
  login: (email, password) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then((res) => res.json()),

  register: (name, email, password) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    }).then((res) => res.json()),

  verify: (token) =>
    fetch(`${API_BASE_URL}/auth/verify`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  // ============ USERS (4) ============
  getUserProfile: (token) =>
    fetch(`${API_BASE_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  updateUserProfile: (profileData, token) =>
    fetch(`${API_BASE_URL}/users/update`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(profileData),
    }).then((res) => res.json()),

  getUserById: (userId) =>
    fetch(`${API_BASE_URL}/users/${userId}`).then((res) => res.json()),

  searchUsers: (query, skills = '', token) => {
    let url = `${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}`;
    if (skills) url += `&skills=${encodeURIComponent(skills)}`;
    return fetch(url, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    }).then((res) => res.json());
  },

  // ============ PROJECTS (9) ============
  getAllProjects: () =>
    fetch(`${API_BASE_URL}/projects/all`).then((res) => res.json()),

  getProjectById: (projectId) =>
    fetch(`${API_BASE_URL}/projects/${projectId}`).then((res) => res.json()),

  createProject: (projectData, token) =>
    fetch(`${API_BASE_URL}/projects/create`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(projectData),
    }).then((res) => res.json()),

  deleteProject: (projectId, token) =>
    fetch(`${API_BASE_URL}/projects/delete/${projectId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  joinProject: (projectId, message = '', token) =>
    fetch(`${API_BASE_URL}/projects/join/${projectId}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ message }),
    }).then((res) => res.json()),

  getProjectRequests: (projectId, token) =>
    fetch(`${API_BASE_URL}/projects/${projectId}/requests`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  acceptProjectRequest: (requestId, token) =>
    fetch(`${API_BASE_URL}/projects/requests/${requestId}/accept`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  rejectProjectRequest: (requestId, token) =>
    fetch(`${API_BASE_URL}/projects/requests/${requestId}/reject`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  matchProjectsForUser: (token) =>
    fetch(`${API_BASE_URL}/projects/match/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  // ============ TEAMS (8) ============
  getAllTeams: () =>
    fetch(`${API_BASE_URL}/teams`).then((res) => res.json()),

  getTeamById: (teamId) =>
    fetch(`${API_BASE_URL}/teams/${teamId}`).then((res) => res.json()),

  createTeam: (teamData, token) =>
    fetch(`${API_BASE_URL}/teams/create`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(teamData),
    }).then((res) => res.json()),

  deleteTeam: (teamId, token) =>
    fetch(`${API_BASE_URL}/teams/${teamId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  joinTeam: (teamId, message = '', token) =>
    fetch(`${API_BASE_URL}/teams/join/${teamId}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ message }),
    }).then((res) => res.json()),

  getTeamRequests: (teamId, token) =>
    fetch(`${API_BASE_URL}/teams/${teamId}/requests`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  acceptTeamRequest: (requestId, token) =>
    fetch(`${API_BASE_URL}/teams/requests/${requestId}/accept`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  rejectTeamRequest: (requestId, token) =>
    fetch(`${API_BASE_URL}/teams/requests/${requestId}/reject`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  // ============ TASKS (6) ============
  getAllTasks: (projectId = '', token) => {
    let url = `${API_BASE_URL}/tasks`;
    if (projectId) url += `?projectId=${projectId}`;
    return fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json());
  },

  createTask: (taskData, token) =>
    fetch(`${API_BASE_URL}/tasks/create`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(taskData),
    }).then((res) => res.json()),

  getTaskById: (taskId, token) =>
    fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  updateTask: (taskId, taskData, token) =>
    fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(taskData),
    }).then((res) => res.json()),

  deleteTask: (taskId, token) =>
    fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  completeTask: (taskId, token) =>
    fetch(`${API_BASE_URL}/tasks/${taskId}/complete`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  // ============ NOTIFICATIONS (4) ============
  getNotifications: (read = '', token) => {
    let url = `${API_BASE_URL}/notifications`;
    if (read) url += `?read=${read}`;
    return fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json());
  },

  markNotificationAsRead: (notificationId, token) =>
    fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  markAllNotificationsAsRead: (token) =>
    fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  deleteNotification: (notificationId, token) =>
    fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  // ============ DASHBOARD (1) ============
  getDashboard: (token) =>
    fetch(`${API_BASE_URL}/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  // ============ MESSAGES (3) ============
  getConversations: (token) =>
    fetch(`${API_BASE_URL}/messages/conversations`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  getMessages: (userId, token) =>
    fetch(`${API_BASE_URL}/messages/chat/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then((res) => res.json()),

  sendMessage: (to, text, token) =>
    fetch(`${API_BASE_URL}/messages/send`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ to, text }),
    }).then((res) => res.json()),
};
