import { jobService } from "../services/jobService.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.validatedBody, req.user._id);
  return successResponse(res, { job }, "Job created successfully", 201);
});

export const listJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.listJobs();
  return successResponse(res, { jobs }, "Jobs retrieved successfully", 200);
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  return successResponse(res, { job }, "Job details retrieved successfully", 200);
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await jobService.updateJob(req.params.id, req.validatedBody);
  return successResponse(res, { job }, "Job updated successfully", 200);
});
