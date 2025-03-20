import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/QuestionTypes.css";

function QuestionTypes() {
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedTypes, setSelectedTypes] = useState([
    "multiple_choice",
    "descriptive",
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const pdfId = location.state?.pdfId;

  const questionTypes = [
    { id: "multiple_choice", label: "Multiple Choice" },
    { id: "descriptive", label: "Descriptive" },
  ];

  const handleTypeToggle = (typeId) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((t) => t !== typeId)
        : [...prev, typeId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfId) {
      setError("No PDF ID found. Please upload a PDF first.");
      return;
    }

    if (!user) {
      setError("Please log in to generate questions.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      // Log the request data for debugging
      const requestData = {
        pdf_id: pdfId,
        num_questions: parseInt(numQuestions),
        question_types: selectedTypes,
      };
      console.log("Sending request data:", requestData);
      const response = await axios.post(
        "http://localhost:8000/api/v1/generate-questions",
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Success response:", response.data);
      navigate("/genrated-quations", {
        state: { questions: response.data.questions },
      });
    } catch (err) {
      console.error("Error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        navigate("/login");
      } else {
        setError(err.response?.data?.detail || "Failed to generate questions");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="question-types-container">
      <h2>Generate Questions</h2>
      <form onSubmit={handleSubmit} className="question-types-form">
        <div className="form-group">
          <label htmlFor="numQuestions">Number of Questions:</label>
          <input
            type="number"
            id="numQuestions"
            min="1"
            max="20"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label>Question Types:</label>
          <div className="question-types-grid">
            {questionTypes.map((type) => (
              <div key={type.id} className="question-type-option">
                <input
                  type="checkbox"
                  id={type.id}
                  checked={selectedTypes.includes(type.id)}
                  onChange={() => handleTypeToggle(type.id)}
                />
                <label htmlFor={type.id}>{type.label}</label>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="generate-button"
          disabled={loading || selectedTypes.length === 0}
        >
          {loading ? "Generating Questions..." : "Generate Questions"}
        </button>
      </form>
    </div>
  );
}

export default QuestionTypes;
