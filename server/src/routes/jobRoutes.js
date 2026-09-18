import { Router } from "express";
import { createJob, listJobs, getJobById, updateJob } from "../controllers/jobController.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createJobSchema, updateJobSchema } from "../validators/jobValidator.js";

const router = Router();

// Public routes for candidates to view jobs
router.get("/", listJobs);
router.get("/:id", getJobById);

// Protected routes for recruiters
router.post("/", verifyToken, validateRequest(createJobSchema), createJob);
router.put("/:id", verifyToken, validateRequest(updateJobSchema), updateJob);

export default router;
