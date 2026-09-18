import { User } from "../server/src/models/User.js";
import { Job } from "../server/src/models/Job.js";
import { Candidate } from "../server/src/models/Candidate.js";
import { hiringWorkflowEngine } from "../server/src/workflows/hiringWorkflow.js";
import { connectDB, disconnectDB } from "../server/src/config/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  await connectDB();

  // Create recruiter if not exists
  let recruiter = await User.findOne({ email: "recruiter@agenthire.com" });
  if (!recruiter) {
    recruiter = await User.create({
      name: "Alex Morgan",
      email: "recruiter@agenthire.com",
      password: "password123",
      role: "recruiter",
    });
    console.log("[Seed] Created default recruiter: recruiter@agenthire.com (password: password123)");
  }

  // Create sample jobs
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
    console.log("[Seed] Created sample job: Senior Frontend Developer");
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
    console.log("[Seed] Created sample job: Backend Systems Engineer");
  }

  // Auto-submit sample candidate to trigger LangGraph workflow
  const demoResumePath = path.resolve(__dirname, "../demo-data/resumes/john-react-resume.pdf");
  const existingCandidate = await Candidate.findOne({ email: "john.doe.dev@example.com" });
  if (!existingCandidate) {
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
    console.log("[Seed] Created and executed sample candidate workflow for John Doe (paused at human approval)");
  }

  console.log("[Seed] Database seeding completed successfully.");
}

seed().catch(console.error);
