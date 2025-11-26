import React, { useEffect } from "react";
import { FaHistory, FaPlus, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RightPanel = ({
  token,
  currentChatId,
  setCurrentChatId,
  chatHistory,
  setChatHistory,
  currentUser,
  setCurrentUser,
  selectedTopic,
  setSelectedTopic,
}) => {
  const navigate = useNavigate();

  const fetchUser = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/api/auth/currentUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(res.data.username);
    } catch (error) {
      console.log("Error fetching the user:", error);
    }
  };

  const fetchChats = async (topic) => {
    if (!token) return;
    try {
      const res = await axios.get(`/api/chats?topic=${topic || ""}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatHistory(res.data.chats);
      if (res.data.chats.length > 0) setCurrentChatId(res.data.chats[0]._id);
    } catch (error) {
      console.log("Error fetching chats:", error);
    }
  };

  const handleNewChat = async () => {
    if (!token || !selectedTopic) return;

    try {
      await axios.post(
        "/api/chats",
        { topic: selectedTopic, content: "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchChats(selectedTopic); // Refetch chats
    } catch (error) {
      console.log("Error creating new chat:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setChatHistory([]);
    setCurrentChatId(null);
    navigate("/");
  };

  useEffect(() => {
    fetchUser();
    fetchChats(selectedTopic);
  }, [token, selectedTopic]);

  return (
    <div className="w-32 lg:block md:w-60 lg:w-60 bg-gradient-to-b from-teal-800 via-teal-700 to-teal-900 rounded-2xl shadow-lg p-2 text-white ml-1">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-2 p-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <FaUserCircle size={20} /> {currentUser}
          </div>
          <button onClick={handleLogout}>
            <FaSignOutAlt />
          </button>
        </div>

        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 p-2 bg-teal-900 rounded-2xl font-semibold focus:bg-teal-950 shadow-md"
        >
          <FaPlus /> New Chat
        </button>

        <h2 className="w-full flex items-center p-2 gap-2">
          <FaHistory /> Chat History
        </h2>

        <div className="flex flex-col gap-2 overflow-y-scroll text-sm scrollbar-thin flex-1">
          {chatHistory.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setCurrentChatId(chat._id)}
              className={`p-2 rounded-3xl cursor-pointer ${
                chat._id === currentChatId ? "bg-teal-900" : "hover:bg-teal-800"
              }`}
            >
              <p>{chat.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
