const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email)
        return res.status(409).json({ error: "Email already in use" });
      if (existingUser.username === username)
        return res.status(409).json({ error: "Username already taken" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: passwordHash });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server error, please try again later" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ error: "User doesn't exist" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, config.JWT_SECRET_PASSWORD, {
      expiresIn: "2d",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res
      .status(200)
      .json({ message: "User logged in successfully", user, token });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server error, please try again later" });
  }
};

const logout = (_, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server error, please try again later" });
  }
};

module.exports = { register, login, logout };
