import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root or project root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const env = {
  PORT: parseInt(process.env.PORT || "5001", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/agenthire",
  JWT_SECRET: process.env.JWT_SECRET || "agenthire_super_secret_jwt_key_2026_dev",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // AI & Services
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
  QDRANT_URL: process.env.QDRANT_URL || "",
  QDRANT_API_KEY: process.env.QDRANT_API_KEY || "",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",

  // Absolute Root Paths
  ROOT_SPECS_PATH: path.resolve(__dirname, "../../../specs"),
  UPLOADS_PATH: path.resolve(__dirname, "../../uploads"),
  LOGS_PATH: path.resolve(__dirname, "../../logs"),
};
