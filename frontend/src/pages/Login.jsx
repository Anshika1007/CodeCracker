import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("storage"));

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--primary)] text-[var(--text)] flex flex-col justify-center items-center overflow-hidden">
     
  
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="backdrop-blur-lg bg-[color:var(--secondary)]/80 shadow-2xl rounded-2xl p-10 w-full max-w-xl relative z-10 border border-[var(--accent)]/30"
      >
        <h2 className="text-4xl font-bold text-center mb-8 text-[var(--accent)]">
          Login to <span className="text-[var(--highlight)]">CodeCracker</span>
        </h2>
  
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 bg-[color:var(--primary)] text-[var(--text)] placeholder-gray-400 border border-[var(--accent)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--highlight)] transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
  
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="p-3 bg-[color:var(--primary)] text-[var(--text)] placeholder-gray-400 border border-[var(--accent)] rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[var(--highlight)] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-[var(--accent)] hover:text-[var(--highlight)] transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
  
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg shadow-md hover:bg-[var(--highlight)] transition-all duration-300 font-semibold"
            onClick={handleLogin}
          >
            Login
          </motion.button>
        </div>
  
        <p className="mt-6 text-center text-sm text-[var(--text)]/70">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-[var(--highlight)] hover:underline transition"
          >
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
  
  
}
