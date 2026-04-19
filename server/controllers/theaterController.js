const Theater = require('../models/Theater');
const Movie = require('../models/Movie');

exports.getTheaterCityHallMovieDetails = async (req, res) => {
  try {
    const theaters = await Theater.find().sort({ createdAt: -1 }).lean();
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTopOccupancyPerformers = async (req, res) => {
  try {
    const theaters = await Theater.find().lean();
    const ranked = theaters
      .map((theater) => {
        const totalCapacity = theater.showtimes.reduce((sum, s) => sum + (s.capacity || 0), 0);
        const totalPaidSeats = theater.showtimes.reduce((sum, s) => sum + (s.paidSeats || 0), 0);
        const occupancyPercent = totalCapacity > 0 ? (totalPaidSeats / totalCapacity) * 100 : 0;
        return {
          theaterId: theater._id,
          theaterName: theater.name,
          cityHall: theater.cityHall,
          occupancyPercent: Number(occupancyPercent.toFixed(2)),
        };
      })
      .sort((a, b) => b.occupancyPercent - a.occupancyPercent)
      .slice(0, 3);

    res.json(ranked);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTheater = async (req, res) => {
  try {
    const theater = await Theater.create(req.body);
    res.status(201).json(theater);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
