const express = require('express');
const {
  createShareLink,
  getSharedContent,
  getSharedContentByQuestionId,
} = require('../controllers/shareController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.post('/', protect, createShareLink);
router.get('/id/:sessionId/:questionIndex', getSharedContentByQuestionId);
router.get('/:token', getSharedContent);
module.exports = router;
