import { errorResponse } from "../utils/apiResponse.js";

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, "Access denied. Insufficient role permissions.", 403);
    }
    next();
  };
}
