const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔥 Attempting MongoDB connection...');
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    console.log('URI scheme:', uri ? uri.substring(0, 20) + '...' : 'MISSING');
    
    if (!uri) {
      console.log('⚠️ No MONGO_URI - Starting in MOCK MODE');
      return { mock: true };
    }
    
    const conn = await mongoose.connect(uri, {
      family: 4, // Force IPv4 for mobile hotspot
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log('Database name:', conn.connection.name);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection FAILED:');
    console.error('- Message:', error.message);
    console.error('- Code:', error.code);
    console.log('🔄 Starting MOCK MODE for UI demo');
    return { mock: true };
  }
};

module.exports = connectDB;
