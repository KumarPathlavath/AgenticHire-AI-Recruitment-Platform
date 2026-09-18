import { Candidate } from "../models/Candidate.js";
import { Job } from "../models/Job.js";
import { hiringWorkflowEngine } from "../workflows/hiringWorkflow.js";

export class CandidateService {
  async handleCandidateUpload({ name, email, phone, jobId, resumeFilePath }) {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }

    // 1. Create candidate record
    const candidate = await Candidate.create({
      name,
      email,
      phone: phone || "",
      resume_url: resumeFilePath,
      job_id: jobId,
      status: "processing",
    });

    // 2. Initialize workflow
    const workflow = await hiringWorkflowEngine.createWorkflow(candidate._id, jobId);

    // 3. Auto-start AI workflow asynchronously
    const workflowPromise = hiringWorkflowEngine.runWorkflow(workflow._id, resumeFilePath);

    return {
      candidate,
      workflow,
      workflowPromise,
    };
  }

  async listCandidates(filter = {}) {
    return Candidate.find(filter).sort({ created_at: -1 }).populate("job_id", "title required_skills");
  }

  async getCandidateById(id) {
    const candidate = await Candidate.findById(id).populate("job_id");
    if (!candidate) {
      throw new Error(`Candidate with ID ${id} not found`);
    }
    return candidate;
  }
}

export const candidateService = new CandidateService();
