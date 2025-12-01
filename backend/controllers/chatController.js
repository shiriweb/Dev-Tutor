const { Chat } = require("../models/Chat.js");
const { GoogleGenAI } = require("@google/genai");
const config = require("../config/config.js");

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

// Remove only JSON comments — keep code blocks intact
const removeComments = (text) => {
  return text
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
};

// Build chat history with instructions
const getChatHistory = (chat) => {
  const topicInstruction = `
You are Dev-Tutor, an AI tutor. ONLY answer questions about: "${chat.topic}".
If the user asks about something outside this topic, reply:
"I'm sorry, I can only answer questions about ${chat.topic}."

Always respond in plain text/Markdown with these sections:
1) Explanation
2) Example (use triple-backtick code blocks for code, no comments)
3) Output (what happens when the code runs)
4) Summary
5) Real-World Analogy

Keep explanations simple, beginner friendly, and clear.
`;

  const messagesText = chat.messages
    .map((msg) => `${msg.sender}: ${msg.content}`)
    .join("\n");

  return topicInstruction + "\n\nConversation:\n" + messagesText;
};

// Parse AI response into sections
const parseSections = (text) => {
  const sections = {
    Explanation: "",
    Example: "",
    Output: "",
    Summary: "",
    Analogy: "",
  };

  const lines = text.split("\n");
  let currentSection = "";

  lines.forEach((line) => {
    const lower = line.toLowerCase();
    if (lower.startsWith("1) explanation")) currentSection = "Explanation";
    else if (lower.startsWith("2) example")) currentSection = "Example";
    else if (lower.startsWith("3) output")) currentSection = "Output";
    else if (lower.startsWith("4) summary")) currentSection = "Summary";
    else if (lower.startsWith("5) real-world analogy")) currentSection = "Analogy";
    else if (currentSection) sections[currentSection] += line + "\n";
  });

  Object.keys(sections).forEach((k) => {
    sections[k] = sections[k].trim();
  });

  return sections;
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
        { sender: "assistant", content: "Hello! I am Dev-Tutor. How can I help you?" },
      ];
    }

    const newChat = new Chat({ userId, topic, title, messages: initialMessages });
    await newChat.save();

    let chatMessage = initialMessages[0].content;
    let parsedSections = null;

    if (content && content.trim() !== "") {
      const chatHistory = getChatHistory(newChat);

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: chatHistory,
      });

      const aiContent =
        response.text ||
        response.candidates?.[0]?.content ||
        "AI did not return a response";

      const cleanedResponse = removeComments(aiContent.trim());

      newChat.messages.push({ sender: "assistant", content: cleanedResponse });
      newChat.title = content.slice(0, 30);
      await newChat.save();
      chatMessage = cleanedResponse;

      parsedSections = parseSections(cleanedResponse);
    }

    return res.status(200).json({
      chat: newChat,
      chatMessage,
      sections: parsedSections,
      topic: newChat.topic,
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ error: "Error while creating chat" });
  }
};

// Add message to existing chat
const addMessageToChat = async (req, res) => {
  const chatId = req.params.id;
  const { content } = req.body;

  if (!content || content.trim() === "")
    return res.status(400).json({ error: "Content is required" });

  try {
    const chat = await Chat.findOne({ _id: chatId, userId: req.userId });
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    chat.messages.push({ sender: "user", content });
    const chatHistory = getChatHistory(chat);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: chatHistory,
    });

    const aiContent =
      response.text ||
      response.candidates?.[0]?.content ||
      "AI did not return a response";

    const cleanedResponse = removeComments(aiContent.trim());
    chat.messages.push({ sender: "assistant", content: cleanedResponse });
    await chat.save();

    const parsedSections = parseSections(cleanedResponse);

    return res.status(200).json({
      chat,
      chatMessage: cleanedResponse,
      sections: parsedSections,
      topic: chat.topic,
    });
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

// Get all chats
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

module.exports = { createChat, getChats, addMessageToChat, getSingleChat };
