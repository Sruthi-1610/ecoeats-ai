
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
        const historyForApi = messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));
        const responseText = await getChatResponse(historyForApi, userInput);
        const modelMessage: ChatMessage = { role: 'model', text: responseText };
        setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
        console.error("Chatbot error:", error);
        const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[60vh]">
        <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-emerald-800">AI Assistant</h2>
            <p className="text-emerald-700 mt-1">Ask me anything about reducing food waste!</p>
        </div>
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto bg-emerald-50/50 p-4 rounded-t-lg border border-b-0 border-emerald-200 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="max-w-xs px-4 py-2 rounded-2xl bg-white text-gray-800 shadow-sm">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
            </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex p-4 border-t border-emerald-200 bg-white rounded-b-lg">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border border-emerald-300 rounded-l-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-r-lg hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
