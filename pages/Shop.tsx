import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Grid, List, Search, ArrowRight, X, PackageSearch, Sparkles } from 'lucide-react';
import { useAppContext } from '../App.js';
import ProductCard from '../components/ProductCard.js';
import { CATEGORIES } from '../constants.js';
import { Link, useNavigate } from 'react-router-dom';

const Shop: React.FC = () => {
  const { products } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // default latest
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Quick results for the dropdown
  const quickResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return products
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [searchQuery, products]);

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-primary-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block"
          >
            Professional Atelier
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase leading-none"
          >
            Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-amber-500">Catalogue</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-xl font-medium"
          >
            Sourcing the world's most elite confectionery assets. Use our real-time intelligence interface to filter by segment or search by keyword.
          </motion.p>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12 border-b border-gray-100 dark:border-white/5 pb-8">
          {/* Categories Scrollable */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-2 no-scrollbar w-full lg:w-auto">
            {['All', ...CATEGORIES.map(c => c.name)].map((cat, idx) => (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/30' 
                    : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Real-time Enhanced Search */}
            <div ref={searchRef} className="relative w-full sm:w-80 group">
              <div className={`relative z-20 transition-all duration-500 ${isSearchFocused ? 'scale-105' : ''}`}>
                <Search size={18} className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? 'text-primary-500' : 'text-gray-400'}`} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search assets..."
                  className="w-full pl-14 pr-12 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all border border-transparent dark:border-white/5"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-400"
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Real-time Results Dropdown */}
              <AnimatePresence>
                {isSearchFocused && searchQuery.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-3 z-[60] glass border border-gray-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden p-2"
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 mb-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center">
                          <Sparkles size={12} className="mr-2 text-primary-500" /> Matches Found
                       </p>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto no-scrollbar">
                      {quickResults.length > 0 ? (
                        <div className="space-y-1">
                          {quickResults.map((product) => (
                            <motion.button
                              key={product.id}
                              whileHover={{ x: 4 }}
                              onClick={() => {
                                setIsSearchFocused(false);
                                navigate(`/product/${product.id}`);
                              }}
                              className="w-full flex items-center p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left"
                            >
                              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/10 overflow-hidden shrink-0 border border-gray-100 dark:border-white/10">
                                <img src={product.images[0]} className="w-full h-full object-cover" />
                              </div>
                              <div className="ml-4 flex-1 min-w-0">
                                <p className="font-black text-[10px] uppercase truncate">{product.name}</p>
                                <p className="text-[10px] text-primary-500 font-bold mt-0.5">${product.price}</p>
                              </div>
                              <ArrowRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 text-center">
                           <PackageSearch size={24} className="mx-auto mb-4 text-gray-300" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No Direct Asset Match</p>
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/10 mt-2">
                       <p className="text-[8px] font-black uppercase tracking-[0.3em] text-center text-gray-400 italic">Press Enter for deep intelligence scan</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort Interface */}
            <div className="relative w-full sm:w-auto">
              <SlidersHorizontal size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer border border-transparent dark:border-white/5"
              >
                <option value="latest">Sort: Registry</option>
                <option value="price-low">Value: Ascending</option>
                <option value="price-high">Value: Descending</option>
                <option value="rating">Metric: Performance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-32 text-center bg-gray-50 dark:bg-white/[0.02] rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-white/10"
          >
            <PackageSearch size={48} className="mx-auto mb-6 text-gray-200" />
            <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Null Sector</h3>
            <p className="text-gray-500 font-medium">No assets matching your intelligence query were located in the registry.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-10 px-10 py-4 bg-primary-600 text-white rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary-500/20 hover:scale-105 transition-all"
            >
              Reset All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Shop;
