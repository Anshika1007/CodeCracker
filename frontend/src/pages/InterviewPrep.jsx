import React, { useEffect, useState } from "react";
import axios from "axios";

const InterviewPrep = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [loading, setLoading] = useState(false);

  const companies = ["Google", "Amazon", "Microsoft", "Facebook", "Netflix"];
  const topics = ["Arrays", "Linked List", "Dynamic Programming", "Graph", "Trees", "Miscellaneous"];
  const difficulties = ["Easy", "Medium", "Hard"];

  useEffect(() => {
    fetchQuestions();
  }, [selectedCompany, selectedTopic, selectedDifficulty]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/interview-questions`, {
        params: {
          company: selectedCompany || undefined,
          topic: selectedTopic || undefined,
          difficulty: selectedDifficulty || undefined,
        },
      });
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch interview questions:", error);
    }
    setLoading(false);
  };

  const difficultyColor = {
    Easy: "text-green-400 bg-green-900",
    Medium: "text-yellow-300 bg-yellow-900",
    Hard: "text-red-400 bg-red-900",
  };

  return (
    <div className="p-6 bg-[var(--primary)] min-h-screen text-[var(--text)]">
      <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-[var(--accent)] via-[var(--highlight)] to-[var(--accent)] text-transparent bg-clip-text">
        Interview Prep Hub
      </h2>
  
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div>
          <label className="block mb-2 text-sm font-medium">Company</label>
          <select
            className="w-full p-3 bg-[var(--secondary)] text-[var(--text)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            onChange={(e) => setSelectedCompany(e.target.value)}
            value={selectedCompany}
          >
            <option value="">All Companies</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>
  
        <div>
          <label className="block mb-2 text-sm font-medium">Topic</label>
          <select
            className="w-full p-3 bg-[var(--secondary)] text-[var(--text)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            onChange={(e) => setSelectedTopic(e.target.value)}
            value={selectedTopic}
          >
            <option value="">All Topics</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
  
        <div>
          <label className="block mb-2 text-sm font-medium">Difficulty</label>
          <select
            className="w-full p-3 bg-[var(--secondary)] text-[var(--text)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            value={selectedDifficulty}
          >
            <option value="">All Difficulties</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>
  
      {/* Display Questions */}
      {loading ? (
        <p className="text-[var(--text)] opacity-60 text-center">Loading questions...</p>
      ) : questions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((q, index) => (
            <div
              key={index}
              className="p-5 bg-[var(--secondary)] rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-[var(--highlight)]/20 hover:border-[var(--accent)]"
            >
              <h4 className="text-lg font-semibold mb-1 text-[var(--accent)]">{q.topic}</h4>
              <p className="text-[var(--text)] opacity-90">{q.question}</p>
              <span
                className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${difficultyColor[q.difficulty] || "bg-[var(--primary)]/40"}`}
              >
                {q.difficulty}
              </span>
              {q.link && (
                <a
                  href={q.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3 text-sm font-medium text-[var(--accent)] hover:underline"
                >
                  Solve Here →
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[var(--text)] opacity-60 text-center">
          No questions available for this filter.
        </p>
      )}
    </div>
  );
  
};

export default InterviewPrep;
