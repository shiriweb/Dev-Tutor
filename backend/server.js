import express from "express";
import mongoose from "mongoose";
import config from "./config.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// MONGODB CONNECTION
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
