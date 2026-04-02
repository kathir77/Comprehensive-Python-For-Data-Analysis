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
  RefreshCw,
  CheckCircle,
  XCircle,
  Trophy
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CURRICULUM } from './constants';
import { Topic } from './types';
import { GoogleGenAI } from "@google/genai";
import { SparkArchitectureDiagram } from './components/SparkArchitectureDiagram';
import { PandasDataFlowDiagram } from './components/PandasDataFlowDiagram';
import { PythonEditor } from './components/PythonEditor';

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
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'study' | 'flashcards' | 'projects' | 'quiz'>('study');
  const [currentFlashcardIdx, setCurrentFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);

  // Calculate total progress
  const totalTopics = Object.values(CURRICULUM).flat().length;
  const progressPercentage = Math.round((completedTopicIds.length / totalTopics) * 100);

  const allTopics = Object.entries(CURRICULUM).flatMap(([category, topics]) => 
    topics.map(topic => ({ ...topic, category }))
  );

  const filteredResults = searchQuery.trim() === '' 
    ? [] 
    : allTopics.filter(topic => 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.concepts.some(concept => concept.toLowerCase().includes(searchQuery.toLowerCase())) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8);

  // Set initial topic
  useEffect(() => {
    if (!selectedTopic) {
      setSelectedTopic(CURRICULUM['Python'][0]);
    }
  }, [selectedTopic]);

  // Reset flashcards and quiz when topic changes
  useEffect(() => {
    setCurrentFlashcardIdx(0);
    setIsFlipped(false);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setQuizScore(0);
    setQuizFinished(false);
  }, [selectedTopic]);

  const handleAnswer = (optionIdx: number) => {
    if (showFeedback || !selectedTopic?.quiz) return;
    
    setSelectedAnswer(optionIdx);
    setShowFeedback(true);
    
    if (optionIdx === selectedTopic.quiz[currentQuestionIdx].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (!selectedTopic?.quiz) return;
    
    if (currentQuestionIdx < selectedTopic.quiz.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizFinished(true);
      // Mark topic as completed if score is at least 80%
      const finalScore = quizScore + (selectedAnswer === selectedTopic.quiz[currentQuestionIdx].correctAnswer ? 1 : 0);
      if (finalScore >= selectedTopic.quiz.length * 0.8) {
        if (!completedTopicIds.includes(selectedTopic.id)) {
          setCompletedTopicIds(prev => [...prev, selectedTopic.id]);
        }
      }
    }
  };

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
                          <div className="flex items-center gap-2 truncate">
                            {completedTopicIds.includes(topic.id) && (
                              <CheckCircle size={14} className="text-green-500 shrink-0" />
                            )}
                            <span className="truncate">{topic.title}</span>
                          </div>
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
                  <span className="text-lg font-bold">{progressPercentage}%</span>
                  <Layers size={16} />
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-[10px] mt-2 opacity-70">
                  {completedTopicIds.length} of {totalTopics} topics completed
                </p>
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
                placeholder="Search topics or concepts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200) /* Delay to allow clicking result */}
                className="pl-9 pr-4 py-1.5 bg-zinc-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              
              {/* Search Results Dropdown */}
              <AnimatePresence>
                {isSearchFocused && filteredResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-2">
                      {filteredResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => {
                            setActiveCategory(result.category);
                            setSelectedTopic(result);
                            setSearchQuery('');
                          }}
                          className="w-full text-left p-3 hover:bg-zinc-50 rounded-xl transition-colors group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{result.category}</span>
                            <span className="text-[10px] font-medium text-zinc-400">{result.level}</span>
                          </div>
                          <h4 className="text-sm font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">{result.title}</h4>
                          <p className="text-[10px] text-zinc-500 line-clamp-1">{result.description}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {!isChatOpen && (
              <button
                onClick={() => setIsChatOpen(true)}
                className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-all shadow-md"
              >
                <MessageSquare size={16} />
                AI Tutor
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Learning Section */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto">
              {selectedTopic ? (
                <div className="space-y-8">
                  {/* Tabs */}
                  <div className="flex border-b border-zinc-200">
                    <button 
                      onClick={() => setActiveTab('study')}
                      className={cn(
                        "px-6 py-3 text-sm font-medium border-b-2 transition-all",
                        activeTab === 'study' ? "border-indigo-600 text-indigo-600" : "border-transparent text-zinc-500 hover:text-zinc-700"
                      )}
                    >
                      Study Guide
                    </button>
                    {selectedTopic.flashcards && (
                      <button 
                        onClick={() => setActiveTab('flashcards')}
                        className={cn(
                          "px-6 py-3 text-sm font-medium border-b-2 transition-all",
                          activeTab === 'flashcards' ? "border-indigo-600 text-indigo-600" : "border-transparent text-zinc-500 hover:text-zinc-700"
                        )}
                      >
                        Flashcards
                      </button>
                    )}
                    {selectedTopic.projects && (
                      <button 
                        onClick={() => setActiveTab('projects')}
                        className={cn(
                          "px-6 py-3 text-sm font-medium border-b-2 transition-all",
                          activeTab === 'projects' ? "border-indigo-600 text-indigo-600" : "border-transparent text-zinc-500 hover:text-zinc-700"
                        )}
                      >
                        Projects
                      </button>
                    )}
                    {selectedTopic.quiz && (
                      <button 
                        onClick={() => setActiveTab('quiz')}
                        className={cn(
                          "px-6 py-3 text-sm font-medium border-b-2 transition-all",
                          activeTab === 'quiz' ? "border-indigo-600 text-indigo-600" : "border-transparent text-zinc-500 hover:text-zinc-700"
                        )}
                      >
                        Quiz
                      </button>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'study' ? (
                      <motion.div
                        key="study"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
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

                        {selectedTopic.diagram === 'spark-arch' && (
                          <SparkArchitectureDiagram />
                        )}

                        {selectedTopic.diagram === 'pandas-flow' && (
                          <PandasDataFlowDiagram />
                        )}

                        {selectedTopic.conceptExplanations && (
                          <div className="space-y-6">
                            <div className="flex items-center gap-2 text-zinc-900">
                              <div className="p-2 bg-indigo-100 rounded-lg">
                                <BookOpen size={20} className="text-indigo-600" />
                              </div>
                              <h3 className="text-xl font-bold">Why these concepts matter in Data Analysis</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              {selectedTopic.conceptExplanations.map((item, idx) => (
                                <div 
                                  key={idx}
                                  className="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl hover:bg-white hover:shadow-md transition-all group"
                                >
                                  <h4 className="text-zinc-900 font-bold mb-2 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform" />
                                    {item.title}
                                  </h4>
                                  <p className="text-zinc-600 text-sm leading-relaxed">
                                    {item.explanation}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <PythonEditor 
                          topicTitle={selectedTopic.title}
                          initialCode={selectedTopic.codeSnippet ? selectedTopic.codeSnippet.trim() : `# Sample code for ${selectedTopic.title}
import ${activeCategory.toLowerCase()} as ${activeCategory === 'Pandas' ? 'pd' : activeCategory === 'Spark' ? 'pyspark' : 'py'}

# Let's explore ${selectedTopic.concepts[0]}
print("Mastering ${selectedTopic.title}...")
`} 
                        />

                        {selectedTopic.codeExplanation && (
                          <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                            <h4 className="text-zinc-900 font-bold mb-3 flex items-center gap-2">
                              <Zap size={18} className="text-indigo-600" />
                              Code Explanation
                            </h4>
                            <p className="text-zinc-600 text-sm leading-relaxed">
                              {selectedTopic.codeExplanation}
                            </p>
                          </div>
                        )}

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
                    ) : activeTab === 'flashcards' ? (
                      <motion.div
                        key="flashcards"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="space-y-8 flex flex-col items-center"
                      >
                        <div className="text-center space-y-2">
                          <h2 className="text-2xl font-bold text-zinc-900">Flashcards</h2>
                          <p className="text-sm text-zinc-500">Click to flip the card</p>
                        </div>

                        {selectedTopic.flashcards && (
                          <div className="w-full max-w-md perspective-1000">
                            <motion.div
                              className="relative w-full h-64 cursor-pointer preserve-3d transition-transform duration-500"
                              animate={{ rotateY: isFlipped ? 180 : 0 }}
                              onClick={() => setIsFlipped(!isFlipped)}
                            >
                              {/* Front */}
                              <div className="absolute inset-0 backface-hidden bg-white border-2 border-indigo-100 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center">
                                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4">Term</span>
                                <h3 className="text-2xl font-bold text-zinc-900">{selectedTopic.flashcards[currentFlashcardIdx].term}</h3>
                              </div>
                              {/* Back */}
                              <div 
                                className="absolute inset-0 backface-hidden bg-indigo-600 border-2 border-indigo-500 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center text-white"
                                style={{ transform: 'rotateY(180deg)' }}
                              >
                                <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-4">Definition</span>
                                <p className="text-lg leading-relaxed">{selectedTopic.flashcards[currentFlashcardIdx].definition}</p>
                              </div>
                            </motion.div>

                            <div className="mt-8 flex items-center justify-between w-full">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentFlashcardIdx(prev => Math.max(0, prev - 1));
                                  setIsFlipped(false);
                                }}
                                disabled={currentFlashcardIdx === 0}
                                className="p-3 bg-white border border-zinc-200 rounded-full text-zinc-600 disabled:opacity-30 hover:bg-zinc-50 transition-colors"
                              >
                                <ChevronRight size={24} className="rotate-180" />
                              </button>
                              <span className="text-sm font-medium text-zinc-500">
                                {currentFlashcardIdx + 1} / {selectedTopic.flashcards.length}
                              </span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentFlashcardIdx(prev => Math.min(selectedTopic.flashcards!.length - 1, prev + 1));
                                  setIsFlipped(false);
                                }}
                                disabled={currentFlashcardIdx === selectedTopic.flashcards.length - 1}
                                className="p-3 bg-white border border-zinc-200 rounded-full text-zinc-600 disabled:opacity-30 hover:bg-zinc-50 transition-colors"
                              >
                                <ChevronRight size={24} />
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ) : activeTab === 'projects' ? (
                      <motion.div
                        key="projects"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="space-y-8"
                      >
                        <div className="text-center space-y-2">
                          <h2 className="text-2xl font-bold text-zinc-900">Hands-on Projects</h2>
                          <p className="text-sm text-zinc-500">Apply your knowledge with these practical projects.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          {selectedTopic.projects?.map((project, idx) => (
                            <div 
                              key={idx}
                              className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                  <Code size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900">{project.title}</h3>
                              </div>
                              <p className="text-zinc-600 mb-6">{project.description}</p>
                              <div className="space-y-3">
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Project Tasks</h4>
                                {project.tasks.map((task, tIdx) => (
                                  <div key={tIdx} className="flex items-start gap-3 text-sm text-zinc-700">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                    <span>{task}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="quiz"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="space-y-8"
                      >
                        {!quizFinished ? (
                          <div className="max-w-xl mx-auto space-y-8">
                            <div className="flex items-center justify-between">
                              <h2 className="text-2xl font-bold text-zinc-900">Quiz</h2>
                              <span className="text-sm font-medium text-zinc-500">
                                Question {currentQuestionIdx + 1} of {selectedTopic.quiz?.length}
                              </span>
                            </div>

                            {selectedTopic.quiz && (
                              <div className="space-y-6">
                                <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                                  <p className="text-lg font-medium text-zinc-800">
                                    {selectedTopic.quiz[currentQuestionIdx].question}
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                  {selectedTopic.quiz[currentQuestionIdx].options.map((option, idx) => {
                                    const isCorrect = idx === selectedTopic.quiz![currentQuestionIdx].correctAnswer;
                                    const isSelected = idx === selectedAnswer;
                                    
                                    return (
                                      <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        disabled={showFeedback}
                                        className={cn(
                                          "p-4 text-left border-2 rounded-xl transition-all flex items-center justify-between",
                                          !showFeedback && "border-zinc-100 hover:border-indigo-200 hover:bg-indigo-50/30",
                                          showFeedback && isCorrect && "border-green-500 bg-green-50 text-green-900",
                                          showFeedback && isSelected && !isCorrect && "border-red-500 bg-red-50 text-red-900",
                                          showFeedback && !isSelected && !isCorrect && "border-zinc-100 opacity-50"
                                        )}
                                      >
                                        <span className="font-medium">{option}</span>
                                        {showFeedback && isCorrect && <CheckCircle className="text-green-500" size={20} />}
                                        {showFeedback && isSelected && !isCorrect && <XCircle className="text-red-500" size={20} />}
                                      </button>
                                    );
                                  })}
                                </div>

                                {showFeedback && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3"
                                  >
                                    <div className="flex items-center gap-2 font-bold">
                                      {selectedAnswer === selectedTopic.quiz[currentQuestionIdx].correctAnswer ? (
                                        <span className="text-green-600">Correct!</span>
                                      ) : (
                                        <span className="text-red-600">Incorrect</span>
                                      )}
                                    </div>
                                    <p className="text-zinc-600 text-sm leading-relaxed">
                                      {selectedTopic.quiz[currentQuestionIdx].explanation}
                                    </p>
                                    <button
                                      onClick={nextQuestion}
                                      className="mt-4 w-full py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors"
                                    >
                                      {currentQuestionIdx < selectedTopic.quiz.length - 1 ? "Next Question" : "Finish Quiz"}
                                    </button>
                                  </motion.div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="max-w-xl mx-auto text-center space-y-8 py-12">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                              <Trophy size={48} />
                            </div>
                            <div className="space-y-2">
                              <h2 className="text-4xl font-extrabold text-zinc-900">Quiz Complete!</h2>
                              <p className="text-zinc-500 text-lg">
                                You scored <span className="text-indigo-600 font-bold">{quizScore}</span> out of <span className="font-bold">{selectedTopic.quiz?.length}</span>
                              </p>
                            </div>
                            
                            <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                              <p className="text-zinc-600 mb-6">
                                {quizScore === selectedTopic.quiz?.length 
                                  ? "Perfect score! You've mastered this topic." 
                                  : "Great effort! Review the study guide and try again to improve your score."}
                              </p>
                              <button
                                onClick={() => {
                                  setCurrentQuestionIdx(0);
                                  setSelectedAnswer(null);
                                  setShowFeedback(false);
                                  setQuizScore(0);
                                  setQuizFinished(false);
                                }}
                                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                              >
                                Retake Quiz
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                  <GraduationCap size={64} strokeWidth={1} />
                  <p>Select a topic from the sidebar to start learning.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Tutor Panel */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div 
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-[400px] bg-white border-l border-zinc-200 flex flex-col shadow-2xl z-10"
              >
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-bold text-zinc-700">AI Tutor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setMessages([])}
                      className="text-xs text-zinc-400 hover:text-zinc-600 px-2 py-1 hover:bg-zinc-100 rounded transition-colors"
                    >
                      Clear Chat
                    </button>
                    <button 
                      onClick={() => setIsChatOpen(false)}
                      className="p-1 hover:bg-zinc-100 rounded-md text-zinc-400 hover:text-zinc-600 transition-colors"
                      title="Close Tutor"
                    >
                      <X size={18} />
                    </button>
                  </div>
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
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
