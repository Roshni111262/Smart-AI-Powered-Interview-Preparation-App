const express = require('express');
const { createSession, getUserSessions, getSessionById, togglePinQuestion } = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createSession);
router.get('/', getUserSessions);
router.get('/:id', getSessionById);
router.patch('/pin', togglePinQuestion);

module.exports = router;
