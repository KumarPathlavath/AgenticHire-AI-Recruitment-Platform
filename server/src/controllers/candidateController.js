import { candidateService } from "../services/candidateService.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const uploadCandidate = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(res, "Resume PDF file is required", 400);
  }

  const { name, email, phone, job_id } = req.body;
  if (!name || !email || !job_id) {
    return errorResponse(res, "Name, email, and job_id are required fields", 400);
  }

  const result = await candidateService.handleCandidateUpload({
    name,
    email,
    phone,
    jobId: job_id,
    resumeFilePath: req.file.path,
  });

  return successResponse(
    res,
    {
      candidate: result.candidate,
      workflow: result.workflow,
    },
    "Application submitted successfully. AI recruitment workflow started.",
    201
  );
});

export const listCandidates = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.job_id) {
    filter.job_id = req.query.job_id;
  }
  const candidates = await candidateService.listCandidates(filter);
  return successResponse(res, { candidates }, "Candidates retrieved successfully", 200);
});

export const getCandidateById = asyncHandler(async (req, res) => {
  const candidate = await candidateService.getCandidateById(req.params.id);
  return successResponse(res, { candidate }, "Candidate details retrieved", 200);
});
