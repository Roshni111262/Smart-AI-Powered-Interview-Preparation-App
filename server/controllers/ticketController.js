const Ticket = require('../models/Ticket');

exports.getMyTicketsLastSixMonths = async (req, res) => {
  try {
    const since = new Date();
    since.setMonth(since.getMonth() - 6);
    const tickets = await Ticket.find({
      user: req.user._id,
      createdAt: { $gte: since },
    })
      .sort({ createdAt: -1 })
      .lean();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
