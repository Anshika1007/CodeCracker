import InterviewQuestion from "../models/interviewQuestions.js";

// Fetch interview questions (filter by company/topic)
export const getInterviewQuestions = async (req, res) => {
  try {
      const { company, topic, difficulty } = req.query;
      let filter = {};

      if (company) filter.company = company;
      if (topic) filter.topic = topic;
      if (difficulty) filter.difficulty = difficulty;

      const questions = await InterviewQuestion.find(filter);
      res.json(questions);
  } catch (error) {
      res.status(500).json({ error: "Server Error" });
  }
};

// Add a new interview question (Admin Only)
export const addInterviewQuestion = async (req, res) => {
  try {
    const { company, topic, question, difficulty, link } = req.body;

    if (!company || !topic || !question || !difficulty) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newQuestion = new InterviewQuestion({ company, topic, question, difficulty, link });
    await newQuestion.save();

    res.status(201).json({ message: "Interview question added successfully." });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Failed to add question." });
  }
};