import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Heart, Star, ArrowLeft, Send, PackageSearch, 
  Sparkles, Wand2, ShieldCheck, Scale, Award, Info, ChevronRight,
  MessageCircle, HelpCircle, Box, Gift, ChevronDown, CheckCircle
} from 'lucide-react';
import { useAppContext } from '../App.js';
import { Review, Product } from '../types.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { 
    products, setProducts, setCart, 
    wishlist, toggleWishlist, comparisonList, toggleComparison,
    addToast, user, aiService, userActivities 
  } = useAppContext();
  
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  const storyRef = useRef<HTMLDivElement>(null);
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [aiInsight, setAiInsight] = useState<string>('');
  const [personalizedRecs, setPersonalizedRecs] = useState<Product[]>([]);
  
  // Experimental: Configurator State
  const [packaging, setPackaging] = useState<'Standard' | 'Gift' | 'Atelier Premium'>('Standard');
  const [customNote, setCustomNote] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);

  const isWishlisted = wishlist.includes(product?.id || '');
  const isCompared = comparisonList.some(p => p.id === product?.id);

  useEffect(() => {
    if (product) {
      window.scrollTo(0, 0);
      aiService.getChefInsights(product).then(setAiInsight);
      aiService.getPersonalizedRecommendations(userActivities, products).then(ids => {
        setPersonalizedRecs(products.filter(p => ids.includes(p.id) && p.id !== product.id));
      });
    }
  }, [product, id]);

  useEffect(() => {
    if (storyRef.current && product?.story) {
      const storyCards = storyRef.current.querySelectorAll('.story-card');
      storyCards.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out",
          delay: i * 0.2
        });
      });
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...prev, { ...product, quantity }];
    });
    addToast(`Added ${product.name} to bag`, "success");
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        <button onClick={() => navigate(-1)} className="mb-12 flex items-center space-x-3 text-[10px] font-black text-gray-400 hover:text-primary-500 transition-all uppercase tracking-[0.2em]">
          <ArrowLeft size={16} /> <span>Exit Analytics</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          {/* Visual System */}
          <div className="space-y-8">
            <motion.div layoutId={`img-${product.id}`} className="aspect-square rounded-[4.5rem] overflow-hidden bg-gray-50 dark:bg-white/5 relative group shadow-2xl border border-gray-100 dark:border-white/5">
              <img src={product.images[activeImage]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              {product.isVerified && (
                <div className="absolute top-8 left-8 flex items-center space-x-2 bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl">
                  <ShieldCheck size={16} /> <span>Verified Pure</span>
                </div>
              )}
            </motion.div>
            <div className="grid grid-cols-4 gap-6">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`aspect-square rounded-[1.5rem] overflow-hidden border-2 transition-all ${activeImage === i ? 'border-primary-500 shadow-xl' : 'border-transparent opacity-40'}`}>
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Intelligence Interface */}
          <div className="flex flex-col">
            <div className="mb-10">
              <span className="text-primary-500 font-black uppercase tracking-[0.4em] text-[10px]">{product.category}</span>
              <h1 className="text-5xl md:text-8xl font-black mt-3 tracking-tighter leading-none">{product.name}</h1>
              
              {aiInsight && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-8 bg-primary-500/5 rounded-[3rem] border border-primary-500/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-3 flex items-center"><Sparkles size={14} className="mr-2" /> AI Intelligence Report</p>
                  <p className="text-sm font-medium leading-relaxed italic text-gray-700 dark:text-gray-300">"{aiInsight}"</p>
                </motion.div>
              )}
            </div>

            <div className="mb-12 relative">
              <div className="flex items-baseline space-x-6">
                <span className="text-7xl font-black tracking-tighter">${product.discountPrice || product.price}</span>
                {product.discountPrice && <span className="text-3xl text-gray-400 line-through opacity-50 font-medium">${product.price}</span>}
                <button 
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="ml-4 p-2 bg-gray-100 dark:bg-white/5 rounded-full hover:text-primary-500 transition-all"
                >
                  <Info size={18} />
                </button>
              </div>
              
              <AnimatePresence>
                {showBreakdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-4 p-6 glass border border-white/10 rounded-3xl shadow-2xl z-20 w-64"
                  >
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Pricing Logic</h4>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-bold text-gray-500"><span>Artisan Labor</span> <span>45%</span></div>
                       <div className="flex justify-between text-[10px] font-bold text-gray-500"><span>Global Logistics</span> <span>25%</span></div>
                       <div className="flex justify-between text-[10px] font-bold text-gray-500"><span>Materials</span> <span>30%</span></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Experimental: Product Configurator */}
            <div className="mb-12 p-8 bg-gray-50 dark:bg-white/[0.03] rounded-[3rem] border border-gray-100 dark:border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center">
                <Box size={14} className="mr-2" /> Logistics Configuration
              </h3>
              <div className="space-y-6">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest mb-4">Atelier Packaging</p>
                   <div className="flex gap-4">
                      {['Standard', 'Gift', 'Atelier Premium'].map(opt => (
                        <button 
                          key={opt}
                          onClick={() => setPackaging(opt as any)}
                          className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${packaging === opt ? 'bg-primary-500 text-white border-primary-500 shadow-lg' : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-500'}`}
                        >
                          {opt}
                        </button>
                      ))}
                   </div>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest mb-4">Personalized Dispatch Note</p>
                   <textarea 
                     value={customNote}
                     onChange={(e) => setCustomNote(e.target.value)}
                     className="w-full p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none h-20"
                     placeholder="Enter custom artisanal instructions..."
                   />
                </div>
              </div>
            </div>

            {/* Interaction System */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
               <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                  <div className="flex items-center space-x-4 bg-white dark:bg-black/20 p-1 rounded-2xl shadow-sm">
                    <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-10 h-10 font-black">-</button>
                    <span className="w-8 text-center font-black">{quantity}</span>
                    <button onClick={() => setQuantity(q => q+1)} className="w-10 h-10 font-black">+</button>
                  </div>
                  <button onClick={handleAddToCart} className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary-500/20 active:scale-95 transition-all">Authorize Purchase</button>
               </div>
               <div className="flex items-center gap-4">
                  <button onClick={() => toggleWishlist(product.id)} className={`flex-1 h-full rounded-3xl flex items-center justify-center border transition-all ${isWishlisted ? 'bg-red-500 text-white border-red-500 shadow-xl' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400'}`}>
                    <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                  <button onClick={() => toggleComparison(product)} className={`flex-1 h-full rounded-3xl flex items-center justify-center border transition-all ${isCompared ? 'bg-primary-500 text-white border-primary-500 shadow-xl' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400'}`}>
                    <Scale size={20} />
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Storytelling Immersive Section */}
        {product.story && (
          <div ref={storyRef} className="mb-32">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-16 text-center">Immersive Narrative</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {product.story.map((item, idx) => (
                <div key={item.id} className={`story-card group relative h-[500px] rounded-[4rem] overflow-hidden ${idx % 2 === 1 ? 'md:mt-24' : ''}`}>
                  <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-12 flex flex-col justify-end">
                    <span className="text-primary-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">{item.type}</span>
                    <h3 className="text-white text-4xl font-black mb-6 uppercase tracking-tighter leading-none">{item.title}</h3>
                    <p className="text-gray-300 font-medium leading-relaxed max-w-sm">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Public Q&A Section */}
        <div className="mb-32">
           <div className="flex items-center space-x-4 mb-12">
              <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-500"><HelpCircle size={24} /></div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">Artisanal Inquiry</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                 {[
                   { q: "Is this suitable for high-humidity climates?", a: "Yes, our stabilizers ensure peak performance up to 85% relative humidity." },
                   { q: "Can I mix this with oil-based essences?", a: "Absolutely. The molecular structure is designed for universal dispersion." }
                 ].map((item, i) => (
                   <div key={i} className="p-8 bg-gray-50 dark:bg-white/[0.02] rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                      <p className="font-black text-sm uppercase tracking-tight mb-4 flex items-center"><span className="text-primary-500 mr-3">Q.</span> {item.q}</p>
                      <p className="text-gray-500 text-sm font-medium leading-relaxed flex items-start"><span className="text-emerald-500 font-black mr-3">A.</span> {item.a}</p>
                   </div>
                 ))}
              </div>
              <div className="glass p-10 rounded-[3rem] border border-white/10">
                 <h4 className="text-sm font-black uppercase tracking-widest mb-6">Submit Your Inquiry</h4>
                 <div className="space-y-4">
                    <input className="w-full p-4 bg-white dark:bg-black/20 rounded-2xl border border-white/5 text-sm outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ask our master pâtissiers..." />
                    <button className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3">
                       <Send size={14} /> Dispatch Inquiry
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Dynamic Personalization */}
        {personalizedRecs.length > 0 && (
          <div className="mb-32">
             <div className="flex items-center space-x-3 mb-12">
                <Sparkles className="text-primary-500" size={24} />
                <h2 className="text-3xl font-black uppercase tracking-tighter">Personalized For Your Project</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {personalizedRecs.slice(0, 4).map(p => (
                  <Link to={`/product/${p.id}`} key={p.id} className="group glass p-6 rounded-[3rem] border border-gray-100 dark:border-white/10 hover:border-primary-500/40 transition-all">
                    <div className="aspect-square rounded-[2rem] overflow-hidden mb-6"><img src={p.images[0]} className="w-full h-full object-cover" /></div>
                    <h4 className="font-black uppercase tracking-tight text-sm truncate">{p.name}</h4>
                    <p className="text-primary-500 font-black text-sm mt-2">${p.price}</p>
                  </Link>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;