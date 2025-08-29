import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { FaRobot, FaPaperPlane, FaUser, FaRegSmileWink } from "react-icons/fa";

// Add these animation constants at the top
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const bubbleVariants = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

const TextInterview = () => {
  // ... existing state and logic
  const [messages, setMessages] = useState([]);
    const [role, setRole] = useState("");
    const [userResponse, setUserResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({});
    const [isRoleSelected, setIsRoleSelected] = useState(false);
    const [waitingForAnswer, setWaitingForAnswer] = useState(false);
  
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id || localStorage.getItem("userId");
  
    useEffect(() => {
      if (!userId) {
        console.error("⚠️ User ID not found. Ensure user is logged in.");
      } else {
        startInterview();
      }
    }, [userId]);
  
    const roles = [
      "Software Engineer",
      "Data Analyst",
      "Product Manager",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Machine Learning Engineer",
      "Cybersecurity Analyst",
      "Cloud Engineer",
      "DevOps Engineer",
    ];
  
    const startInterview = () => {
      setMessages([{ text: "Hi! Now we will start your text interview to help you prepare for your interviews. What role would you like to practice for?", sender: "ai" }]);
    };
  
    const handleRoleSelection = (selectedRole) => {
      setRole(selectedRole);
      setIsRoleSelected(true);
      setMessages((prev) => [
        ...prev,
        { text: selectedRole, sender: "user" },
        { text: `Great! Let's start with a question for ${selectedRole}.`, sender: "ai" },
      ]);
      fetchQuestions(selectedRole);
    };
  
    const fetchQuestions = async (selectedRole) => {
      setLoading(true);
      setFeedback({});
      setUserResponse("");
  
      try {
        const res = await fetch("http://localhost:5000/api/text-interview/generate-question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: selectedRole }),
        });
  
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setMessages((prev) => [...prev, { text: data.questions[0], sender: "ai" }]);
          setWaitingForAnswer(true);
        } else {
          setMessages((prev) => [...prev, { text: "No questions found. Try a different role.", sender: "ai" }]);
        }
      } catch (error) {
        console.error("❌ Error fetching questions:", error);
      }
  
      setLoading(false);
    };
  
    const submitResponse = async () => {
      if (!userResponse) {
        alert("Please provide an answer before submitting.");
        return;
      }
  
      setMessages((prev) => [...prev, { text: userResponse, sender: "user" }]);
      setWaitingForAnswer(false);
  
      const question = messages[messages.length - 1]?.text;
      try {
        await fetch("http://localhost:5000/api/text-interview/save-response", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, role, question, userAnswer: userResponse }),
        });
  
        const analyzeResponse = await fetch("http://localhost:5000/api/text-interview/analyze-response", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, userAnswer: userResponse }),
        });
  
        const analyzeData = await analyzeResponse.json();
        displayFeedback(analyzeData.feedback);
      } catch (error) {
        console.error("❌ Error submitting response:", error);
        setMessages((prev) => [...prev, { text: "Error analyzing response. Please try again.", sender: "ai" }]);
      }
    };
  
    const displayFeedback = (feedbackText) => {
      if (!feedbackText) {
        setMessages((prev) => [...prev, { text: "No feedback available.", sender: "ai" }]);
        return;
      }
  
      // Split the feedback into sections based on the occurrence of "Step" and remove the step numbers
      const sections = feedbackText.split(/\*?Step \d+:?/).map((section) => section.trim()).filter(Boolean);
  
      let parsedFeedback = {
        mistakes: "",
        improvements: "",
        idealAnswer: ""
      };
  
      // Process the sections to categorize them without "Step"
      sections.forEach((section) => {
        const lowerSection = section.toLowerCase();
        if (lowerSection.includes("identify mistakes")) {
          parsedFeedback.mistakes = section;
        } else if (lowerSection.includes("suggestions for improvement")) {
          parsedFeedback.improvements = section;
        } else if (lowerSection.includes("ideal answer example")) {
          parsedFeedback.idealAnswer = section;
        }
      });
  
      // Constructing messages based on the parsed feedback
      const feedbackMessages = [
        { text: "Here's your feedback:", sender: "ai" },
        ...(parsedFeedback.mistakes
          ? [
              {
                text: `❌ **Mistakes & Missing Points:**\n${parsedFeedback.mistakes}`,
                sender: "ai"
              }
            ]
          : []),
        ...(parsedFeedback.improvements
          ? [
              {
                text: `💡 **Suggestions for Improvement:**\n${parsedFeedback.improvements}`,
                sender: "ai"
              }
            ]
          : []),
        ...(parsedFeedback.idealAnswer
          ? [
              {
                text: `✅ **Ideal Answer Example:**\n${parsedFeedback.idealAnswer}`,
                sender: "ai"
              }
            ]
          : []),
      ];
  
      // Adding the Continue or End session buttons
      feedbackMessages.push({
        text: "Would you like to continue practicing or end the session?",
        buttons: [
          { label: "Continue", value: "continue" },
          { label: "End", value: "end" }
        ],
        sender: "ai"
      });
  
      setMessages((prev) => [...prev, ...feedbackMessages]);
      setWaitingForAnswer(true);
    };
  
    const handleUserResponse = (response) => {
      if (response === "continue") {
        // Proceed to the next question (Don't repeat the role)
        setMessages((prev) => [...prev, { text: "Great! Let's move on to the next question.", sender: "ai" }]);
        fetchQuestions(role);
      } else if (response === "end") {
        // End the session and wish them luck
        setMessages((prev) => [
          ...prev,
          { text: "All the best for your future! Good luck with your preparations!", sender: "ai" }
        ]);
      }
    };
  

    return (
      <motion.div 
        className="h-screen flex flex-col items-center bg-[var(--secondary)] border border-[var(--accent)] rounded-lg p-4 shadow-md hover:shadow-[var(--accent)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl w-full h-full flex flex-col">
          <motion.div
            className="flex-1 bg-opacity-50 p-6 rounded-lg shadow-xl backdrop-blur-sm border overflow-y-auto relative bg-[var(--secondary)] border-[var(--accent)] hover:shadow-[var(--accent)]"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            {messages.length === 0 ? (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FaRobot className="text-6xl text-[var(--accent)] mb-4 bg-[var(--secondary)] border border-[var(--accent)] rounded-lg p-4 shadow-md hover:shadow-[var(--accent)]" />
                <p className="text-xl text-[var(--text)]">Ready for your interview practice?</p>
              </motion.div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    variants={bubbleVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-3`}
                  >
                    <motion.div
                      className={`p-4 rounded-2xl max-w-md relative flex items-start ${
                        msg.sender === "user" 
                          ? "bg-[var(--accent)] text-white rounded-br-none" 
                          : "bg-[var(--secondary)] text-[var(--text)] rounded-bl-none border border-[var(--accent)]"
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute -top-3 left-0">
                        {msg.sender === "ai" && (
                          <FaRobot className="text-xl text-[var(--accent)] bg-[var(--secondary)] rounded-full p-1 border border-[var(--accent)]" />
                        )}
                        {msg.sender === "user" && (
                          <FaUser className="text-xl text-[var(--text)] bg-[var(--accent)] rounded-full p-1" />
                        )}
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        {msg.buttons && (
                          <motion.div 
                            className="mt-3 flex gap-3 flex-wrap"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {msg.buttons.map((button, idx) => (
                              <motion.button
                                key={idx}
                                className="px-4 py-2 bg-[var(--accent)] text-white rounded-xl hover:brightness-110 transition duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleUserResponse(button.value)}
                              >
                                {button.label}
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>
    
          {isRoleSelected && waitingForAnswer ? (
            <motion.div
              className="mt-4 flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.input
                className="flex-1 p-4 bg-[var(--secondary)] rounded-xl text-[var(--text)] border-2 border-[var(--accent)] focus:border-[var(--highlight)] focus:ring-2 focus:ring-[var(--highlight)] outline-none"
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Type your answer..."
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                className="px-6 bg-[var(--highlight)] text-white rounded-xl flex items-center gap-2 hover:brightness-110"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={submitResponse}
              >
                <FaPaperPlane /> Send
              </motion.button>
            </motion.div>
          ) : (
            !isRoleSelected && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[var(--text)]">
                  <FaRegSmileWink className="text-[var(--accent)]" />
                  Choose a role to practice:
                </h2>
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-3 gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {roles.map((r) => (
                    <motion.button
                      key={r}
                      className="p-3 bg-[var(--secondary)] hover:bg-[var(--primary)] text-[var(--text)] border border-[var(--accent)] rounded-xl text-left transition-colors"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRoleSelection(r)}
                    >
                      {r}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )
          )}
    
          {loading && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-[var(--secondary)] text-[var(--text)] p-8 rounded-2xl flex items-center gap-4"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <FaRobot className="text-2xl text-[var(--accent)]" />
                <span>Analyzing your answer...</span>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
    
};

export default TextInterview;