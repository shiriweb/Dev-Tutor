import React, { useContext, useState, useEffect } from "react";
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

  // Show error if quiz not available
  useEffect(() => {
    if (!quiz) {
      toast.error("Quiz not available");
    }
  }, [quiz]);

  // Reset state whenever a new quiz loads
  useEffect(() => {
    if (quiz) {
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowFeedback(false);
      setScore(0);
      setAnswers([]);
    }
  }, [quiz?._id]);

  if (!quiz) return null;

  const question = quiz.questions[currentQuestionIndex];

  const handleOptionClick = (option) => {
    if (showFeedback) return;

    const isCorrect =
      option.trim().toLowerCase() ===
      String(question.correctAnswer).trim().toLowerCase();
    if (isCorrect) setScore((prev) => prev + 1);

    setSelectedOption(option);
    setShowFeedback(true);
    setAnswers([...answers, option]);
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      // submit quiz attempt
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `/api/quizzes/${quiz._id}/attempt`,
          { answers },
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
  };

  const getOptionClass = (option) => {
    const correctAnswer = String(question.correctAnswer).trim().toLowerCase();
    const selected = selectedOption?.trim().toLowerCase();
    const currentOption = option.trim().toLowerCase();

    if (!showFeedback) {
      return "border p-2 rounded hover:bg-gray-200 cursor-pointer hover:scale-105 transition-transform duration-300";
    }

    if (currentOption === correctAnswer) {
      return "border p-2 rounded bg-green-500 text-white";
    }

    if (
      selected &&
      currentOption === selected &&
      currentOption !== correctAnswer
    ) {
      return "border p-2 rounded bg-red-500 text-white";
    }

    // all other options remain neutral
    return "border p-2 rounded text-gray-800 cursor-not-allowed";
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

        {showFeedback && (
          <>
            <p className="mt-2 font-semibold">
              Correct Answer:{" "}
              <span className="text-green-600">{question.correctAnswer}</span>
            </p>

            <button
              onClick={nextQuestion}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              {currentQuestionIndex + 1 < quiz.questions.length
                ? "Next Question"
                : "Finish Quiz"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizDisplay;
