import React from "react";
import { FaHistory, FaPlus, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

const RightPanel = ({
  token,
  currentChatId,
  setCurrentChatId,
  chatHistory = [],
  setChatHistory,
}) => {
  const currentUser = "Shirisha";
  return (
    <div className="hidden w-full lg:block md:w-60 lg:w-60 bg-gradient-to-b from-teal-800 via-teal-700 to-teal-900 rounded-2xl shadow-lg p-2 text-white ml-2 ">
      <div className="flex items-center justify-between mb-2 p-2">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <FaUserCircle size={20} />
        </div>
        <button>
          <FaSignOutAlt />
        </button>
      </div>

      <button className="w-full flex items-center justify-center gap-2 p-2 bg-teal-900 rounded-2xl font-semibold focus:bg-teal-950 shadow-md">
        <FaPlus />
        New Chat
      </button>

      <h2 className=" w-full flex items-center p-2 gap-2">
        <FaHistory /> Chat History
      </h2>

      <div className="flex flex-col gap-1 autoflow-y-auto max-h-40 md:max-h-80">
        {chatHistory.map((chat) => (
          <div
            key={chat._id}
            className={`p-2 rounded-2xl cursor-pointer shadow-md ${
              chat._id === currentChatId ? "bg-teal-900 " : "bg-teal-800"
            }`}
          >
            <p>{chat.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightPanel;
