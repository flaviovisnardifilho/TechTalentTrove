import express from "express";
const router = express.Router();

import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/loginController.js";

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(authenticateToken, getUserProfile)
  .put(authenticateToken, updateUserProfile);

export default router;
