import mongoose from "mongoose";

const InterviewQuestionSchema = new mongoose.Schema({
  company: { type: String, required: true }, // Example: "Google"
  topic: { type: String, required: true }, // Example: "Dynamic Programming"
  question: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  link: { type: String }, // Link to problem (optional)
});

const InterviewQuestion = mongoose.model("InterviewQuestion", InterviewQuestionSchema);
export default InterviewQuestion;