const express = require('express');
const { explainQuestion } = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.post('/', explainQuestion);

module.exports = router;

