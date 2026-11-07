import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
  logout,
} from "../controllers/auth.controller.js";
import { loginLimiter } from "../middleware/rate-limit.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", authenticate, logout);

export default router;
