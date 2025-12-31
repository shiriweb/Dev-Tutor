import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { QuizContext } from "../../context/QuizContext";

const SingleQuizPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const { loading, setLoading } = useContext(QuizContext);
  const navigate = useNavigate();



  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuiz(res.data);
    } catch (err) {
      console.error("Failed to fetch quiz:", err);
      alert("Failed to fetch quiz. Check your backend or internet connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [id]);


  
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-teal-800 via-teal-700 to-teal-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );

  if (!quiz)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-teal-800 via-teal-700 to-teal-900 text-white">
        Quiz not found
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#f5f5f5] rounded shadow flex flex-col h-screen">
      <h2 className="text-2xl font-bold mb-4 text-teal-900">{quiz.title}</h2>

      <h3 className="text-xl font-semibold mt-4 mb-2 text-teal-800">
        Questions:
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-teal-100">
        {quiz.questions.map((q, idx) => (
          <div key={idx} className="mb-3 p-3 bg-white rounded shadow-sm border">
            <p className="font-semibold text-teal-900">
              {idx + 1}. {q.question}
            </p>
            <ul className="list-disc list-inside">
              {q.options.map((opt, i) => (
                <li
                  key={i}
                  className={
                    opt === q.correctAnswer
                      ? "text-green-600 font-bold"
                      : "text-teal-800"
                  }
                >
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex  mt-4">
        <button
          className="bg-teal-800 hover:bg-teal-900 text-white font-semibold p-2 rounded shadow-md "
          onClick={() => navigate("/quiz-stats")}
        >
          Back to Statistics
        </button>
      </div>
    </div>
  );
};

export default SingleQuizPage;
