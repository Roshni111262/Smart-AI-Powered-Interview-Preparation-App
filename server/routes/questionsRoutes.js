const express = require('express');
const { getQuestionByIndex, togglePinQuestion } = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/:sessionId/:questionIndex', getQuestionByIndex);
router.patch('/pin', togglePinQuestion);

module.exports = router;

