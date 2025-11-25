import React, { useContext, useState } from "react";
import { QuizContext } from "../../context/QuizContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const QuizDisplay = () => {
  const { quiz } = useContext(QuizContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  if (!quiz) {
    toast.error("Quiz not available");
    return null;
  }

  const question = quiz.questions[currentQuestionIndex];

  const handleOptionClick = (option) => {
    if (showFeedback) return;

    setSelectedOption(option);
    setShowFeedback(true);

    if (option === question.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    // Wait 1.5 seconds to show feedback
    setTimeout(() => {
      setShowFeedback(false);

      // Move to next question or show score
      if (currentQuestionIndex + 1 < quiz.questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        navigate("/score", {
          state: {
            score: option === question.correctAnswer ? score + 1 : score,
            total: quiz.questions.length,
          },
        });
      }
    }, 1500);
  };

  const getOptionClass = (option) => {
    if (!showFeedback)
      return "border p-2 rounded hover:bg-gray-200 cursor-pointer";

    if (option === question.correctAnswer)
      return "border p-2 rounded bg-green-500 text-white";

    if (option === selectedOption && option !== question.correctAnswer)
      return "border p-2 rounded bg-red-500 text-white";

    return "border p-2 rounded cursor-not-allowed";
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-[#f5f5f5] rounded-xl shadow-lg">
      <h3 className="text-sm font-medium text-gray-600 mb-2">
        Question {currentQuestionIndex + 1} of {quiz.questions.length}
      </h3>
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
