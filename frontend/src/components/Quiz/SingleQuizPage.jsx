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
      console.log("Quiz data:", res.data); // For debugging
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

  // Show loading first
  if (loading) return <p className="p-4">Loading</p>;
  if (!quiz) return <p className="p-4">Quiz not found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-[#f5f5f5] rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
      <p><strong>Topic:</strong> {quiz.topic}</p>
      <p><strong>Total Attempts:</strong> {quiz.attempts.length}</p>

      <button
        className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded mb-4"
        onClick={fetchQuiz} // reuse fetchQuiz for retry
      >
        Retry Quiz
      </button>

      <h3 className="text-xl font-semibold mt-4 mb-2">Questions:</h3>
      {quiz.questions.map((q, idx) => (
        <div key={idx} className="mb-3 p-3 bg-white rounded shadow-sm border">
          <p className="font-semibold">{idx + 1}. {q.question}</p>
          <ul className="list-disc list-inside">
            {q.options.map((opt, i) => (
              <li key={i} className={opt === q.correctAnswer ? "text-green-600 font-bold" : ""}>
                {opt}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <h3 className="text-xl font-semibold mt-4 mb-2">Attempts:</h3>
      {quiz.attempts.length === 0 && <p>No attempts yet.</p>}
      {quiz.attempts.map((a, i) => (
        <div key={i} className="p-2 bg-white rounded mb-2 border">
          Attempt {i + 1}: <span>Score: {a.score}</span>
        </div>
      ))}

      <button
        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded mt-4"
        onClick={() => navigate("/quiz-stats")}
      >
        Back to Statistics
      </button>
    </div>
  );
};

export default SingleQuizPage;
