import express from "express";
import { generateTrivia } from "../controllers/triviaController.js";

const router = express.Router();

router.post("/generateTrivia", generateTrivia); // Accepts user preferences

export default router;
