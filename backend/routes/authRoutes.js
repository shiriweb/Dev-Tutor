// routes/authRoutes.js
const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const { validateRegister } = require("../middleware/validateAuth");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
