import axios from "axios";

// Fetch LeetCode Stats
 const getLeetCodeStats = async (req, res) => {
  try {
    const { username } = req.params;
    const response = await axios.get(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`);

    if (!response.data) {
      return res.status(404).json({ error: "User not found or API error" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("LeetCode API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch LeetCode data" });
  }
};

// Fetch CodeChef Stats
 const getCodeChefStats = async (req, res) => {
  try {
    const { username } = req.params;
    const response = await axios.get(`https://codechef-api.vercel.app/handle/${username}`);

    if (!response.data || response.data.error) {
      return res.status(404).json({ error: "User not found or API error" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("CodeChef API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch CodeChef data" });
  }
};

// Fetch GeeksforGeeks Stats
const getGFGStats = async (req, res) => {
  try {
    const { username } = req.params;
    const response = await axios.get(`https://geeks-for-geeks-api.vercel.app/${username}`);
    
    console.log("GFG API Response:", response.data); 


    if (!response.data || !response.data.info) {
      return res.status(404).json({ error: "User not found or API error" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("GFG API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch GFG data" });
  }
};
export { getLeetCodeStats, getCodeChefStats, getGFGStats };