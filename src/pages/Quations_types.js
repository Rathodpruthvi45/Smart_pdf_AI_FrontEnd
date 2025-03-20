import React from 'react';
import { useNavigate } from 'react-router-dom';
// import '../styles/Genrated_quations.css';
import '../styles/Quations_types.css';

const Quations_types = () => {
  const navigate = useNavigate();

  const questionTypes = [
    {
      title: "Multiple Choice Questions (MCQ)",
      description: "Generate questions with multiple answer options",
      icon: "📝",
    },
    {
      title: "Short Answer Questions", 
      description: "Generate questions requiring brief responses",
      icon: "✏️",
    },
    {
      title: "Descriptive Questions",
      description: "Generate questions requiring detailed explanations",
      icon: "📄",
    },
    {
      title: "True/False Questions",
      description: "Generate questions with true or false answers",
      icon: "✓",
    }
  ];

  const handleTypeSelect = (type) => {
    // Navigate to question generation page with selected type
    navigate('/genrated-quations', { state: { questionType: type } });
  };

  return (
    <div className="questions-container">
      <h2>Select Question Type</h2>
      <div className="questions-list">
        {questionTypes.map((type, index) => (
          <div 
            key={index} 
            className="question-card"
            onClick={() => handleTypeSelect(type.title)}
            style={{cursor: 'pointer'}}
          >
            <h3>
              <span style={{marginRight: '10px'}}>{type.icon}</span>
              {type.title}
            </h3>
            <p className="question-text">{type.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quations_types;
