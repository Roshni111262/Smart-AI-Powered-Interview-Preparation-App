const Discussion = require('../models/Discussion');

exports.createDiscussion = async (req, res) => {
  try {
    const { title, content, sessionRef, questionRef } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const discussion = await Discussion.create({
      user: req.user._id,
      userName: req.user.name,
      title,
      content,
      sessionRef: sessionRef || undefined,
      questionRef: questionRef || undefined,
    });
    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addReply = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });
    discussion.replies.push({
      user: req.user._id,
      userName: req.user.name,
      content: content.trim(),
    });
    await discussion.save();
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
