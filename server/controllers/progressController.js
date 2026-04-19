const UserProgress = require('../models/UserProgress');

exports.getMyProgress = async (req, res) => {
  try {
    const progress = await UserProgress.findOne({ user: req.user._id }).lean();

    res.json({
      sessionsCompleted: progress?.sessionsCompleted || 0,
      questionsPracticed: progress?.questionsPracticed || 0,
      questionReviewCount: progress?.questionReviewCount || 0,
      pinnedCount: progress?.pinnedCount || 0,
      notesCount: progress?.notesCount || 0,
      discussionsContributed: progress?.discussionsContributed || 0,
      topicsCovered: progress?.topicsCovered || [],
      mockScores: progress?.mockScores || [],
      averageMockScore: progress?.averageMockScore || 0,
      improvementOverTime: progress?.improvementOverTime || 0,
      lastActiveAt: progress?.lastActiveAt || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to load progress' });
  }
};

