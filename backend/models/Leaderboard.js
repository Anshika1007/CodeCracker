import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic: String,
  difficulty: String,
  score: Number,
  timestamp: { type: Date, default: Date.now },
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
export default Leaderboard;
