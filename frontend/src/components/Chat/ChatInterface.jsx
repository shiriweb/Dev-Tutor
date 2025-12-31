import React, { useRef, useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
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
  fetchChats,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChatId) {
        setMessages([]);
        return;
      }

      try {
        const res = await axios.get(`/api/chats/${currentChatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessages(res.data.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentChatId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageContent = newMessage;
    setNewMessage("");
    setIsTyping(true);
    setMessages((prev) => [
      ...prev,
      { sender: "user", content: messageContent },
    ]);

    try {
      let res;

      if (currentChatId) {
        res = await axios.post(
          `/api/chats/${currentChatId}/messages`,
          { content: messageContent },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        res = await axios.post(
          "/api/chats",
          { topic: selectedTopic, content: messageContent },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCurrentChatId(res.data.chat._id);
      }

      setMessages(res.data.chat.messages);
      await fetchChats(selectedTopic);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-2 w-full bg-gradient-to-b from-teal-800 via-teal-700 to-teal-900 rounded-2xl shadow-lg ml-1">
      <h2 className="text-white ml-2 mb-2 font-semibold">
        Topic: {selectedTopic}
      </h2>

      <div className="flex-1 overflow-y-scroll text-sm scrollbar-thin">
        {messages.length === 0 && !isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-2 rounded-xl shadow-md mb-2">
              Hello! I am Dev-Tutor. How can I help you?
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } w-full`}
          >
            <div
              className={`p-2 rounded-xl shadow-md mb-2 ${
                msg.sender === "user"
                  ? "bg-teal-300 text-teal-900 max-w-[60%]"
                  : "bg-white"
              }`}
            >
              {msg.sender === "assistant" ? (
                <ReactMarkdown
                  components={{
                    code({ inline, children }) {
                      if (inline) return <>{children}</>;
                      return (
                        <pre className="bg-gray-800 text-white p-3 rounded-lg overflow-x-auto my-2">
                          <code className="font-mono text-sm">{children}</code>
                        </pre>
                      );
                    },

                    p({ children }) {
                      const text = String(children);
                      return <p>{children}</p>;
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="p-2 rounded-xl max-w-xs bg-gray-200 text-gray-900 italic flex items-center gap-2">
              <AiOutlineLoading3Quarters className="animate-spin" /> AI is
              thinking...
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
          disabled={isTyping}
        />
        <button
          onClick={handleSendMessage}
          className="bg-teal-400 p-2 rounded-lg"
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
