const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const discussionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  sessionRef: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession' },
  questionRef: { type: String },
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Discussion', discussionSchema);
