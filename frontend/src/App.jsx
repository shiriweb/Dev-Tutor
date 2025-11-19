import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginRegisterForm from "./components/Auth/LoginRegisterForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";

// export const backendUrl = "http://localhost:3000";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const handleSetToken = (t) => {
    setToken(t);
    localStorage.setItem("token", t);
  };

  return (
    <>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Login */}
        <Route
          path="/login"
          element={
            <LoginRegisterForm setToken={handleSetToken} token={token} />
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" replace />}
        />
      </Routes>

      <ToastContainer />
    </>
  );
};

export default App;
