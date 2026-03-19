import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Code, 
  Database, 
  Zap, 
  ChevronRight, 
  MessageSquare, 
  Send, 
  Terminal,
  GraduationCap,
  Layers,
  Search,
  Menu,
  X,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CURRICULUM } from './constants';
import { Topic } from './types';
import { GoogleGenAI } from "@google/genai";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('Python');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Set initial topic
  useEffect(() => {
    if (!selectedTopic) {
      setSelectedTopic(CURRICULUM['Python'][0]);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSendMessage = async (e?: React.FormEvent, overrideInput?: string) => {
    e?.preventDefault();
    const input = overrideInput || chatInput;
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    if (!overrideInput) setChatInput('');
    setIsTyping(true);

    try {
      const context = selectedTopic 
        ? `Topic: ${selectedTopic.title} (${selectedTopic.level}). Concepts: ${selectedTopic.concepts.join(', ')}.`
        : `Category: ${activeCategory}`;
      
      const systemPrompt = `
        You are an expert Data Science Tutor specializing in Python, Pandas, and Spark.
        The user is currently studying: ${context}.
        Provide clear, technical yet accessible explanations. 
        Always include Python code snippets for practical demonstration.
        If the user asks for a "prompt to give an LLM", generate a high-quality, structured prompt that they can use to learn this specific topic deeply.
        Format your response using Markdown.
      `;

      const response = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: systemPrompt + "\n\nUser Question: " + input }] }],
      });
      const text = response.text;
      
      setMessages(prev => [...prev, { role: 'ai', content: text || "I couldn't generate a response." }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error. Please check your API key or try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const categories = [
    { name: 'Python', icon: Code, color: 'text-blue-500' },
    { name: 'Pandas', icon: Database, color: 'text-purple-500' },
    { name: 'Spark', icon: Zap, color: 'text-orange-500' },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-80 bg-white border-r border-zinc-200 flex flex-col z-20"
          >
            <div className="p-6 border-b border-zinc-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <GraduationCap size={24} />
                </div>
                <h1 className="text-xl font-bold tracking-tight">Data Mastery</h1>
              </div>

              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setActiveCategory(cat.name);
                      setSelectedTopic(CURRICULUM[cat.name][0]);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium",
                      activeCategory === cat.name 
                        ? "bg-indigo-50 text-indigo-700" 
                        : "text-zinc-600 hover:bg-zinc-100"
                    )}
                  >
                    <cat.icon size={18} className={cat.color} />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {['Beginner', 'Intermediate', 'Advanced', 'Master'].map((level) => {
                const topics = CURRICULUM[activeCategory].filter(t => t.level === level);
                if (topics.length === 0) return null;
                
                return (
                  <div key={level}>
                    <h3 className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      {level}
                    </h3>
                    <div className="space-y-1">
                      {topics.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => setSelectedTopic(topic)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-md text-sm transition-all group flex items-center justify-between",
                            selectedTopic?.id === topic.id
                              ? "bg-zinc-900 text-white"
                              : "text-zinc-600 hover:bg-zinc-100"
                          )}
                        >
                          <span className="truncate">{topic.title}</span>
                          <ChevronRight size={14} className={cn(
                            "opacity-0 group-hover:opacity-100 transition-opacity",
                            selectedTopic?.id === topic.id && "opacity-100"
                          )} />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-zinc-100">
              <div className="bg-indigo-600 rounded-xl p-4 text-white">
                <p className="text-xs font-medium opacity-80 mb-1">Your Progress</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold">42%</span>
                  <Layers size={16} />
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div className="bg-white h-full rounded-full w-[42%]" />
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-zinc-100 rounded-md text-zinc-500"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span>{activeCategory}</span>
              <ChevronRight size={14} />
              <span className="font-medium text-zinc-900">{selectedTopic?.title}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search concepts..." 
                className="pl-9 pr-4 py-1.5 bg-zinc-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Learning Section */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto">
              {selectedTopic ? (
                <motion.div
                  key={selectedTopic.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
                      <Sparkles size={12} />
                      {selectedTopic.level}
                    </div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900">
                      {selectedTopic.title}
                    </h2>
                    <p className="text-lg text-zinc-600 leading-relaxed">
                      {selectedTopic.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTopic.concepts.map((concept, idx) => (
                      <div 
                        key={idx}
                        className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm hover:border-indigo-300 transition-colors flex items-start gap-3"
                      >
                        <div className="mt-1 w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium text-zinc-700">{concept}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-zinc-900 rounded-2xl p-6 text-zinc-300 font-mono text-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                      <Terminal size={24} />
                    </div>
                    <div className="flex items-center gap-2 mb-4 text-zinc-500">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                      <span className="ml-2 text-xs">example_code.py</span>
                    </div>
                    <pre className="overflow-x-auto">
                      <code>{`# Sample code for ${selectedTopic.title}
import ${activeCategory.toLowerCase()} as ${activeCategory === 'Pandas' ? 'pd' : activeCategory === 'Spark' ? 'pyspark' : 'py'}

# Let's explore ${selectedTopic.concepts[0]}
print("Mastering ${selectedTopic.title}...")
`}</code>
                    </pre>
                  </div>

                  <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <h4 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                      <BookOpen size={18} />
                      Study Tip
                    </h4>
                    <p className="text-indigo-800/80 text-sm leading-relaxed">
                      To truly master {selectedTopic.title.toLowerCase()}, try implementing a small project using these concepts. 
                      Ask the AI Tutor on the right for a specific project prompt!
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                  <GraduationCap size={64} strokeWidth={1} />
                  <p>Select a topic from the sidebar to start learning.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Tutor Panel */}
          <div className="w-[400px] bg-white border-l border-zinc-200 flex flex-col shadow-2xl">
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-bold text-zinc-700">AI Tutor</span>
              </div>
              <button 
                onClick={() => setMessages([])}
                className="text-xs text-zinc-400 hover:text-zinc-600"
              >
                Clear Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.length === 0 && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                    <MessageSquare size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-zinc-800">Ask me anything!</p>
                    <p className="text-xs text-zinc-500 px-8">
                      I can explain concepts, write code, or generate learning prompts for you.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center px-4">
                    {[
                      "Explain this topic",
                      "Give me a project prompt",
                      "Write a code example",
                      "Quiz me on this",
                      "Master Learning Prompt"
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          const input = suggestion === "Master Learning Prompt" 
                            ? "Generate a comprehensive prompt to teach me about Pandas, Spark, and Python for Data Analysis from beginner to master level."
                            : suggestion;
                          handleSendMessage(undefined, input);
                        }}
                        className="text-[10px] bg-zinc-100 hover:bg-zinc-200 text-zinc-600 px-2 py-1 rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "px-4 py-2 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-indigo-600 text-white rounded-tr-none" 
                      : "bg-zinc-100 text-zinc-800 rounded-tl-none shadow-sm"
                  )}>
                    {msg.role === 'ai' ? (
                      <div className="prose prose-sm prose-zinc max-w-none prose-headings:text-zinc-900 prose-a:text-indigo-600">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 px-1">
                    {msg.role === 'user' ? 'You' : 'Tutor'}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-zinc-400 text-xs italic">
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  Tutor is thinking...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form 
              onSubmit={(e) => handleSendMessage(e)}
              className="p-4 border-t border-zinc-100 bg-zinc-50/50"
            >
              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question..." 
                  className="w-full pl-4 pr-12 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                />
                <button 
                  type="submit"
                  disabled={!chatInput.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 mt-2 text-center">
                Powered by Gemini AI • Expert Data Tutor
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
