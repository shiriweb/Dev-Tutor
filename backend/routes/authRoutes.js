import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { validateRegister } from "../middleware/validateAuth.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
