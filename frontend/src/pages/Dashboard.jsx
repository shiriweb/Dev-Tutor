import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  const { chatId } = useParams();
  const navigate = useNavigate();

  // Fetch chat by URL chatId if exists
  useEffect(() => {
    const fetchChatTopic = async () => {
      if (!chatId || !token) return;
      try {
        const res = await axios.get(`/api/chats/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentChatId(res.data._id);
        setSelectedTopic(res.data.topic);
        await fetchChats(res.data.topic, res.data._id);
      } catch (error) {
        console.log("Error fetching chat by id:", error);
      }
    };

    fetchChatTopic();
  }, [chatId, token]);

  // Fetch chats for default topic if no chatId
  useEffect(() => {
    const fetchDefaultChats = async () => {
      if (!token) return;

      if (!chatId) {
        const chats = await fetchChats(selectedTopic);
        if (chats && chats.length > 0) {
          setCurrentChatId(chats[0]._id);
          navigate(`/dashboard/${chats[0]._id}`, { replace: true });
        }
      }
    };

    fetchDefaultChats();
  }, [token, selectedTopic, chatId, navigate]);

  // Show login form if not logged in
  if (!token) {
    return <LoginRegisterForm token={token} setToken={setToken} />;
  }

  // Fetch chats for a topic, optionally keep currentChatId if provided
  const fetchChats = async (topic, keepChatId = null) => {
    if (!token) return;
    try {
      const res = await axios.get(`/api/chats?topic=${topic}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const chats = res.data.chats;
      setChatHistory(chats);

      if (chats.length > 0 && !keepChatId) {
        setCurrentChatId(chats[0]._id);
      }

      return chats;
    } catch (error) {
      console.log("Error fetching chats:", error);
      return [];
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
      navigate(`/dashboard/${newChat._id}`);
      await fetchChats(topic);
    } catch (error) {
      console.log("Error creating new Chat: ", error);
    }
  };

  return (
    <div className="relative flex h-screen p-1 bg-[#f5f5f5]">
      <LeftPanel
        topics={topics}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        fetchChats={fetchChats}
        handleNewChat={handleNewChat}
        setCurrentChatId={setCurrentChatId}
        navigate={navigate}
      />

      <ChatInterface
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
