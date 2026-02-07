const mongoose = require('mongoose');

const questionAnswerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  isPinned: { type: Boolean, default: false },
});

const interviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
  },
  experience: {
    type: String,
    required: [true, 'Experience level is required'],
    trim: true,
  },
  generatedQuestions: [questionAnswerSchema],
  pinnedQuestions: [{ type: Number }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
