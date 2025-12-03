import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../../context/QuizContext";

const QuizStatsPage = () => {
  const { loading, setLoading } = useContext(QuizContext);
  const [quizStats, setQuizStats] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef(null); // for auto-scroll

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/quizzes/quiz-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuizStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [setLoading]);



  const totalQuizzes = quizStats.length;
  const topicsStudied = [...new Set(quizStats.map((q) => q.topic))].length;

  const totalScoreOverall = quizStats.reduce(
    (sum, q) => sum + (q.latestScore || 0),
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#f5f5f5] rounded shadow flex flex-col h-screen">
      <h2 className="text-2xl font-bold mb-4">Your Study Stats</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-white rounded shadow text-center">
          <h3 className="text-lg font-semibold">Topics Studied</h3>
          <p className="text-2xl font-bold">{topicsStudied}</p>
        </div>

        <div className="p-4 bg-white rounded shadow text-center">
          <h3 className="text-lg font-semibold">Quizzes Taken</h3>
          <p className="text-2xl font-bold">{totalQuizzes}</p>
        </div>

        <div className="p-4 bg-white rounded shadow text-center">
          <h3 className="text-lg font-semibold">Total Score</h3>
          <p className="text-2xl font-bold">{totalScoreOverall}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {quizStats.length === 0 && <p>No quizzes taken yet.</p>}

        {quizStats.map((quiz) => (
          <div
            key={quiz.id}
            className="mb-4 p-4 bg-white rounded shadow-sm border cursor-pointer"
            onClick={() => navigate(`/quiz/${quiz.id}`)}
          >
            <h3 className="text-lg font-semibold">{quiz.title}</h3>
            <p>
              <strong>Topic:</strong> {quiz.topic}
            </p>
            <p>
              <strong>Attempts:</strong> {quiz.attempts}
            </p>
            <p>
              <strong>Latest Score:</strong> {quiz.latestScore}
            </p>
          </div>
        ))}

      </div>

      <button
        className=" bg-gray-600 hover:bg-gray-700 text-white font-semibold p-2 rounded mt-2 w-40"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default QuizStatsPage;
