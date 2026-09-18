import fs from "fs";
import path from "path";
import { env } from "../config/env.js";

// Ensure logs directory exists
if (!fs.existsSync(env.LOGS_PATH)) {
  fs.mkdirSync(env.LOGS_PATH, { recursive: true });
}

export function logWorkflowEvent(workflowId, agentName, status, data = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    workflowId,
    agentName,
    status,
    ...data,
  };

  const line = JSON.stringify(logEntry) + "\n";
  const logFile = path.join(env.LOGS_PATH, `workflow-${workflowId || "general"}.log`);

  try {
    fs.appendFileSync(logFile, line);
  } catch (err) {
    console.error("[Logger] Failed to write log file:", err.message);
  }

  console.log(`[Workflow Log] [${timestamp}] [${agentName}] ${status.toUpperCase()}:`, data.message || "");
}

export function logWorkflowFailure(workflowId, agentName, state, error) {
  const stack = error?.stack || String(error);
  logWorkflowEvent(workflowId, agentName, "failed", {
    state,
    error: error?.message || String(error),
    stack,
  });
}
