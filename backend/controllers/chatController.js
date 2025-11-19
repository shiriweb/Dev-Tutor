const { Chat } = require("../models/Chat.js");
const { GoogleGenAI } = require("@google/genai");
const config = require("../config/config.js");

// Initialize Google Gemini AI client with API key
const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

const getChatHistory = (chat) => {
  const topicInstruction = `
You are an AI tutor. Only answer questions about the topic: ${chat.topic}.
If the user asks something outside this topic, politely reply:
"I'm sorry, I can only answer questions about ${chat.topic}."
`;

  const messagesText = chat.messages
    .map((msg) => `${msg.sender}: ${msg.content}`)
    .join("\n");

  return topicInstruction + "\n\n" + messagesText;
};

// Create a new chat session
const createChat = async (req, res) => {
  const { topic, content } = req.body;
  const userId = req.userId;

  if (!userId || !topic) {
    return res.status(400).json({ error: "userId and topic are required" });
  }

  try {
    let initialMessages = [];
    let title = "New Chat";

    if (content && content.trim() !== "") {
      // User typed something
      initialMessages = [{ sender: "user", content }];
      title = content.slice(0, 30);
    } else {
      // New chat without user input
      initialMessages = [
        { sender: "assistant", content: "Hello! I am Dev-Tutor. How can I help you?" },
      ];
    }

    const newChat = new Chat({
      userId,
      topic,
      title,
      messages: initialMessages,
    });

    await newChat.save();

    // If the first message is from user, generate AI response
    if (content && content.trim() !== "") {
      const chatHistory = getChatHistory(newChat);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: chatHistory,
      });

      const aiContent =
        response.text ||
        response.candidates?.[0]?.content ||
        "AI did not return a response";

      const cleanedResponse = aiContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      newChat.messages.push({ sender: "assistant", content: cleanedResponse });
      await newChat.save();

      return res.status(200).json({ chat: newChat, chatMessage: cleanedResponse });
    }

    // If no user input, just return the AI greeting
    return res.status(200).json({ chat: newChat, chatMessage: initialMessages[0].content });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ error: "Error while creating chat" });
  }
};

// Retrieve all chats for a user
const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.userId });
    return res.status(200).json({ chats });
  } catch (error) {
    return res.status(500).json({ error: "Error while fetching chats" });
  }
};

// Add a new message to an existing chat
const addMessageToChat = async (req, res) => {
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

    chat.messages.push({ sender: "user", content });
    await chat.save();

    const chatHistory = getChatHistory(chat);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: chatHistory,
    });

    const aiContent =
      response.text ||
      response.candidates?.[0]?.content ||
      "AI did not return a response";

    const cleanedResponse = aiContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    chat.messages.push({ sender: "assistant", content: cleanedResponse });
    await chat.save();

    return res.status(200).json({ chat, chatMessage: cleanedResponse });
  } catch (error) {
    return res.status(500).json({ error: "Error while adding message to chat" });
  }
};

const getSingleChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(400).json({ error: "Chats not found" });
    }
    return res.status(200).json(chat);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching chats" });
  }
};

module.exports = { createChat, getChats, addMessageToChat, getSingleChat };

