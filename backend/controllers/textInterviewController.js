import dotenv from "dotenv";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import TextInterview from "../models/textInterviewModel.js";

dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// 🚀 Generate AI Interview Question
export const generateTextInterviewQuestion = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a professional and commonly asked interview question for a ${role}.  
    The question should be relevant to technical skills, problem-solving, or experience.  
    Do not include explanations—just return the question.`;

    const result = await model.generateContent(prompt);
    // console.log("🔍 Full AI Response:", JSON.stringify(result, null, 2));

    // ✅ Extracting AI-generated question properly
    const candidates = result?.response?.candidates;
    if (!candidates || candidates.length === 0) {
      return res.status(500).json({ error: "No candidates found. Try a different role." });
    }

    const contentParts = candidates[0]?.content?.parts;
    if (!contentParts || contentParts.length === 0) {
      return res.status(500).json({ error: "No valid question content found." });
    }

    const question = contentParts[0].text.trim();
    if (!question) {
      return res.status(500).json({ error: "No question found. Try a different role." });
    }

    // 🔹 Fix: Send response in correct format (Array)
    res.json({ questions: [question] });

  } catch (error) {
    console.error("❌ Error generating interview question:", error);
    res.status(500).json({ error: "Failed to generate question" });
  }
};

// 🚀 Store User Response
export const saveUserResponse = async (req, res) => {
  try {
    let { userId, role, question, userAnswer } = req.body;

    if (!userId || !role || !question || !userAnswer) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Ensure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    // Convert userId to ObjectId
    userId = new mongoose.Types.ObjectId(userId);

    const response = new TextInterview({ userId, role, question, userAnswer });

    await response.save();
    res.json({ message: "Response saved successfully!" });

  } catch (error) {
    console.error("❌ Error saving response:", error);
    res.status(500).json({ error: "Failed to save response." });
  }
};

// 🚀 Fetch User Responses
export const getUserResponses = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const responses = await TextInterview.find({ userId }).sort({ createdAt: -1 });
    res.json({ responses });

  } catch (error) {
    console.error("❌ Error fetching responses:", error);
    res.status(500).json({ error: "Failed to retrieve responses." });
  }
};

export const analyzeUserResponse = async (req, res) => {
  try {
    const { question, userAnswer } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ error: "Question and answer are required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an AI interview coach. Your role is to **professionally analyze** the given **interview question** and **user's response**, then provide structured feedback.  

    **Step 1: Identify Mistakes**  
    - Highlight inaccuracies in the user's answer.  
    - Mention missing key points.  
    - Explain any technical misunderstandings.  

    **Step 2: Suggestions for Improvement**  
    - Offer specific, actionable tips to enhance the answer.  
    - Suggest how to structure the response better.  
    - Recommend additional points the user should include.  

    **Step 3: Ideal Answer Example**  
    - Provide a **well-structured, professional answer** that correctly addresses the question.  
    - Ensure the response is concise, technical, and effective.  

    **Interview Question:** ${question}  
    **User's Answer:** ${userAnswer}  

    ---
    **Deliver the response in a structured format with bullet points.**  
    Keep a **professional yet encouraging** tone.   and also in short not long paragraphs make it in 50 words max to max and also ask different question realted to particular role everytime 
      
    `;

    const result = await model.generateContent(prompt);

    // ✅ Extract response properly
    const candidates = result?.response?.candidates;
    if (!candidates || candidates.length === 0) {
      return res.status(500).json({ error: "AI did not return any feedback." });
    }

    const content = candidates[0]?.content;
    if (!content || !content.parts || content.parts.length === 0) {
      return res.status(500).json({ error: "Invalid AI response format." });
    }

    const feedback = content.parts.map((part) => part.text).join("\n").trim();
    if (!feedback) {
      return res.status(500).json({ error: "Failed to extract feedback." });
    }

    res.json({ feedback });

  } catch (error) {
    console.error("❌ Error analyzing answer:", error);
    res.status(500).json({ error: "Failed to analyze response." });
  }
};
