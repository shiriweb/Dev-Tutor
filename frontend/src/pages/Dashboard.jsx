import React, { useState } from "react";
import LeftPanel from "../components/Chat/LeftPanel";
import ChatInterface from "../components/Chat/ChatInterface";
import RightPanel from "../components/Chat/RightPanel";
import LoginRegisterForm from "../components/Auth/LoginRegisterForm";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

const Dashboard = () => {
  const [topics] = useState(["JavaScript", "React", "Python", "HTML/CSS"]);
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return <LoginRegisterForm token={token} setToken={setToken} />;
  }

  const fetchChats = async (topic) => {
    if (!token) return;
    try {
      const res = await axios.get("/api/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredChat = res.data.chats.filter(
        (chat) => chat.topic === topic
      );

      setChatHistory(filteredChat);

      if (!currentChatId && filteredChat.length > 0) {
        setCurrentChatId(filteredChat[0]._id);
      }

      return filteredChat;
    } catch (error) {
      console.log("Error fetching chats: ", error);
    }
  };

  const handleNewChat = async () => {
    if (!token) return;
    const topic = selectedTopic;
    const content = "";

    try {
      const res = await axios.post(
        "/api/chats",
        { topic, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newChat = res.data.chat;

      // Add new chat to history and select it immediately
      setChatHistory((prev) => [...prev, newChat]);
      setCurrentChatId(newChat._id);

      // Refetch chats but do NOT overwrite currentChatId
      await fetchChats();
    } catch (error) {
      console.log("Error creating new Chat: ", error);
    }
  };

  return (
    <div className="relative flex h-[530px] p-1 bg-[#f5f5f5]">
      {/* Left Panel */}
      <LeftPanel
        className="h-full overflow-y-auto"
        topics={topics}
        selectedTopic={selectedTopic}
        fetchChats={fetchChats}
        handleNewChat={handleNewChat}
        setSelectedTopic={(topic) => {
          setSelectedTopic(topic);
          setCurrentChatId(null);
          fetchChats(topic);
        }}
      />

      {/* Chat Interface */}
      <ChatInterface
        className="h-full overflow-y-auto"
        token={token}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        selectedTopic={selectedTopic}
        z
        quiz={quiz}
        setQuiz={setQuiz}
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
      />

      {/* Right Panel */}
      <RightPanel
        className="h-full overflow-y-auto"
        token={token}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        fetchChats={fetchChats}
        handleNewChat={handleNewChat}
      />

      {/* Full-screen loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-lg flex items-center gap-2">
            <FaSpinner className="animate-spin text-3xl" />
            Generating Quiz...
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
