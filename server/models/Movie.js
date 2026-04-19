const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    durationMinutes: { type: Number, default: 120 },
    genre: [{ type: String, trim: true }],
    theaterRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Theater' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
