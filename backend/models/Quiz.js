const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  chatId: { type: String, required: true },
  title: { type: String, required: true },
  topic: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: [String],
      correctAnswer: { type: String, required: true },
    },
  ],
  attempts: [
    {
      score: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Quiz", quizSchema);
