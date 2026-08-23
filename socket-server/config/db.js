const mongoose = require("mongoose");
const { logInfo, logError } = require("../utils/logger");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in socket-server .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    logInfo("Socket server connected to MongoDB");
  } catch (error) {
    logError("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;