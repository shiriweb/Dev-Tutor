import React from "react";
import { FaGraduationCap } from "react-icons/fa";

const LeftPanel = ({
  topics = [],
  selectedTopic,
  setSelectedTopic,
  fetchChats,
  handleNewChat,
}) => {
  
  const handleTopicClick = async (topic) => {
    setSelectedTopic(topic);
    await handleNewChat();
    await fetchChats(topic);
  };

  return (
    <div className="w-32 md:w-60 bg-gradient-to-b from-teal-800 via-teal-700 to-teal-900 rounded-2xl shadow-lg p-3 text-white">
      <h2 className="flex items-center font-bold text-lg mb-2">
        <FaGraduationCap className="mr-2" />
        Topics
      </h2>
      <ul className="space-y-2">
        {topics.map((topic) => (
          <li
            key={topic}
            onClick={() => handleTopicClick(topic)} 
            className={`p-2 rounded cursor-pointer ${
              selectedTopic === topic ? "bg-teal-900" : "hover:bg-teal-900"
            }`}
          >
            {topic}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftPanel;
