
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Search, Menu, X, Sun, Moon, Heart, Globe, DollarSign, Mic } from 'lucide-react';
import { useAppContext } from '../App.js';

interface NavbarProps { onOpenCart: () => void; }

const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const { cart, wishlist, isDarkMode, toggleDarkMode, user, currency, language, setLanguage, setCurrency, abVariant, categories } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const query = event.results[0][0].transcript;
      navigate(`/shop?q=${query}`);
    };
    recognition.start();
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-4 bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-2xl border-b border-gray-100 dark:border-white/5' : 'py-8'}`}
    >
      <div className="container mx-auto px-10 flex items-center justify-between">
        <div className="hidden lg:flex items-center space-x-6">
           <button onClick={() => setLanguage(language === 'EN' ? 'FR' : 'EN')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 hover:text-primary-500">
             <Globe size={12} /> {language}
           </button>
           <button onClick={() => setCurrency('USD')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 hover:text-primary-500">
             <DollarSign size={12} /> {currency.code}
           </button>
        </div>

        <Link to="/" className="text-3xl font-black tracking-tighter flex items-center">
          SWEET<span className={abVariant === 'B' ? 'text-primary-500' : 'text-gray-900 dark:text-white'}>LUXE</span>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-6">
          <button onClick={startVoiceSearch} className={`p-3 rounded-full transition-all ${isListening ? 'bg-primary-500 text-white animate-pulse' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>
            <Mic size={20} />
          </button>
          
          <Link to={user ? "/profile" : "/login"} className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 relative group">
             <User size={20} className={user ? 'text-primary-500' : ''} />
             {!user && <span className="absolute top-2 right-2 w-2 h-2 bg-gray-400 rounded-full" />}
          </Link>

          {user?.role === 'admin' && (
             <Link to="/admin" className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-purple-500" title="Admin Dashboard">
               <span className="sr-only">Admin Dashboard</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="3" y2="21"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
             </Link>
          )}

          <button onClick={toggleDarkMode} className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/wishlist" className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 relative">
            <Heart size={20} className={wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''} />
            {wishlist.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />}
          </Link>
          <button onClick={onOpenCart} className="p-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl flex items-center space-x-3 shadow-xl hover:scale-105 transition-all">
            <ShoppingBag size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">{cart.length} Units</span>
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-3"><Menu size={24} /></button>
        </div>
      </div>

      {/* Main Topics / Categories Bar */}
      <div className={`hidden lg:flex justify-center border-t border-gray-100 dark:border-white/5 transition-all duration-300 ${isScrolled ? 'mt-2 pt-2 opacity-0 h-0 overflow-hidden' : 'mt-6 pt-4 opacity-100 h-auto'}`}>
         <div className="flex items-center space-x-12">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                className="group relative"
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors">
                  {category.name}
                </span>
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
         </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
