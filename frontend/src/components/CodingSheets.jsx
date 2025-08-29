import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";

const popularSheets = [
  {
    name: "Striver's SDE Sheet",
    link: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/",
  },
  {
    name: "Blind 75 Sheet",
    link: "https://leetcode.com/list/xi4ci4ig/",
  },
  {
    name: "Neetcode 150 Sheet",
    link: "https://neetcode.io/practice",
  },
];

const companySpecificSheets = [
  {
    name: "Amazon Coding Sheet",
    link: "https://www.geeksforgeeks.org/amazon-sde-sheet-interview-questions-and-answers/",
  },
  {
    name: "Google Coding Sheet",
    link: "https://www.geeksforgeeks.org/google-sde-sheet-interview-questions-and-answers/",
  },
  // {
  //   name: "Microsoft Coding Sheet",
  //   link: "https://www.geeksforgeeks.org/microsoft-sde-sheet-interview-questions-and-answers/",
  // },
  // {
  //   name: "Facebook (Meta) Coding Sheet",
  //   link: "https://leetcode.com/list/xoqagjc7/",
  // },
  // {
  //   name: "Adobe Coding Sheet",
  //   link: "https://www.geeksforgeeks.org/adobe-sde-sheet-interview-questions-and-answers/",
  // },
];


const copyLinkToClipboard = (sheetId) => {
  const link = `${window.location.origin}/coding-sheets/${sheetId}`;
  navigator.clipboard.writeText(link);
  alert("Link copied to clipboard!");
};

const CodingSheets = () => {
  const [codingSheets, setCodingSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [questionData, setQuestionData] = useState({
    questionTitle: "",
    difficulty: "Easy",
    platform: "",
    url: "",
  });
 
  useEffect(() => {
    const fetchCodingSheets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/coding-sheets", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (Array.isArray(response.data)) {
          setCodingSheets(response.data);
          console.log("Fetched Coding Sheets:", response.data); 
        } else {
          throw new Error("Invalid data format received.");
        }
      } catch (err) {
        console.error("Error fetching coding sheets:", err);
        setError("Failed to fetch coding sheets.");
      } finally {
        setLoading(false);
      }
    };

    fetchCodingSheets();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Title and description are required.");
      return;
    }

    setCreating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/coding-sheets/create",
        { title, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("New Sheet Created:", response.data); 
      setCodingSheets([...codingSheets, response.data]);
      setTitle("");
      setDescription("");
    } catch (err) {
      alert("Failed to create coding sheet.");
    } finally {
      setCreating(false);
    }
  };

  const addQuestion = async (sheetId) => {
    if (!questionData.questionTitle || !questionData.platform || !questionData.url) {
      alert("Please fill in all question fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
       ` http://localhost:5000/api/coding-sheets/${sheetId}/add-question`,
        { questions: [questionData] },
        {
          headers: { Authorization: `Bearer ${token} `},
        }
      );

      
      console.log(`Question added to Sheet ID ${sheetId}:`, response.data.sheet);

      setCodingSheets((prevSheets) =>
        prevSheets.map((sheet) =>
          sheet._id === sheetId ? { ...sheet, questions: response.data.sheet.questions } : sheet
        )
      );

      setQuestionData({ questionTitle: "", difficulty: "Easy", platform: "", url: "" });
      alert("Question added successfully!");
    } catch (error) {
      alert("Failed to add question.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 w-full min-h-screen" style={{ backgroundColor: 'var(--primary)', color: 'var(--text)' }}>
      <h2 className="text-4xl font-bold mb-6 text-center">Coding Sheets</h2>
  
      {/* Popular Coding Sheets */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Popular Coding Sheets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularSheets.map((sheet, index) => (
            <motion.a
              key={index}
              href={sheet.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="p-5 rounded-lg shadow-lg flex items-center justify-between border transition-all duration-300"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--text)',
                borderColor: 'var(--secondary)',
              }}
            >
              <span className="text-lg font-medium">{sheet.name}</span>
              <FaExternalLinkAlt size={20} />
            </motion.a>
          ))}
        </div>
      </section>
  
      {/* Company-Specific Coding Sheets */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Company-Specific Coding Sheets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companySpecificSheets.map((sheet, index) => (
            <motion.a
              key={index}
              href={sheet.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="p-5 rounded-lg shadow-lg flex items-center justify-between border transition-all duration-300"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--text)',
                borderColor: 'var(--secondary)',
              }}
            >
              <span className="text-lg font-medium">{sheet.name}</span>
              <FaExternalLinkAlt size={20} />
            </motion.a>
          ))}
        </div>
      </section>
  
      {/* Create New Coding Sheet */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Create Your Own Coding Sheet</h3>
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-lg shadow-lg"
          style={{ backgroundColor: 'var(--secondary)' }}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="border p-3 w-full mb-3 rounded"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--text)',
              borderColor: 'var(--secondary)',
            }}
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="border p-3 w-full mb-3 rounded"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--text)',
              borderColor: 'var(--secondary)',
            }}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 rounded w-full"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#fff',
              cursor: creating ? 'not-allowed' : 'pointer',
            }}
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create Coding Sheet'}
          </button>
        </form>
      </section>
  
      {/* User-Created Coding Sheets */}
      {codingSheets.length > 0 && (
        <section>
          <h3 className="text-2xl font-semibold mb-4">Your Coding Sheets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codingSheets.map((sheet) => (
              <div
                key={sheet._id}
                className="p-5 rounded-lg shadow-lg"
                style={{ backgroundColor: 'var(--secondary)', color: 'var(--text)' }}
              >
                <h4 className="text-xl font-semibold">{sheet.title}</h4>
                <p style={{ color: 'var(--text)' }}>{sheet.description}</p>
                <div className="mt-3 flex space-x-3">
                  <Link
                    to={`/coding-sheets/${sheet._id}`}
                    className="hover:underline"
                    style={{ color: 'var(--accent)' }}
                  >
                    View
                  </Link>
                  <button
                    onClick={() => copyLinkToClipboard(sheet._id)}
                    className="hover:underline"
                    style={{ color: 'var(--accent)' }}
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
  
};

export default CodingSheets;