import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App.js';
import { Product } from '../types.js';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, setCart, aiService, products, addToast } = useAppContext();
  const [upsell, setUpsell] = useState<{ product: Product; reason: string } | null>(null);
  const [isLoadingUpsell, setIsLoadingUpsell] = useState(false);
  const navigate = useNavigate();

  // Handle AI Upsell Suggestion
  useEffect(() => {
    if (isOpen && cart.length > 0) {
      setIsLoadingUpsell(true);
      aiService.getCartUpsell(cart, products).then(result => {
        if (result && result.productId) {
          const product = products.find(p => p.id === result.productId);
          if (product) {
            setUpsell({ product, reason: result.reason });
          }
        }
        setIsLoadingUpsell(false);
      });
    } else {
      setUpsell(null);
    }
  }, [isOpen, cart, products, aiService]);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const addUpsellToCart = () => {
    if (!upsell) return;
    setCart(prev => [...prev, { ...upsell.product, quantity: 1 }]);
    addToast(`Added recommended ${upsell.product.name}`, "success");
    setUpsell(null);
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#0f1115] z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="text-primary-500" />
                <h2 className="text-xl font-black uppercase tracking-tight">Your Bag</h2>
                <span className="bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full text-xs font-bold">
                  {cart.length}
                </span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} className="text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Your bag is empty</h3>
                    <p className="text-gray-500 text-sm">Looks like you haven't added anything yet.</p>
                  </div>
                  <button 
                    onClick={() => { onClose(); navigate('/shop'); }}
                    className="px-8 py-3 bg-primary-600 text-white rounded-full font-bold hover:bg-primary-700 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <motion.div 
                      layout
                      key={item.id} 
                      className="flex items-center space-x-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl group"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm truncate">{item.name}</h4>
                        <p className="text-primary-500 font-black text-sm">${item.discountPrice || item.price}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10"><Minus size={14} /></button>
                            <span className="px-3 text-sm font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10"><Plus size={14} /></button>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}

                  {/* AI Upsell Section */}
                  <AnimatePresence>
                    {upsell && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-6 bg-primary-500/5 rounded-[2.5rem] border border-primary-500/10"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Wand2 className="text-primary-500" size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary-500">AI Recommendation</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                            <img src={upsell.product.images[0]} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs truncate">{upsell.product.name}</h4>
                            <p className="text-[10px] text-gray-500 font-medium italic leading-tight mt-1">"{upsell.reason}"</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-xs text-primary-500">${upsell.product.price}</p>
                          </div>
                        </div>
                        <button 
                          onClick={addUpsellToCart}
                          className="w-full py-2.5 bg-primary-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all flex items-center justify-center space-x-2"
                        >
                          <Plus size={14} />
                          <span>Add to Project</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-2xl font-black">${subtotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => { onClose(); navigate('/checkout'); }}
                  className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary-700 transition-all transform hover:scale-[1.02] shadow-xl shadow-primary-500/20"
                >
                  Checkout Now
                </button>
                <div className="flex items-center justify-center space-x-2 mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <Sparkles size={10} />
                  <span>AI Personalized Checkout</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;