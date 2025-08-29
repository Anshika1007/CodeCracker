import express from "express";
import { generateTextInterviewQuestion, saveUserResponse, getUserResponses,analyzeUserResponse } from "../controllers/textInterviewController.js";

const router = express.Router();

router.post("/generate-question", generateTextInterviewQuestion);
router.post("/save-response", saveUserResponse);
router.get("/responses/:userId", getUserResponses);
router.post("/analyze-response", analyzeUserResponse);


export default router;
