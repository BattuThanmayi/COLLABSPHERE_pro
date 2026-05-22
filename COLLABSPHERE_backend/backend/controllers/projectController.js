const Project = require('../models/Project');
const JoinRequest = require('../models/JoinRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.createProject = async (req, res) => {
  try {
    const { title, description, requiredSkills = [] } = req.body;
    if (!title || !description) return res.status(400).json({ message: 'Title and description required' });

    const project = new Project({ 
      title, 
      description, 
      requiredSkills, 
      createdBy: req.user._id,
      members: [req.user._id]
    });
    await project.save();
    
    // Update user's created projects
    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdProjects: project._id, joinedProjects: project._id }
    });

    await project.populate('createdBy', 'name email profileImage');
    await project.populate('members', 'name email profileImage');
    
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('createdBy', 'name email profileImage')
      .populate('members', 'name email profileImage')
      .populate('contributors', 'name email profileImage')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email profileImage bio skills')
      .populate('members', 'name email profileImage bio skills')
      .populate('contributors', 'name email profileImage');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Only creator can delete' });
    
    // Remove project from all users' joined/created lists
    await User.updateMany(
      { $or: [{ joinedProjects: req.params.id }, { createdProjects: req.params.id }] },
      { $pull: { joinedProjects: req.params.id, createdProjects: req.params.id } }
    );

    await Project.findByIdAndDelete(req.params.id);
    await JoinRequest.deleteMany({ projectId: req.params.id });
    
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Request to join project
exports.requestToJoin = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if already a member
    if (project.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a project member' });
    }

    const existing = await JoinRequest.findOne({ 
      projectId, 
      userId: req.user._id,
      status: 'pending'
    });
    
    if (existing) return res.status(400).json({ message: 'Request already exists' });

    const jr = new JoinRequest({ 
      projectId, 
      userId: req.user._id, 
      message: req.body.message || '',
      requestType: 'project'
    });
    await jr.save();
    
    // Notify project creator
    const notification = new Notification({
      userId: project.createdBy,
      type: 'join_request',
      title: `Join request from ${req.user.name}`,
      description: `${req.user.name} wants to join your project`,
      relatedId: jr._id,
      relatedModel: 'JoinRequest'
    });
    await notification.save();

    res.status(201).json(jr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Creator accepts request
exports.acceptRequest = async (req, res) => {
  try {
    const reqId = req.params.requestId;
    const jr = await JoinRequest.findById(reqId).populate('userId');
    if (!jr) return res.status(404).json({ message: 'Request not found' });
    
    const project = await Project.findById(jr.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Only creator can accept' });

    jr.status = 'accepted';
    jr.respondedBy = req.user._id;
    jr.respondedAt = Date.now();
    await jr.save();

    // Add member if not already
    if (!project.members.some(c => c.toString() === jr.userId._id.toString())) {
      project.members.push(jr.userId._id);
      await project.save();
    }

    // Update user's joined projects
    await User.findByIdAndUpdate(jr.userId._id, {
      $push: { joinedProjects: jr.projectId }
    });

    // Notify user
    const notification = new Notification({
      userId: jr.userId._id,
      type: 'request_accepted',
      title: `Your request to join ${project.title} was accepted`,
      description: 'Welcome to the project!',
      relatedId: project._id,
      relatedModel: 'Project'
    });
    await notification.save();

    res.json({ message: 'Request accepted', request: jr, project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const reqId = req.params.requestId;
    const jr = await JoinRequest.findById(reqId).populate('userId');
    if (!jr) return res.status(404).json({ message: 'Request not found' });
    
    const project = await Project.findById(jr.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Only creator can reject' });

    jr.status = 'rejected';
    jr.respondedBy = req.user._id;
    jr.respondedAt = Date.now();
    await jr.save();

    // Notify user
    const notification = new Notification({
      userId: jr.userId._id,
      type: 'request_rejected',
      title: `Your request to join ${project.title} was rejected`,
      description: 'Try improving your skills and apply again',
      relatedId: project._id,
      relatedModel: 'Project'
    });
    await notification.save();

    res.json({ message: 'Request rejected', request: jr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Filter projects based on matching user skills
exports.matchProjectsForUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user.skills || user.skills.length === 0) return res.json([]);

    // find projects where requiredSkills intersects user.skills
    const projects = await Project.find({
      requiredSkills: { $in: user.skills },
      status: 'open'
    })
      .populate('createdBy', 'name email profileImage')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProjectRequests = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only creator can view requests
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only project creator can view requests' });
    }

    const requests = await JoinRequest.find({ 
      projectId,
      requestType: 'project'
    })
      .populate('userId', 'name email profileImage skills')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
