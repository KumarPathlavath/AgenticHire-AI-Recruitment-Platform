import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

async function startServer() {
  try {
    await connectDB();
    const server = app.listen(env.PORT, () => {
      console.log(`[Server] AgentHire API running on http://localhost:${env.PORT}`);
      console.log(`[Server] Environment: ${env.NODE_ENV}`);
      console.log(`[Server] Specs path: ${env.ROOT_SPECS_PATH}`);
    });

    const shutdown = async () => {
      console.log("[Server] Gracefully shutting down...");
      server.close(() => {
        console.log("[Server] HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("[Server] Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
