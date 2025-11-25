import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginRegisterForm from "./components/Auth/LoginRegisterForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import Quizzes from "./pages/Quizzes";
import ScoreBoard from "./components/Quiz/ScoreBoard";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const handleSetToken = (t) => {
    setToken(t);
    localStorage.setItem("token", t);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signin"
          element={
            <LoginRegisterForm setToken={handleSetToken} token={token} />
          }
        />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/signin" replace />}
        />{" "}
        <Route
          path="/quiz"
          element={token ? <Quizzes /> : <Navigate to="/signin" replace />}
        />{" "}
        <Route
          path="/score"
          element={token ? <ScoreBoard /> : <Navigate to="/signin" replace />}
        />
      </Routes>

      <ToastContainer />
    </>
  );
};

export default App;
