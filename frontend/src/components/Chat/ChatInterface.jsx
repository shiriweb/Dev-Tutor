import React, { useRef, useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import ReactMarkdown from "react-markdown";
const ChatInterface = ({
  token,
  selectedTopic,
  setCurrentChatId,
  currentChatId,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch messages for the current chat
  useEffect(() => {
    const fetchMessages = async () => {
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

        const chat = res.data.chat;
        if (!chat || !chat.messages || chat.messages.length === 0) {
          setMessages([
            {
              sender: "assistant",
              content: "Hello, I am Dev-Tutor. How can I help you?",
            },
          ]);
        } else {
          setMessages(chat.messages);
        }
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentChatId, token]);

  // Scroll chat to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageToSend = { sender: "user", content: newMessage };
    setMessages([...messages, messageToSend]);
    setNewMessage("");
    setIsTyping(true);

    try {
      let res;

      if (currentChatId) {
        // Existing chat
        res = await axios.post(
          `/api/chats/${currentChatId}/messages`,
          { content: messageToSend.content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // New chat
        res = await axios.post(
          `/api/chats`,
          { topic: selectedTopic, content: messageToSend.content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Update current chat ID so future messages go to the same chat
        setCurrentChatId(res.data.chat._id);
      }

      // Get AI response from backend
      const aiResponse = res.data.chatMessage || "AI did not respond";
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", content: aiResponse },
      ]);
    } catch (error) {
      console.log("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", content: "Error: Could not get AI response." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-2 w-full bg-gradient-to-b from-teal-800 via-teal-700 to-teal-900 rounded-2xl shadow-lg ml-2">
      {/* Messages */}
      <div className="flex-1 overflow-auto mb-2 text-sm">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-xl max-w-xs ${
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

      {/* Input */}
      <div className="flex space-x-2">
        <input
          className="flex-1 p-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          type="text"
          placeholder="Ask Anything"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          className="bg-teal-400 p-2 rounded-lg hover:bg-[#f5f5f5]"
          onClick={handleSendMessage}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
