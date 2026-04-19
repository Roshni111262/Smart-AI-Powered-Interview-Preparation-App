const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gateway: {
      type: String,
      enum: ['stripe', 'khalti', 'esewa', 'manual'],
      default: 'stripe',
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'NPR' },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'premium',
    },
    providerTransactionId: { type: String, trim: true },
    metadata: { type: Object, default: {} },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
