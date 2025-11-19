const { User } = require("../models/User.js");

const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("username");
    if (!user) {
      return res.status(400).json({ error: "User not Found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
    });
  }
};
module.exports = { currentUser };
