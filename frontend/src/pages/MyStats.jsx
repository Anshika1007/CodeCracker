import React, { useEffect, useState } from "react";
import axios from "axios";

const MyStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usernames, setUsernames] = useState(null);

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched Data:", data);


      // Ensure data has the expected structure before setting state
      if (data && data.platforms) {
        setUsernames(data.platforms);
      } else {
        console.error("Unexpected API response format:", data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  fetchUserData();
}, []);


  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to view your stats.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching My Stats...");
        const { data } = await axios.get("http://localhost:5000/api/users/my-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched Data:", data);
        setStats(data);
      } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Failed to fetch stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center text-white">Loading stats...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center text-white p-10">
      <h1 className="text-3xl font-bold mb-6">My CP Stats</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* LeetCode Stats */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold mb-4 text-yellow-400">LeetCode</h2>
          {stats?.leetcode ? (
            <>
              <li className="flex justify-between">
                <span>👤 <strong>Username:</strong></span>
                <span className="text-blue-400">{usernames.leetcode || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>🏆 <strong>Ranking:</strong></span>
                <span className="text-yellow-400">{stats.leetcode?.ranking || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>✅ <strong>Total Solved:</strong></span>
                <span>{stats.leetcode?.totalSolved || "N/A"} / {stats.leetcode?.totalQuestions || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>🥇 <strong>Easy:</strong></span>
                <span className="text-green-400">{stats.leetcode?.easySolved || "N/A"} / {stats.leetcode?.totalEasy || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>🥈 <strong>Medium:</strong></span>
                <span className="text-yellow-400">{stats.leetcode?.mediumSolved || "N/A"} / {stats.leetcode?.totalMedium || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>🥉 <strong>Hard:</strong></span>
                <span className="text-red-400">{stats.leetcode?.hardSolved || "N/A"} / {stats.leetcode?.totalHard || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>📊 <strong>Contest Rating:</strong></span>
                <span className="text-purple-400">{stats.leetcode?.contestRating || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>🎖 <strong>Contribution Points:</strong></span>
                <span className="text-orange-400">{stats.leetcode?.contributionPoint || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>💬 <strong>Reputation:</strong></span>
                <span className="text-teal-400">{stats.leetcode?.reputation || "N/A"}</span>
              </li>

              {/* Animated Recent Submissions */}
              {stats.leetcode?.recentSubmissions?.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold mt-6">Recent Submissions</h3>
                  <ul className="mt-2 space-y-2">
                    {stats.leetcode.recentSubmissions.slice(0, 5).map((submission, index) => (
                      <li
                        key={index}
                        className={`flex justify-between items-center px-4 py-2 rounded-md shadow-md ${
                          submission.statusDisplay === "Accepted"
                            ? " text-white"
                            : " text-white"
                        } transition-transform duration-300 hover:scale-105`}
                      >
                        <span className="font-medium text-lg">{submission.title}</span>
                        <span className="font-bold text-sm">{submission.statusDisplay}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <p className="text-gray-400">No LeetCode data found.</p>
          )}
        </div>

        {/* GFG Stats */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold mb-4 text-green-400">GeeksforGeeks</h2>
          {stats?.gfg ? (
            <p className="text-gray-400">GFG profile not found.</p>)(
            <>
            <li className="flex justify-between">
                <span>👤 <strong>Username:</strong></span>
                <span className="text-blue-400">{usernames.gfg || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>🔥 <strong>Total Problems Solved:</strong></span>
                <span className="text-green-400">{stats.gfg?.info.totalProblemsSolved || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>💯 <strong>Coding Score:</strong></span>
                <span className="text-yellow-400">{stats.gfg?.info.codingScore || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>📆 <strong>Current Streak:</strong></span>
                <span className="text-red-400">{stats.gfg?.info.currentStreak || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>🏅 <strong>Monthly Score:</strong></span>
                <span className="text-purple-400">{stats.gfg?.info.monthlyScore || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>🥇 <strong>Easy Solved:</strong></span>
                <span className="text-green-400">{stats.gfg?.solvedStats.easy.count || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>🥈 <strong>Medium Solved:</strong></span>
                <span className="text-yellow-400">{stats.gfg?.solvedStats.medium.count || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>🥉 <strong>Hard Solved:</strong></span>
                <span className="text-red-400">{stats.gfg?.solvedStats.hard.count || "N/A"}</span>
              </li>

            </>
          ) : (
            <p className="text-gray-400">No GFG data found.</p>
          )}
        </div>

        {/* CodeForces Stats */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold mb-4 text-blue-400">Codechef</h2>
          {stats?.codechef ? (
            <>
              <li className="flex justify-between">
                <span>👤 <strong>Username:</strong></span>
                <span className="text-blue-400">{usernames.codechef || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>🏅 <strong>Current Rating:</strong></span>
                <span className="text-yellow-400">{stats.codechef?.rating || "N/A"}</span>
              </li>
              <li className="flex justify-between">
                <span>📈 <strong>Highest Rating:</strong></span>
                <span className="text-green-400">{stats.codechef?.highest_rating || "N/A"}</span>
              </li>
            </>
          ) : (
            <p className="text-gray-400">No CodeForces data found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyStats;
