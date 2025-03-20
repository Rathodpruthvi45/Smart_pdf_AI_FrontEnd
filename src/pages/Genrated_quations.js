import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Genrated_quations.css';

const Genrated_quations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // Changed to use user instead of authToken
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if questions are passed through location state first
    if (location.state?.questions) {
      setQuestions(location.state.questions);
      setLoading(false);
      return;
    }

    // If no questions in state, fetch them
    const fetchQuestions = async () => {
      try {
        if (!user) {
          throw new Error('Please log in to view questions');
        }

        const response = await fetch('http://localhost:8000/api/v1/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({
            pdf_id: location.state?.pdfId,
            question_types: location.state?.questionType
          }),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }

        const data = await response.json();
        setQuestions(data.questions);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('log in')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [user, location.state, navigate]);

  const handleOptionSelect = (questionIndex, optionValue) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionValue
    });
  };

  if (loading) {
    return <div className="questions-container">Loading questions...</div>;
  }

  if (error) {
    return <div className="questions-container">Error: {error}</div>;
  }

  return (
    <div className="questions-container">
      <h2>Generated Questions</h2>
      <div className="questions-list">
        {questions.map((question, index) => (
          <div key={index} className="question-card">
            <h3>Question {index + 1}</h3>
            <p className="question-text">{question.question}</p>
            {question.options && (
              <div className="options-list">
                {question.options.map((option, optIndex) => (
                  <label 
                    key={optIndex} 
                    className="option"
                    htmlFor={`option-${index}-${optIndex}`}
                  >
                    <input
                      type="radio"
                      id={`option-${index}-${optIndex}`}
                      name={`question-${index}`}
                      value={option}
                      checked={selectedAnswers[index] === option}
                      onChange={() => handleOptionSelect(index, option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
            {question.answer && (
              <div className="answer-section">
                <button 
                  className="show-answer-btn"
                  onClick={(e) => {
                    const answerDiv = e.currentTarget.nextElementSibling;
                    if (answerDiv) {
                      answerDiv.classList.toggle('show');
                    }
                  }}
                >
                  Show Answer
                </button>
                <div className="answer">
                  <p><strong>Answer:</strong> {question.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Genrated_quations;
