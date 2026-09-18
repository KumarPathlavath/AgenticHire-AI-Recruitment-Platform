import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", verifyToken, getAnalytics);

export default router;
