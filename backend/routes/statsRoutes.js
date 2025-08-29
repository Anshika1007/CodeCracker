
import express from "express";
import { getLeetCodeStats, getCodeChefStats, getGFGStats } from "../controllers/statsController.js";

const router = express.Router();

router.get("/leetcode/:username", getLeetCodeStats);
router.get("/codechef/:username", getCodeChefStats);
router.get("/gfg/:username", getGFGStats);

export default router;
