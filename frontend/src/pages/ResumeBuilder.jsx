import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useReactToPrint } from "react-to-print";

export default function ResumeBuilder() {
  const resumeRef = useRef();

  const [resumeData, setResumeData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
    education: [],
    experience: [],
    projects: [],
    technicalSkills: "",
    certifications: "",
    softSkills: "",
    hobbies: "",
  });

  const handleChange = (e, section, index, field) => {
    const { name, value } = e.target;
    if (section) {
      const updatedSection = [...resumeData[section]];
      updatedSection[index][field] = value;
      setResumeData({ ...resumeData, [section]: updatedSection });
    } else {
      setResumeData({ ...resumeData, [name]: value });
    }
  };

  const addField = (section, newEntry) => {
    setResumeData((prev) => ({ ...prev, [section]: [...prev[section], newEntry] }));
  };

  const deleteField = (section, index) => {
    setResumeData((prev) => {
      const updatedSection = [...prev[section]];
      updatedSection.splice(index, 1);
      return { ...prev, [section]: updatedSection };
    });
  };

  const handleDownloadPDF = useReactToPrint({ content: () => resumeRef.current });

  return (
    <motion.div className="min-h-screen p-8" style={{ backgroundColor: 'var(--primary)', color: 'var(--text)' }}>
      <h2 className="text-4xl font-bold text-center mb-6" style={{ color: 'var(--highlight)' }}>
        Professional Resume Builder
      </h2>
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Resume Form */}
        <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--secondary)' }}>
          <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>
            Fill Your Resume Details
          </h3>
  
          <div className="space-y-2">
            <input name="fullName" value={resumeData.fullName} onChange={handleChange} placeholder="Full Name" className="p-3 w-full rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--text)' }} />
            <input name="email" value={resumeData.email} onChange={handleChange} placeholder="Email" className="p-3 w-full rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--text)' }} />
            <input name="phone" value={resumeData.phone} onChange={handleChange} placeholder="Phone Number" className="p-3 w-full rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--text)' }} />
            <input name="linkedin" value={resumeData.linkedin} onChange={handleChange} placeholder="LinkedIn Profile" className="p-3 w-full rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--text)' }} />
            <input name="github" value={resumeData.github} onChange={handleChange} placeholder="GitHub Profile" className="p-3 w-full rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--text)' }} />
            <input name="portfolio" value={resumeData.portfolio} onChange={handleChange} placeholder="Portfolio Website" className="p-3 w-full rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--text)' }} />
          </div>
  
          <textarea name="summary" value={resumeData.summary} onChange={handleChange} placeholder="Short Summary / About Me" className="p-3 w-full mt-4 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--text)' }}></textarea>
  
          <textarea name="technicalSkills" value={resumeData.technicalSkills} onChange={handleChange} placeholder="Technical Skills (comma separated)" className="p-3 w-full mt-4 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--text)' }}></textarea>
          <textarea name="certifications" value={resumeData.certifications} onChange={handleChange} placeholder="Certifications (comma separated)" className="p-3 w-full mt-4 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--text)' }}></textarea>
          <textarea name="softSkills" value={resumeData.softSkills} onChange={handleChange} placeholder="Soft Skills (comma separated)" className="p-3 w-full mt-4 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--text)' }}></textarea>
          <textarea name="hobbies" value={resumeData.hobbies} onChange={handleChange} placeholder="Hobbies (comma separated)" className="p-3 w-full mt-4 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--text)' }}></textarea>
  
          <button onClick={handleDownloadPDF} className="mt-6 px-6 py-2 rounded-lg w-full hover:opacity-90" style={{ backgroundColor: 'var(--highlight)', color: 'var(--primary)' }}>
            📥 Download as PDF
          </button>
        </div>
  
        {/* Right: Resume Live Preview */}
        <div ref={resumeRef} className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--text)' }}>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>{resumeData.fullName}</h2>
          <p>{resumeData.email} | {resumeData.phone}</p>
          {resumeData.linkedin && <p><a href={resumeData.linkedin} style={{ color: 'var(--accent)' }} className="hover:underline">LinkedIn</a></p>}
          {resumeData.github && <p><a href={resumeData.github} style={{ color: 'var(--accent)' }} className="hover:underline">GitHub</a></p>}
          {resumeData.portfolio && <p><a href={resumeData.portfolio} style={{ color: 'var(--accent)' }} className="hover:underline">Portfolio</a></p>}
  
          {resumeData.technicalSkills && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Technical Skills</h3>
              <p>{resumeData.technicalSkills}</p>
            </div>
          )}
  
          {resumeData.certifications && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Certifications</h3>
              <p>{resumeData.certifications}</p>
            </div>
          )}
  
          {resumeData.softSkills && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Soft Skills</h3>
              <p>{resumeData.softSkills}</p>
            </div>
          )}
  
          {resumeData.hobbies && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>Hobbies</h3>
              <p>{resumeData.hobbies}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
  
}
