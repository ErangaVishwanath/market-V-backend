const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.CONNECTION_STRING;
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: process.env.MONGODB_TIMEOUT
        ? parseInt(process.env.MONGODB_TIMEOUT)
        : 30000,
      socketTimeoutMS: process.env.MONGODB_TIMEOUT
        ? parseInt(process.env.MONGODB_TIMEOUT)
        : 30000,
      connectTimeoutMS: process.env.MONGODB_TIMEOUT
        ? parseInt(process.env.MONGODB_TIMEOUT)
        : 30000,
    };

    await mongoose.connect(mongoURI, options);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
