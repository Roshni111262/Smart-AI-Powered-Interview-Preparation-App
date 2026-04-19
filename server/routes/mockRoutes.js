const express = require('express');
const {
  startMockInterview,
  submitMockResponse,
  completeMockInterview,
  getMockHistory,
} = require('../controllers/mockController');
const { protect, requirePremium } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/start', requirePremium, startMockInterview);
router.post('/response', submitMockResponse);
router.post('/complete', completeMockInterview);
router.get('/history', getMockHistory);

module.exports = router;

