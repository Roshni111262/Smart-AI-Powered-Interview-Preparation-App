const mongoose = require('mongoose');

const shareLinkSchema = new mongoose.Schema({
  token: { type: String, unique: true, required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession', required: true },
  questionIndex: { type: Number, default: -1 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ShareLink', shareLinkSchema);
