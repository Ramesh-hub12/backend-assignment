const mongoose = require('mongoose');
require('dotenv').config(); // Loads variables from .env

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Stop app if DB fails
  }
};

module.exports = connectDB;