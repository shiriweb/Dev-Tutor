import React, { useState } from "react";
import LeftPanel from "../components/Chat/LeftPanel";
import ChatInterface from "../components/Chat/ChatInterface";
import RightPanel from "../components/Chat/RightPanel";

const Dashboard = () => {
  const [topics] = useState(["JavaScript", "React", "Python", "HTML/CSS"]);
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [currentChatId, setCurrentChatId] = useState(null);

  // useEffect(() => {}, [selectedTopic]);

  return (
    <div className="flex min-h-screen p-1 bg-[#f5f5f5]">
      <LeftPanel
        topics={topics}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
      />

      <ChatInterface
        token={token}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        selectedTopic={selectedTopic}
      />

      <RightPanel
        token={token}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
      />
    </div>
  );
};

export default Dashboard;
