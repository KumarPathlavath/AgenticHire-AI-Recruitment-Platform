import { specLoader } from "../utils/specLoader.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getSpecs = asyncHandler(async (req, res) => {
  const allSpecs = specLoader.getAllSpecs();
  return successResponse(res, { specs: allSpecs }, "Specifications retrieved", 200);
});

export const getWorkflowSpec = asyncHandler(async (req, res) => {
  const workflowSpec = specLoader.getWorkflowSpec(req.params.id || "default-hiring-workflow");
  return successResponse(res, { workflow: workflowSpec }, "Workflow spec retrieved", 200);
});

export const getNodeStates = asyncHandler(async (req, res) => {
  const nodeStates = specLoader.getNodeStates();
  return successResponse(res, { nodeStates: nodeStates.states }, "Node states spec retrieved", 200);
});
