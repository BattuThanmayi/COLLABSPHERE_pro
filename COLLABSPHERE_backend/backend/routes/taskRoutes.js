const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController');

// Get all tasks (optionally filtered by projectId)
router.get('/', auth, taskController.getAllTasks);

// Create a new task (only project creator)
router.post('/create', auth, taskController.createTask);

// Get task by ID
router.get('/:id', auth, taskController.getTaskById);

// Update task (only project creator)
router.put('/:id', auth, taskController.updateTask);

// Delete task (only project creator)
router.delete('/:id', auth, taskController.deleteTask);

// Mark task as completed
router.put('/:id/complete', auth, taskController.completeTask);

module.exports = router;
