import React, { useContext, useState } from "react";
import { QuizContext } from "../../context/QuizContext";
import { toast } from "react-toastify";

const QuizDisplay = () => {
  const { quiz } = useContext(QuizContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!quiz) {
    toast.error("No quiz generated yet");
    return null;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const correctAnswer = currentQuestion.correct; // correct answer from API

  const handleOptionClick = (option) => {
    if (!showFeedback) {
      setSelectedOption(option);
      setShowFeedback(true); // show feedback immediately
    }
  };

  const handleNext = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  const handlePrev = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h2 className="text-xl font-bold mb-4">
        Question {currentQuestionIndex + 1} of {quiz.questions.length}
      </h2>

      <p className="mb-4">{currentQuestion.question}</p>

      <ul className="mb-4 w-full max-w-md">
        {currentQuestion.options.map((option, index) => {
          let bgClass = "bg-white"; // default background

          if (showFeedback) {
            if (option === selectedOption) {
              // selected option
              bgClass =
                selectedOption === correctAnswer
                  ? "bg-green-500 text-white" // correct selection → green
                  : "bg-red-500 text-white"; // wrong selection → red
            } else if (option === correctAnswer && selectedOption !== correctAnswer) {
              // correct option (if user selected wrong)
              bgClass = "bg-green-500 text-white";
            }
          }

          return (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`p-2 mb-2 border rounded cursor-pointer ${bgClass}`}
            >
              {option}
            </li>
          );
        })}
      </ul>

      <div className="flex gap-2">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!showFeedback || currentQuestionIndex === quiz.questions.length - 1}
          className="px-4 py-2 bg-teal-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizDisplay;
