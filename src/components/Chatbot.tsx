"use client";
import { useState, useRef, useEffect } from "react";
import chatbotIcon from "../../public/chatbot-icon.png";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import TypingDots from "./TypingDots";
import parse from "html-react-parser";
import { useUserStore } from "@/store/user-store";

type Message = {
  role: "user" | "assistant";
  parts: { text: string }[];
  read?: boolean;
};
// Ensure a chat session token exists in localStorage

const initialMessages: Message[] = [
  {
    role: "assistant",
    parts: [
      {
        text: "👋 Hi there! Welcome to Investory. How can I help you with stocks or investing today?",
      },
    ],
    read: true,
  },
  {
    role: "user",
    parts: [{ text: "Hi! I want to learn more about investing." }],
    read: true,
  },
  {
    role: "assistant",
    parts: [
      {
        text: "Absolutely! Ask me anything about stocks, markets, or investing strategies.",
      },
    ],
    read: true,
  },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const sessionToken = localStorage.getItem("chat_session");
    if (!sessionToken) {
      const newToken = Math.random().toString(36).substr(2, 16) + Date.now();
      localStorage.setItem("chat_session", newToken);
      setSessionToken(newToken);
    } else {
      setSessionToken(sessionToken);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setError(null);

    const newUserMessage: Message = {
      role: "user",
      parts: [{ text: inputValue }],
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsAssistantTyping(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/conversation`,
        {
          user_id: user?.uid || 101,
          session_token: sessionToken,
          messages: updatedMessages,
          stock_context: null,
          memory_context: null,
        }
      );

      const aiText = response.data.data;

      const assistantMessage: Message = {
        parts: [{ text: aiText }],
        role: "assistant",
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      localStorage.setItem("chatbotMessages", JSON.stringify(finalMessages));
    } catch (error) {
      setError(
        "Sorry, I couldn't process your request. Please try again in a moment."
      );
      console.error("Error sending message:", error);
    } finally {
      setIsAssistantTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadHistory = async () => {
      const sessionToken = localStorage.getItem("chat_session");

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/conversation/${sessionToken}`
        );
        const previous = res.data.data
          .map((msg: any) => {
            if (msg.prompt && msg.prompt.trim() !== "") {
              return { role: "user", parts: [{ text: msg.prompt }] };
            } else if (msg.response && msg.response.trim() !== "") {
              return { role: "assistant", parts: [{ text: msg.response }] };
            }
            return null;
          })
          .filter(Boolean);

        setMessages(previous);
      } catch (err) {
        console.error("Error loading chat history:", err);
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
      {/* Chatbot Icon */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChatbot}
        className="cursor-pointer shadow-lg rounded-full border-2 border-blue-200 bg-white p-1 relative">
        <motion.img
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          src={chatbotIcon.src}
          alt="Chatbot"
          className="w-16 h-16 rounded-full shadow-xl border-2 border-blue-400"
        />
        {!isOpen && messages.some((m) => m.role === "assistant" && !m.read) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white"
          />
        )}
      </motion.div>
      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-80 md:w-96 h-[520px] bg-white shadow-2xl rounded-2xl overflow-hidden mt-4 flex flex-col border border-blue-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 text-white flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 2,
                    }}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-blue-200">
                    <div className="w-5 h-5 bg-blue-600 rounded-full" />
                  </motion.div>
                  <h2 className="text-lg font-bold tracking-wide">
                    Investory AI
                  </h2>
                </div>
                <button
                  onClick={toggleChatbot}
                  className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
                  aria-label="Close chatbot">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <span className="text-xs text-blue-100 font-light pl-10">
                Your AI Stock Assistant
              </span>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-blue-50">
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}>
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl shadow-sm text-sm break-words ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white rounded-br-md"
                          : "bg-white text-gray-800 rounded-bl-md border border-blue-100"
                      }`}>
                      <div>{parse(msg.parts[0].text)}</div>
                    </div>
                  </motion.div>
                ))}
                {/* Show TypingDots when assistant is typing */}
                {isAssistantTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-start">
                    <div className="max-w-[75%] p-3 rounded-2xl shadow-sm bg-white text-gray-800 rounded-bl-md border border-blue-100">
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
                {error && (
                  <div className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded-md border border-red-200">
                    {error}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white border-t border-blue-100 flex items-center gap-2">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                type="text"
                placeholder="Ask me anything about stocks or investing..."
                className="flex-1 rounded-full focus:ring-2 focus:ring-blue-400 px-4 py-2 text-sm"
                autoFocus
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="ml-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Send message">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
