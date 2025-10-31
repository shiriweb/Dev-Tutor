import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

// MONGODB CONNECTION
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
