const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { to, text } = req.body;
    if (!to || !text) return res.status(400).json({ message: 'to and text required' });

    const msg = new Message({ from: req.user._id, to, text });
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getChat = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { from: myId, to: otherUserId },
        { from: otherUserId, to: myId }
      ]
    }).sort('createdAt');
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
