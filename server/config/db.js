const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const isPlaceholderUri = (uri) => {
  if (!uri || !uri.trim()) return true;
  const u = uri.toLowerCase();
  return (
    u.includes('your_') ||
    u.includes('<username>') ||
    u.includes('<password>') ||
    u.includes('your_real_password') ||
    u.includes('your_real_cluster') ||
    u.includes('<actual') ||
    u.includes('paste_real') ||
    u.includes('pasted_here')
  );
};

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    const forceLocal = String(process.env.USE_LOCAL_MONGO || '').toLowerCase() === 'true';

    if (forceLocal || isPlaceholderUri(uri)) {
      console.log('Using local in-memory MongoDB (no Atlas login needed). Data resets when server stops.');
      mongod = await MongoMemoryServer.create({
        binary: { version: '7.0.3' }
      });
      uri = mongod.getUri();
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
