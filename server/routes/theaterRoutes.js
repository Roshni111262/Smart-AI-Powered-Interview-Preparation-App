const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getTheaterCityHallMovieDetails,
  getTopOccupancyPerformers,
  createMovie,
  createTheater,
} = require('../controllers/theaterController');

const router = express.Router();

router.get('/city-hall-movies', protect, getTheaterCityHallMovieDetails);
router.get('/occupancy/top', protect, getTopOccupancyPerformers);
router.post('/movies', protect, authorize('admin'), createMovie);
router.post('/theaters', protect, authorize('admin'), createTheater);

module.exports = router;
