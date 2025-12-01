import React, { useContext, useState } from "react";
import { QuizContext } from "../../context/QuizContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const QuizDisplay = () => {
  const { quiz } = useContext(QuizContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  if (!quiz) {
    toast.error("Quiz not available");
    return null;
  }

  const question = quiz.questions[currentQuestionIndex];

  const handleOptionClick = (option) => {
    if (showFeedback) return;

    const isCorrect =
      option.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    if (isCorrect) setScore((prev) => prev + 1);

    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    setSelectedOption(option);
    setShowFeedback(true);

    setTimeout(async () => {
      if (currentQuestionIndex + 1 < quiz.questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        try {
          const token = localStorage.getItem("token");
          await axios.post(
            `/api/quizzes/${quiz._id}/attempt`,
            { answers: newAnswers },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Quiz attempt saved!");
        } catch (err) {
          console.error("Failed to save quiz attempt:", err);
          toast.error("Failed to save quiz attempt.");
        }

        navigate("/score", {
          state: { score, total: quiz.questions.length },
        });
      }
    }, 1200);
  };

  const getOptionClass = (option) => {
    if (!showFeedback)
      return "border p-2 rounded hover:bg-gray-200 cursor-pointer hover:scale-105 transition-transform duration-300";

    if (option.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase())
      return "border p-2 rounded bg-green-500 text-white";

    if (selectedOption && option === selectedOption)
      return "border p-2 rounded bg-red-500 text-white";

    return "border p-2 rounded cursor-not-allowed text-gray-400";
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-[#f5f5f5] rounded-xl shadow-lg h-auto md:h-[350px] lg:h-[350px] flex flex-col justify-between">
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
