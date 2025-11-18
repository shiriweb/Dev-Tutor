import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginRegisterForm = ({ setToken, token }) => {
  const [currentState, setCurrentState] = useState("Sign In");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    resetForm();
  }, [currentState]);

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const formSubmission = async (e) => {
    e.preventDefault();

    try {
      if (currentState === "Sign Up") {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        const response = await axios.post("/api/auth/register", {
          username,
          email,
          password,
        });

        toast.success(response.data.message);
        setCurrentState("Sign In"); 
      } else {
        const response = await axios.post("/api/auth/login", {
          email,
          password,
        });

        toast.success(response.data.message);
        setToken(response.data.token); // navigation happens in useEffect
      }
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-teal-50 p-2 sm:p-4">
      <form
        onSubmit={formSubmission}
        className="w-full sm:max-w-xs md:max-w-sm lg:max-w-xs lg:py-7 bg-white p-6 rounded-none sm:rounded-2xl shadow-none sm:shadow-xl space-y-3"
      >
        <div className="text-center mb-3">
          <p className="text-2xl font-bold text-teal-700 tracking-wide">
            {currentState}
          </p>
        </div>

        {currentState === "Sign Up" && (
          <div className="flex items-center border border-teal-300 rounded-lg p-2.5 focus-within:ring-2 focus-within:ring-teal-400">
            <FaUser className="mr-3 w-4 h-4 text-teal-600" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
            />
          </div>
        )}

        <div className="flex items-center border border-teal-300 rounded-lg p-2.5 focus-within:ring-2 focus-within:ring-teal-400">
          <FaEnvelope className="mr-3 w-4 h-4 text-teal-600" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
          />
        </div>

        <div className="flex items-center border border-teal-300 rounded-lg p-2.5 focus-within:ring-2 focus-within:ring-teal-400">
          <FaLock className="mr-3 w-4 h-4 text-teal-600" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
          />
        </div>

        {currentState === "Sign Up" && (
          <div className="flex items-center border border-teal-300 rounded-lg p-2.5 focus-within:ring-2 focus-within:ring-teal-400">
            <FaLock className="mr-3 w-4 h-4 text-teal-600" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg transition duration-300 text-sm"
        >
          {currentState}
        </button>

        <div className="text-center text-xs text-gray-600 mt-2">
          {currentState === "Sign In" ? (
            <p>
              Don't have an account?{" "}
              <span
                className="cursor-pointer text-teal-700 hover:underline"
                onClick={() => setCurrentState("Sign Up")}
              >
                Sign Up
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span
                className="cursor-pointer text-teal-700 hover:underline"
                onClick={() => setCurrentState("Sign In")}
              >
                Sign In
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginRegisterForm;