import express from "express";
import { sendChat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/send", sendChat);
export default router;
