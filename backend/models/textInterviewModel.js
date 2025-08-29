import mongoose from "mongoose";

const textInterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, required: true },
  question: { type: String, required: true },
  userAnswer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("TextInterview", textInterviewSchema);
