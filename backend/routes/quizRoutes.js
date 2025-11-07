const express = require("express");
const { createQuiz, getQuizzes, submitAttemptQuiz } = require("../controllers/quizController.js");
const userMiddleware = require("../middleware/chatmiddleware.js");

const router = express.Router();
router.post("/generates", userMiddleware, createQuiz);
router.get("/", userMiddleware, getQuizzes);
router.post("/:id/attempt",userMiddleware, submitAttemptQuiz)
module.exports = router;
