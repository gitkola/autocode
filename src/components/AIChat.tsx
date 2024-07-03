import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getAIResponse } from "../services/aiService";
import { ArrowUp } from "./Icons";
import { getChat, saveChat } from "../utils/projectChatUtil";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const { projectId, chatId } = useParams<{
    projectId: string;
    chatId: string;
  }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const settings = useSelector((state: RootState) => state.settings);
  const activeService = useSelector(
    (state: RootState) => state.chat.activeService,
  );
  const projects = useSelector((state: RootState) => state.projects.list);

  useEffect(() => {
    const loadChat = async () => {
      if (projectId && chatId) {
        const project = projects.find((p) => p.id === projectId);
        if (project) {
          try {
            const chatData = await getChat(project.path);
            if (chatData) {
              setMessages(chatData.messages);
            } else {
              setMessages([]);
            }
          } catch (error) {
            console.error("Failed to load chat:", error);
            // Handle error (e.g., show error message to user)
          }
        }
      }
    };
    loadChat();
  }, [projectId, chatId, projects]);

  useEffect(() => {
    const saveCurrentChat = async () => {
      if (projectId && chatId) {
        const project = projects.find((p) => p.id === projectId);
        if (project) {
          try {
            await saveChat(project.path, {
              id: chatId,
              title: `Chat ${chatId}`,
              messages,
              lastUpdated: Date.now(),
            });
          } catch (error) {
            console.error("Failed to save chat:", error);
            // Handle error (e.g., show error message to user)
          }
        }
      }
    };
    saveCurrentChat();
  }, [projectId, chatId, messages, projects]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(
        inputMessage,
        settings,
        activeService,
      );
      const newAIMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newAIMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
                }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 text-gray-500">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              AI is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex items-end space-x-4">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Type your message... (Shift+Enter for new line)"
            disabled={isLoading}
            rows={1}
            style={{ minHeight: "2.5rem", maxHeight: "10rem" }}
          />
          <button
            onClick={handleSendMessage}
            className="w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading}
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
