import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ResumeRoadmaps() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  const resumeTemplates = [
    {
      id: 1,
      name: "Professional Template",
      description: "Perfect for corporate and technical roles.",
      image: "/assets/template1-preview.jpg",
      editUrl: "https://www.canva.com/resumes/templates/professional/"
    },
    {
      id: 2,
      name: "Creative Template",
      description: "Ideal for design and creative positions.",
      image: "/assets/template2-preview.jpg",
      editUrl: "https://www.canva.com/resumes/templates/creative/"
    },
    {
      id: 3,
      name: "Modern Template",
      description: "Clean and contemporary design for all roles.",
      image: "/assets/template3-preview.jpg",
      editUrl: "https://www.canva.com/resumes/templates/modern/"
    }
  ];

  const roadmaps = [
    {
      id: 1,
      name: "Frontend Development",
      description: "HTML, CSS, JavaScript, React, and more.",
      url: "https://roadmap.sh/frontend"
    },
    {
      id: 2,
      name: "Backend Development",
      description: "Node.js, Python, Databases, and APIs.",
      url: "https://roadmap.sh/backend"
    },
    {
      id: 3,
      name: "DevOps Engineer",
      description: "CI/CD, Docker, Kubernetes, and Cloud Services.",
      url: "https://roadmap.sh/devops"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        backgroundColor: 'var(--primary)',
        color: 'var(--text)',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {/* Header Section */}
      <div
        style={{
          backgroundColor: 'var(--secondary)',
          borderBottom: '1px solid var(--text)',
          padding: '1.5rem 1rem',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 style={{ color: 'var(--accent)', textAlign: 'center' }} className="text-3xl md:text-4xl font-bold">
            Free Resume Templates, Builder & Roadmaps
          </h2>
        </div>
      </div>
  
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Resume Templates Section */}
          <div className="w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                backgroundColor: 'var(--secondary)',
                borderRadius: '1rem',
                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                padding: '1.5rem',
                height: '100%',
              }}
            >
              <h3
                style={{ color: 'var(--accent)' }}
                className="text-2xl font-bold mb-6 flex items-center"
              >
                <span
                  style={{ backgroundColor: 'var(--accent)' }}
                  className="p-2 rounded-full mr-3 flex-shrink-0 text-white"
                >
                  📄
                </span>
                Resume Templates
              </h3>
  
              {selectedTemplate ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 style={{ color: 'var(--accent)' }} className="text-xl font-bold">
                      {selectedTemplate.name}
                    </h3>
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      style={{ color: 'var(--text)' }}
                      className="hover:opacity-80"
                    >
                      ← Back
                    </button>
                  </div>
                  <div className="aspect-w-8 aspect-h-11 bg-white rounded-lg mb-6 overflow-hidden">
                    <img
                      src={selectedTemplate.image}
                      alt={selectedTemplate.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <a
                    href={selectedTemplate.editUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: 'var(--highlight)',
                      color: 'white',
                    }}
                    className="w-full py-3 rounded-lg text-center font-medium hover:opacity-90 transition-colors block"
                  >
                    Edit This Template
                  </a>
                </div>
              ) : (
                <>
                  <p className="mb-6" style={{ color: 'var(--text)' }}>
                    Select a template to preview and customize for your next job application.
                  </p>
                  <div className="space-y-4">
                    {resumeTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        style={{
                          backgroundColor: 'var(--primary)',
                          color: 'var(--text)',
                        }}
                        className="rounded-lg p-4 cursor-pointer hover:opacity-90 transition-all"
                      >
                        <h4 className="font-semibold text-lg mb-1">{template.name}</h4>
                        <p>{template.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>
  
          {/* Career Roadmaps Section */}
          <div className="w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                backgroundColor: 'var(--secondary)',
                borderRadius: '1rem',
                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                padding: '1.5rem',
                height: '100%',
              }}
            >
              <h3
                style={{ color: 'var(--highlight)' }}
                className="text-2xl font-bold mb-6 flex items-center"
              >
                <span
                  style={{ backgroundColor: 'var(--highlight)' }}
                  className="p-2 rounded-full mr-3 flex-shrink-0 text-white"
                >
                  🚀
                </span>
                Career Roadmaps
              </h3>
  
              {selectedRoadmap ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 style={{ color: 'var(--highlight)' }} className="text-xl font-bold">
                      {selectedRoadmap.name}
                    </h3>
                    <button
                      onClick={() => setSelectedRoadmap(null)}
                      style={{ color: 'var(--text)' }}
                      className="hover:opacity-80"
                    >
                      ← Back
                    </button>
                  </div>
                  <a
                    href={selectedRoadmap.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'white',
                    }}
                    className="block w-full py-3 rounded-lg text-center font-medium hover:opacity-90 transition-colors"
                  >
                    View Interactive Roadmap
                  </a>
                </div>
              ) : (
                <>
                  <p className="mb-6" style={{ color: 'var(--text)' }}>
                    Access interactive roadmaps to guide your learning journey and develop in-demand skills.
                  </p>
                  <div className="space-y-4">
                    {roadmaps.map((roadmap) => (
                      <div
                        key={roadmap.id}
                        onClick={() => setSelectedRoadmap(roadmap)}
                        style={{
                          backgroundColor: 'var(--primary)',
                          color: 'var(--text)',
                        }}
                        className="rounded-lg p-4 cursor-pointer hover:opacity-90 transition-all"
                      >
                        <h4 className="font-semibold text-lg mb-1">{roadmap.name}</h4>
                        <p>{roadmap.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
  
        {/* Resume Builder CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/resume-builder"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
            }}
            className="inline-block text-lg font-semibold py-3 px-6 rounded-lg shadow-lg hover:opacity-90 transition"
          >
            🚀 Build Your Resume Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
  
}
