import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatWidget: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Ref for auto-scroll
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 🔽 Auto-scroll whenever messages or typing state changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isBotTyping]);

  // -------------------------
  // 🔵 CHAT API CALL
  // -------------------------
  const sendChatMessage = async (userMessage: string) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/login-cover");
        return { assistant: "Please log in first." };
      }

      const payload = { message: userMessage };
      const apiUrl = "http://3.109.62.26/api/chat/";

      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Chat API Error:", error.response?.data || error);
      return { assistant: "Sorry, something went wrong. Try again." };
    }
  };

  // -------------------------
  // 🟢 Send Message
  // -------------------------
  const sendMessage = async (e?: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input;

    // Clear input immediately
    setInput("");

    // Add user message
    const userMsg = { sender: "user" as const, text: userText };
    setMessages((prev) => [...prev, userMsg]);

    // Show loading skeleton / typing bubble
    setIsBotTyping(true);

    // Call API
    const apiResponse = await sendChatMessage(userText);

    // Hide loading
    setIsBotTyping(false);

    const botMsg = {
      sender: "bot" as const,
      text: apiResponse?.assistant || "No response from server",
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-primary rounded-circle shadow-lg"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          zIndex: 1050,
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "24px",
            width: "340px",
            height: "420px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            border: "1px solid #dee2e6",
            display: "flex",
            flexDirection: "column",
            zIndex: 1050,
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#0d6efd",
              color: "#fff",
              padding: "10px",
              fontWeight: 600,
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            Chat Support
          </div>

          {/* Messages */}
          <div
            style={{
              padding: "10px",
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "13px",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor:
                    msg.sender === "user" ? "#0d6efd" : "#f1f3f5",
                  color: msg.sender === "user" ? "#fff" : "#000",
                  borderRadius: "12px",
                  padding: "6px 10px",
                  maxWidth: "75%",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.text}
              </div>
            ))}

            {/* 🔵 Skeleton / Typing Bubble */}
            {isBotTyping && (
              <div
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#f1f3f5",
                  color: "#000",
                  borderRadius: "12px",
                  padding: "6px 10px",
                  maxWidth: "60%",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  className="spinner-border spinner-border-sm"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span>Thinking...</span>
              </div>
            )}

            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              borderTop: "1px solid #dee2e6",
              display: "flex",
              alignItems: "center",
              padding: "6px",
              gap: "6px",
            }}
          >
            <input
              type="text"
              className="form-control"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Type a message..."
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={sendMessage}
              disabled={isBotTyping}
            >
              {isBotTyping ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
