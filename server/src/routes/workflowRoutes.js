import { Router } from "express";
import {
  listWorkflows,
  getWorkflowById,
  startWorkflow,
  approveWorkflow,
  retryWorkflow,
} from "../controllers/workflowController.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  startWorkflowSchema,
  approveWorkflowSchema,
  retryWorkflowSchema,
} from "../validators/workflowValidator.js";

const router = Router();

// All workflow orchestration management requires recruiter auth
router.use(verifyToken);

router.get("/", listWorkflows);
router.get("/:id", getWorkflowById);
router.post("/start", validateRequest(startWorkflowSchema), startWorkflow);
router.post("/approve", validateRequest(approveWorkflowSchema), approveWorkflow);
router.post("/retry", validateRequest(retryWorkflowSchema), retryWorkflow);

export default router;
