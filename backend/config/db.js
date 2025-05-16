const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Get MongoDB connection string from environment variable
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('MongoDB URI is not defined in environment variables');
      return false;
    }
    
    console.log('Attempting to connect to MongoDB...');
    console.log('Using connection string with format: mongodb+srv://username:***@cluster...');
    
    // Connect with specific options to avoid deprecation warnings
    const conn = await mongoose.connect(mongoURI, {
      // These options help with connection stability
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Print more detailed error info if available
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
    if (error.syscall) {
      console.error(`System call: ${error.syscall}`);
    }
    if (error.hostname) {
      console.error(`Hostname: ${error.hostname}`);
    }
    
    // Don't exit the process, return false instead
    return false;
  }
};

module.exports = connectDB;