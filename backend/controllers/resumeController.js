import Resume from "../models/Resume.js";

// Save Resume
export const saveResume = async (req, res) => {
    try {
        const newResume = new Resume(req.body);
        await newResume.save();
        res.status(201).json({ message: "Resume saved successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to save resume." });
    }
};

// Get Resumes for a User
export const getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.params.userId });
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch resumes." });
    }
};
