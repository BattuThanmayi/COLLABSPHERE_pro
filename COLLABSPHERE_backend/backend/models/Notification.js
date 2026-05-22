const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['join_request', 'request_accepted', 'request_rejected', 'task_assignment', 'message', 'project_invite', 'team_invite'], 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  relatedId: { 
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel'
  },
  relatedModel: {
    type: String,
    enum: ['User', 'Project', 'Team', 'Task', 'JoinRequest'],
    required: true
  },
  read: { type: Boolean, default: false },
  readAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Index for performance
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, read: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);
