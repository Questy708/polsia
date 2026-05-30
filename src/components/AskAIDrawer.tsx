import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Sparkles, Terminal, ArrowRight, Bot, User, Code, FileCode } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  codeSnippet?: string;
}

interface AskAIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AskAIDrawer({ isOpen, onClose }: AskAIDrawerProps) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "entry-1",
      sender: "ai",
      text: "Hello. I'm the Polsia System Assistant. I can help you orchestrate deployment commands, update environment variables, or navigate the dashboard. What would you like to build?",
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "I've analyzed your request. We're currently spinning up a dynamic edge function to process this command. Monitor the 'Deployments' tab for status.",
          codeSnippet: `// Edge handler preview\nexport default function req(req: Request) {\n  return new Response("Success");\n}`,
        }
      ]);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed inset-y-0 right-0 w-full sm:w-[450px] border-l z-[101] flex flex-col shadow-2xl ${
              theme === "black" 
                ? "bg-[#0A0A0C] border-[#1A1B1D]" 
                : "bg-slate-900 border-slate-800"
            }`}
          >
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
              theme === "black" ? "border-[#1A1B1D]" : "border-slate-800"
            }`}>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-sm text-zinc-100 tracking-tight">Ask Polsia</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium tracking-tight bg-zinc-800 text-zinc-400 border border-zinc-700">beta</span>
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div className={`flex items-start space-x-2.5 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
                    <div className={`w-6 h-6 rounded-full flex justify-center items-center shrink-0 border mt-0.5 ${
                      msg.sender === "user" 
                        ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                        : "bg-purple-900/30 border-purple-800/50 text-purple-400"
                    }`}>
                      {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                    <div className="space-y-2">
                      <div className={`px-3.5 py-2.5 rounded-lg text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-zinc-200 text-zinc-900" /* Light bubble for user contrast */
                          : theme === "black" ? "bg-[#121214] border border-[#1F2021] text-zinc-200" : "bg-slate-800 border-slate-700 text-slate-200"
                      }`}>
                        {msg.text}
                      </div>

                      {msg.codeSnippet && (
                        <div className={`rounded-md border p-3 font-mono text-xs overflow-hidden ${
                          theme === "black" ? "border-zinc-800 bg-black text-zinc-300" : "border-slate-700 bg-slate-950 text-slate-300"
                        }`}>
                          <div className="flex items-center space-x-1.5 mb-2 pb-2 border-b border-inherit opacity-50">
                            <Terminal className="w-3 h-3" />
                            <span className="uppercase tracking-wider text-[10px] font-bold">Generated Output</span>
                          </div>
                          <pre className="whitespace-pre-wrap">{msg.codeSnippet}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 text-zinc-500 font-mono text-xs p-2"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-purple-400" />
                  <span className="animate-pulse">Polsia is computing...</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={`p-4 border-t shrink-0 ${theme === "black" ? "border-[#1A1B1D] bg-[#0A0A0C]" : "border-slate-800 bg-slate-900"}`}>
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question or deploy a service..."
                  className={`w-full pl-4 pr-11 py-3 text-sm rounded-lg outline-none transition-colors border ${
                    theme === "black" 
                      ? "bg-[#121214] border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-600 focus:bg-[#1A1A1E]" 
                      : "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-slate-500 focus:bg-slate-700"
                  }`}
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 p-1.5 rounded-md text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex justify-between items-center mt-3 text-[10px] items-center text-zinc-500 font-medium">
                <div className="flex space-x-3">
                  <button type="button" className="hover:text-zinc-300 transition-colors flex items-center space-x-1"><FileCode className="w-3 h-3"/><span>Docs</span></button>
                  <button type="button" className="hover:text-zinc-300 transition-colors flex items-center space-x-1"><Code className="w-3 h-3"/><span>Snippet</span></button>
                </div>
                <span>⌘ + K to focus</span>
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
