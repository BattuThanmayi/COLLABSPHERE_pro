const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// Get all tasks (optionally filtered by project)
exports.getAllTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = projectId ? { projectId } : {};

    const tasks = await Task.find(filter)
      .populate('projectId', 'title')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email profileImage')
      .sort({ dueDate: 1, createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// Create task
exports.createTask = async (req, res) => {
  try {
    const { projectId, title, description = '', assignedTo = [], priority = 'medium', dueDate } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ message: 'Project ID and title are required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only project creator can create tasks
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project creator can create tasks' });
    }

    const task = new Task({
      projectId,
      title,
      description,
      assignedTo,
      priority,
      dueDate,
      createdBy: req.user._id,
      status: 'todo'
    });

    await task.save();
    await task.populate('projectId', 'title');
    await task.populate('createdBy', 'name email');
    await task.populate('assignedTo', 'name email profileImage');

    // Notify assigned users
    for (const userId of assignedTo) {
      const notification = new Notification({
        userId,
        type: 'task_assignment',
        title: `You have been assigned to "${title}"`,
        description: `Task in project: ${project.title}`,
        relatedId: task._id,
        relatedModel: 'Task'
      });
      await notification.save();
    }

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate('projectId', 'title description')
      .populate('createdBy', 'name email profileImage')
      .populate('assignedTo', 'name email profileImage skills');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch task' });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, priority, dueDate, status } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project creator can update tasks' });
    }

    // Update fields if provided
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo) task.assignedTo = assignedTo;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (status) task.status = status;
    
    task.updatedAt = Date.now();
    await task.save();

    await task.populate('projectId', 'title');
    await task.populate('createdBy', 'name email');
    await task.populate('assignedTo', 'name email profileImage');

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project creator can delete tasks' });
    }

    await Task.findByIdAndDelete(id);

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};

// Complete task
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = 'completed';
    task.updatedAt = Date.now();
    await task.save();

    await task.populate('projectId', 'title');
    await task.populate('createdBy', 'name email');
    await task.populate('assignedTo', 'name email profileImage');

    res.json({ message: 'Task completed', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to complete task' });
  }
};
