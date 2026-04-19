const UserProgress = require('../models/UserProgress');

exports.getLeaderboard = async (req, res) => {
  try {
    const progressList = await UserProgress.find()
      .populate('user', 'name email')
      .sort({
        sessionsCompleted: -1,
        averageMockScore: -1,
        questionsPracticed: -1,
      })
      .limit(20)
      .lean();

    const leaderboard = progressList
      .filter((p) => p.user)
      .map((p, i) => ({
        rank: i + 1,
        name: p.user.name,
        score:
          p.sessionsCompleted * 10 +
          p.questionsPracticed * 2 +
          (p.pinnedCount || 0) +
          (p.discussionsContributed || 0) * 3 +
          Math.round(p.averageMockScore || 0),
        sessionsCompleted: p.sessionsCompleted,
        questionsPracticed: p.questionsPracticed,
        pinnedCount: p.pinnedCount || 0,
        discussionsContributed: p.discussionsContributed || 0,
        averageMockScore: p.averageMockScore || 0,
      }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
