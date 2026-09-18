import { errorResponse } from "../utils/apiResponse.js";

export const validateRequest = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const errorDetails = parsed.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return errorResponse(res, "Validation failed", 400, errorDetails);
    }
    req.validatedBody = parsed.data;
    next();
  } catch (err) {
    return errorResponse(res, `Internal validation error: ${err.message}`, 400);
  }
};
