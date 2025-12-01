import { createContext, useState } from "react";
import { FaSpinner } from "react-icons/fa";
export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <QuizContext.Provider value={{ quiz, setQuiz, loading, setLoading }}>
      {children}

      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-lg flex items-center gap-2">
            <FaSpinner className="animate-spin text-3xl" />
            Loading
          </div>
        </div>
      )}
    </QuizContext.Provider>
  );
};
