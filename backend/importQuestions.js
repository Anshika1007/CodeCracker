import mongoose from "mongoose";
import fs from "fs";
import InterviewQuestion from "./models/interviewQuestions.js"; // Your Mongoose model

// MongoDB Connection
const MONGO_URI = "mongodb+srv://aasthajuly2004:codecracker@codecracker.qlkig.mongodb.net/?retryWrites=true&w=majority&appName=CodeCracker"; // Replace with your actual MongoDB Atlas connection string"
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Function to determine topic based on problem name
const getTopic = (problemName) => {
  const keywords = {
    "Dynamic Programming": ["subsequence", "substring", "dp", "dynamic programming"],
    "Graph": ["shortest path", "graph", "dijkstra", "bfs", "dfs"],
    "Linked List": ["linked list", "cycle", "reverse list"],
    "Arrays": ["subarray", "maximum subarray", "array", "two sum"],
    "Trees": ["binary tree", "bst", "tree traversal"]
  };

  for (const [topic, words] of Object.entries(keywords)) {
    if (words.some(word => problemName.toLowerCase().includes(word))) {
      return topic;
    }
  }
  return "Miscellaneous"; // Default if no match
};

// Function to determine difficulty based on occurrences
const getDifficulty = (occurrences) => {
  if (occurrences > 20) return "Easy";
  if (occurrences > 10) return "Medium";
  return "Hard";
};

// Function to insert JSON data
const importQuestions = async (filePath, companyName) => {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const questions = JSON.parse(data);
  
      const formattedQuestions = questions.map(q => {
        if (!q.problem_name || !q.problem_link || q.num_occur === undefined) {
          console.error("❌ Skipping invalid question:", q);
          return null; // Skip invalid entries
        }
  
        return {
          company: companyName,
          topic: getTopic(q.problem_name), // Updated key
          question: q.problem_name, // Updated key
          difficulty: getDifficulty(q.num_occur), // Updated key
          link: q.problem_link // Updated key
        };
      }).filter(q => q !== null); // Remove null entries
  
      await InterviewQuestion.insertMany(formattedQuestions);
      console.log(` Successfully inserted data from ${filePath}`);
    } catch (error) {
      console.error(`❌ Error inserting data from ${filePath}:`, error);
    }
  };
  

// Run the function for multiple JSON files
const runImport = async () => {
  await importQuestions("./data/Google.json", "Google");
  await importQuestions("./data/Amazon.json", "Amazon");
  await importQuestions("./data/Microsoft.json", "Microsoft");
  await importQuestions("./data/Netflix.json", "Netflix");
  await importQuestions("./data/Facebook.json", "Facebook");

  mongoose.connection.close(); // Close connection after inserting
};

runImport();