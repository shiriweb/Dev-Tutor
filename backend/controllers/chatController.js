const { Chat } = require("../models/Chat.js");
const { GoogleGenAI } = require("@google/genai");
const config = require("../config/config.js");

// Initialize Google Gemini AI client with API key
const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

const getChatHistory = (chat) => {
  return chat.messages.map((msg) => `${msg.sender}: ${msg.content}`).join("\n");
};

// Create a new chat session
const createChat = async (req, res) => {
  const { topic, content } = req.body;
  const userId = req.userId;

  if (!userId || !topic || !content || content.trim() === "") {
    return res
      .status(400)
      .json({ error: "userId, topic, and content are required" });
  }

  try {
    // Creating a new chat document with the user's message
    const newChat = new Chat({
      userId,
      topic,
      title: content.slice(0, 30),
      messages: [{ sender: "user", content }],
    });

    await newChat.save();

    const chatHistory = getChatHistory(newChat);
    console.log("Chat history:", chatHistory);

    // Sending the user's message to the AI model and getting a response
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: chatHistory,
    });

    console.log("AI response:", response);

    // Extracting and cleaning the AI's response
    const aiContent =
      response.text ||
      response.candidates?.[0]?.content ||
      "AI did not return a response";

    const cleanedResponse = aiContent
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Adding the AI's response to the chat messages
    newChat.messages.push({ sender: "assistant", content: cleanedResponse });
    await newChat.save();

    return res.status(200).json({ chat: newChat });
  } catch (error) {
    console.error("Error creating chat:", error);
    console.log("ERror");

    return res.status(500).json({ error: "Error while creating chat" });
  }
};

// Retrieve all chats for a user
const getChats = async (req, res) => {
  try {
    // Fetching all chat documents for the user
    const chats = await Chat.find({ userId: req.userId });
    return res.status(200).json({ chats });
  } catch (error) {
    return res.status(500).json({
      error: "Error while fetching chats",
    });
  }
};

// Adding the new message to an existing chat
const addMessageToChat = async (req, res) => {
  //   const chatId = req.params.id;
  const chatId = req.params.id;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Content is required" });
  }
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Adding User message
    chat.messages.push({ sender: "user", content });
    await chat.save();

    const chatHistory = getChatHistory(chat);

    // AI response
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: chatHistory,
    });

    const aiContent =
      response.text ||
      response.candidates?.[0]?.content ||
      "AI did not return a response";

    const cleanedResponse = aiContent
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    chat.messages.push({ sender: "assistant", content: cleanedResponse });
    await chat.save();

    return res.status(200).json({ chat });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error while adding message to chat" });
  }
};
module.exports = { createChat, getChats, addMessageToChat };
