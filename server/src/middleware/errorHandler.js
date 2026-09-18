import { errorResponse } from "../utils/apiResponse.js";

export function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  if (err.name === "MulterError") {
    return errorResponse(res, `Upload error: ${err.message}`, 400);
  }

  if (err.name === "ValidationError") {
    return errorResponse(res, `Database validation error: ${err.message}`, 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return errorResponse(res, message, statusCode);
}
