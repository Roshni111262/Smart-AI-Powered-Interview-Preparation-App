const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema(
  {
    movieTitle: { type: String, required: true, trim: true },
    startsAt: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1 },
    paidSeats: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const theaterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    cityHall: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    showtimes: [showtimeSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Theater', theaterSchema);
