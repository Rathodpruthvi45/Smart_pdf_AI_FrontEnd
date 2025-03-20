import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Pdf_upload.css";

function Pdf_upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authToken } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please select a valid PDF file");
      setFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/api/v1/upload-pdf", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          // Remove Content-Type header to let browser set it with boundary for FormData
        },
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(
          errorData.detail || errorData.message || "Failed to upload PDF"
        );
      }

      const data = await response.json();
      console.log("Success response:", data);
      // Redirect to question types selection page with pdf_id
      navigate("/question-types", { state: { pdfId: data.pdf_id } });
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Error uploading PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pdf-upload-container">
      <h2>Upload PDF Document</h2>
      <p>Select a PDF file to analyze with our AI</p>

      <form onSubmit={handleUpload} className="pdf-upload-form">
        <div className="file-input-container">
          <label htmlFor="pdf-upload" className="file-label">
            Click or drag to upload PDF
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="file-input"
          />
          {file && <p className="selected-file">Selected: {file.name}</p>}
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="upload-button"
          disabled={loading || !file}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Uploading...
            </>
          ) : (
            "Upload PDF"
          )}
        </button>
      </form>
    </div>
  );
}

export default Pdf_upload;
