import express from "express";
import { saveLeaderboard, getUserLeaderboard } from "../controllers/leaderboardController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Ensure user is logged in

const router = express.Router();

router.post("/saveLeaderboard", authMiddleware, saveLeaderboard);
router.get("/getLeaderboard", authMiddleware, getUserLeaderboard);

export default router;
