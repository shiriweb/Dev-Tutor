import React, { useState } from "react";
import LeftPanel from "../components/Chat/LeftPanel";
import ChatInterface from "../components/Chat/ChatInterface";
import RightPanel from "../components/Chat/RightPanel";
import LoginRegisterForm from "../components/Auth/LoginRegisterForm";
import axios from "axios";

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

  const fetchChats = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/api/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredChat = res.data.chats.filter(
        (chat) => chat.topic === selectedTopic
      );
      setChatHistory(filteredChat);
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
      setChatHistory((prev) => [...prev, newChat]);
      setCurrentChatId(newChat._id);
      await fetchChats(selectedTopic);
    } catch (error) {
      console.log("Error creating new Chat: ", error);
    }
  };

  return (
    <div className="flex min-h-screen p-1 bg-[#f5f5f5] top-0">
      <LeftPanel
        className="h-full sticky top-0"
        topics={topics}
        selectedTopic={selectedTopic}
        fetchChats={fetchChats}
        handleNewChat={handleNewChat}
        setSelectedTopic={(topic) => {
          setSelectedTopic(topic);
          setCurrentChatId(null);
        }}
      />

      <ChatInterface
        className="h-full"
        token={token}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        selectedTopic={selectedTopic}
        quiz={quiz}
        setQuiz={setQuiz}
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
      />

      <RightPanel
        className="h-full sticky top-0"
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
    </div>
  );
};

export default Dashboard;
