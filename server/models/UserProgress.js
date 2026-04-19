const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  sessionsCompleted: { type: Number, default: 0 },
  questionsPracticed: { type: Number, default: 0 },
  questionReviewCount: { type: Number, default: 0 },
  pinnedCount: { type: Number, default: 0 },
  notesCount: { type: Number, default: 0 },
  discussionsContributed: { type: Number, default: 0 },
  topicsCovered: [{ type: String, trim: true }],
  mockScores: [{ type: Number }],
  averageMockScore: { type: Number, default: 0 },
  improvementOverTime: { type: Number, default: 0 },
  lastActiveAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserProgress', userProgressSchema);
