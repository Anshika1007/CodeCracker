import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserCircle, FaQuestionCircle, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import axios from "axios";
import "./Home.css"; // ✅ Import local CSS for custom styles

export default function Home() {
  const [user, setUser] = useState(null);
  const [faqOpen, setFaqOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
  };

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    { question: "What is CodeCracker?", answer: "CodeCracker helps you track and improve your competitive programming skills." },
    { question: "Which platforms does CodeCracker support?", answer: "It fetches data from LeetCode, GeeksforGeeks, and CodeChef." },
    { question: "How does progress tracking work?", answer: "It continuously monitors your problem-solving history and contest performance to provide insights." },
    { question: "Does CodeCracker provide a resume builder?", answer: "Yes! You can generate a coding resume with your achievements and rankings." },
    { question: "What are coding sheets?", answer: "We provide structured coding sheets for different topics, including Data Structures, Algorithms, and System Design." },
    { question: "How can I link my profiles?", answer: "You can enter your LeetCode, GeeksforGeeks, and CodeChef usernames in the dashboard settings to fetch your data." },
    { question: "Does CodeCracker support real-time updates?", answer: "Yes! Your stats are automatically updated after every submission on supported platforms." },
    { question: "What makes CodeCracker unique?", answer: "Unlike other trackers, it combines progress tracking, coding sheets, resume builder, and profile analytics in one place." },
    { question: "Is CodeCracker free to use?", answer: "Yes! Most features are free, but we may introduce premium features for advanced analytics." },
    { question: "How often is data updated?", answer: "The data is fetched in real-time whenever you visit your dashboard." },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
        setProfileImage(data.profileImage);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };
    fetchUserProfile();
  }, []);

  // ⏰ Real-time Analog Clock Rotation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const secondHand = document.querySelector(".hand.second");
      const minuteHand = document.querySelector(".hand.minute");
      const hourHand = document.querySelector(".hand.hour");

      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours();

      const secondDeg = seconds * 6;
      const minuteDeg = minutes * 6 + seconds * 0.1;
      const hourDeg = hours * 30 + minutes * 0.5;

      if (secondHand && minuteHand && hourHand) {
        secondHand.style.transform = `rotate(${secondDeg}deg)`;
        minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
        hourHand.style.transform = `rotate(${hourDeg}deg)`;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen text-[var(--text)] bg-gradient-to-br from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] overflow-hidden">
      {/* Particle background */}
      <Particles
        id="tsparticles"
        init={async (main) => await loadFull(main)}
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 80 },
            color: { value: "#ffcc00" },
            shape: { type: "circle" },
            opacity: { value: 0.8 },
            size: { value: 3 },
            move: { enable: true, speed: 1.5 },
          },
        }}
        className="absolute top-0 left-0 w-full h-full z-0"
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Navbar */}
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 w-full bg-[var(--primary)] text-[var(--text)] shadow-md flex justify-between items-center p-4 z-[999]"
        >
          <motion.div whileHover={{ scale: 1.1 }} className="text-3xl font-bold text-[var(--accent)] cursor-pointer">
            <Link to="/">CodeCracker</Link>
          </motion.div>

          
  <div>
    {user ? (
      <motion.div className="flex items-center gap-4">
        <div
          onClick={() => navigate("/profile")}
          className="cursor-pointer"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-[var(--accent)]"
            />
          ) : (
            <FaUserCircle
              size={34}
              className="text-[var(--accent)] animate-pulse"
            />
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px #ff4d4d" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="px-4 py-2 border-2 border-[var(--highlight)] text-[var(--highlight)] hover:text-white hover:bg-[var(--highlight)] rounded-md transition-all cursor-pointer"
        >
          Logout
        </motion.button>
      </motion.div>
    ) : (
      <div className="flex gap-4">
        <motion.div whileHover={{ scale: 1.1 }}>
          <Link
            to="/login"
            className="btn border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white flex items-center gap-1"
          >
            <FaUserCircle className="animate-bounce" />
            Login
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }}>
          <Link
            to="/register"
            className="btn border-[var(--highlight)] text-[var(--highlight)] hover:bg-[var(--highlight)] hover:text-white flex items-center gap-1"
          >
            <FaUserCircle className="animate-bounce" />
            Signup
          </Link>
        </motion.div>
      </div>
    )}
  </div>
</motion.nav>


        {/* Main content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between min-h-screen w-full px-8 md:px-20 pt-20 gap-8">
          {/* Left: Heading and CTA */}
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--accent)]">Welcome to CodeCracker</h1>
            <p className="text-[var(--text-light)] text-lg">Track and improve your competitive programming skills.</p>
            <Link to="/dashboard" className="go-dashboard-btn bg-[var(--secondary)] border border-[var(--accent)] rounded-lg p-4 shadow-md hover:shadow-[var(--accent)] text-[var(--text)]">
              Go to Dashboard
            </Link>

            {/* 🔥 Quick Feature Cards */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "🔥 Popular Sheets", path: "/coding-sheets" },
                { title: "💼 Text Interviews", path: "/text-interview" },
                { title: "🚀 Interview Prep Hub", path: "/interview-prep" },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-[var(--secondary)] border border-[var(--accent)] rounded-lg p-4 shadow-md hover:shadow-[var(--accent)] transition-all cursor-pointer"
                  onClick={() => navigate(card.path)}
                >
                  <h3 className="font-bold text-[var(--accent)] text-lg">{card.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Analog Clock */}
          <div className="relative mt-8 md:mt-0">
            <div className="clock-container relative w-52 h-52 border-4 border-[var(--accent)] rounded-full bg-[var(--primary)]">
              <div className="hand hour" />
              <div className="hand minute" />
              <div className="hand second" />
              {[...Array(12)].map((_, i) => (
                <div key={i} className="clock-marker " style={{ transform: `rotate(${i * 30}deg)` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Floating FAQ Button */}
        <motion.button
          onClick={() => setFaqOpen(true)}
          whileHover={{ scale: 1.2, rotate: 10 }}
          className="fixed bottom-6 right-6 p-4 bg-[var(--highlight)] text-white rounded-full shadow-lg hover:bg-[var(--highlight)] transition-all z-20"
        >
          <FaQuestionCircle size={28} />
        </motion.button>

        {/* FAQ Modal */}
        {faqOpen && (
          <motion.div className="fixed bottom-16 right-6 bg-[var(--primary)] text-[var(--text)] p-5 rounded-lg shadow-lg w-80 z-20">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">FAQs</h3>
              <button onClick={() => setFaqOpen(false)} className="text-[var(--highlight)] hover:text-[var(--highlight)]">
                <FaTimes size={20} />
              </button>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {faqs.map((faq, index) => (
                <li key={index} className="border-b border-[var(--secondary)] pb-2">
                  <button className="text-left w-full font-semibold text-[var(--accent)] hover:underline" onClick={() => toggleAnswer(index)}>
                    {faq.question}
                  </button>
                  {openIndex === index && <p className="text-[var(--text)] mt-2">{faq.answer}</p>}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}
