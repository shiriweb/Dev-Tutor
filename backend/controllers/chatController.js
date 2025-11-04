// backend/controllers/chatController.js
const { Chat } = require("../models/Chat.js");
const { GoogleGenAI } = require("@google/genai"); // Correct import
const config = require("../config.js");

const ai = new GoogleGenAI({
  apiKey: config.GEMINI_API_KEY,
});

// Function to clean Markdown and format line breaks
const cleanText = (text) => {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold **
    .replace(/\*(.*?)\*/g, "$1")     // Remove italic *
    .replace(/\\n/g, "\n")           // Convert escaped newlines
    .trim();
};

// Controller to create or continue a chat
const createChat = async (req, res) => {
  const { userId, content, topic } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    // 1️⃣ Find existing chat for this user and topic or create a new one
    let chat = await Chat.findOne({ userId, topic });
    // if (!chat) {
    //   chat = await Chat.create({ userId, topic, messages: [] });
    // }

    // 2️⃣ Add the user's message
    chat.messages.push({ sender: "user", content });

    // 3️⃣ Prepare conversation input for Gemini AI
    // You can limit the number of previous messages if chat is very long
    const recentMessages = chat.messages.slice(-10); // last 10 messages
    const conversationInput = recentMessages
      .map(msg => (msg.sender === "user" ? `User: ${msg.content}` : `AI: ${msg.content}`))
      .join("\n");

    // 4️⃣ Send conversation to Gemini AI
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [conversationInput], // Must be an array
    });

    // 5️⃣ Extract AI response safely
    const aiContentRaw =
      response.text || (response.candidates && response.candidates[0]?.content) || "";
    const aiContent = cleanText(aiContentRaw);

    // 6️⃣ Save AI response in the chat
    chat.messages.push({ sender: "assistant", content: aiContent });
    await chat.save();

    // 7️⃣ Return full conversation back to client
    return res.status(200).json({ messages: chat.messages });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createChat };
