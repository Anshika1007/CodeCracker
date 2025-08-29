import User from "../models/User.js";
import axios from "axios";

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure platforms exists
    if (!user.platforms) {
      user.platforms = { codechef: "", leetcode: "", gfg: "" };
    }

    // Update fields only if provided (to prevent overwriting with empty strings)
    if (req.body.username !== undefined) user.username = req.body.username;
    if (req.body.email !== undefined) user.email = req.body.email;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.additionalEmail !== undefined) user.additionalEmail = req.body.additionalEmail;
    if (req.body.profileImage !== undefined) user.profileImage = req.body.profileImage;
    if (req.body.leetcode !== undefined) user.platforms.leetcode = req.body.leetcode;
    if (req.body.codechef !== undefined) user.platforms.codechef = req.body.codechef;
    if (req.body.gfg !== undefined) user.platforms.gfg = req.body.gfg;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getMyStats = async (req, res) => {
  try {
    // Fetch the logged-in user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Extract platform usernames
    const { leetcode, codechef, gfg } = user.platforms || {};

    // API URLs
    const leetcodeAPI = leetcode ? `https://alfa-leetcode-api.onrender.com/userProfile/${leetcode}` : null;
    const codechefAPI = codechef ? `https://codechef-api.vercel.app/handle/${codechef}` : null;
    const gfgAPI = gfg ? `https://geeks-for-geeks-api.vercel.app/${gfg}` : null;

    // Fetch stats in parallel (only if username exists)
    const [leetcodeStats, codechefStats, gfgStats] = await Promise.all([
      leetcodeAPI ? axios.get(leetcodeAPI).then(res => res.data).catch(() => null) : null,
      codechefAPI ? axios.get(codechefAPI).then(res => res.data).catch(() => null) : null,
      gfgAPI ? axios.get(gfgAPI).then(res => res.data).catch(() => null) : null,
    ]);

    // Response
    res.json({
      leetcode: leetcodeStats || { error: "LeetCode stats not found" },
      codechef: codechefStats || { error: "CodeChef stats not found" },
      gfg: gfgStats || { error: "GFG stats not found" },
    });
  } catch (error) {
    console.error("Error fetching My Stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};
