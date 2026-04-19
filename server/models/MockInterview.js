const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema(
  {
    questionIndex: { type: Number, required: true },
    question: { type: String, required: true },
    expectedAnswer: { type: String, required: true },
    userResponse: { type: String, required: true },
    score: { type: Number, default: 0 },
    feedback: { type: String, default: '' },
  },
  { _id: false }
);

const mockInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewSession',
      required: true,
    },
    role: { type: String, required: true },
    experience: { type: String, required: true },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
    },
    responses: [responseSchema],
    finalScore: { type: Number, default: 0 },
    summary: { type: String, default: '' },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MockInterview', mockInterviewSchema);

