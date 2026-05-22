const mongoose = require('mongoose');

const JoinRequestSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project' 
  },
  teamId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team' 
  },
  message: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  requestType: { 
    type: String, 
    enum: ['project', 'team'], 
    required: true 
  },
  respondedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  respondedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Ensure either projectId or teamId is present
JoinRequestSchema.pre('save', function(next) {
  if (!this.projectId && !this.teamId) {
    return next(new Error('Either projectId or teamId is required'));
  }
  next();
});

// Index for performance
JoinRequestSchema.index({ userId: 1, status: 1 });
JoinRequestSchema.index({ projectId: 1, status: 1 });
JoinRequestSchema.index({ teamId: 1, status: 1 });

module.exports = mongoose.model('JoinRequest', JoinRequestSchema);
