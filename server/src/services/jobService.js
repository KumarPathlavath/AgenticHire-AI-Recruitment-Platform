import { Job } from "../models/Job.js";
import { Candidate } from "../models/Candidate.js";

export class JobService {
  async createJob(jobData, userId) {
    const job = await Job.create({
      ...jobData,
      creator: userId,
    });
    return job;
  }

  async listJobs(filter = {}) {
    const jobs = await Job.find(filter).sort({ created_at: -1 }).populate("creator", "name email");
    return jobs;
  }

  async getJobById(id) {
    const job = await Job.findById(id).populate("creator", "name email");
    if (!job) {
      throw new Error(`Job with ID ${id} not found`);
    }
    const candidateCount = await Candidate.countDocuments({ job_id: id });
    return {
      ...job.toObject(),
      candidate_count: candidateCount,
    };
  }

  async updateJob(id, updateData) {
    const job = await Job.findByIdAndUpdate(id, updateData, { new: true });
    if (!job) {
      throw new Error(`Job with ID ${id} not found`);
    }
    return job;
  }
}

export const jobService = new JobService();
