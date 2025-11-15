import React, { useRef, useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
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

  // Fetching messages for the current chat
  useEffect(() => {
    const fetchMessage = async () => {
      if (!currentChatId) {
        setMessages([
          {
            sender: "assistant",
            content: "Hello, I am Dev-Tutor. How can I help you",
          },
        ]);
        return;
      }

      try {
        const res = await axios.get(`/api/chats/${currentChatId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data;
        if (!data.messages || data.messages.length === 0) {
          setMessages([
            {
              sender: "assistant",
              content: "Hello, I am Dev-Tutor. How can I help you ",
            },
          ]);
        } else {
          setMessages(data.messages);
        }
      } catch (error) {
        console.log("Error fetching messages", error);
      }
    };
    fetchMessage();
  }, [currentChatId, token]);

  // Scroll the chat to the bottom when the messages updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Sending new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }
    const messageToSend = { sender: "user", content: newMessage };
    setMessages([...messages, messageToSend]);
    setNewMessage(" ");

    try {
      let aiResponse = null;
      if (currentChatId) {
        setIsTyping(true);
        const res = await axios.post(
          `/api/chats/${currentChatId}/messages`,
          { content: newMessage },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        aiResponse = res.data.chatMessage;
        setIsTyping(false);
      } else {
        setIsTyping(true);

        const res = await axios.post(
          `/api/chats`,
          {
            topic: selectedTopic,
            content: newMessage,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(res);
        const data = res.data;
        setCurrentChatId(data._id);
        aiResponse = res.data.chatMessage;
        setIsTyping(false);
      }
      if (aiResponse) {
        setMessages((prev) => [
          ...prev,
          { sender: "assistant", content: aiResponse },
        ]);
      }
    } catch (error) {
      console.log("Error sending Messages", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-2 w-full bg-gradient-to-b from-teal-800 via-teal-700 to-teal-900 rounded-2xl shadow-lg ml-2">
      <div className="flex-1 overflow-auto mb-2 text-sm ">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify:start"
            }`}
          >
            <div
              className={`p-2 rounded-xl max-w-xs mb-2 ${
                msg.sender === "user"
                  ? "bg-teal-300 text-teal-900"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.content}
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
      <div className="flex space-x-2">
        <input
          className="flex-1 p-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          type="text"
          placeholder="Ask Anything"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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
