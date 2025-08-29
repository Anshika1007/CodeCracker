// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";
// import Settings from "./pages/Settings";
// import ProtectedRoute from "./components/ProtectedRoute";
//  // ✅ Import ProtectedRoute
 

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-900">
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
        
//         {/* 🔒 Protected Routes: Accessible only if logged in */}
//         <Route 
//           path="/dashboard" 
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/profile" 
//           element={
//             <ProtectedRoute>
//               <Profile />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/settings" 
//           element={
//             <ProtectedRoute>
//               <Settings />
//             </ProtectedRoute>
//           } 
//         />
//       </Routes>
//     </div>
//   );
// }

// export default App;
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import CodingSheets from "./components/CodingSheets";
import CodingSheetPage from "./pages/CodingSheetPage"; // ✅ Page for sheet details
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Protect routes
import ResumeRoadmaps from "./pages/ResumeRoadmaps";
import MyStats from "./pages/MyStats";
import CPTrivia from "./pages/CPTrivia";
import InterviewPrep from "./pages/InterviewPrep";
import ResumeBuilder from "./pages/ResumeBuilder";
import TextInterview from "./pages/TextInterview";
import { useEffect } from 'react';
import './App.css';


function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark-cyber';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 🔒 Protected Routes: Accessible only if logged in */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        
        {/* ✅ Route for all coding sheets */}
        <Route 
          path="/coding-sheets" 
          element={
            <ProtectedRoute>
              <CodingSheets />
            </ProtectedRoute>
          } 
        />

        {/* ✅ Route for specific Coding Sheet details */}
        <Route 
          path="/coding-sheets/:sheetId"  // Use :sheetId to pass ID dynamically
          element={
            <ProtectedRoute>
              <CodingSheetPage />  {/* Ensure this fetches coding sheet details */}
            </ProtectedRoute>
          } 
        />
        
      
      <Route path="/resume-roadmaps" element={<ResumeRoadmaps />} />
      <Route path="/my-stats" element={<MyStats />} />
      <Route path="/cp-trivia" element={<CPTrivia />} />
      <Route path="/interview-prep" element={<InterviewPrep/>}/>
      <Route path="/my-stats" element={<MyStats />} />
      <Route path="/resume-builder" element={<ResumeBuilder />} />
      <Route path="/text-interview" element={<TextInterview />} />
     

      </Routes>
    </div>
  );
}

export default App;