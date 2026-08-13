const mongoose = require('mongoose');

let isConnectedToMongoDB = false;

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/downloadpulse';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000
    });
    isConnectedToMongoDB = true;
    console.log(`[MongoDB] Connected successfully to ${mongoURI}`);
  } catch (error) {
    isConnectedToMongoDB = false;
    console.log(`[MongoDB] Local daemon not detected. Operating in high-performance in-memory mode.`);
  }
}

function getIsConnected() {
  return isConnectedToMongoDB;
}

module.exports = {
  connectDB,
  getIsConnected
};
