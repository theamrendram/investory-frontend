"use client";
import { useState, useRef, useEffect } from "react";
import chatbotIcon from "../../public/chatbot-icon.png";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
// Define the type for a message
type Message = {
  role: "user" | "assistant";
  parts: { text: string }[];
  read?: boolean;
};

const initialMessages: Message[] = [
  {
    role: "assistant",
    parts: [{ text: "Hello, how can I help you?" }],
    read: true,
  },
  {
    role: "user",
    parts: [{ text: "Hi! I'm looking for some assistance." }],
    read: true,
  },
  {
    role: "assistant",
    parts: [
      { text: "Sure! I'm here to help. What do you need assistance with?" },
    ],
    read: true,
  },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatText = (text: string) => {
    const boldFormatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return boldFormatted;
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Step 1: Add new user message to history
    const updatedMessages: Message[] = [
      ...messages,
      {
        role: "user",
        parts: [{ text: inputValue }],
      },
    ];

    // Save in localStorage
    localStorage.setItem("chatbotMessages", JSON.stringify(updatedMessages));
    setMessages(updatedMessages); // Optimistically update UI

    try {
      // Step 2: Send updated messages to backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assistant`,
        {
          messages: updatedMessages,
        }
      );

      console.log("Response from server:", response.data);

      // Step 3: Add assistant's reply to chat
      const finalMessages: Message[] = [
        ...updatedMessages,
        {
          role: "assistant",
          parts: [{ text: response.data.ai_response }],
        },
      ];

      setMessages(finalMessages);
      localStorage.setItem("chatbotMessages", JSON.stringify(finalMessages));
      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      {/* Chatbot Icon */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChatbot}
        className="cursor-pointer">
        <motion.img
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          src={chatbotIcon.src}
          alt="Chatbot"
          className="w-16 rounded-full shadow-2xl"
        />
        {!isOpen && messages.some((m) => m.role === "assistant" && !m.read) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full"
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
            className="w-80 md:w-96 h-[500px] bg-white shadow-2xl rounded-lg overflow-hidden mt-4 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white flex justify-between items-center">
              <div className="flex items-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 2,
                  }}
                  className="w-8 h-8 bg-white rounded-full mr-2 flex items-center justify-center">
                  <div className="w-5 h-5 bg-blue-600 rounded-full" />
                </motion.div>
                <h2 className="text-lg font-bold">Investory AI</h2>
              </div>
              <button
                onClick={toggleChatbot}
                className="text-white hover:text-gray-200">
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
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
                      className={`max-w-3/4 p-3 rounded-lg shadow-sm ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      }`}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatText(msg.parts[0].text),
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white border-t border-gray-200 flex items-center">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                type="text"
                placeholder="Type your message..."
                className="flex-1 rounded-full focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="ml-2 bg-blue-600 text-white p-2 rounded-full flex items-center justify-center">
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
