# Frontend Implementation Quick Reference

## 📋 File Checklist & Import Statements

### 1️⃣ Core Files to Update/Add

#### Update: `src/services/api.js` ✅
```javascript
// All 47 endpoints organized by feature
export const api = {
  // Auth, Users, Projects, Teams, Tasks, Notifications, Dashboard, Messages
};
```

#### Add: `src/context/DataContext.jsx` ✅
```javascript
import { DataProvider } from './context/DataContext';

// Wrap in App.jsx:
<DataProvider>
  <YourApp />
</DataProvider>
```

#### Add: `src/hooks/useContexts.js` ✅
```javascript
// Provides these hooks:
export const useAuth = () => { ... }
export const useData = () => { ... }
export const useTeams = () => { ... }
export const useTasks = () => { ... }
export const useNotifications = () => { ... }
export const useDashboard = () => { ... }
```

---

## 🎯 How to Use Each Hook

### `useAuth()` - Authentication
```javascript
import { useAuth } from '../hooks/useContexts';

function MyComponent() {
  const { user, token, loading, login, logout } = useAuth();
  
  return (
    <div>
      {user && <p>Welcome, {user.name}</p>}
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

### `useDashboard()` - Dashboard Overview
```javascript
import { useDashboard } from '../hooks/useContexts';
import { useAuth } from '../hooks/useContexts';

function Dashboard() {
  const { token } = useAuth();
  const { dashboard, fetchDashboard, loading } = useDashboard();

  useEffect(() => {
    if (token) fetchDashboard(token);
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (!dashboard) return <div>No dashboard data</div>;

  return (
    <div>
      <h1>Projects: {dashboard.stats.totalProjects}</h1>
      <h1>Teams: {dashboard.stats.totalTeams}</h1>
      <h1>Pending: {dashboard.stats.pendingRequests}</h1>
    </div>
  );
}
```

### `useTeams()` - Teams Management
```javascript
import { useTeams } from '../hooks/useContexts';
import { useAuth } from '../hooks/useContexts';

function TeamsManager() {
  const { token } = useAuth();
  const {
    teams,
    fetchTeams,
    createTeam,
    joinTeam,
    deleteTeam,
    fetchTeamRequests,
    acceptTeamRequest,
    rejectTeamRequest,
    loading,
    error
  } = useTeams();

  useEffect(() => {
    fetchTeams();
  }, []);

  // Create a team
  const handleCreate = async () => {
    await createTeam({
      name: 'Backend Developers',
      description: 'Node.js experts',
      skills: ['Node.js', 'MongoDB']
    }, token);
  };

  // Join a team
  const handleJoin = async (teamId) => {
    await joinTeam(teamId, 'I want to join', token);
  };

  // Manage requests
  const handleAccept = async (requestId) => {
    await acceptTeamRequest(requestId, token);
  };

  return (
    // Your JSX
  );
}
```

### `useTasks()` - Tasks Management
```javascript
import { useTasks } from '../hooks/useContexts';
import { useAuth } from '../hooks/useContexts';

function TaskManager() {
  const { token } = useAuth();
  const {
    tasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    loading,
    error
  } = useTasks();

  useEffect(() => {
    fetchTasks('', token); // Empty projectId = all tasks
  }, []);

  // Create task
  const handleCreate = async () => {
    await createTask({
      projectId: 'project-123',
      title: 'Fix bug in auth',
      description: 'Session timeout issue',
      priority: 'high',
      dueDate: '2026-04-20'
    }, token);
  };

  // Update task status
  const handleStatusChange = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus }, token);
  };

  // Complete task
  const handleComplete = async (taskId) => {
    await completeTask(taskId, token);
  };

  // Delete task
  const handleDelete = async (taskId) => {
    await deleteTask(taskId, token);
  };

  return (
    // Your JSX
  );
}
```

### `useNotifications()` - Notifications
```javascript
import { useNotifications } from '../hooks/useContexts';
import { useAuth } from '../hooks/useContexts';

function NotificationCenter() {
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
    // Fetch all notifications
    fetchNotifications(token);
    
    // Or fetch only unread:
    fetchNotifications(token, 'false');
  }, [token]);

  const handleMarkRead = async (notifId) => {
    await markNotificationAsRead(notifId, token);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead(token);
  };

  return (
    <div>
      <h2>Unread: {unreadCount}</h2>
      {notifications.map(n => (
        <div key={n._id}>
          <p>{n.title}</p>
          <p>{n.type}</p>
          {!n.read && (
            <button onClick={() => handleMarkRead(n._id)}>Mark Read</button>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## 🎨 Component Templates

### Page Template
```javascript
import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useContexts';
import { useTeams } from '../hooks/useContexts'; // Or other hooks
import './Pages.css';

const MyPage = () => {
  const { token } = useAuth();
  const { items, fetchItems, loading, error } = useTeams(); // Or other hook

  useEffect(() => {
    if (token) {
      fetchItems(token);
    }
  }, [token]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="my-page">
      <h1>My Page</h1>
      {/* Your content */}
    </div>
  );
};

export default MyPage;
```

### Form Component
```javascript
import React, { useState } from 'react';
import { useAuth } from '../hooks/useContexts';
import { useTeams } from '../hooks/useContexts';

const TeamForm = () => {
  const { token } = useAuth();
  const { createTeam, loading } = useTeams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    skills: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTeam({
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim())
    }, token);
    setFormData({ name: '', description: '', skills: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Team'}
      </button>
    </form>
  );
};

export default TeamForm;
```

---

## 📁 Directory Structure After Update

```
frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── MessagesPage.jsx
│   │   ├── DashboardPage.jsx          ✨ NEW
│   │   ├── TeamsPage.jsx              ✨ NEW
│   │   ├── TasksPage.jsx              ✨ NEW
│   │   ├── NotificationsPage.jsx      ✨ NEW
│   │   ├── NotFoundPage.jsx
│   │   ├── Pages.css
│   │   └── Pages-Updated.css          ✨ NEW (merge into Pages.css)
│   │
│   ├── context/
│   │   ├── AuthContext.jsx            (existing)
│   │   └── DataContext.jsx            ✨ NEW
│   │
│   ├── hooks/
│   │   ├── (existing hooks)
│   │   └── useContexts.js             ✨ NEW
│   │
│   ├── services/
│   │   └── api.js                     ✅ UPDATED
│   │
│   ├── components/
│   │   ├── Auth/
│   │   ├── Layout/
│   │   ├── Projects/
│   │   └── Messages/
│   │
│   ├── App.jsx                        ✅ UPDATED
│   └── index.js
│
└── package.json
```

---

## 🔌 API Endpoint Quick Reference

### Search Users
```javascript
const { api } = require('../services/api');

// Search by name or email
const results = await api.searchUsers('john', '', token);

// Search by skills
const results = await api.searchUsers('', 'React,Node.js', token);

// Search both
const results = await api.searchUsers('john', 'React', token);
```

### Team Operations
```javascript
// Get all teams
const teams = await api.getAllTeams();

// Get single team
const team = await api.getTeamById(teamId);

// Create team
const team = await api.createTeam({
  name: 'Expert Developers',
  description: 'We build amazing things',
  skills: ['React', 'Node.js']
}, token);

// Join team
const request = await api.joinTeam(teamId, 'I want to join', token);

// Manage requests
const requests = await api.getTeamRequests(teamId, token);
await api.acceptTeamRequest(requestId, token);
await api.rejectTeamRequest(requestId, token);
```

### Task Operations
```javascript
// Get all tasks or filtered by project
const tasks = await api.getAllTasks('', token);
const projectTasks = await api.getAllTasks(projectId, token);

// Create task
const task = await api.createTask({
  projectId: 'proj-123',
  title: 'Implement login',
  description: 'Create auth pages',
  priority: 'high',
  dueDate: '2026-04-25'
}, token);

// Update task status
await api.updateTask(taskId, { status: 'in-progress' }, token);

// Complete task
await api.completeTask(taskId, token);

// Delete
await api.deleteTask(taskId, token);
```

### Notification Operations
```javascript
// Get notifications
const data = await api.getNotifications('', token);  // All
const data = await api.getNotifications('false', token);  // Only unread

// {
//   notifications: [...],
//   unreadCount: 5,
//   total: 10
// }

// Mark as read
await api.markNotificationAsRead(notifId, token);

// Mark all as read
await api.markAllNotificationsAsRead(token);

// Delete
await api.deleteNotification(notifId, token);
```

### Dashboard
```javascript
const dashboard = await api.getDashboard(token);

// Contains:
// {
//   user: { _id, name, email, profileImage, bio, skills },
//   stats: {
//     totalProjects: 5,
//     totalTeams: 3,
//     totalMembers: 15,
//     unreadNotifications: 2,
//     pendingRequests: 1
//   },
//   recentProjects: [...],
//   recentTeams: [...],
//   pendingTasks: [...],
//   unreadNotifications: [...],
//   pendingRequests: [...]
// }
```

---

## 🎯 Common Tasks & Code

### Display Unread Notification Count in Navigation
```javascript
import { useNotifications } from '../hooks/useContexts';

function Navigation() {
  const { unreadCount, fetchNotifications } = useNotifications();
  const { token } = useAuth();

  useEffect(() => {
    fetchNotifications(token);
  }, [token]);

  return (
    <nav>
      <Link to="/notifications">
        Notifications {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </Link>
    </nav>
  );
}
```

### Show User's Joined Teams
```javascript
import { useAuth } from '../hooks/useContexts';

function UserProfile() {
  const { user } = useAuth();

  return (
    <div>
      <h3>Your Teams ({user?.joinedTeams?.length})</h3>
      {user?.joinedTeams?.map(team => (
        <p key={team._id}>{team.name}</p>
      ))}
    </div>
  );
}
```

### Filter Tasks by Status
```javascript
import { useTasks } from '../hooks/useContexts';

function TaskBoard() {
  const { tasks } = useTasks();

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="task-board">
      <div className="column">
        <h2>To Do ({todoTasks.length})</h2>
        {todoTasks.map(t => <TaskCard task={t} />)}
      </div>
      <div className="column">
        <h2>In Progress ({inProgressTasks.length})</h2>
        {inProgressTasks.map(t => <TaskCard task={t} />)}
      </div>
      <div className="column">
        <h2>Completed ({completedTasks.length})</h2>
        {completedTasks.map(t => <TaskCard task={t} />)}
      </div>
    </div>
  );
}
```

### Handle Errors Gracefully
```javascript
import { useTeams } from '../hooks/useContexts';

function TeamsWithErrorHandling() {
  const { teams, error, loading } = useTeams();

  if (loading) return <Spinner />;
  if (error) return <Alert type="error">{error}</Alert>;
  if (!teams.length) return <Alert type="info">No teams found</Alert>;

  return <TeamsList teams={teams} />;
}
```

---

## 💾 State Update Pattern

All hooks follow this pattern:
```javascript
const { data, fetchData, createData, updateData, deleteData, loading, error } = useHook();

// 1. Initial fetch
useEffect(() => {
  fetchData();
}, []);

// 2. Handle creation
const handleCreate = async (formData) => {
  if (loading) return; // Prevent double submit
  try {
    await createData(formData, token);
    // Success! Data is auto-updated in state
  } catch (err) {
    // Error is in `error` state
  }
};

// 3. Handle updates
const handleUpdate = async (id, updates) => {
  await updateData(id, updates, token);
  // State auto-updates
};

// 4. Handle deletion
const handleDelete = async (id) => {
  await deleteData(id, token);
  // Item removed from state
};
```

---

## ✨ That's All!

You now have:
- ✅ 47 API endpoints ready
- ✅ Complete state management with contexts
- ✅ 4 new feature pages
- ✅ Custom hooks for easy use
- ✅ Professional UI styling
- ✅ Error handling everywhere
- ✅ Loading states
- ✅ Responsive design

**Start building! 🚀**
