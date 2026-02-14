import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight, Trash2, Share2, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../App.js';
import ProductCard from '../components/ProductCard.js';

const Wishlist: React.FC = () => {
  const { wishlist, products, toggleWishlist, addToast } = useAppContext();
  const [isCopied, setIsCopied] = React.useState(false);
  
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/#/shop?wishlist=${wishlist.join(',')}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      addToast("Wishlist intelligence link copied to clipboard", "success");
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-primary-500 font-bold uppercase tracking-widest text-xs">Your Collection</span>
            <h1 className="text-5xl font-black mt-2 tracking-tighter uppercase">Registry Saved</h1>
          </div>
          <div className="flex items-center space-x-4">
             {wishlistedProducts.length > 0 && (
               <button 
                 onClick={handleShare}
                 className="flex items-center space-x-3 px-6 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-all shadow-sm"
               >
                 {isCopied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                 <span>{isCopied ? 'Link Dispatched' : 'Share Collection'}</span>
               </button>
             )}
             <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">
                {wishlistedProducts.length} Assets Logged
             </p>
          </div>
        </div>

        {wishlistedProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode='popLayout'>
              {wishlistedProducts.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
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
            className="text-center py-32 bg-gray-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-white/10"
          >
            <div className="w-24 h-24 bg-white dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Heart size={40} className="text-gray-300" />
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tight uppercase">Wishlist Null</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto">
              Archive assets you desire to track them within your profile intelligence suite.
            </p>
            <Link 
              to="/shop" 
              className="inline-flex items-center space-x-3 px-10 py-4 bg-primary-600 text-white rounded-full font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20"
            >
              <span>Explore Atelier</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;