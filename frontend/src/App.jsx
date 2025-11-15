import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginRegisterForm from "./components/Auth/LoginRegisterForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import LeftPanel from "./components/Chat/LeftPanel";

export const backendUrl = "http://localhost:3000";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const handleSetToken = (t) => {
    setToken(t);
    localStorage.setItem("token", t);
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={<LoginRegisterForm setToken={handleSetToken} />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>

      <ToastContainer />
    </>
  );
};

export default App;
