const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { sendMessage, getChat } = require('../controllers/messageController');

router.post('/send', auth, sendMessage);
router.get('/chat/:userId', auth, getChat);

module.exports = router;
