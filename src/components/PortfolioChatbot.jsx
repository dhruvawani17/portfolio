import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';
import Cerebras from '@cerebras/cerebras_cloud_sdk';
const CEREBRAS_API_KEY = import.meta.env.VITE_CEREBRAS_API_KEY;
const SYSTEM_PROMPT = `
You are an AI assistant for Dhruva Wani's portfolio. You are helpful, professional, and concise.

Bio Data: Dhruva Wani is a developer in Mumbai, a Google Student Ambassador, and a student at K.J. Somaiya Institute of Technology. He wrote the book "The Secrets To Master Your Mind" at age 14. He loves React, AI (Gemini/Cerebras), and OCI.

Navigation Logic: If the user's intent is to view a specific section of the site, append a special tag at the end of your response like this: [[SCROLL_TO: sectionId]]. The available section IDs are: about, projects, skills, contact.

Example interactions:
User: "Show me his projects"
Assistant: "Here are some of the innovative projects Dhruva has worked on. [[SCROLL_TO: projects]]"
`;

const PortfolioChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm Dhruva's virtual assistant. Ask me anything about his projects, his book, or his journey!",
      sender: 'bot',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const client = new Cerebras({
    apiKey: import.meta.env.VITE_CEREBRAS_API_KEY || 'demo-key', // Fallback to avoid crash if key missing
    dangerouslyAllowBrowser: true,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const completion = await client.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map(m => ({ 
            role: m.sender === 'bot' ? 'assistant' : 'user', 
            content: m.text 
          })),
          { role: 'user', content: userInput }
        ],
        model: 'llama3.1-8b',
      });

      const rawResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";
      
      // Check for SCROLL_TO tag
      const scrollMatch = rawResponse.match(/\[\[SCROLL_TO:\s*(\w+)\]\]/);
      let cleanResponse = rawResponse;
      
      if (scrollMatch) {
        cleanResponse = rawResponse.replace(scrollMatch[0], '').trim();
        const sectionId = scrollMatch[1];
        
        // Handle scrolling
        setTimeout(() => {
          const element = document.getElementById(sectionId);
           if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: cleanResponse,
          sender: 'bot',
        },
      ]);
    } catch (error) {
      console.error("Cerebras API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "I'm having trouble connecting to my brain right now. Please try again later.",
          sender: 'bot',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end sm:bottom-6 sm:right-24">
       {/* Chat Window */}
      <div
        className={`bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-10 pointer-events-none absolute bottom-0 right-0'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-white">
            <Bot size={20} />
            <span className="font-semibold text-sm">Dhruva's Assistant</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages messages area */}
        <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-900/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-gray-700 text-gray-100 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
             <div className="flex items-start justify-start">
              <div className="bg-gray-700 text-gray-100 rounded-2xl rounded-bl-none px-4 py-2 text-sm flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSendMessage} className="p-3 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about Dhruva..."
              className="flex-1 bg-gray-700 text-white text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center text-white z-50 ${
            isOpen ? 'bg-red-500 rotate-90' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
        }`}
        style={!isOpen ? {
             boxShadow: "0 0 15px #6366f1, 0 0 25px #a855f7",
        } : {}}
        aria-label="Toggle Chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default PortfolioChatbot;
