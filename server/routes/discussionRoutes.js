const express = require('express');
const { createDiscussion, getDiscussions, addReply } = require('../controllers/discussionController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);
router.post('/', createDiscussion);
router.get('/', getDiscussions);
router.post('/:id/reply', addReply);
module.exports = router;
