const Team = require('../models/Team');
const JoinRequest = require('../models/JoinRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('createdBy', 'name email profileImage')
      .populate('members', 'name email profileImage')
      .sort({ createdAt: -1 });
    
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch teams' });
  }
};

// Create team
exports.createTeam = async (req, res) => {
  try {
    const { name, description = '', skills = [] } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    const team = new Team({
      name,
      description,
      skills,
      createdBy: req.user._id,
      members: [req.user._id]
    });

    await team.save();
    await team.populate('createdBy', 'name email profileImage');
    await team.populate('members', 'name email profileImage');

    // Update user's created teams
    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdTeams: team._id, joinedTeams: team._id }
    });

    res.status(201).json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create team' });
  }
};

// Get team by ID
exports.getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id)
      .populate('createdBy', 'name email profileImage skills bio')
      .populate('members', 'name email profileImage skills bio');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch team' });
  }
};

// Delete team (only creator)
exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only team creator can delete' });
    }

    // Remove team from all users' joined/created teams
    await User.updateMany(
      { $or: [{ joinedTeams: id }, { createdTeams: id }] },
      { $pull: { joinedTeams: id, createdTeams: id } }
    );

    await Team.findByIdAndDelete(id);
    await JoinRequest.deleteMany({ teamId: id });

    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete team' });
  }
};

// Join team
exports.joinTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { message = '' } = req.body;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if already a member
    if (team.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a team member' });
    }

    // Check if request already exists
    const existingRequest = await JoinRequest.findOne({
      userId: req.user._id,
      teamId: id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Join request already sent' });
    }

    // Create join request
    const joinRequest = new JoinRequest({
      userId: req.user._id,
      teamId: id,
      message,
      requestType: 'team',
      status: 'pending'
    });

    await joinRequest.save();
    await joinRequest.populate('userId', 'name email');

    // Notify team creator
    const notification = new Notification({
      userId: team.createdBy,
      type: 'join_request',
      title: `Join request from ${req.user.name}`,
      description: `${req.user.name} wants to join your team`,
      relatedId: joinRequest._id,
      relatedModel: 'JoinRequest'
    });

    await notification.save();

    res.status(201).json({ message: 'Join request sent', joinRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to join team' });
  }
};

// Get team join requests
exports.getTeamJoinRequests = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Only creator can view requests
    if (team.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only team creator can view requests' });
    }

    const requests = await JoinRequest.find({ teamId: id, requestType: 'team' })
      .populate('userId', 'name email profileImage skills')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

// Accept team join request
exports.acceptTeamRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const joinRequest = await JoinRequest.findById(id).populate('userId');
    if (!joinRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const team = await Team.findById(joinRequest.teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Only creator can accept
    if (team.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only team creator can accept requests' });
    }

    // Add user to team members
    await Team.findByIdAndUpdate(joinRequest.teamId, {
      $push: { members: joinRequest.userId._id }
    });

    // Update user's joined teams
    await User.findByIdAndUpdate(joinRequest.userId._id, {
      $push: { joinedTeams: joinRequest.teamId }
    });

    // Update request status
    joinRequest.status = 'accepted';
    joinRequest.respondedBy = req.user._id;
    joinRequest.respondedAt = Date.now();
    await joinRequest.save();

    // Notify user
    const notification = new Notification({
      userId: joinRequest.userId._id,
      type: 'request_accepted',
      title: `Your request to join ${team.name} was accepted`,
      description: 'Welcome to the team!',
      relatedId: team._id,
      relatedModel: 'Team'
    });

    await notification.save();

    res.json({ message: 'Request accepted', joinRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to accept request' });
  }
};

// Reject team join request
exports.rejectTeamRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const joinRequest = await JoinRequest.findById(id).populate('userId');
    if (!joinRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const team = await Team.findById(joinRequest.teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Only creator can reject
    if (team.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only team creator can reject requests' });
    }

    // Update request status
    joinRequest.status = 'rejected';
    joinRequest.respondedBy = req.user._id;
    joinRequest.respondedAt = Date.now();
    await joinRequest.save();

    // Notify user
    const notification = new Notification({
      userId: joinRequest.userId._id,
      type: 'request_rejected',
      title: `Your request to join ${team.name} was rejected`,
      description: 'Try another team or improve your skills',
      relatedId: team._id,
      relatedModel: 'Team'
    });

    await notification.save();

    res.json({ message: 'Request rejected', joinRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reject request' });
  }
};
