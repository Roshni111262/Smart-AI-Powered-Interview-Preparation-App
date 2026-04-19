const express = require('express');
const { getMyProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/me', protect, getMyProgress);

module.exports = router;

