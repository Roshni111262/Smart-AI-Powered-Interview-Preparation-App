const UserProgress = require('../models/UserProgress');
const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    const progressList = await UserProgress.find()
      .populate('user', 'name email')
      .sort({ sessionsCompleted: -1, questionsPracticed: -1 })
      .limit(20)
      .lean();

    const leaderboard = progressList
      .filter((p) => p.user)
      .map((p, i) => ({
        rank: i + 1,
        name: p.user.name,
        score: p.sessionsCompleted * 10 + p.questionsPracticed,
        sessionsCompleted: p.sessionsCompleted,
        questionsPracticed: p.questionsPracticed,
      }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
