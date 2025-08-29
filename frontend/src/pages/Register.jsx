import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async () => {
    if (!isValidPassword(password)) {
      setError(
        "Password must be 8-12 characters long and include uppercase, lowercase, a number, and a symbol."
      );
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });
      localStorage.setItem("username",username)
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[var(--primary)] text-[var(--text)]">
      {/* Background Particles */}
      <Particles
        options={{
          fullScreen: { enable: true },
          particles: {
            number: { value: 80 },
            color: { value: "var(--highlight)" },
            shape: { type: "circle" },
            opacity: { value: 0.8 },
            size: { value: 3 },
            move: { enable: true, speed: 1.5 },
          },
        }}
        init={async (main) => await loadFull(main)}
        className="absolute inset-0 z-0"
      />
  
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-[color:var(--secondary)]/80 border border-[var(--accent)]/30 shadow-xl rounded-lg p-8 w-full max-w-md z-10 backdrop-blur-lg"
      >
        <h2 className="text-3xl font-semibold text-center text-[var(--accent)] mb-6">
          Create an Account
        </h2>
  
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Username"
            className="p-3 bg-[color:var(--primary)] border border-[var(--accent)] rounded-lg mb-4 text-[var(--text)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="p-3 bg-[color:var(--primary)] border border-[var(--accent)] rounded-lg mb-4 text-[var(--text)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
  
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="p-3 bg-[color:var(--primary)] border border-[var(--accent)] rounded-lg w-full text-[var(--text)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
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
  
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-red-500 text-sm mb-4"
            >
              {error}
            </motion.p>
          )}
  
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg shadow-md hover:bg-[var(--highlight)] transition w-full"
            onClick={handleRegister}
          >
            Register
          </motion.button>
        </div>
  
        <p className="mt-4 text-center text-[var(--text)]/70">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[var(--highlight)] hover:underline transition"
          >
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
  
}
