const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ticketId: { type: String, required: true, unique: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    featuresAccessed: [{ type: String, trim: true }],
    accessDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
