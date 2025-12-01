const { GoogleGenAI } = require("@google/genai");
const { Chat } = require("../models/Chat.js");
const Quiz = require("../models/Quiz.js");
const config = require("../config/config.js");

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

// Create a quiz
const createQuiz = async (req, res) => {
  const { chatId } = req.body;
  const userId = req.userId;

  if (!chatId)
    return res.status(400).json({ error: "Chat history ID is required" });

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    const chatHistory = chat.messages
      .map((msg) => `${msg.sender}: ${msg.content}`)
      .join("\n");

    const prompt = `Generate 5 multiple-choice questions from this chat about ${chat.topic}.
Each question should have 4 options and indicate the correct answer.
Return as JSON like:
[
  { "question": "Q?", "options": ["A","B","C","D"], "correctAnswer": "A" }
] Chat:${chatHistory}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    const aiContent =
      response.text ||
      response.candidates?.[0]?.content ||
      "AI did not return a response";
    const cleanedResponse = aiContent
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const quizData = JSON.parse(cleanedResponse);

    const newQuiz = await Quiz.create({
      userId,
      chatId,
      title: `Quiz on ${chat.topic}`,
      topic: chat.topic,
      questions: quizData,
      attempts: [],
    });

    res.status(201).json(newQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create quiz" });
  }
};

const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.userId });
    res.status(200).json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching quizzes" });
  }
};

// Submit a quiz attempt
const submitAttemptQuiz = async (req, res) => {
  const { answers } = req.body;
  const quizId = req.params.id;
  const userId = req.userId;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    if (quiz.userId.toString() !== userId.toString())
      return res.status(403).json({ error: "Not allowed" });

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });

    quiz.attempts.push({ score });
    await quiz.save();

    res.status(200).json({ score, quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit attempt" });
  }
};

const getQuizStats = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.userId });

    const stats = quizzes.map((quiz) => {
      const attempts = quiz.attempts.length;
      const totalScore = quiz.attempts.reduce((sum, a) => sum + a.score, 0);
      const maxScore = quiz.questions.length; // always 5

      // ⭐ Average in percentage
      const averageScore =
        attempts > 0 ? Math.round((totalScore / attempts / maxScore) * 100) : 0;

      // ⭐ Latest score as RAW number (0–5)
      const latestScore = attempts > 0 ? quiz.attempts[attempts - 1].score : 0;

      return {
        id: quiz._id,
        title: quiz.title,
        topic: quiz.topic,
        attempts,
        averageScore, // percentage
        latestScore, // raw number
      };
    });

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quiz stats" });
  }
};

const getQuizById = async (req, res) => {
  const quizId = req.params.id;
  const userId = req.userId;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    if (quiz.userId.toString() !== userId.toString())
      return res.status(403).json({ error: "Not allowed" });

    res.status(200).json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};

module.exports = {
  createQuiz,
  submitAttemptQuiz,
  getQuizStats,
  getQuizzes,
  getQuizById,
};
