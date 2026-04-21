const mongoose = require('mongoose');
const dns = require('dns');
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

const createLocalMongoUri = async () => {
  console.log('Using local in-memory MongoDB (no Atlas login needed). Data resets when server stops.');
  mongod = await MongoMemoryServer.create({
    binary: { version: '7.0.3' },
  });
  return mongod.getUri();
};

const connectDB = async () => {
  let uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  const forceLocal = String(process.env.USE_LOCAL_MONGO || '').toLowerCase() === 'true';

  if (uri && uri.startsWith('mongodb+srv://')) {
    dns.setServers(['1.1.1.1', '8.8.8.8']);
  }

  if (forceLocal || isPlaceholderUri(uri)) {
    uri = await createLocalMongoUri();
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);

    if (!forceLocal && process.env.NODE_ENV !== 'production') {
      console.warn('Falling back to local in-memory MongoDB for development due to Atlas connection failure.');
      uri = await createLocalMongoUri();
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 15000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    }

    process.exit(1);
  }
};

module.exports = connectDB;
