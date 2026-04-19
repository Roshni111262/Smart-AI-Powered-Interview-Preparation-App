const Payment = require('../models/Payment');
const Ticket = require('../models/Ticket');
const User = require('../models/User');

const randomTicket = () => `TKT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, gateway = 'stripe', currency = 'NPR', subscriptionPlan = 'premium' } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Valid amount is required' });

    const payment = await Payment.create({
      user: req.user._id,
      amount,
      gateway,
      currency,
      subscriptionPlan,
      status: 'pending',
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { paymentId, providerTransactionId, success = true, featuresAccessed = [] } = req.body;
    const payment = await Payment.findOne({ _id: paymentId, user: req.user._id });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.providerTransactionId = providerTransactionId || payment.providerTransactionId;
    payment.status = success ? 'paid' : 'failed';
    payment.paidAt = success ? new Date() : null;
    await payment.save();

    if (success && payment.subscriptionPlan === 'premium') {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      await User.findByIdAndUpdate(req.user._id, {
        subscription: {
          plan: 'premium',
          status: 'active',
          expiresAt,
        },
      });
    }

    await Ticket.create({
      user: req.user._id,
      payment: payment._id,
      ticketId: randomTicket(),
      paymentStatus: payment.status === 'paid' ? 'paid' : 'failed',
      featuresAccessed,
      accessDate: new Date(),
    });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
