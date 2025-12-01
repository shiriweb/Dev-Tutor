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
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Log current chat ID whenever it changes
  useEffect(() => {
    console.log("Current Chat ID changed:", currentChatId);
  }, [currentChatId]);

  // Fetch messages for the current chat
  useEffect(() => {
    const fetchMessages = async () => {
      console.log("Selected Topic:", selectedTopic);
      if (!selectedTopic) return;

      if (!currentChatId) {
        setMessages([
          {
            sender: "assistant",
            content: "Hello! I am Dev-Tutor. How can I help you?",
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
              content: "Hello! I am Dev-Tutor. How can I help you?",
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

    const messageContent = newMessage;
    setNewMessage("");
    setIsTyping(true);

    // Optimistically show user's message
    setMessages((prev) => [
      ...prev,
      { sender: "user", content: messageContent },
    ]);

    try {
      let res;

      if (currentChatId) {
        // Existing chat → add message
        res = await axios.post(
          `/api/chats/${currentChatId}/messages`,
          { content: messageContent },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // No chat yet → create new chat
        res = await axios.post(
          "/api/chats",
          { topic: selectedTopic, content: messageContent },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const newChatId = res.data.chat._id;
        setCurrentChatId(newChatId); // update state
        console.log("New Chat Created with ID:", newChatId);
      }

      // Log chat ID from backend
      console.log("Chat ID from backend:", res.data.chat._id);

      setMessages(res.data.chat.messages);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-2 w-full bg-gradient-to-b from-teal-800 via-teal-700 to-teal-900 rounded-2xl shadow-lg ml-1">
      <h2 className="text-white ml-2 mb-2 font-semibold">
        Topic : {selectedTopic}
      </h2>
      <div className="flex-1 overflow-y-scroll text-sm scrollbar-thin">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }  w-full`}
          >
            <div
              className={`p-2 rounded-xl shadow-md mb-2 ${
                msg.sender === "user"
                  ? "bg-teal-300 text-teal-900 0 max-w-[60%]"
                  : "bg-white "
              }`}
            >
              {msg.sender === "assistant" ? (
                <div className="">
                  <ReactMarkdown
                    components={{
                      code({ inline, children }) {
                        return inline ? (
                          <code className="bg-gray-700 text-yellow-300 px-1 rounded">
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-gray-800 text-green-300 p-4 rounded-lg overflow-x-auto shadow-md">
                            <code className="font-mono">{children}</code>
                          </pre>
                        );
                      },
                      p({ children }) {
                        return (
                          <p className="mb-2 leading-relaxed">{children}</p>
                        );
                      },
                      li({ children }) {
                        return (
                          <li className="ml-6 mb-1 list-disc">{children}</li>
                        );
                      },
                      h1({ children }) {
                        return (
                          <h1 className="text-xl font-bold mt-4 mb-2">
                            {children}
                          </h1>
                        );
                      },
                      h2({ children }) {
                        return (
                          <h2 className="text-lg font-semibold mt-3 mb-2">
                            {children}
                          </h2>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="p-2 rounded-xl max-w-xs bg-gray-200 text-gray-900 italic flex items-center gap-2">
              <AiOutlineLoading3Quarters
                size={22}
                className="animate-spin text-gray-400"
              />
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
          className={`flex-1 p-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400`}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={isTyping}
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
