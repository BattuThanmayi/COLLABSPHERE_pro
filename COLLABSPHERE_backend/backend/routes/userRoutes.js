const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getProfile, updateProfile, getUserById, searchUsers } = require('../controllers/userController');

router.get('/profile', auth, getProfile);
router.put('/update', auth, updateProfile);
router.get('/search', searchUsers);
router.get('/:userId', getUserById);

module.exports = router;
