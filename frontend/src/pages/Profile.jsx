// import axios from "axios";
// import React, { useRef, useState, useEffect } from "react";
// import { 
//   FaUser, FaEnvelope, FaPhone, FaCode, FaCloudUploadAlt, 
//   FaCheckCircle, FaHome,  FaSignOutAlt 
// } from "react-icons/fa";
// import { MdDashboard } from "react-icons/md";
// import { useNavigate } from "react-router-dom";

// const Profile = () => {
//   const nameRef = useRef();
//   const emailRef = useRef();
//   const phoneRef = useRef();
//   const additionalEmailRef = useRef();
//   const leetcodeRef = useRef();
//   const gfgRef = useRef();
//   const codechefRef = useRef();
//   const navigate = useNavigate();

//   const [profileImage, setProfileImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [profileCompletion, setProfileCompletion] = useState(0);
//   const [user, setUser] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const { data } = await axios.get("http://localhost:5000/api/users/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setUser(data);
//         if (nameRef.current) nameRef.current.value = data.username;
//         if (emailRef.current) emailRef.current.value = data.email;
//         if (phoneRef.current) phoneRef.current.value = data.phone;
//         if (additionalEmailRef.current) additionalEmailRef.current.value = data.additionalEmail;
//         if (leetcodeRef.current) leetcodeRef.current.value = data.platforms.leetcode;
//         if (gfgRef.current) gfgRef.current.value = data.platforms.gfg;
//         if (codechefRef.current) codechefRef.current.value = data.platforms.codechef;

//         setProfileImage(data.profileImage);
//         setPreviewImage(data.profileImage);
//         calculateProfileCompletion(data);
//       } catch (error) {
//         console.error("Error fetching profile", error);
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   const calculateProfileCompletion = (user) => {
//     if (!user) return;
//     let filledFields = 0;
//     const totalFields = 6;
//     if (user.username) filledFields++;
//     if (user.email) filledFields++;
//     if (user.phone) filledFields++;
//     if (user.additionalEmail) filledFields++;
//     if (user.platforms.leetcode || user.platforms.gfg || user.platforms.codechef) filledFields++;
//     if (user.profileImage) filledFields++;
//     setProfileCompletion(Math.round((filledFields / totalFields) * 100));
//   };

//   const uploadImage = async (image) => {
//     setUploading(true);
//     const formData = new FormData();
//     formData.append("file", image);
//     formData.append("upload_preset", "mern_product");

//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME_CLOUDINARY}/image/upload`,
//         { method: "POST", body: formData }
//       );

//       const data = await response.json();
//       setProfileImage(data.secure_url);
//       setPreviewImage(data.secure_url);
//     } catch (error) {
//       console.error("Image upload failed", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         "http://localhost:5000/api/users/profile",
//         {
//           username: nameRef.current.value,
//           email: emailRef.current.value,
//           phone: phoneRef.current.value,
//           additionalEmail: additionalEmailRef.current.value,
//           profileImage,
//           leetcode: leetcodeRef.current.value,
//           gfg: gfgRef.current.value,
//           codechef: codechefRef.current.value,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("Profile updated successfully!");
//     } catch (error) {
//       console.error("Error updating profile", error);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div className="bg-gray-900 min-h-screen flex flex-col items-center text-white px-10">
      
//       {/* Navigation Bar */}
//       <div className="w-full flex justify-between items-center py-4 px-6 bg-gray-800 shadow-lg">
//         <h1 className="text-2xl font-bold">Profile Settings</h1>
//         <div className="flex space-x-4">
//           <button onClick={() => navigate("/")} className="flex items-center bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
//             <FaHome className="mr-2" /> Home
//           </button>
//           <button onClick={() => navigate("/dashboard")} className="flex items-center bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-all">
//             <MdDashboard className="mr-2" /> Dashboard
//           </button>
//           <button onClick={handleLogout} className="flex items-center bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-all">
//             <FaSignOutAlt className="mr-2" /> Logout
//           </button>
//         </div>
//       </div>

//       {/* Profile Content */}
//       <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-5xl flex flex-col items-center mt-6">
        
//         {/* Profile Image */}
//         <div className="relative w-32 h-32 mb-6">
//           {previewImage ? (
//             <img src={previewImage} alt="Profile" className="rounded-full w-full h-full object-cover border-4 border-blue-500" />
//           ) : (
//             <div className="w-full h-full bg-gray-700 rounded-full flex justify-center items-center text-gray-300">
//               <FaUser size={50} />
//             </div>
//           )}
//           <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer">
//             <FaCloudUploadAlt size={20} />
//             <input type="file" className="hidden" onChange={(e) => uploadImage(e.target.files[0])} accept="image/*" />
//           </label>
//         </div>

//         {/* Profile Completion Bar */}
//         <div className="w-full max-w-lg mb-4">
//           <p className="text-center text-sm">Profile Completion: {profileCompletion}%</p>
//           <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
//             <div className="h-2 rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${profileCompletion}%` }}></div>
//           </div>
//         </div>

//         {/* Profile Fields */}
//         <div className="grid grid-cols-2 gap-6 w-full">
//           {[
//             { label: "Full Name", ref: nameRef, icon: <FaUser /> },
//             { label: "Email", ref: emailRef, icon: <FaEnvelope /> },
//             { label: "Phone Number", ref: phoneRef, icon: <FaPhone /> },
//             { label: "Additional Email", ref: additionalEmailRef, icon: <FaEnvelope /> },
//             { label: "LeetCode Username", ref: leetcodeRef, icon: <FaCode /> },
//             { label: "GeeksforGeeks Username", ref: gfgRef, icon: <FaCode /> },
//             { label: "CodeChef Username", ref: codechefRef, icon: <FaCode /> },
//           ].map((field, index) => (
//             <div key={index} className="flex flex-col">
//               <label className="text-sm text-gray-300 mb-1">{field.label}</label>
//               <div className="flex items-center bg-gray-700 px-3 py-2 rounded">
//                 {field.icon}
//                 <input ref={field.ref} placeholder={field.label} className="bg-transparent w-full focus:outline-none ml-2" />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Save Button */}
//         <button onClick={handleSave} className="mt-6 w-1/2 bg-blue-500 py-2 rounded text-white font-bold flex items-center justify-center hover:bg-blue-600 transition-all">
//           <FaCheckCircle className="mr-2" /> Save Changes
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { 
  FaUser, FaEnvelope, FaPhone, FaCode, FaCloudUploadAlt, 
  FaCheckCircle, FaHome, FaSignOutAlt 
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const themes = [
  { label: 'Night Parse', value: 'night-parse' },
  { label: 'Byte Breeze', value: 'byte-breeze' },
  { label: 'Neon Terminal', value: 'neon-terminal' },
  { label: 'Bubble Code', value: 'bubble-code' },
  { label: 'Violet Verse', value: 'violet-verse' },
];

const Profile = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const additionalEmailRef = useRef();
  const leetcodeRef = useRef();
  const gfgRef = useRef();
  const codechefRef = useRef();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('theme') || 'dark-cyber');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data);
        if (nameRef.current) nameRef.current.value = data.username;
        if (emailRef.current) emailRef.current.value = data.email;
        if (phoneRef.current) phoneRef.current.value = data.phone;
        if (additionalEmailRef.current) additionalEmailRef.current.value = data.additionalEmail;
        if (leetcodeRef.current) leetcodeRef.current.value = data.platforms.leetcode;
        if (gfgRef.current) gfgRef.current.value = data.platforms.gfg;
        if (codechefRef.current) codechefRef.current.value = data.platforms.codechef;

        setProfileImage(data.profileImage);
        setPreviewImage(data.profileImage);
        calculateProfileCompletion(data);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('theme', selectedTheme);  // Save theme to local storage
  }, [selectedTheme]);
  

  const calculateProfileCompletion = (user) => {
    if (!user) return;
    let filledFields = 0;
    const totalFields = 6;
    if (user.username) filledFields++;
    if (user.email) filledFields++;
    if (user.phone) filledFields++;
    if (user.additionalEmail) filledFields++;
    if (user.platforms.leetcode || user.platforms.gfg || user.platforms.codechef) filledFields++;
    if (user.profileImage) filledFields++;
    setProfileCompletion(Math.round((filledFields / totalFields) * 100));
  };

  const uploadImage = async (image) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "mern_product");
 const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await response.json();
      setProfileImage(data.secure_url);
      setPreviewImage(data.secure_url);
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          username: nameRef.current.value,
          email: emailRef.current.value,
          phone: phoneRef.current.value,
          additionalEmail: additionalEmailRef.current.value,
          profileImage,
          leetcode: leetcodeRef.current.value,
          gfg: gfgRef.current.value,
          codechef: codechefRef.current.value,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-primary min-h-screen flex flex-col items-center text-text px-10">
      
      {/* Navigation Bar */}
      <div className="w-full flex justify-between items-center py-4 px-6 bg-secondary shadow-lg">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <div className="flex space-x-4">
          <button onClick={() => navigate("/")} className="flex items-center bg-accent px-4 py-2 rounded-lg hover:bg-highlight transition-all">
            <FaHome className="mr-2" /> Home
          </button>
          <button onClick={() => navigate("/dashboard")} className="flex items-center bg-highlight px-4 py-2 rounded-lg hover:bg-accent transition-all">
            <MdDashboard className="mr-2" /> Dashboard
          </button>
          <button onClick={handleLogout} className="flex items-center bg-accent px-4 py-2 rounded-lg hover:bg-highlight transition-all">
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-secondary p-8 rounded-lg shadow-lg w-full max-w-5xl flex flex-col items-center mt-6">
        
        {/* Profile Image */}
        <div className="relative w-32 h-32 mb-6">
          {previewImage ? (
            <img src={previewImage} alt="Profile" className="rounded-full w-full h-full object-cover border-4 border-accent" />
          ) : (
            <div className="w-full h-full bg-gray-700 rounded-full flex justify-center items-center text-gray-300">
              <FaUser size={50} />
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-accent p-2 rounded-full cursor-pointer">
            <FaCloudUploadAlt size={20} />
            <input type="file" className="hidden" onChange={(e) => uploadImage(e.target.files[0])} accept="image/*" />
          </label>
        </div>

        {/* Profile Completion Bar */}
        <div className="w-full max-w-lg mb-4">
          <p className="text-center text-sm">Profile Completion: {profileCompletion}%</p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div className="h-2 rounded-full bg-accent transition-all duration-500" style={{ width: `${profileCompletion}%` }}></div>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="w-full max-w-lg mb-6">
          <label className="text-sm text-gray-300 mb-2 block text-center">Select Theme</label>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="w-full p-2 rounded bg-secondary text-text border border-gray-600"
          >
            {themes.map((theme) => (
              <option key={theme.value} value={theme.value}>
                {theme.label}
              </option>
            ))}
          </select>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-2 gap-6 w-full">
          {[
            { label: "Full Name", ref: nameRef, icon: <FaUser /> },
            { label: "Email", ref: emailRef, icon: <FaEnvelope /> },
            { label: "Phone Number", ref: phoneRef, icon: <FaPhone /> },
            { label: "Additional Email", ref: additionalEmailRef, icon: <FaEnvelope /> },
            { label: "LeetCode Username", ref: leetcodeRef, icon: <FaCode /> },
            { label: "GeeksforGeeks Username", ref: gfgRef, icon: <FaCode /> },
            { label: "CodeChef Username", ref: codechefRef, icon: <FaCode /> },
          ].map((field, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-sm text-gray-300 mb-1">{field.label}</label>
              <div className="flex items-center bg-gray-700 px-3 py-2 rounded">
                {field.icon}
                <input ref={field.ref} placeholder={field.label} className="bg-transparent w-full focus:outline-none ml-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <button onClick={handleSave} className="mt-6 w-1/2 bg-accent py-2 rounded text-white font-bold flex items-center justify-center hover:bg-highlight transition-all">
          <FaCheckCircle className="mr-2" /> Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
