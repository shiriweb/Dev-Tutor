import React, { useContext, useState } from "react";
import { QuizContext } from "../../context/QuizContext";

const QuizDisplay = () => {
  const { quiz } = useContext(QuizContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!quiz || !quiz.questions || quiz.questions.length === 0)
    return <p>No quiz available</p>;

  const question = quiz.questions[currentQuestionIndex];

  const handleOptionClick = (option) => {
    if (showFeedback) return; // Prevent multiple clicks
    setSelectedOption(option);
    setShowFeedback(true);

    // Move to next question after 1.5 seconds
    setTimeout(() => {
      setSelectedOption(null);
      setShowFeedback(false);
      if (currentQuestionIndex + 1 < quiz.questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        alert("Quiz completed!");
        setCurrentQuestionIndex(0); // optional reset
      }
    }, 1500);
  };

  const getOptionClass = (option) => {
    if (!showFeedback)
      return "border p-2 rounded hover:bg-gray-200 cursor-pointer";
    if (option === question.correctAnswer)
      return "border p-2 rounded bg-green-500 text-white";
    if (option === selectedOption && selectedOption !== question.correctAnswer)
      return "border p-2 rounded bg-red-500 text-white";
    return "border p-2 rounded cursor-not-allowed";
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">{question.question}</h2>
      <div className="flex flex-col gap-2">
        {question.options.map((option, idx) => (
          <div
            key={idx}
            className={getOptionClass(option)}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizDisplay;
