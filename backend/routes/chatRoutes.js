import express from "express";
import { createChat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", createChat);
// router.get("/", getChat);
// router.post("/:id/message", addMessageToChat);
export default router;
