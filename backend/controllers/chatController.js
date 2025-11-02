const express = require("express");
const config = require("../config");
const { Chat } = require("../models/Chat");

const API_KEY = config.GEMINI_API_KEY;

const createChat = async (req, res) => {
  const { userId, topic, content } = req.body;

  if (!userId || !topic || !content || content.trim() === "") {
    return res
      .status(400)
      .json({ error: "Userid, topic or the content is missing" });
  }

  try {
    // Creating the new chat
    const newChat = new Chat({
      userId,
      topic,
      messages: [
        {
          sender: "user",
          content: content,
          timestamp: new Date(),
        },
      ],
    });

    await newChat.save();

    return res.status(201).json({
      message: "Chat created successfully",
      chat: newChat,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create chat" });
  }
};

module.exports = { createChat };
