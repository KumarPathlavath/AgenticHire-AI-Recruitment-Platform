
import { analyticsService } from "../services/analyticsService.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getRecruiterAnalytics();
  return successResponse(res, { analytics }, "Recruiter analytics retrieved successfully", 200);
});
