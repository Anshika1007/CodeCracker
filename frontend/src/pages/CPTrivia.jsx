import React, { useState, useEffect } from "react";
import { FaClock, FaTrophy, FaStar, FaCrown } from "react-icons/fa";
import { motion } from "framer-motion";

const CPTrivia = () => {
  // ... [Keep all existing state variables and logic unchanged] ...
    const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [leaderboard, setLeaderboard] = useState([]);

  const [topic, setTopic] = useState("Data Structures");
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState(5);

  const topics = [
    "React Js", "Node Js",
    "OOPS", "Operating System", "Computer Networks","Linux","Git",
    "DBMS", "System Design", "Data Structures", "Algorithms"
  ];

  const difficulties = ["Easy", "Medium", "Hard"];

  // Fetch trivia questions
  const fetchTriviaData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/generateTrivia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numQuestions }),
      });

      const data = await response.json();
      console.log("Received Data:", data);

      if (data.quizzes) {
        setQuizData(data.quizzes);
        setCurrentQuestion(0);
        setScore(0);
        setAttemptsLeft(2);
        setQuizFinished(false);
        setSelectedAnswer(null);
        setTimer(60);
      } else {
        setQuizData([]);
      }
    } catch (error) {
      console.error("Error fetching trivia:", error);
    }
    setLoading(false);
  };

  // Handle answer selection
  const handleAnswerClick = (option) => {
    if (selectedAnswer || attemptsLeft === 0) return;
  
    if (option === quizData[currentQuestion].answer) {
      // Correct Answer: Award points based on attempts
      setScore((prevScore) => prevScore + (attemptsLeft === 2 ? 10 : 5));
      setSelectedAnswer(option);
      setTimeout(() => nextQuestion(), 1000);
    } else {
      // Wrong Answer: Reduce attempts
      setAttemptsLeft((prev) => prev - 1);
      setSelectedAnswer(option);
  
      if (attemptsLeft === 2) {
        // First Wrong Attempt: Reset selection after a delay
        setTimeout(() => setSelectedAnswer(null), 1000);
      } else {
        // Second Wrong Attempt: Move to next question
        setTimeout(() => nextQuestion(), 1000);
      }
    }
  };
  

  // Move to next question or finish quiz
  const nextQuestion = () => {
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion((prev) => prev + 1);
      setAttemptsLeft(2);
      setSelectedAnswer(null);
      setTimer(60);
    } else {
      setQuizFinished(true);
      updateLeaderboard();
    }
  };

  // Timer logic
  useEffect(() => {
    if (quizFinished) return;
    if (timer === 0) {
      nextQuestion();
      return;
    }

    const interval = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(interval);
  }, [timer, quizFinished]);

  // Update leaderboard
  const updateLeaderboard = () => {
    setLeaderboard((prev) => [
      ...prev,
      { topic, difficulty, score, timestamp: new Date().toISOString() }
    ]);
  };

  const saveLeaderboard = async () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username"); // Ensure username is stored
    
    if (!token || !username) {
      console.warn("User not authenticated or missing username.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/leaderboard/saveLeaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ username, topic, difficulty, score }),
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      console.log("Leaderboard entry saved successfully.");
      fetchLeaderboard(); // Refresh leaderboard after saving
    } catch (error) {
      console.error("Error saving leaderboard:", error);
    }
  };
  
  const fetchLeaderboard = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.warn("No authentication token found.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/leaderboard/getLeaderboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      console.log("Raw leaderboard data:", data); // Log the response
  
      // Ensure leaderboard is an array
      if (!Array.isArray(data.leaderboard)) {
        throw new Error("Invalid leaderboard data format");
      }
  
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLeaderboard([]); // Ensure leaderboard remains an array
    }
  };
  
  useEffect(() => {
    fetchLeaderboard();
  }, []); // Run only once when component loads
  
  

  return (
    <div className="min-h-screen flex flex-col items-center bg-[var(--primary)] text-[var(--text)] p-6">
      <motion.h1 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold mb-8 mt-4 flex items-center gap-2"
      >
        <FaCrown className="text-[var(--highlight)]" />
        CP Trivia & Quizzes
        <FaStar className="text-[var(--highlight)]" />
      </motion.h1>
  
      {/* Topic & Difficulty Selection */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <motion.select 
          whileHover={{ scale: 1.05 }}
          className="px-6 py-3 bg-[var(--secondary)] text-[var(--text)] rounded-xl border-2 border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          value={topic} 
          onChange={(e) => setTopic(e.target.value)}
        >
          {topics.map((t) => <option key={t} value={t} className="bg-[var(--secondary)]">{t}</option>)}
        </motion.select>
  
        <motion.select 
          whileHover={{ scale: 1.05 }}
          className="px-6 py-3 bg-[var(--secondary)] text-[var(--text)] rounded-xl border-2 border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value)}
        >
          {difficulties.map((d) => <option key={d} value={d} className="bg-[var(--secondary)]">{d}</option>)}
        </motion.select>
  
        <motion.input 
          whileHover={{ scale: 1.05 }}
          type="number" 
          min="1" 
          max="10" 
          value={numQuestions} 
          onChange={(e) => setNumQuestions(e.target.value)}
          className="px-6 py-3 bg-[var(--secondary)] text-[var(--text)] rounded-xl border-2 border-[var(--accent)] text-center w-24 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>
  
      {/* Generate Quiz Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={fetchTriviaData} 
        disabled={loading}
        className="px-8 py-4 bg-[var(--accent)] hover:opacity-90 disabled:bg-gray-500 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 mb-8 text-xl"
      >
        {loading ? "✨ Generating Magic..." : "🎮 Start Quiz"}
      </motion.button>
  
      {/* Quiz Container */}
      {!quizFinished && quizData.length > 0 && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-2xl p-8 bg-[var(--secondary)] rounded-2xl shadow-2xl border-2 border-[var(--accent)] mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-[var(--accent)]">
              <span className="text-2xl font-bold bg-[var(--primary)] px-4 py-2 rounded-xl">
                {currentQuestion + 1}/{quizData.length}
              </span>
              <div className="flex items-center gap-2 text-[var(--highlight)]">
                <FaClock className="text-xl" />
                <span className="text-2xl font-mono">{timer}s</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[var(--primary)] px-4 py-2 rounded-xl">
                💎 {score} Points
              </div>
              <div className="bg-[var(--primary)] px-4 py-2 rounded-xl">
                🎯 {attemptsLeft} Attempts
              </div>
            </div>
          </div>
  
          <motion.div 
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-semibold leading-relaxed">
              {quizData[currentQuestion].question}
            </h2>
  
            <ul className="grid grid-cols-1 gap-4">
              {quizData[currentQuestion].options.map((option, idx) => (
                <motion.li
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerClick(option)}
                  className={`p-4 rounded-xl cursor-pointer text-lg font-medium transition-all duration-300 ${
                    selectedAnswer === option 
                      ? option === quizData[currentQuestion].answer
                        ? "bg-green-500/90"
                        : "bg-red-500/90"
                      : "bg-[var(--primary)] hover:bg-[var(--secondary)]"
                  }`}
                >
                  {String.fromCharCode(65 + idx)}. {option}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
  
      {/* Leaderboard */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl bg-[var(--secondary)] rounded-2xl p-6 border-2 border-[var(--accent)] shadow-xl mt-8"
      >
        <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <FaTrophy className="text-[var(--highlight)]" />
          LeaderBoard
          <FaTrophy className="text-[var(--highlight)]" />
        </h3>
        
        <div className="overflow-x-auto rounded-xl border-2 border-[var(--accent)]">
          <table className="w-full">
            <thead className="bg-[var(--primary)] text-[var(--text)]">
              <tr>
                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">Topic</th>
                <th className="p-4 text-left">Difficulty</th>
                <th className="p-4 text-left">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--primary)]">
              {Array.isArray(leaderboard) && leaderboard.sort((a, b) => b.score - a.score).map((entry, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-[var(--primary)] transition-colors duration-200"
                >
                  <td className="p-4 font-bold text-[var(--accent)]">#{idx + 1}</td>
                  <td className="p-4">{entry.topic}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      entry.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      entry.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {entry.difficulty}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xl text-[var(--text)]">🌟 {entry.score}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
  
};

export default CPTrivia;