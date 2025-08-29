import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import statsRoutes from './routes/statsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import codingSheetRoutes from './routes/sheetsRoutes.js'
import userRoutes from './routes/userRoutes.js'
import triviaRoutes from './routes/triviaRoutes.js';
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import textInterviewRoutes from "./routes/textInterviewRoutes.js";


dotenv.config();

const app = express();
const server = createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Ensure this matches your frontend URL
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend origin
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Allow cookies and authentication headers
  })
);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/coding-sheets',codingSheetRoutes)
app.use('/api/users', userRoutes);
app.use("/api", triviaRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/interview-questions",interviewRoutes)
app.use("/api/resumes", resumeRoutes);
app.use("/api/text-interview", textInterviewRoutes);



// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Example: Emit real-time stats update
  socket.on('requestStatsUpdate', () => {
    console.log('Stats update requested');
    io.emit('updateStats', { message: 'New stats available' });
  });
});

// Use `server.listen()` instead of `app.listen()`
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
