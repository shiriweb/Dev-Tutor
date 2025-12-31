import axios from "axios";
import React, { useContext } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { QuizContext } from "../../context/QuizContext";

const QuizGenerator = ({ token, currentChatId, loading, setLoading }) => {
  const navigate = useNavigate();
  const { setQuiz } = useContext(QuizContext);

  const handleGenerateQuiz = async () => {
    if (!currentChatId) {
      toast.error("Please chat first in order to generate quiz");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "/api/quizzes/generates",
        { chatId: currentChatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuiz(res.data);
      navigate("/quiz");
      toast.success("Quiz generated successfully!");
      setLoading(false); 
    } catch (error) {
      console.log("Error generating quiz", error);
      const message =
        error.response?.data?.error ||
        "Failed to generate quiz. Please try again.";
      toast.error(message);
      setLoading(false); 
    }
  };

  return (
    <div className="flex w-10">
      <button
        onClick={handleGenerateQuiz}
        disabled={loading} 
        className={`text-white p-2 rounded-xl hover:text-black ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-teal-600 hover:bg-teal-500"
        }`}
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default QuizGenerator;
