// routes/authRoutes.js
const express = require("express");
const { register, login } = require("../controllers/authController");
const { validateRegister } = require("../middleware/validateAuth");
const userMiddleware = require("../middleware/authMiddleware");
const { currentUser } = require("../controllers/userController");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", login);
router.get("/currentUser", userMiddleware, currentUser);
module.exports = router;
