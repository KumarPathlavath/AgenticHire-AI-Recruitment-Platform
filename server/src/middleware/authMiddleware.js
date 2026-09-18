import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { errorResponse } from "../utils/apiResponse.js";

export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Authorization token required", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return errorResponse(res, "User not found or token invalid", 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, "Invalid or expired token", 401);
  }
}
