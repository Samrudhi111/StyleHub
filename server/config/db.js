import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Ensure environment variables are loaded even if connectDB is called standalone
dotenv.config();

// ==============================================================================
// MongoDB Connection via Mongoose
// Connects Node.js application to the 'stylehub' database (Atlas Cloud / Local)
// ==============================================================================

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stylehub';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000 // 8-second connection timeout for cloud Atlas latency
    });

    console.log(`\x1b[32m%s\x1b[0m`, `✓ MongoDB Connected Successfully!`);
    console.log(`  Host:     ${conn.connection.host}`);
    console.log(`  Database: ${conn.connection.name}`);
    console.log(`  Cloud:    ${mongoUri.includes('mongodb.net') ? 'MongoDB Atlas (Cloud Production)' : 'Local MongoDB'}`);
  } catch (error) {
    console.error(`\x1b[33m%s\x1b[0m`, `! MongoDB Connection Error: ${error.message}`);
    console.error(`  Target URI: ${process.env.MONGODB_URI || process.env.MONGO_URI ? '[HIDDEN CLOUD URI]' : 'mongodb://127.0.0.1:27017/stylehub'}`);
    console.error(`  Ensure MongoDB Atlas Network Access whitelist contains 0.0.0.0/0 (Allow from Anywhere).`);
  }
};

export default connectDB;
