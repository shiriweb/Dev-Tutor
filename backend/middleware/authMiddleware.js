const config = require("../config/config.js");
const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer")) {
    return res.status(401).json({
      errors: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET_PASSWORD);
    req.userId = decoded.id;
    console.log("Token received:", token);
    console.log("JWT secret:", config.JWT_SECRET_PASSWORD);

    next();
  } catch (error) {
    res.status(401).json({
      errors: "Invalid token or expired",
    });
  }
}
module.exports = userMiddleware;
