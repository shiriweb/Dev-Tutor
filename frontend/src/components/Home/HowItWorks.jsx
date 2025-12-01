import React from "react";
import {
  FaSignInAlt,
  FaCode,
  FaQuestionCircle,
  FaChartLine,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaSignInAlt className="text-4xl mx-auto mb-2 text-red-500" />,
    title: "Login / Register",
    description: "Sign in to start learning and chatting with Dev-Tutor.",
  },
  {
    icon: <FaCode className="text-4xl mx-auto mb-2 text-red-500" />,
    title: "Pick a Topic",
    description:
      "Choose JavaScript, React, Python, or HTML/CSS to focus your learning.",
  },
  {
    icon: <FaQuestionCircle className="text-4xl mx-auto mb-2 text-red-500" />,
    title: "Chat with AI",
    description: "Ask questions and get programming help in real-time.",
  },
  {
    icon: <FaChartLine className="text-4xl mx-auto mb-2 text-red-500" />,
    title: "Generate Quizzes",
    description:
      "Turn your chats into interactive quizzes to test your knowledge.",
  },
];

const HowItWorks = () => {
  return (
    <div
      id="how-it-works"
      className="py-12 px-4 sm:px-8 md:px-20 bg-gradient-to-b from-teal-800 via-teal-700 to-teal-900"
    >
      <h2 className="text-3xl font-bold text-white text-center mb-12">
        How It Works
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-[#f5f5f5] text-center p-6 border rounded-xl shadow-md hover:scale-105 duration-300 cursor-pointer"
          >
            {step.icon}
            <h3 className="font-bold text-lg mb-2">{step.title}</h3>
            <p className="text-sm text-gray-700">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
