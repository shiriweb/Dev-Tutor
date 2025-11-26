const { Chat } = require("../models/Chat.js");
const { GoogleGenAI } = require("@google/genai");
const config = require("../config/config.js");

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

// Prepare chat history for AI
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

// Create new chat
const createChat = async (req, res) => {
  const { topic, content } = req.body;
  const userId = req.userId;

  if (!userId || !topic)
    return res.status(400).json({ error: "userId and topic are required" });

  try {
    let initialMessages = [];
    let title = "New Chat";

    if (content && content.trim() !== "") {
      initialMessages = [{ sender: "user", content }];
      title = content.slice(0, 30);
    } else {
      initialMessages = [
        {
          sender: "assistant",
          content: "Hello! I am Dev-Tutor. How can I help you?",
        },
      ];
    }

    const newChat = new Chat({
      userId,
      topic,
      title,
      messages: initialMessages,
    });
    await newChat.save();

    let chatMessage = initialMessages[0].content;

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

      const cleanedResponse = aiContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      newChat.messages.push({ sender: "assistant", content: cleanedResponse });

      // Update title to first user message
      newChat.title = content.slice(0, 30);

      await newChat.save();
      chatMessage = cleanedResponse;
    }

    return res.status(200).json({ chat: newChat, chatMessage });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ error: "Error while creating chat" });
  }
};

// Get all chats (optionally filter by topic)
const getChats = async (req, res) => {
  try {
    const topic = req.query.topic;
    const query = { userId: req.userId };
    if (topic) query.topic = topic;

    const chats = await Chat.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ chats });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching chats" });
  }
};

// Add message to existing chat
const addMessageToChat = async (req, res) => {
  const chatId = req.params.id;
  const { content } = req.body;

  if (!content || content.trim() === "")
    return res.status(400).json({ error: "Content is required" });

  try {
    // Ensure chat belongs to user
    const chat = await Chat.findOne({ _id: chatId, userId: req.userId });
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // Add user message
    chat.messages.push({ sender: "user", content });

    // Prepare chat history for AI
    const chatHistory = getChatHistory(chat);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
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

    return res.status(200).json({ chat, chatMessage: cleanedResponse });
  } catch (error) {
    console.error("Error in addMessageToChat:", error);
    return res.status(500).json({ error: "Error adding message to chat" });
  }
};

// Get single chat
const getSingleChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    return res.status(200).json(chat);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching chat" });
  }
};

module.exports = { createChat, getChats, addMessageToChat, getSingleChat };
