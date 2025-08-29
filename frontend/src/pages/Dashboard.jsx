import { useEffect, useState } from "react";
import axios from "axios";

import { motion } from "framer-motion";
import { io } from "socket.io-client";
import { FiSun, FiMoon } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { FaBookOpen, FaFileAlt, FaUserCircle, FaCog,FaChartBar,FaBriefcase,FaPen  } from "react-icons/fa";
import gfglogo from "../assets/image-removebg-preview (6).png";
import leetcodeLogo from "../assets/image-removebg-preview (2).png";
import codechefLogo from "../assets/image-removebg-preview (5).png";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import {  FaQuestionCircle } from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

let socket;
try {
  socket = io("http://localhost:5000", {
    transports: ["websocket", "polling"],
  });
} catch (error) {
  console.error("Socket connection failed:", error);
}

const platforms = [
  {
    name: "LeetCode",
    key: "leetcode",
    logo: leetcodeLogo,
    color: "bg-yellow-400",
  },
  {
    name: "CodeChef",
    key: "codechef",
    logo: codechefLogo,
    color: "bg-orange-500",
  },
  { name: "GeeksforGeeks",
     key: "gfg",
      logo: gfglogo,
       color: "bg-green-500" }, 
];

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [graphData, setGraphData] = useState({});
  // const [darkMode, setDarkMode] = useState(
  //   () => localStorage.getItem("theme") === "dark"
  // );
  const [usernames, setUsernames] = useState({
    leetcode: "",
    codechef: "",
    gfg: "",
  });
  const [availablePlatforms, setAvailablePlatforms] = useState([]); 

 
  
 
  const saveUsername = async (platformKey, username) => {
    if (!username) return;
    
    try {
      await axios.post("http://localhost:5000/api/save-username", {
        email: user.email,  // Get user's email from authentication state
        platform: platformKey,
        username,
      });
  
      setUsernames((prev) => ({ ...prev, [platformKey]: username }));
      localStorage.setItem("usernames", JSON.stringify({ ...usernames, [platformKey]: username }));
    } catch (error) {
      console.error(`Error saving username for ${platformKey}:`, error);
    }
  };
  
  // useEffect(() => {
  //   localStorage.setItem("theme", darkMode ? "dark" : "light");
  //   document.documentElement.classList.toggle("dark", darkMode);
  // }, [darkMode]);

  const fetchStatsForPlatform = async (platformKey) => {
    const username = usernames[platformKey];
    if (!username) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/stats/${platformKey}/${username}`
      );
      console.log(`Fetched ${platformKey} Stats:`, response.data);
      if (!response.data) return;

      setStats((prev) => ({ ...prev, [platformKey]: response.data }));

      let formattedGraphData = [];
      if (platformKey === "codechef") {
        formattedGraphData = response.data.contest_ratings.map((entry) => ({
          name: entry.contest_code,
          rating: entry.rating,
        }));
      } else if (platformKey === "leetcode") {
        formattedGraphData =
          response.data.contestHistory?.map((entry) => ({
            name: entry.contest.title,
            rating: entry.rating,
          })) || [];
      } else if (platformKey === "gfg") {
        
        formattedGraphData = response.data.solvedStats.basic.questions.map(
          (question) => ({
            name: question.question,
            rating: 1, 
          })
        );
      }

      setGraphData((prev) => ({ ...prev, [platformKey]: formattedGraphData }));
    } catch (error) {
      console.error(`Error fetching stats for ${platformKey}:`, error);
    }
  };

  const fetchAllStats = async () => {
    let detectedPlatforms = [];
    for (const platform of platforms) {
      if (!usernames[platform.key]) continue;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/stats/${platform.key}/${
            usernames[platform.key]
          }`
        );
        if (response.data) {
          detectedPlatforms.push(platform.key);
          fetchStatsForPlatform(platform.key);
        }
      } catch (error) {
        console.error(`Error checking ${platform.name} stats:`, error);
      }
    }
    setAvailablePlatforms(detectedPlatforms);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("updateStats", (updatedStats) => {
      setStats((prev) => ({ ...prev, ...updatedStats }));
    });
    return () => socket.off("updateStats");
  }, []);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      console.error("Username not found in localStorage");
    }
  }, []);

  
return (
    <div
      
    >
      {/* Sidebar */}
<motion.div
  initial={{ x: -100 }}
  animate={{ x: 0 }}
  transition={{ duration: 0.5 }}
  className="w-64 h-screen p-5 bg-[var(--secondary)] text-[var(--text)] flex flex-col fixed shadow-xl"
>
  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
    <MdDashboard size={28} className="text-[var(--accent)]" />
    Dashboard
  </h2>

  <div className="flex items-center gap-3 mb-6 p-3 bg-[var(--secondary)] rounded-lg">
    <AiOutlineUser size={26} className="text-[var(--highlight)]" />
    <p className="text-lg font-medium">{username ? username : "User"}</p>
  </div>

  {/* Sidebar Links */}
  <nav className="flex flex-col gap-4">
    <Link
      to="/profile"
      className="flex items-center gap-3 p-3 rounded-lg bg-[var(--secondary)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-all duration-300 shadow-md"
    >
      <FaUserCircle size={22} className="text-pink-400" />
      <span className="text-lg">Profile</span>
    </Link>

    <Link
      to="/coding-sheets"
      className="flex items-center gap-3 p-3 rounded-lg bg-[var(--secondary)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-all duration-300 shadow-md"
    >
      <FaBookOpen size={22} className="text-green-400" />
      <span className="text-lg">Coding Sheets</span>
    </Link>

    <Link
      to="/resume-roadmaps"
      className="flex items-center gap-3 p-3 rounded-lg bg-[var(--secondary)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-all duration-300 shadow-md"
    >
      <FaFileAlt size={22} className="text-[var(--text)]" />
      <span className="text-lg">Resume & Roadmaps</span>
    </Link>

    <Link
      to="/interview-prep"
      className="flex items-center gap-3 p-3 rounded-lg bg-[var(--secondary)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-all duration-300 shadow-md"
    >
      <FaBriefcase size={22} className="text-blue-400" />
      <span className="text-lg">Interview Prep Hub</span>
    </Link>

    <Link
      to="/text-interview"
      className="flex items-center gap-3 p-3 rounded-lg bg-[var(--secondary)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-all duration-300 shadow-md"
    >
      <FaPen size={22} className="text-yellow-400" />
      <span className="text-lg">Text Interview</span>
    </Link>

    <Link
      to="/cp-trivia"
      className="flex items-center gap-3 p-3 rounded-lg bg-[var(--secondary)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition-all duration-300 shadow-md"
    >
      <FaQuestionCircle size={22} className="text-yellow-400" />
      <span className="text-lg">CP Trivia & Quizzes</span>
    </Link>
  </nav>
</motion.div>


      {/* Main Content */}
      <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
  className="flex-1 p-6 ml-64 min-h-screen bg-[var(--primary)] text-[var(--text)]"
>
  <h2 className="text-3xl font-semibold mb-4">
    Your Competitive Programming Stats
  </h2>

  {/* Platform Input Section */}
  <div className="flex flex-wrap justify-center gap-10 mb-8">
    {platforms.map((platform) => (
      <div key={platform.key} className="text-center">
        <div className="w-40 h-40 flex justify-center items-center rounded-xl bg-[var(--secondary)] shadow-lg">
          <img
            src={platform.logo}
            alt={platform.name}
            className="w-36 h-36 object-contain opacity-100 hover:opacity-100 transition-all duration-300 "
          />
        </div>

        <input
          type="text"
          className="mt-4 p-3 w-60 text-lg rounded bg-[var(--secondary)] text-[var(--text)] text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          placeholder={`Enter ${platform.name} Username`}
          value={usernames[platform.key] || ""}
          onChange={(e) =>
            setUsernames((prev) => ({
              ...prev,
              [platform.key]: e.target.value,
            }))
          }
          onBlur={() => saveUsername(platform.key, usernames[platform.key])}
        />
      </div>
    ))}
  </div>

  <button
    onClick={fetchAllStats}
    className="block mx-auto px-6 py-3 text-xl bg-[var(--accent)] text-white rounded-lg shadow-lg hover:brightness-110 transition-all duration-300"
  >
    Fetch Stats
  </button>

  {/* Stats Display Section */}
  <div className="mt-6 bg-[var(--secondary)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {availablePlatforms.map((platformKey) => {
      const platform = platforms.find((p) => p.key === platformKey);


      return (
  <div
    key={platformKey}
    className="p-6 rounded-xl shadow-lg border transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
    style={{
      background: "linear-gradient(to bottom right, var(--primary), var(--secondary))",
      color: "var(--text)",
      borderColor: "var(--accent)",
    }}
  >
    {/* Platform Title */}
    <h3
      className="text-2xl font-bold flex items-center space-x-2"
      style={{ color: "var(--accent)" }}
    >
      {platform.icon && <span className="text-3xl">{platform.icon}</span>}
      <span>{platform.name} Stats</span>
    </h3>

    {/* Stats List */}
    <ul className="mt-4 space-y-3 text-lg">
      {platformKey === "leetcode" ? (
        <>
          <li className="flex justify-between">
            <span>👤 <strong>Username:</strong></span>
            <span style={{ color: "var(--accent)" }}>{usernames.leetcode || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>🏆 <strong>Ranking:</strong></span>
            <span style={{ color: "var(--highlight)" }}>{stats.leetcode?.ranking || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>✅ <strong>Total Solved:</strong></span>
            <span>{stats.leetcode?.totalSolved || "N/A"} / {stats.leetcode?.totalQuestions || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>🥇 <strong>Easy:</strong></span>
            <span style={{ color: "var(--highlight)" }}>{stats.leetcode?.easySolved || "N/A"} / {stats.leetcode?.totalEasy || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>🥈 <strong>Medium:</strong></span>
            <span style={{ color: "var(--accent)" }}>{stats.leetcode?.mediumSolved || "N/A"} / {stats.leetcode?.totalMedium || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>🥉 <strong>Hard:</strong></span>
            <span style={{ color: "var(--highlight)" }}>{stats.leetcode?.hardSolved || "N/A"} / {stats.leetcode?.totalHard || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>📊 <strong>Contest Rating:</strong></span>
            <span style={{ color: "var(--accent)" }}>{stats.leetcode?.contestRating || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>🎖 <strong>Contribution Points:</strong></span>
            <span style={{ color: "var(--highlight)" }}>{stats.leetcode?.contributionPoint || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>💬 <strong>Reputation:</strong></span>
            <span style={{ color: "var(--accent)" }}>{stats.leetcode?.reputation || "N/A"}</span>
          </li>

          {/* Animated Recent Submissions */}
          {stats.leetcode?.recentSubmissions?.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mt-6" style={{ color: "var(--accent)" }}>
                Recent Submissions
              </h3>
              <ul className="mt-2 space-y-2">
                {stats.leetcode.recentSubmissions.slice(0, 5).map((submission, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center px-4 py-2 rounded-md shadow-md transition-transform duration-300 hover:scale-105"
                    style={{ backgroundColor: "var(--secondary)", color: "var(--text)" }}
                  >
                    <span className="font-medium text-lg">{submission.title}</span>
                    <span className="font-bold text-sm">{submission.statusDisplay}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : platformKey === "codechef" ? (
        <>
          <li className="flex justify-between">
            <span>👤 <strong>Username:</strong></span>
            <span style={{ color: "var(--accent)" }}>{usernames.codechef || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>🏅 <strong>Current Rating:</strong></span>
            <span style={{ color: "var(--highlight)" }}>{stats.codechef?.rating || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>📈 <strong>Highest Rating:</strong></span>
            <span style={{ color: "var(--accent)" }}>{stats.codechef?.highest_rating || "N/A"}</span>
          </li>
        </>
      ) : platformKey === "gfg" ? (
        <>
          <li className="flex justify-between">
            <span>👤 <strong>Username:</strong></span>
            <span style={{ color: "var(--accent)" }}>{usernames.gfg || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>🔥 <strong>Total Problems Solved:</strong></span>
            <span style={{ color: "var(--highlight)" }}>{stats.gfg?.info.totalProblemsSolved || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>💯 <strong>Coding Score:</strong></span>
            <span style={{ color: "var(--highlight)" }}>{stats.gfg?.info.codingScore || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>📆 <strong>Current Streak:</strong></span>
            <span style={{ color: "var(--highlight)" }}>{stats.gfg?.info.currentStreak || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>🏅 <strong>Monthly Score:</strong></span>
            <span style={{ color: "var(--highlight)" }}>{stats.gfg?.info.monthlyScore || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>🥇 <strong>Easy Solved:</strong></span>
            <span style={{ color: "var(--highlight)" }}>{stats.gfg?.solvedStats.easy.count || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>🥈 <strong>Medium Solved:</strong></span>
            <span style={{ color: "var(--accent)" }}>{stats.gfg?.solvedStats.medium.count || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span>🥉 <strong>Hard Solved:</strong></span>
            <span style={{ color: "var(--accent)" }}>{stats.gfg?.solvedStats.hard.count || "N/A"}</span>
          </li>
        </>
      ) : (
        Object.entries(stats[platformKey] || {}).map(([key, value]) => (
          <li key={key} className="hover:underline transition-colors" style={{ color: "var(--text)" }}>
            <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong> {JSON.stringify(value)}
          </li>
        ))
      )}
    </ul>
  </div>
);

  })}
</div>


      </motion.div>
    </div>
  );
}
