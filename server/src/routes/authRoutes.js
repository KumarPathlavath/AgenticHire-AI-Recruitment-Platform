import { Router } from "express";
import { signup, login, getMe } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { signupSchema, loginSchema } from "../validators/authValidator.js";

const router = Router();

router.post("/signup", validateRequest(signupSchema), signup);
router.post("/login", validateRequest(loginSchema), login);
router.get("/me", verifyToken, getMe);

export default router;
