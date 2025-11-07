const config = require("../config/config");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};

module.exports = connectDB;
