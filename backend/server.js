const express = require("express");
const config = require("./config/config");
const connectDB = require("./db/mongodb");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const quizRoutes = require("./routes/quizRoutes");
const cors = require("cors");
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
connectDB();

// MONGODB CONNECTION

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/quizzes", quizRoutes);
// Start server
app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
