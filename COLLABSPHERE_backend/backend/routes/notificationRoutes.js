const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

// Get user notifications (optionally filtered by read status)
router.get('/', auth, notificationController.getNotifications);

// Mark notification as read
router.put('/:id/read', auth, notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', auth, notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', auth, notificationController.deleteNotification);

module.exports = router;
