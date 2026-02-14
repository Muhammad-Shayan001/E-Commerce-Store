import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CreditCard, CheckCircle, ArrowLeft, ShieldCheck, Ticket, Tag, AlertCircle, Sparkles, Loader2, Info, ChevronDown } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../App.js';
import EmailService from '../services/EmailService.js';
import { Order, Coupon } from '../types.js';

const Checkout: React.FC = () => {
  const { cart, setCart, user, setOrders, setProducts, coupons, setCoupons, addToast } = useAppContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
    card: '',
    cvc: '',
    expiry: ''
  });

  const subtotal = useMemo(() => 
    cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0),
  [cart]);
  
  const isMinSpendMet = useMemo(() => {
    if (!appliedCoupon?.minOrderAmount) return true;
    return subtotal >= appliedCoupon.minOrderAmount;
  }, [subtotal, appliedCoupon]);

  const calculateDiscount = () => {
    if (!appliedCoupon || !isMinSpendMet) return 0;
    if (appliedCoupon.type === 'percentage') {
      return subtotal * (appliedCoupon.value / 100);
    }
    return Math.min(appliedCoupon.value, subtotal);
  };

  const discount = calculateDiscount();
  const shipping = (subtotal - discount) > 500 ? 0 : 25;
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = () => {
    const code = couponCodeInput.trim().toUpperCase();
    if (!code) return;

    setIsValidating(true);
    
    setTimeout(() => {
      const foundCoupon = coupons.find(c => c.code === code);

      if (!foundCoupon) {
        addToast("Promotional code not recognized.", "error");
      } else if (!foundCoupon.isActive) {
        addToast("This code is currently inactive.", "error");
      } else {
        const expiry = new Date(foundCoupon.expiryDate);
        expiry.setHours(23, 59, 59, 999);
        const now = new Date();

        if (expiry < now) {
          addToast("This promotional offer has expired.", "error");
        } else if (foundCoupon.minOrderAmount && subtotal < foundCoupon.minOrderAmount) {
          addToast(`Minimum spend of $${foundCoupon.minOrderAmount} required for this code.`, "info");
          setAppliedCoupon(foundCoupon); 
          setCouponCodeInput('');
        } else {
          setAppliedCoupon(foundCoupon);
          setCouponCodeInput('');
          addToast(`Code "${foundCoupon.code}" activated!`, "success");
        }
      }
      setIsValidating(false);
    }, 800);
  };

  const handlePlaceOrder = () => {
    if (!formData.name || !formData.email || !formData.address || !formData.card) {
      addToast("Required delivery data missing.", "error");
      return;
    }

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: orderId,
      userId: user?.id || 'guest',
      customerEmail: formData.email,
      items: [...cart],
      total: total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      paymentStatus: 'paid',
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}`
    };
    
    setProducts(prevProducts => prevProducts.map(p => {
      const cartItem = cart.find(ci => ci.id === p.id);
      return cartItem ? { ...p, stock: Math.max(0, p.stock - cartItem.quantity) } : p;
    }));

    if (appliedCoupon && isMinSpendMet) {
      setCoupons(prev => prev.map(c => 
        c.id === appliedCoupon.id ? { ...c, usageCount: (c.usageCount || 0) + 1 } : c
      ));
    }

    setOrders(prev => [newOrder, ...prev]);
    EmailService.sendOrderConfirmation({ name: formData.name, email: formData.email }, newOrder);

    setCart([]);
    setStep(3);
    addToast("Order finalized successfully.", "success");
    window.scrollTo(0, 0);
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 pt-32">
        <div className="text-center bg-gray-50 dark:bg-white/5 p-16 rounded-[4rem] border border-gray-100 dark:border-white/5 max-w-lg shadow-sm">
          <Tag className="text-gray-300 mx-auto mb-8" size={48} />
          <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase">Your Bag is Empty</h2>
          <p className="text-gray-500 mb-10 font-medium leading-relaxed">Secure your premium tech items before moving to checkout.</p>
          <Link 
            to="/shop" 
            className="inline-block px-12 py-5 bg-primary-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20"
          >
            Browse Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50 dark:bg-[#090b0d]">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1">
            <div className="flex items-center space-x-6 mb-16 overflow-x-auto no-scrollbar pb-4">
              {[
                { s: 1, l: "Logistics" },
                { s: 2, l: "Auth" },
                { s: 3, l: "Ready" }
              ].map((item, i) => (
                <React.Fragment key={item.s}>
                  <div className={`flex items-center space-x-3 shrink-0 ${step >= item.s ? 'text-primary-500' : 'text-gray-400'}`}>
                    <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 ${step >= item.s ? 'bg-primary-500 text-white shadow-xl' : 'bg-gray-200 dark:bg-white/5'}`}>{item.s}</span>
                    <span className="font-black text-[10px] uppercase tracking-widest">{item.l}</span>
                  </div>
                  {i < 2 && <div className={`h-1 w-12 rounded-full transition-colors duration-500 shrink-0 ${step > item.s ? 'bg-primary-500' : 'bg-gray-200 dark:bg-white/5'}`} />}
                </React.Fragment>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} key="shipping" className="space-y-10">
                  <h2 className="text-4xl font-black tracking-tighter uppercase">Deployment Data</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Secure Email</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-8 py-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2.5rem] focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold text-lg" placeholder="john@example.com" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Legal Name</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-8 py-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2.5rem] focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold text-lg" placeholder="John Doe" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Street Access</label>
                      <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-8 py-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2.5rem] focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold text-lg" placeholder="123 Luxury Avenue" />
                    </div>
                    <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-8 py-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2.5rem] focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold text-lg" placeholder="Region" />
                    <input type="text" value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} className="w-full px-8 py-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2.5rem] focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold text-lg" placeholder="Zip" />
                  </div>
                  <button onClick={() => setStep(2)} className="w-full py-6 bg-primary-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/30 flex items-center justify-center space-x-3">
                    <span>Move to Payment</span>
                    <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} key="payment" className="space-y-10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-black tracking-tighter uppercase">Vault Auth</h2>
                    <button onClick={() => setStep(1)} className="text-[10px] font-black text-gray-400 uppercase hover:text-primary-500 transition-colors flex items-center">
                      <ArrowLeft size={14} className="mr-2" />
                      Revise Shipment
                    </button>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900 to-black p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group border border-white/5">
                    <ShieldCheck size={280} className="absolute -top-12 -right-12 opacity-10 group-hover:opacity-20 transition-opacity duration-1000 rotate-12" />
                    <div className="relative z-10 space-y-12">
                      <div className="flex justify-between items-start">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                          <CreditCard size={32} />
                        </div>
                        <span className="font-black text-2xl tracking-widest italic">PLATINUM</span>
                      </div>
                      <div className="text-3xl font-mono tracking-[0.4em]">{formData.card ? formData.card.padEnd(16, '•').replace(/(.{4})/g, '$1 ') : "•••• •••• •••• ••••"}</div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <input type="text" value={formData.card} onChange={(e) => setFormData({...formData, card: e.target.value.replace(/\D/g, '').slice(0,16)})} className="w-full px-8 py-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2.5rem] focus:ring-2 focus:ring-primary-500 font-bold text-lg" placeholder="Card Signature" />
                    <div className="grid grid-cols-2 gap-8">
                      <input type="text" value={formData.expiry} onChange={(e) => setFormData({...formData, expiry: e.target.value})} className="w-full px-8 py-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2.5rem] focus:ring-2 focus:ring-primary-500 font-bold text-lg" placeholder="MM/YY" />
                      <input type="text" value={formData.cvc} onChange={(e) => setFormData({...formData, cvc: e.target.value})} className="w-full px-8 py-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2.5rem] focus:ring-2 focus:ring-primary-500 font-bold text-lg" placeholder="CVC" />
                    </div>
                  </div>
                  <button onClick={handlePlaceOrder} className="w-full py-6 bg-emerald-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-500/30 flex items-center justify-center space-x-3">
                    <span>Confirm • ${total.toFixed(2)}</span>
                    <CheckCircle size={18} />
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key="success" className="text-center py-24 space-y-10">
                  <div className="w-32 h-32 bg-emerald-500 text-white rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl relative z-10">
                    <CheckCircle size={64} />
                    <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-emerald-500 rounded-[3rem] -z-10" />
                  </div>
                  <h2 className="text-6xl font-black tracking-tighter uppercase">Authorized</h2>
                  <p className="text-gray-500 max-w-sm mx-auto font-medium">Transaction complete. Logistical tracking dispatched to <b>{formData.email}</b>.</p>
                  <Link to="/" className="inline-block px-12 py-5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl">Return Home</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pricing & Promo Portal */}
          {step !== 3 && (
            <div className="w-full lg:w-[420px] shrink-0">
              <div className="glass p-10 rounded-[4rem] border border-gray-100 dark:border-white/5 sticky top-32 shadow-2xl">
                <h3 className="text-2xl font-black tracking-tight uppercase mb-10">Manifest</h3>
                
                <div className="space-y-8 mb-10 max-h-[300px] overflow-y-auto no-scrollbar pr-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center space-x-6">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 overflow-hidden border border-white/5 shrink-0">
                        <img src={item.images[0]} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs truncate uppercase tracking-tight">{item.name}</h4>
                        <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase">x{item.quantity}</p>
                      </div>
                      <p className="font-black text-xs text-gray-900 dark:text-white">${((item.discountPrice || item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Interface */}
                <div className="pt-10 border-t border-gray-100 dark:border-white/5 mb-10">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 px-2">Campaign Activation</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Tag size={16} className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isValidating ? 'text-primary-500 animate-pulse' : 'text-gray-400'}`} />
                      <input 
                        type="text" 
                        value={couponCodeInput} 
                        onChange={(e) => setCouponCodeInput(e.target.value)} 
                        disabled={isValidating} 
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary-500/50 rounded-2xl outline-none font-black text-xs uppercase tracking-widest transition-all" 
                        placeholder="AUTH_CODE" 
                      />
                    </div>
                    <button 
                      onClick={handleApplyCoupon} 
                      disabled={isValidating || !couponCodeInput.trim()} 
                      className="px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50 transition-all hover:bg-primary-500 hover:text-white dark:hover:bg-primary-600"
                    >
                      {isValidating ? <Loader2 size={14} className="animate-spin" /> : 'Link'}
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {appliedCoupon && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className={`mt-4 flex items-center justify-between px-5 py-3 rounded-2xl border shadow-sm ${isMinSpendMet ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                        <div className="flex items-center">
                          {isMinSpendMet ? <Sparkles size={14} className="mr-3" /> : <AlertCircle size={14} className="mr-3" />}
                          <span className="text-[10px] font-black uppercase tracking-[0.1em]">
                            {appliedCoupon.code} {isMinSpendMet ? 'ACTIVE' : 'LOCKED'}
                          </span>
                        </div>
                        <button onClick={() => setAppliedCoupon(null)} className="text-[10px] font-black uppercase hover:underline ml-4">Revoke</button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isMinSpendMet && appliedCoupon && (
                    <div className="mt-4 flex items-start space-x-3 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                      <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[9px] font-black uppercase tracking-widest text-amber-600/70 leading-relaxed">
                        Spend <span className="text-amber-600">${(appliedCoupon.minOrderAmount! - subtotal).toFixed(2)}</span> more to activate this discount.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-10 border-t border-gray-100 dark:border-white/5">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-500 items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest flex items-center"><Ticket size={12} className="mr-2" /> Reward Applied</span>
                      <span className="font-black">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Logistics</span>
                    <span className={shipping === 0 ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}>{shipping === 0 ? 'COMPLIMENTARY' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between pt-6 border-t border-gray-100 dark:border-white/5 items-end">
                    <div>
                      <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-400">Net Total</span>
                      <p className="text-4xl font-black tracking-tighter text-primary-500 leading-none mt-2">${total.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end opacity-40">
                      <ShieldCheck size={16} />
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1">256-BIT SSL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;