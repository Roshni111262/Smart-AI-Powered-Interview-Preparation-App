const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardOverview,
  getUsers,
  blockUser,
  deleteUser,
  getPayments,
  getDiscussions,
} = require('../controllers/adminController');

const router = express.Router();
router.use(protect, authorize('admin'));

router.get('/overview', getDashboardOverview);
router.get('/users', getUsers);
router.patch('/users/:userId/block', blockUser);
router.delete('/users/:userId', deleteUser);
router.get('/payments', getPayments);
router.get('/discussions', getDiscussions);

module.exports = router;
