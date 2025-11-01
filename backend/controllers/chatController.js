import config from "../config.js";
import { Chat } from "../models/Chat.js";

const API_KEY = config.GEMINI_API_KEY;
console.log(API_KEY);

export const createChat = async (req, res) => {
  const { userId, topic, content } = req.body;
  if (!userId || !topic || !content || content.trim() === "") {
    return res
      .status(400)
      .json({ error: "userId, topic, and content are required" });
  }

  try {
    // Create a new chat with the first user message
    const newChat = await Chat.create({
      userId,
      topic,
      messages: [
        {
          sender: "user",
          content: content,
        },
      ],
    });

    res.status(201).json(newChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create chat" });
  }
};
