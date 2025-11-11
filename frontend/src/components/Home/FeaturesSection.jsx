import React from "react";
import { FaRobot, FaQuestionCircle, FaChartLine, FaBook } from "react-icons/fa";

const FeaturesSection = () => {
  return (
    <div className="relative bg-[#f5f5f5] py-12 px-4 sm:px-8 md:px-20 overflow-hidden">
      {/* Decorative glowing circles */}
      <div className="absolute top-10 left-[-50px] w-60 h-60 sm:w-72 sm:h-64 bg-teal-400/40 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-10 right-[-60px] w-72 h-72 sm:w-80 sm:h-80 bg-teal-600/30 rounded-full blur-3xl z-0"></div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
        {/* Left side - Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {/* Top-left card */}
          <div className="bg-gradient-to-br from-teal-900 via-teal-700 to-teal-900 text-white text-center h-44 w-full p-3 border-t-8 border-l-4 border-red-500 shadow-lg rounded-3xl rounded-br-none hover:scale-105 transition-transform duration-300 cursor-pointer">
            <FaRobot className="text-5xl mx-auto" />
            <h2 className="font-bold mt-2 text-sm">Programming Assistance</h2>
            <p className="mt-3 text-xs">
              Get clear coding tips and solutions to learn programming faster.
            </p>
          </div>

          {/* Top-right card */}
          <div className="bg-gradient-to-bl from-teal-800 via-teal-700 to-teal-900 text-white text-center h-44 w-full p-3 border shadow-lg rounded-3xl rounded-bl-none hover:scale-105 transition-transform duration-300 cursor-pointer">
            <FaQuestionCircle className="text-5xl mx-auto" />
            <h2 className="text-sm font-bold mt-2">Quiz Generation</h2>
            <p className="mt-3 text-xs">
              Turn your chats into short interactive quizzes to test yourself.
            </p>
          </div>

          {/* Bottom-left card */}
          <div className="bg-gradient-to-tr from-teal-900 via-teal-700 to-teal-900 text-white text-center h-44 w-full p-3 border shadow-lg rounded-3xl rounded-tr-none hover:scale-105 transition-transform duration-300 cursor-pointer">
            <FaChartLine className="text-5xl mx-auto" />
            <h2 className="text-sm font-bold mt-2">
              Comprehensive Learning Analytics
            </h2>
            <p className="mt-3 text-xs">
              Track progress and see insights to improve your learning habits.
            </p>
          </div>

          {/* Bottom-right card */}
          <div className="bg-gradient-to-br from-teal-900 via-teal-700 to-teal-900 text-white text-center h-44 w-full p-3 border-b-8 border-r-4 border-red-500 shadow-lg rounded-3xl rounded-tl-none hover:scale-105 transition-transform duration-300 cursor-pointer">
            <FaBook className="text-5xl mx-auto" />
            <h2 className="text-sm font-bold mt-3">Focused Topic Navigation</h2>
            <p className="mt-3 text-xs">
              Explore specific programming topics efficiently and clearly.
            </p>
          </div>
        </div>

        {/* Right side - Text content */}
        <div className="flex-1 max-w-lg text-center md:text-left">
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-teal-900 leading-snug">
            Empower Your <span className="text-red-500">Learning</span> Journey
          </h2>
          <p className="text-gray-700 text-base mt-4 text-sm sm:text-sm md:text-base">
            Learning programming can feel challenging, but every step you take
            brings you closer to mastery. With AI-guided assistance, interactive
            quizzes, and progress tracking, you can challenge yourself, stay
            motivated, and see your growth every day.
          </p>
          <button className="bg-red-500 px-6 py-2 rounded-md mt-4 text-white font-bold hover:bg-red-600 transition-colors">
            Explore
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
