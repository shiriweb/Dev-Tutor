import React from "react";
import QuizDisplay from "../components/Quiz/QuizDisplay";
import ScoreBoard from "../components/Quiz/ScoreBoard";

const Quizzes = () => {
  return (
    <div className="flex flex-col w-full h-screen items-center justify-between bg-gradient-to-b from-teal-800 via-700 to-teal-900">
      <QuizDisplay />
    </div>
  );
};

export default Quizzes;
