import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types.js';
import { useAppContext } from '../App.js';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, setCart, wishlist, toggleWishlist, addToast } = useAppContext();
  const navigate = useNavigate();

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        addToast(`Increased ${product.name} quantity`, "success");
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      addToast(`Added ${product.name} to bag`, "success");
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -12 }}
      className="group relative bg-white dark:bg-white/5 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] transition-all duration-500 glass border border-transparent hover:border-primary-500/20"
    >
      {/* Visual Container */}
      <div className="aspect-[4/5] overflow-hidden relative cursor-pointer" onClick={handleViewDetails}>
        <motion.img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Overlay Actions - These are now clear of nested Link constraints */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-4 z-10">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="px-8 py-3 bg-white dark:bg-gray-900 rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-xl"
          >
            Add to Bag
          </motion.button>
          <div className="flex space-x-3">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className={`p-3 rounded-full transition-all transform shadow-lg ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white dark:bg-gray-900 hover:text-red-500'}`}
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleViewDetails}
              className="p-3 bg-white dark:bg-gray-900 rounded-full hover:text-primary-500 transition-all transform shadow-lg"
            >
              <Eye size={18} />
            </motion.button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-0">
          {product.discountPrice && (
            <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
              SAVE ${product.price - product.discountPrice}
            </span>
          )}
          {product.featured && (
            <span className="bg-primary-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
              EXCLUSIVE
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 cursor-pointer" onClick={handleViewDetails}>
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] text-primary-500 dark:text-primary-400 font-black uppercase tracking-[0.2em]">
            {product.category}
          </p>
          <div className="flex items-center text-amber-500">
            <Star size={12} fill="currentColor" />
            <span className="text-[10px] font-black ml-1 text-gray-900 dark:text-white">{product.rating}</span>
          </div>
        </div>
        <h3 className="font-bold text-lg mb-2 truncate group-hover:text-primary-500 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center space-x-3">
          <span className="text-xl font-black">${product.discountPrice || product.price}</span>
          {product.discountPrice && (
            <span className="text-sm text-gray-400 line-through">${product.price}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;