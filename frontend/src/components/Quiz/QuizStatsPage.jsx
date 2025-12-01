import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../../context/QuizContext";

const QuizStatsPage = () => {
  const { loading, setLoading } = useContext(QuizContext); // use context loading
  const [quizStats, setQuizStats] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true); // start global loading
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/quizzes/quiz-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched quiz stats:", res.data);
        setQuizStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false); // stop global loading
      }
    };
    fetchStats();
  }, [setLoading]);

  const totalQuizzes = quizStats.length;
  const topicsStudied = [...new Set(quizStats.map((q) => q.topic))].length;
  const averageScoreOverall =
    totalQuizzes > 0
      ? Math.round(
          quizStats.reduce((sum, q) => sum + (q.averageScore || 0), 0) /
            totalQuizzes
        )
      : 0;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-[#f5f5f5] rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your Study Stats</h2>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow text-center">
          <h3 className="text-lg font-semibold">Topics Studied</h3>
          <p className="text-2xl font-bold">{topicsStudied}</p>
        </div>

        <div className="p-4 bg-white rounded shadow text-center">
          <h3 className="text-lg font-semibold">Quizzes Taken</h3>
          <p className="text-2xl font-bold">{totalQuizzes}</p>
        </div>

        <div className="p-4 bg-white rounded shadow text-center">
          <h3 className="text-lg font-semibold">Average Score</h3>
          <p className="text-2xl font-bold">{averageScoreOverall}%</p>
          <div className="w-full bg-gray-200 h-3 rounded mt-2">
            <div
              className="bg-teal-600 h-3 rounded"
              style={{ width: `${averageScoreOverall}%` }}
            />
          </div>
        </div>
      </div>
      {/* Individual Quiz Stats */}
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
      <button
        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded"
        onClick={() => navigate("/dashboard")}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default QuizStatsPage;
