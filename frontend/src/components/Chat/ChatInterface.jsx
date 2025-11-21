import React, { useRef, useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import QuizGenerator from "../Quiz/QuizGenerator";
const ChatInterface = ({
  token,
  selectedTopic,
  setCurrentChatId,
  currentChatId,
  loading,
  setLoading,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch messages for the current chat
  useEffect(() => {
    const fetchMessages = async () => {
      console.log("Selected Topic inside useEffect:", selectedTopic);

      if (!selectedTopic) return;
      if (!currentChatId) {
        setMessages([
          {
            sender: "assistant",
            content: "Hello, I am Dev-Tutor. How can I help you?",
          },
        ]);
        return;
      }

      try {
        const res = await axios.get(`/api/chats/${currentChatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        if (!data.messages || data.messages.length === 0) {
          setMessages([
            {
              sender: "assistant",
              content: "Hello, I am Dev-Tutor. How can I help you?",
            },
          ]);
        } else {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentChatId, token, selectedTopic]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    console.log(selectedTopic);

    const messageToSend = { sender: "user", content: newMessage };
    setMessages((prev) => [...prev, messageToSend]);
    setNewMessage("");

    try {
      setIsTyping(true);

      let res;
      if (currentChatId) {
        // Add message to existing chat
        res = await axios.post(
          `/api/chats/${currentChatId}/messages`,
          { content: messageToSend.content, topic: selectedTopic },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new chat
        res = await axios.post(
          `/api/chats`,
          { topic: selectedTopic, content: messageToSend.content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCurrentChatId(res.data.chat._id);
      }

      const aiResponse = res.data.chatMessage || "AI did not respond";
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", content: aiResponse },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-2 w-full bg-gradient-to-b from-teal-800 via-teal-700 to-teal-900 rounded-2xl shadow-lg ml-2 max-h-screen">
      <h2 className="text-white ml-2 mb-2 font-semibold">
        Topic : {selectedTopic}
      </h2>
      <div className="flex-1 overflow-y-scroll text-sm scrollbar-thin">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end " : "justify-start"
            } mb-3 w-full`}
          >
            <div
              className={`p-2 rounded-xl max-w-[60%] mb-2 ${
                msg.sender === "user"
                  ? "bg-teal-300 text-teal-900"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.sender === "assistant" ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="p-2 rounded-xl max-w-xs bg-gray-200 text-gray-900 italic">
              AI is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex space-x-2 mt-2">
        <input
          type="text"
          placeholder="Ask Anything"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="bg-teal-400 p-2 rounded-lg hover:bg-[#f5f5f5]"
        >
          <FaPaperPlane />
        </button>

        <QuizGenerator
          token={token}
          loading={loading}
          setLoading={setLoading}
          currentChatId={currentChatId}
          setCurrentChatId={setCurrentChatId}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
