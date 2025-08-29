import express from "express";
import { 
    createCodingSheet, 
    getUserCodingSheets, 
    getCodingSheetById,  
    addQuestionsToSheet,
    updateQuestionInSheet,
    deleteQuestionInSheet 
} from "../controllers/sheetsController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Authentication middleware

const router = express.Router();
 
router.post("/create", authMiddleware, createCodingSheet);
router.get("/", authMiddleware, getUserCodingSheets);
router.get("/:id", authMiddleware, getCodingSheetById);
router.post("/:sheetId/add-questions", authMiddleware, addQuestionsToSheet);
router.put("/:sheetId/questions/:questionId",authMiddleware,updateQuestionInSheet);
router.delete("/:sheetId/questions/:questionId",authMiddleware,deleteQuestionInSheet);

export default router;