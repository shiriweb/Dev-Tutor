// src/pages/ScoreBoard.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ScoreBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, total } = location.state || { score: 0, total: 0 };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-teal-800">Quiz Completed!</h1>
      <p className="text-xl">
        Your Score: <span className="font-semibold">{score}</span> / {total}
      </p>

      <div className="flex gap-4">
        <button
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded"
          onClick={() => navigate("/quiz")}
        >
          Retry Quiz
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
        <button
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded"
          onClick={() => navigate("/quiz-stats")}
        >
          Statistics
        </button>
      </div>
    </div>
  );
};

export default ScoreBoard;
