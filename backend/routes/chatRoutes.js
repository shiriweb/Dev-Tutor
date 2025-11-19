// routes/chatRoutes.js
const express = require("express");
const {
  createChat,
  getChats,
  addMessageToChat,
  getSingleChat,
} = require("../controllers/chatController");
const userMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", userMiddleware, createChat);
router.get("/", userMiddleware, getChats);
router.post("/:id/messages", userMiddleware, addMessageToChat);
router.get("/:id", userMiddleware, getSingleChat);
module.exports = router;
