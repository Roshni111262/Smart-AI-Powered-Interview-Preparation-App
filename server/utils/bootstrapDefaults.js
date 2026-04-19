const User = require('../models/User');

async function ensureDefaultUsers() {
  const defaults = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Password@123',
      role: 'admin',
      subscription: {
        plan: 'premium',
        status: 'active',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    },
    {
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'Password@123',
      role: 'user',
      subscription: {
        plan: 'premium',
        status: 'active',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    },
  ];

  for (const entry of defaults) {
    const existing = await User.findOne({ email: entry.email });
    if (!existing) {
      await User.create(entry);
    }
  }
}

module.exports = { ensureDefaultUsers };
