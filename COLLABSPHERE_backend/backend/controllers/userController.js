const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('joinedProjects', 'title description status')
      .populate('joinedTeams', 'name description status')
      .populate('createdProjects', 'title description status')
      .populate('createdTeams', 'name description status');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) delete updates.password; // password change should be separate
    
    // Prevent direct modification of joined/created lists
    delete updates.joinedProjects;
    delete updates.joinedTeams;
    delete updates.createdProjects;
    delete updates.createdTeams;
    
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true })
      .select('-password')
      .populate('joinedProjects', 'title description status')
      .populate('joinedTeams', 'name description status')
      .populate('createdProjects', 'title description status')
      .populate('createdTeams', 'name description status');
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password')
      .populate('joinedProjects', 'title description status')
      .populate('joinedTeams', 'name description status')
      .populate('createdProjects', 'title description status')
      .populate('createdTeams', 'name description status');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search users by name or skills
exports.searchUsers = async (req, res) => {
  try {
    const { q, skills } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }

    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim());
      filter.skills = { $in: skillArray };
    }

    const users = await User.find(filter)
      .select('-password')
      .limit(20);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.findByEmail = async (email) => {
  return User.findOne({ email });
};

