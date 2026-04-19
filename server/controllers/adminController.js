const User = require('../models/User');
const Payment = require('../models/Payment');
const Discussion = require('../models/Discussion');
const InterviewSession = require('../models/InterviewSession');
const UserProgress = require('../models/UserProgress');
const Ticket = require('../models/Ticket');
const Theater = require('../models/Theater');
const Movie = require('../models/Movie');

exports.getDashboardOverview = async (req, res) => {
  try {
    const [users, premiumUsers, sessions, paymentsPaid, discussions, tickets, theaters, movies] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ 'subscription.plan': 'premium', 'subscription.status': 'active' }),
      InterviewSession.countDocuments(),
      Payment.countDocuments({ status: 'paid' }),
      Discussion.countDocuments(),
      Ticket.countDocuments({ paymentStatus: 'paid' }),
      Theater.countDocuments(),
      Movie.countDocuments(),
    ]);

    const revenueRows = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]);

    const leaderboard = await UserProgress.find()
      .sort({ averageMockScore: -1, discussionsContributed: -1 })
      .limit(5)
      .populate('user', 'name email')
      .lean();

    res.json({
      stats: {
        users,
        premiumUsers,
        sessions,
        paidTransactions: paymentsPaid,
        discussions,
        paidTickets: tickets,
        theaters,
        movies,
        totalRevenue: revenueRows[0]?.totalRevenue || 0,
      },
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isBlocked: req.body.isBlocked === true },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('user', 'name email').sort({ createdAt: -1 }).lean();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find().sort({ createdAt: -1 }).lean();
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('user', 'name email').sort({ createdAt: -1 }).lean();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
