import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import workflowRoutes from "./routes/workflowRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import specRoutes from "./routes/specRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: [env.CLIENT_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// Body Parsers
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Static uploads serving
app.use("/uploads", express.static(env.UPLOADS_PATH));

// Root & Health Check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "AgentHire Multi-Agent Recruitment Backend API",
    version: "1.0.0",
    frontendUrl: env.CLIENT_URL || "http://localhost:3000",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      jobs: "/api/jobs",
      candidates: "/api/candidates",
      workflows: "/api/workflow",
      analytics: "/api/analytics",
      specs: "/api/specs",
    },
    message: "AgentHire Backend is operational. Open the frontend UI at http://localhost:3000",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AgentHire Backend",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/workflow", workflowRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/specs", specRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
