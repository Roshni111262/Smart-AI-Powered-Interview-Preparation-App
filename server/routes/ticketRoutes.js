const express = require('express');
const { protect } = require('../middleware/auth');
const { getMyTicketsLastSixMonths } = require('../controllers/ticketController');

const router = express.Router();
router.get('/me', protect, getMyTicketsLastSixMonths);

module.exports = router;
