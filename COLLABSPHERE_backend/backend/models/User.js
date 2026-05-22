const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: { type: [String], default: [] },
  githubLink: { type: String, default: '' },
  joinedProjects: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project' 
  }],
  joinedTeams: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team' 
  }],
  createdProjects: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project' 
  }],
  createdTeams: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team' 
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for performance
UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
