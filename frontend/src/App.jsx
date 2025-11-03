import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginRegisterForm from "./components/Auth/LoginRegisterForm";
import Home from "./components/Auth/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          element={token ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={<LoginRegisterForm setToken={handleSetToken} />}
        />
      </Routes>

      <ToastContainer />
    </>
  );
};

export default App;
