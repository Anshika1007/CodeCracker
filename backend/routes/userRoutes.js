import express from "express";
import { getUserProfile, updateUserProfile,getMyStats } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile); // Get profile
router.put("/profile", authMiddleware, updateUserProfile); // Update profile
router.get("/my-stats", authMiddleware, getMyStats);

export default router;
 