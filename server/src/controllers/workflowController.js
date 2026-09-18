import { workflowService } from "../services/workflowService.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listWorkflows = asyncHandler(async (req, res) => {
  const workflows = await workflowService.listWorkflows();
  return successResponse(res, { workflows }, "Workflows retrieved successfully", 200);
});

export const getWorkflowById = asyncHandler(async (req, res) => {
  const details = await workflowService.getWorkflowDetails(req.params.id);
  return successResponse(res, details, "Workflow details retrieved successfully", 200);
});

export const startWorkflow = asyncHandler(async (req, res) => {
  const { candidate_id, job_id } = req.validatedBody;
  const result = await workflowService.startWorkflow(candidate_id, job_id);
  return successResponse(res, result, "Workflow started successfully", 200);
});

export const approveWorkflow = asyncHandler(async (req, res) => {
  const { workflow_id, decision, notes } = req.validatedBody;
  const result = await workflowService.approveCheckpoint(workflow_id, decision, notes);
  return successResponse(res, result, `Workflow human checkpoint resolved: ${decision}`, 200);
});

export const retryWorkflow = asyncHandler(async (req, res) => {
  const { workflow_id } = req.validatedBody;
  const result = await workflowService.retryWorkflow(workflow_id);
  return successResponse(res, result, "Workflow retry initiated", 200);
});
