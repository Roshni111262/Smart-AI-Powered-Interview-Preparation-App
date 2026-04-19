const express = require('express');
const { protect } = require('../middleware/auth');
const { createPaymentIntent, confirmPayment, getMyPayments } = require('../controllers/paymentController');

const router = express.Router();

router.use(protect);
router.post('/intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/me', getMyPayments);

module.exports = router;
