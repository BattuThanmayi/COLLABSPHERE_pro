import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useContexts';
import { useTasks } from '../hooks/useContexts';
import { api } from '../services/api';
import './Pages.css';

const TasksPage = () => {
  const { token } = useAuth();
  const { tasks, fetchTasks, createTask, updateTask, deleteTask, completeTask, loading, error } = useTasks();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium',
    dueDate: ''
  });
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchTasks('', token);

    // Fetch projects for the form
    const fetchProjects = async () => {
      const data = await api.getAllProjects();
      setProjects(data);
    };
    fetchProjects();
  }, [token, fetchTasks]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.projectId) return;

    await createTask(formData, token);
    setFormData({
      title: '',
      description: '',
      projectId: '',
      priority: 'medium',
      dueDate: ''
    });
    setShowCreateForm(false);
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus }, token);
  };

  const handleCompleteTask = async (taskId) => {
    await completeTask(taskId, token);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId, token);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus);

  return (
    <div className="tasks-page">
      <h1>Tasks</h1>

      <div className="page-header">
        <div className="filter-section">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Create Task'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && (
        <div className="form-section">
          <h2>Create New Task</h2>
          <form onSubmit={handleCreateTask} className="task-form">
            <div className="form-row">
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter task title"
                />
              </div>

              <div className="form-group">
                <label>Project *</label>
                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Task description"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success">
              Create Task
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : filteredTasks.length > 0 ? (
        <div className="tasks-list">
          {filteredTasks.map(task => (
            <div key={task._id} className={`task-card ${task.status}`}>
              <div className="task-content">
                <h3>{task.title}</h3>
                <p>{task.description}</p>

                <div className="task-details">
                  <span className="project">{task.projectId?.title}</span>
                  <span className={`priority ${task.priority}`}>{task.priority} priority</span>
                  {task.dueDate && (
                    <span className="due-date">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="task-actions">
                <select 
                  value={task.status}
                  onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                  className="status-select"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                {task.status !== 'completed' && (
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={() => handleCompleteTask(task._id)}
                  >
                    Complete
                  </button>
                )}

                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No tasks found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
