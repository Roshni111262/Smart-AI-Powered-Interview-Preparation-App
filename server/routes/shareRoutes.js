const express = require('express');
const { createShareLink, getSharedContent } = require('../controllers/shareController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.post('/', protect, createShareLink);
router.get('/:token', getSharedContent);
module.exports = router;
