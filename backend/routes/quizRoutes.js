const express = require("express");
const {
  createQuiz,
  getQuizzes,
  submitAttemptQuiz,
  getQuizStats,
  getQuizById,
} = require("../controllers/quizController.js");
const userMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();
router.post("/generates", userMiddleware, createQuiz);
router.get("/quiz-stats", userMiddleware, getQuizStats);
router.get("/:id", userMiddleware, getQuizById);
router.post("/:id/attempt", userMiddleware, submitAttemptQuiz);
module.exports = router;
