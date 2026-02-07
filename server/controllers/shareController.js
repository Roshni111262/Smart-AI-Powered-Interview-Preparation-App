const crypto = require('crypto');
const ShareLink = require('../models/ShareLink');
const InterviewSession = require('../models/InterviewSession');

exports.createShareLink = async (req, res) => {
  try {
    const { sessionId, questionIndex } = req.body;
    const session = await InterviewSession.findOne({
      _id: sessionId,
      user: req.user._id,
    });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    let token;
    do {
      token = crypto.randomBytes(8).toString('hex');
    } while (await ShareLink.findOne({ token }));
    const shareLink = await ShareLink.create({
      token,
      session: session._id,
      questionIndex: questionIndex ?? -1,
      createdBy: req.user._id,
    });
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.status(201).json({
      token,
      url: `${baseUrl}/shared/${token}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSharedContent = async (req, res) => {
  try {
    const { token } = req.params;
    const shareLink = await ShareLink.findOne({ token }).populate('session');
    if (!shareLink || !shareLink.session) {
      return res.status(404).json({ message: 'Link not found or expired' });
    }
    const session = shareLink.session;
    const qIndex = shareLink.questionIndex;
    if (qIndex >= 0 && qIndex < session.generatedQuestions.length) {
      return res.json({
        type: 'question',
        role: session.role,
        experience: session.experience,
        question: session.generatedQuestions[qIndex],
      });
    }
    res.json({
      type: 'session',
      role: session.role,
      experience: session.experience,
      questions: session.generatedQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
