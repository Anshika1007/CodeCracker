import CodingSheet from "../models/CodingSheet.js";

// Create a new coding sheet (restricted to logged-in users)
const createCodingSheet = async (req, res) => {
    try {
        const { title, description, questions } = req.body;
 
        // Create a new coding sheet and associate it with the logged-in user
        const codingSheet = new CodingSheet({
            title,
            description,
            questions,
            createdBy: req.user.id, // user id from the authMiddleware
        });

        await codingSheet.save();
        res.status(201).json(codingSheet); // Return the created coding sheet
    } catch (error) {
        console.error("Error creating coding sheet:", error.message);
        res.status(500).json({ error: "Failed to create coding sheet" });
    }
};

// Fetch all coding sheets created by the logged-in user
const getUserCodingSheets = async (req, res) => {
    try {
        const codingSheets = await CodingSheet.find({ createdBy: req.user.id });
        res.json(codingSheets); // Return all coding sheets belonging to the logged-in user
    } catch (error) {
        console.error("Error fetching coding sheets:", error.message);
        res.status(500).json({ error: "Failed to fetch coding sheets" });
    }
};

// Fetch a specific coding sheet by ID (restricted to logged-in user)
const getCodingSheetById = async (req, res) => {
    try {
        const codingSheet = await CodingSheet.findById(req.params.id);

        if (!codingSheet) {
            return res.status(404).json({ error: "Coding sheet not found" });
        }

        // Ensure the logged-in user owns the coding sheet (access control)
        // if (codingSheet.createdBy.toString() !== req.user.id) {
        //     return res.status(403).json({ error: "You do not have permission to access this sheet" });
        // }

        res.json(codingSheet); // Return the requested coding sheet
    } catch (error) {
        console.error("Error fetching coding sheet:", error.message);
        res.status(500).json({ error: "Failed to fetch coding sheet" });
    }
};

// Add questions to an existing coding sheet
const addQuestionsToSheet = async (req, res) => {
    try {
        const { sheetId } = req.params;
        const { questions } = req.body; // Expecting an array of questions

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: "Invalid questions format. Must be an array." });
        }

        // Ensure each question has the required fields
        for (const question of questions) {
            if (!question.questionTitle || !question.difficulty || !question.platform || !question.url) {
                return res.status(400).json({
                    message: "Each question must have questionTitle, difficulty, platform, and url."
                }); 
            }

            // Validate difficulty
            if (!["Easy", "Medium", "Hard"].includes(question.difficulty)) {
                return res.status(400).json({ message: "Invalid difficulty. Must be 'Easy', 'Medium', or 'Hard'." });
            }
        }

        const sheet = await CodingSheet.findById(sheetId);
        if (!sheet) {
            return res.status(404).json({ message: "Coding sheet not found" });
        }

        // Append new questions to the sheet's questions array
        sheet.questions.push(...questions);
        await sheet.save();

        res.status(200).json({ message: "Questions added successfully", sheet });
    } catch (error) {
        console.error("Error adding questions:", error.message);
        res.status(500).json({ message: "Server error", error });
    }
};

const updateQuestionInSheet = async (req, res) => {
    try {
        const { sheetId, questionId } = req.params;
        const { questionTitle, difficulty, platform, url } = req.body;

        const updatedSheet = await CodingSheet.findOneAndUpdate(
            { _id: sheetId, "questions._id": questionId },
            { 
                $set: { 
                    "questions.$.questionTitle": questionTitle,
                    "questions.$.difficulty": difficulty,
                    "questions.$.platform": platform,
                    "questions.$.url": url
                }
            },
            { new: true }
        );

        if (!updatedSheet) return res.status(404).json({ error: "Question not found" });

        res.json(updatedSheet);
    } catch (error) {
        console.error("Error updating question:", error);
        res.status(500).json({ error: "Failed to update question" });
    }
};


const deleteQuestionInSheet = async (req, res) => {
    try {
        const { sheetId, questionId } = req.params;

        const updatedSheet = await CodingSheet.findByIdAndUpdate(
            sheetId,
            { $pull: { questions: { _id: questionId } } },
            { new: true }
        );

        if (!updatedSheet) return res.status(404).json({ error: "Question not found" });

        res.json(updatedSheet);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete question" });
    }
};

// Export all controller functions
export { createCodingSheet, getUserCodingSheets, getCodingSheetById, addQuestionsToSheet,updateQuestionInSheet,deleteQuestionInSheet };