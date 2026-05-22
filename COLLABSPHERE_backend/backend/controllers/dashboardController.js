const User = require('../models/User');
const Project = require('../models/Project');
const Team = require('../models/Team');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const JoinRequest = require('../models/JoinRequest');

// Get dashboard data
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user with all relations
    const user = await User.findById(userId)
      .populate('joinedProjects', 'title description status')
      .populate('joinedTeams', 'name description status')
      .populate('createdProjects', 'title description status')
      .populate('createdTeams', 'name description status');

    // Get recent projects
    const recentProjects = await Project.find({ createdBy: userId })
      .populate('createdBy', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent teams
    const recentTeams = await Team.find({ createdBy: userId })
      .populate('createdBy', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get pending tasks
    const pendingTasks = await Task.find({
      assignedTo: userId,
      status: { $ne: 'completed' }
    })
      .populate('projectId', 'title')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 })
      .limit(10);

    // Get unread notifications
    const unreadNotifications = await Notification.find({
      userId,
      read: false
    })
      .populate('relatedId')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get pending join requests (for creator)
    const pendingRequests = await JoinRequest.find({
      $or: [
        { projectId: { $in: recentProjects.map(p => p._id) }, status: 'pending' },
        { teamId: { $in: recentTeams.map(t => t._id) }, status: 'pending' }
      ]
    })
      .populate('userId', 'name email profileImage skills')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const totalProjects = await Project.countDocuments({ createdBy: userId });
    const totalTeams = await Team.countDocuments({ createdBy: userId });
    const totalMembers = await User.countDocuments({ joinedProjects: { $in: user.createdProjects } });
    const unreadNotificationCount = await Notification.countDocuments({ userId, read: false });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        skills: user.skills
      },
      stats: {
        totalProjects,
        totalTeams,
        totalMembers,
        unreadNotifications: unreadNotificationCount,
        pendingRequests: pendingRequests.length
      },
      recentProjects,
      recentTeams,
      pendingTasks,
      unreadNotifications,
      pendingRequests
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};
