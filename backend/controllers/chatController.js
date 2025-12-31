const { Chat } = require("../models/Chat.js");
const { GoogleGenAI } = require("@google/genai");
const config = require("../config/config.js");

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

const removeComments = (text) => {
  return text.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
};

const getChatHistory = (chat) => {
  const topicInstruction = `
    You are Dev-Tutor, a beginner-friendly AI tutor.
    RULES:
    - ONLY answer questions related to: "${chat.topic}"
    - If the question is outside this topic, reply exactly:
    "I'm sorry, I can only answer questions about ${chat.topic}."

    RESPONSE FORMAT (STRICT):
    Use ONLY Markdown. Do NOT use HTML or CSS.

    Use the following headings exactly and in order:

    **Explanation**
    (8 short sentences)

    **Example**
    (Provide the exact code snippet or example)

    **Output**
    provide the exact output of the example above

    **Real World Analogy**
    (1 simple sentence)

    **Summary**
    - Point 1
    - Point 2
    `;

  const messagesText = chat.messages
    // .filter((msg) => msg.topic === chat.topic)
    .map((msg) => `${msg.sender}: ${msg.content}`)
    .join("\n");

  return topicInstruction + "\n\nConversation:\n" + messagesText;
};

const createChat = async (req, res) => {
  const { topic, content } = req.body;
  const userId = req.userId;
  if (!userId || !topic)
    return res.status(400).json({ error: "userId and topic are required" });

  try {
    const initialMessages =
      content && content.trim() !== "" ? [{ sender: "user", content }] : [];
    const newChat = new Chat({
      userId,
      topic,
      title:
        content && content.trim() !== "" ? content.slice(0, 30) : "New Chat",
      messages: initialMessages,
    });

    await newChat.save();

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

      const cleanedResponse = removeComments(aiContent.trim());
      newChat.messages.push({ sender: "assistant", content: cleanedResponse });
      await newChat.save();
    }

    return res.status(200).json({ chat: newChat });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ error: "Error while creating chat" });
  }
};

const addMessageToChat = async (req, res) => {
  const chatId = req.params.id;
  const { content } = req.body;

  if (!content || content.trim() === "")
    return res.status(400).json({ error: "Content is required" });

  try {
    const chat = await Chat.findOne({ _id: chatId, userId: req.userId });
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    chat.messages.push({ sender: "user", content });
    chat.title = content.slice(0, 30);

    const chatHistory = getChatHistory(chat);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: chatHistory,
    });
    const aiContent =
      response.text ||
      response.candidates?.[0]?.content ||
      "AI did not return a response";
    const cleanedResponse = removeComments(aiContent.trim());
    chat.messages.push({ sender: "assistant", content: cleanedResponse });
    await chat.save();
    return res.status(200).json({ chat });
  } catch (error) {
    console.error("Error in addMessageToChat:", error);
    return res.status(500).json({ error: "Error adding message to chat" });
  }
};

const getSingleChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    return res.status(200).json(chat);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching chat" });
  }
};

const getChats = async (req, res) => {
  const filter = { userId: req.userId };
  if (req.query.topic) filter.topic = req.query.topic;
  const chats = await Chat.find(filter).sort({ createdAt: -1 });
  res.json({ chats });
};

module.exports = { createChat, getChats, addMessageToChat, getSingleChat };
