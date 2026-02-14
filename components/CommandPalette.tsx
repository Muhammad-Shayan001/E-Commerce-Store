import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ShoppingBag, Package, LayoutDashboard, Settings, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App.js';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { products, user, aiService } = useAppContext();
  const [query, setQuery] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const navigate = useNavigate();

  // Handle AI Autocomplete
  useEffect(() => {
    if (query.length < 3) {
      setAiSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingAi(true);
      const suggestions = await aiService.getSmartSearchSuggestions(query, products);
      setAiSuggestions(suggestions);
      setIsLoadingAi(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [query, products, aiService]);

  const results = useMemo(() => {
    if (!query) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, [query, products]);

  const navItems = [
    { name: 'Shop Catalogue', path: '/shop', icon: <ShoppingBag size={18} />, admin: false },
    { name: 'My Profile', path: '/profile', icon: <Settings size={18} />, admin: false },
    { name: 'Admin Dashboard', path: '/admin', icon: <LayoutDashboard size={18} />, admin: true },
    { name: 'Product Inventory', path: '/admin/products', icon: <Package size={18} />, admin: true },
  ].filter(item => !item.admin || user?.role === 'admin');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const handleAction = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#1a1c22] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden"
          >
            <div className="relative p-6 border-b border-gray-100 dark:border-white/5">
              <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Search premium tech or ask AI..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/5 pl-14 pr-6 py-4 rounded-2xl outline-none font-medium transition-all focus:ring-2 focus:ring-primary-500"
              />
              {isLoadingAi && (
                <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 text-primary-500 animate-spin" size={20} />
              )}
            </div>

            <div className="max-h-[450px] overflow-y-auto p-4 no-scrollbar">
              {aiSuggestions.length > 0 && (
                <div className="mb-6 px-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles size={14} className="text-primary-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">AI Suggestions</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuery(suggestion)}
                        className="px-4 py-2 bg-primary-500/10 text-primary-500 rounded-full text-xs font-bold hover:bg-primary-500 hover:text-white transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query && results.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-4">Products Found</p>
                  <div className="space-y-1">
                    {results.map(product => (
                      <button
                        key={product.id}
                        onClick={() => handleAction(`/product/${product.id}`)}
                        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 overflow-hidden shrink-0">
                            <img src={product.images[0]} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-sm truncate">{product.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-black">{product.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-primary-500 font-black text-sm">${product.price}</span>
                          <ArrowRight size={14} className="text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-4">Instant Navigation</p>
                <div className="space-y-1">
                  {navItems.map(item => (
                    <button
                      key={item.path}
                      onClick={() => handleAction(item.path)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-primary-500/10 hover:text-primary-500 transition-all text-left font-bold text-sm"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500">
                          {item.icon}
                        </div>
                        <span>{item.name}</span>
                      </div>
                      <span className="text-[10px] bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-400 font-black">Jump</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span className="bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-black">ESC</span>
                  <span className="text-[10px] text-gray-500 font-bold">to close</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-black">ENTER</span>
                  <span className="text-[10px] text-gray-500 font-bold">to select</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-gray-400">
                <Sparkles size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Powered by Gemini AI</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;