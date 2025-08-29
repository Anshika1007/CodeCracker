import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

export default function PdfEditor() {
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPdfFile(reader.result);
      };
    }
  };

  return (
    <div className="p-5 text-center">
      <h2 className="text-2xl font-bold mb-4">Upload & Edit PDF Resume</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-3" />
      {pdfFile && (
        <div className="border p-3">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.14.305/build/pdf.worker.min.js`}>
            <Viewer fileUrl={pdfFile} />
          </Worker>
        </div>
      )}
 </div>
);
}