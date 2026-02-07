const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('your_') || uri.includes('<username>')) {
      console.log('No MongoDB URI found. Using in-memory database for demo...');
      mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host || 'in-memory'}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
