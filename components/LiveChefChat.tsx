
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Wand2, ChefHat, Sparkles, Loader2 } from 'lucide-react';
import { useAppContext } from '../App.js';

const LiveChefChat: React.FC = () => {
  const { aiService, products } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'chef'; text: string }[]>([
    { role: 'chef', text: 'Bienvenue! I am Chef Pierre, your AI pâtisserie expert. How can I refine your creations today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Use proper chat method
      const response = await aiService.chatWithChef(userMsg);
      setMessages(prev => [...prev, { role: 'chef', text: response || "I'm contemplating the finest technique... could you rephrase?" }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'chef', text: "Forgive me, the kitchen is a bit busy. How else can I help?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[55] w-16 h-16 bg-primary-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary-500/40 border-4 border-white dark:border-gray-900"
      >
        <ChefHat size={28} />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-28 right-8 z-[55] w-[400px] h-[600px] bg-white dark:bg-[#15171c] rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-white/10 flex flex-col overflow-hidden glass"
          >
            {/* Header */}
            <div className="p-8 bg-gray-50 dark:bg-white/[0.03] border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-500">
                  <ChefHat size={24} />
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-widest text-sm">Chef Pierre</h3>
                  <div className="flex items-center text-[10px] text-emerald-500 font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse mr-2" />
                    Live Assist Active
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6 no-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-5 rounded-[2rem] text-sm font-medium leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-primary-600 text-white rounded-tr-none' 
                      : 'bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-200 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-white/5 p-5 rounded-[2rem] rounded-tl-none">
                    <Loader2 size={16} className="animate-spin text-primary-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 border-t border-gray-100 dark:border-white/5">
              <div className="relative">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about recipes, inventory..."
                  className="w-full pl-6 pr-14 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-xl shadow-lg">
                  <Send size={18} />
                </button>
              </div>
              <p className="mt-3 text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                <Sparkles size={10} /> Powered by LuxeIntelligence AI
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChefChat;
