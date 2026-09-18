import { authService } from "../services/authService.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.validatedBody);
  return successResponse(res, result, "Account created successfully", 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.validatedBody);
  return successResponse(res, result, "Logged in successfully", 200);
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  return successResponse(res, { user }, "User profile retrieved", 200);
});
