import express from "express";
import config from "../config.js";
import { Chat } from "../models/Chat.js";

const API_KEY = config.GEMINI_API_KEY;
console.log(API_KEY);

export const createChat = async (req, res) => {
  const { userId, topic, content } = req.body;

  if (!userId || !topic || !content || content.trim() === "") {
    return res
      .status(400)
      .json({ error: "Userid ,topic or the contente is missing " });
  }

  try {
    const newChat = await new Chat({
      userId,
      topic,
      messages: [
        {
          sender: "user",
          content: content,
        },
      ],
    });
    await res.status(201).json(newChat);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create chat" });
  }
};
