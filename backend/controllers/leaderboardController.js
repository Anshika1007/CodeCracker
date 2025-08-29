import Leaderboard from "../models/Leaderboard.js";

// ✅ Save a leaderboard entry
export const saveLeaderboard = async (req, res) => {
    try {
      console.log("Request body:", req.body); // Debugging
      console.log("User ID:", req.user?.id); // Check if user ID is available
  
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }
  
      const { topic, difficulty, score } = req.body;
      const newEntry = new Leaderboard({
        userId: req.user.id,
        topic,
        difficulty,
        score,
      });
  
      await newEntry.save();
      res.status(201).json({ message: "Leaderboard entry saved!" });
    } catch (error) {
      console.error("Error saving leaderboard:", error);
      res.status(500).json({ error: "Error saving leaderboard data" });
    }
  };
  
// ✅ Get leaderboard entries for a specific user
export const getUserLeaderboard = async (req, res) => {
    try {
      console.log("Fetching leaderboard for User ID:", req.user?.id); // Debugging
  
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }
  
      const leaderboard = await Leaderboard.find({ userId: req.user.id }).sort({ score: -1 });
  
      console.log("Fetched leaderboard data:", leaderboard); // Debugging
  
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Error fetching leaderboard data" });
    }
  };
  
