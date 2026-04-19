const UserProgress = require('../models/UserProgress');

const recalculateProgress = (progress) => {
  const scores = progress.mockScores || [];
  const avg = scores.length
    ? scores.reduce((sum, s) => sum + s, 0) / scores.length
    : 0;

  let improvement = 0;
  if (scores.length >= 2) {
    const first = scores[0];
    const last = scores[scores.length - 1];
    improvement = Number((last - first).toFixed(2));
  }

  progress.averageMockScore = Number(avg.toFixed(2));
  progress.improvementOverTime = improvement;
  progress.updatedAt = new Date();
  progress.lastActiveAt = new Date();
};

const ensureUserProgress = async (userId) => {
  let progress = await UserProgress.findOne({ user: userId });
  if (!progress) {
    progress = await UserProgress.create({ user: userId });
  }
  return progress;
};

module.exports = {
  ensureUserProgress,
  recalculateProgress,
};

