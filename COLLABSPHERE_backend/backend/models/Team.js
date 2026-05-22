const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  skills: { type: [String], default: [] },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'archived'], 
    default: 'active' 
  },
  profileImage: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for performance
TeamSchema.index({ createdBy: 1 });
TeamSchema.index({ members: 1 });
TeamSchema.index({ status: 1 });

module.exports = mongoose.model('Team', TeamSchema);
