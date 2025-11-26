const { GoogleGenAI } = require("@google/genai");
const { Chat } = require("../models/Chat.js");
const config = require("../config/config.js");
const { Quiz } = require("../models/Quiz.js");

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

const createQuiz = async (req, res) => {
  const { chatId } = req.body;
  const userId = req.userId; //from middleware
  if (!chatId) {
    return res.status(400).json({
      error: "Chat history ID is required to create a quiz",
    });
  }

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        error: "Chat not found",
      });
    }

    const chatHistory = chat.messages
      .map((msg) => `${msg.sender}: ${msg.content}`)
      .join("\n");

    const prompt = `Generate 5 multiple-choice questions from this chat about ${chat.topic}.
        Each question should have 4 options and indicate the correct answer.
        Return the result as JSON like this:
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
    });
    res.status(201).json(newQuiz);
    console.log(newQuiz);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create quiz",
    });
  }
};

const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      userId: req.userId,
    });
    console.log("Found quizzes:", quizzes);

    return res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({
      error: "Error fetching the quizzes",
    });
  }
};

const submitAttemptQuiz = async (req, res) => {
  const { answers } = req.body;
  const quizId = req.params.id;
  const userId = req.userId;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        error: "Quiz not found",
      });
    }

    if (quiz.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not allowed to submit this quiz" });
    }

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        score++;
      }
    });

    quiz.attempts.push({
      score,
      date: new Date(),
    });
    await quiz.save();
    res.status(200).json({
      score,
      quiz,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit attempt" });
  }
};

module.exports = {
  createQuiz,
  getQuizzes,
  submitAttemptQuiz,
};
