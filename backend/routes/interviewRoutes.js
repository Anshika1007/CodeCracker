import express from "express";
import { getInterviewQuestions, addInterviewQuestion } from "../controllers/interviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getInterviewQuestions); // Fetch questions
router.post("/", authMiddleware, addInterviewQuestion); // Add a new question (Admin)

export default router;