// routes/chatRoutes.js
const express = require("express");
const {
  createChat,
  getChats,
  addMessageToChat,
} = require("../controllers/chatController");
const userMiddleware = require("../middleware/chatmiddleware");

const router = express.Router();

router.post("/", userMiddleware, createChat);
router.get("/", userMiddleware, getChats);
router.post("/:id/messages", userMiddleware, addMessageToChat);

module.exports = router;
