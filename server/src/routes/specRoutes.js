import { Router } from "express";
import { getSpecs, getWorkflowSpec, getNodeStates } from "../controllers/specController.js";

const router = Router();

// Publicly inspectable spec endpoints for frontend UI alignment
router.get("/", getSpecs);
router.get("/workflow/:id?", getWorkflowSpec);
router.get("/node-states", getNodeStates);

export default router;
