import { Router } from "express";
import { uploadCandidate, listCandidates, getCandidateById } from "../controllers/candidateController.js";
import { uploadResumeFile } from "../middleware/uploadMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

// Public route: Candidate applies with PDF resume
router.post("/upload", uploadResumeFile.single("resume"), uploadCandidate);

// Protected routes: Recruiter views candidates
router.get("/", verifyToken, listCandidates);
router.get("/:id", verifyToken, getCandidateById);

export default router;
