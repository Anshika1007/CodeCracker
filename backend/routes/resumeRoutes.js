import express from "express";
import { saveResume, getResumes } from "../controllers/resumeController.js";

const router = express.Router();

router.post("/save", saveResume);
router.get("/:userId", getResumes);

export default router;
