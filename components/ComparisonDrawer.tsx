
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../App.js';
import { Link } from 'react-router-dom';

const ComparisonDrawer: React.FC = () => {
  const { comparisonList, toggleComparison } = useAppContext();

  if (comparisonList.length === 0) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-2xl border-t border-gray-100 dark:border-white/10 shadow-2xl p-6"
    >
      <div className="container mx-auto flex items-center justify-between gap-8">
        <div className="flex items-center space-x-6 shrink-0">
          <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Scale size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest">Compare Logic</h4>
            <p className="text-[10px] text-gray-500 font-bold">{comparisonList.length}/3 Assets Analysis</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center gap-4">
          <AnimatePresence>
            {comparisonList.map(p => (
              <motion.div 
                key={p.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative group bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center space-x-3 w-48"
              >
                <img src={p.images[0]} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase truncate tracking-tight">{p.name}</p>
                  <p className="text-[10px] font-bold text-primary-500">${p.price}</p>
                </div>
                <button 
                  onClick={() => toggleComparison(p)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {comparisonList.length < 3 && (
            <div className="w-48 h-[66px] rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
              Empty Slot
            </div>
          )}
        </div>

        <div className="shrink-0 flex items-center space-x-4">
          <button className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-3 shadow-xl">
            <span>Analyze Diff</span>
            <ArrowRight size={14} />
          </button>
          <button 
            onClick={() => comparisonList.forEach(p => toggleComparison(p))}
            className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ComparisonDrawer;
