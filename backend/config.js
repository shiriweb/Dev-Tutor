import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET_PASSWORD = process.env.JWT_SECRET_PASSWORD;
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default {
  JWT_SECRET_PASSWORD,
  MONGODB_URI,
  PORT,
  NODE_ENV,
  GEMINI_API_KEY,
};
