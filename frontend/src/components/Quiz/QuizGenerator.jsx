import axios from "axios";
import React, { useContext, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { QuizContext } from "../../context/QuizContext";

const QuizGenerator = ({
  token,
  currentChatId,
  setCurrentChatId,
  loading,
  setLoading,
}) => {
  const navigate = useNavigate();
  const { setQuiz } = useContext(QuizContext);
  const handleGenerateQuiz = async () => {
    if (!currentChatId) {
      toast.error("Please chat first inorder to generate quiz");
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
      setLoading(false);
      navigate("/quiz");
      console.log("Quiz generated successfully");
    } catch (error) {
      console.log("Error generating quizzes", error);
      setLoading(false);
    }
  };

  return (
    <div className=" flex w-10 ">
      <button
        onClick={handleGenerateQuiz}
        className="text-white bg-teal-600 p-2 rounded-xl hover:bg-teal-500 hover:text-black"
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default QuizGenerator;
