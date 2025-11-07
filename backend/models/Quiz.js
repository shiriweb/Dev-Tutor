const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
});

const attemptSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const quizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      enum: ["JavaScript", "React", "Python", "HTML/CSS"],
      required: true,
    },
    questions: [questionSchema],
    attempts: [attemptSchema],
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = { Quiz };
