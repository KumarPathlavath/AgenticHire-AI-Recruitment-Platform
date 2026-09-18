import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { User } from "./models/User.js";
import { Job } from "./models/Job.js";
import { Candidate } from "./models/Candidate.js";
import { hiringWorkflowEngine } from "./workflows/hiringWorkflow.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function autoSeedIfEmpty() {
  try {
    let recruiter = await User.findOne({ email: "recruiter@agenthire.com" });
    if (!recruiter) {
      recruiter = await User.create({
        name: "Alex Morgan",
        email: "recruiter@agenthire.com",
        password: "password123",
        role: "recruiter",
      });
      console.log("[AutoSeed] Created default officer: recruiter@agenthire.com (password: password123)");
    }

    let frontendJob = await Job.findOne({ title: "Senior Frontend Developer" });
    if (!frontendJob) {
      frontendJob = await Job.create({
        title: "Senior Frontend Developer",
        description: "We are seeking an experienced Frontend Developer to engineer modern React & Next.js user interfaces with stateful AI agent workflows and high-performance UI components.",
        required_skills: ["React", "JavaScript", "CSS"],
        preferred_skills: ["Next.js", "Tailwind CSS", "TypeScript"],
        min_experience: 2,
        workflow_spec_id: "default-hiring-workflow",
        hiring_spec_id: "frontend-developer",
        creator: recruiter._id,
        status: "open",
      });
      console.log("[AutoSeed] Created sample requisition: Senior Frontend Developer");
    }

    let backendJob = await Job.findOne({ title: "Backend Systems Engineer" });
    if (!backendJob) {
      backendJob = await Job.create({
        title: "Backend Systems Engineer",
        description: "Join our core engineering team to build scalable microservices, vector search pipelines with Qdrant, and LangGraph workflow orchestration services.",
        required_skills: ["Node.js", "Express", "MongoDB"],
        preferred_skills: ["Docker", "Redis", "LangChain", "Qdrant"],
        min_experience: 3,
        workflow_spec_id: "default-hiring-workflow",
        hiring_spec_id: "backend-developer",
        creator: recruiter._id,
        status: "open",
      });
      console.log("[AutoSeed] Created sample requisition: Backend Systems Engineer");
    }

    const demoResumePath = path.resolve(__dirname, "../../demo-data/resumes/john-react-resume.pdf");
    const existingCandidate = await Candidate.findOne({ email: "john.doe.dev@example.com" });
    if (!existingCandidate && frontendJob) {
      const candidate = await Candidate.create({
        name: "John Doe",
        email: "john.doe.dev@example.com",
        phone: "(555) 234-5678",
        resume_url: demoResumePath,
        job_id: frontendJob._id,
        status: "processing",
      });

      const workflow = await hiringWorkflowEngine.createWorkflow(candidate._id, frontendJob._id);
      await hiringWorkflowEngine.runWorkflow(workflow._id, demoResumePath);
      console.log("[AutoSeed] Created and executed sample candidate workflow for John Doe");
    }
  } catch (seedErr) {
    console.warn("[AutoSeed] Non-fatal auto-seed notice:", seedErr.message);
  }
}

async function startServer() {
  try {
    await connectDB();
    await autoSeedIfEmpty();

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
