import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { QuizContext } from "../../context/QuizContext";

const SingleQuizPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const { loading, setLoading } = useContext(QuizContext);
  const navigate = useNavigate();

  // Fetch quiz function
  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuiz(res.data);
      console.log("Quiz data:", res.data);
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

  if (loading) return <p className="p-4">Loading...</p>;
  if (!quiz) return <p className="p-4">Quiz not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#f5f5f5] rounded shadow flex flex-col h-screen">
      <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
      {/* <p>
        <strong>Topic:</strong> {quiz.topic}
      </p> */}

      <h3 className="text-xl font-semibold mt-4 mb-2">Questions:</h3>

      {/* Scrollable questions container */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {quiz.questions.map((q, idx) => (
          <div key={idx} className="mb-3 p-3 bg-white rounded shadow-sm border">
            <p className="font-semibold">
              {idx + 1}. {q.question}
            </p>
            <ul className="list-disc list-inside">
              {q.options.map((opt, i) => (
                <li
                  key={i}
                  className={
                    opt === q.correctAnswer ? "text-green-600 font-bold" : ""
                  }
                >
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button
        className=" bg-gray-600 hover:bg-gray-700 text-white font-semibold p-2 rounded mt-4 w-40"
        onClick={() => navigate("/quiz-stats")}
      >
        Back to Statistics
      </button>
    </div>
  );
};

export default SingleQuizPage;
