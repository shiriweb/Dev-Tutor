import React, { useState } from "react";
import LeftPanel from "../components/Chat/LeftPanel";
import ChatInterface from "../components/Chat/ChatInterface";
import RightPanel from "../components/Chat/RightPanel";

const Dashboard = () => {
  const [topics] = useState(["JavaScript", "React", "Python", "HTML/CSS"]);
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [currentChatId, setCurrentChatId] = useState(null);

  return (
    <div className="flex min-h-screen p-1 bg-[#f5f5f5] top-0">
      <LeftPanel
        className="h-full sticky top-0"
        topics={topics}
        selectedTopic={selectedTopic}
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
      />

      <RightPanel
        className="h-full sticky top-0"
        token={token}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
      />
    </div>
  );
};

export default Dashboard;

