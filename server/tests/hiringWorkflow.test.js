import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../src/models/User.js";
import { Job } from "../src/models/Job.js";
import { Candidate } from "../src/models/Candidate.js";
import { Workflow } from "../src/models/Workflow.js";
import { hiringWorkflowEngine } from "../src/workflows/hiringWorkflow.js";

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("Hiring Workflow Orchestration Engine", () => {
  let user, job, candidate;

  beforeEach(async () => {
    await User.deleteMany({});
    await Job.deleteMany({});
    await Candidate.deleteMany({});
    await Workflow.deleteMany({});

    user = await User.create({
      name: "Recruiter Bob",
      email: "bob@agenthire.com",
      password: "password123",
    });

    job = await Job.create({
      title: "Frontend Developer",
      description: "Looking for an awesome frontend developer",
      required_skills: ["React", "JavaScript", "CSS"],
      preferred_skills: ["Next.js", "Tailwind CSS"],
      min_experience: 2,
      creator: user._id,
    });

    candidate = await Candidate.create({
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "555-1234",
      resume_url: "demo-resume.pdf",
      job_id: job._id,
      status: "applied",
    });
  });

  it("should initialize workflow and pause at human_approval checkpoint", async () => {
    const workflow = await hiringWorkflowEngine.createWorkflow(candidate._id, job._id);
    expect(workflow.status).toBe("pending");

    // Provide resume text
    const sampleResumeText = `John Doe
Email: john.doe@example.com
Phone: 555-1234
Skills: React, JavaScript, CSS, Next.js, Tailwind CSS
Experience: 4 years of frontend development`;

    workflow.state_data = { resumeText: sampleResumeText };
    await workflow.save();

    const result = await hiringWorkflowEngine.runWorkflow(workflow._id);

    expect(result.paused).toBe(true);
    expect(result.status).toBe("waiting_approval");
    expect(result.currentState).toBe("human_approval");

    const updatedWorkflow = await Workflow.findById(workflow._id);
    expect(updatedWorkflow.status).toBe("waiting_approval");
    expect(updatedWorkflow.current_state).toBe("human_approval");

    const updatedCandidate = await Candidate.findById(candidate._id);
    expect(updatedCandidate.match_score).toBe(100);
    expect(updatedCandidate.status).toBe("shortlisted");
  });

  it("should resume from human_approval when recruiter approves candidate", async () => {
    const workflow = await hiringWorkflowEngine.createWorkflow(candidate._id, job._id);
    const sampleResumeText = `John Doe
Email: john.doe@example.com
Skills: React, JavaScript, CSS, Next.js
Experience: 3 years`;

    workflow.state_data = { resumeText: sampleResumeText };
    await workflow.save();

    // Step 1: Run until pause
    await hiringWorkflowEngine.runWorkflow(workflow._id);

    // Step 2: Recruiter approves
    const resumeResult = await hiringWorkflowEngine.resumeWorkflowWithApproval(
      workflow._id,
      "approved",
      "Candidate looks exceptional!"
    );

    expect(resumeResult.completed).toBe(true);
    expect(resumeResult.status).toBe("completed");

    const finalWorkflow = await Workflow.findById(workflow._id);
    expect(finalWorkflow.status).toBe("completed");
    expect(finalWorkflow.approval_decision).toBe("approved");

    const finalCandidate = await Candidate.findById(candidate._id);
    expect(finalCandidate.interview_data).toBeDefined();
    expect(finalCandidate.interview_data.questions.length).toBeGreaterThan(0);
    expect(finalCandidate.email_data).toBeDefined();
    expect(finalCandidate.email_data.delivery_status).toBe("sent");
  });
});
