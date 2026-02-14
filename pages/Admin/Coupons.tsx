import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Ticket, Calendar, DollarSign, Percent, AlertCircle, CheckCircle2, Power, TrendingUp, BarChart3 } from 'lucide-react';
import { useAppContext } from '../../App.js';
import AdminSidebar from './AdminSidebar.js';
import { Coupon } from '../../types.js';

const AdminCoupons: React.FC = () => {
  const { coupons, setCoupons, addToast } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Coupon, 'id' | 'usageCount'>>({
    code: '',
    type: 'percentage',
    value: 0,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    minOrderAmount: 0
  });

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      addToast("Coupon code is required", "error");
      return;
    }
    if (formData.value <= 0) {
      addToast("Value must be greater than zero", "error");
      return;
    }
    if (coupons.some(c => c.code === formData.code.toUpperCase())) {
      addToast("This code already exists", "error");
      return;
    }

    const newCoupon: Coupon = {
      ...formData,
      id: `CPN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      code: formData.code.toUpperCase().replace(/\s+/g, ''),
      usageCount: 0
    };

    setCoupons(prev => [newCoupon, ...prev]);
    setIsModalOpen(false);
    resetForm();
    addToast("Promotional campaign launched", "success");
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: 0,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      minOrderAmount: 0
    });
  };

  const deleteCoupon = (id: string) => {
    if (window.confirm("Permanently archive this campaign?")) {
      setCoupons(prev => prev.filter(c => c.id !== id));
      addToast("Campaign deleted", "info");
    }
  };

  const toggleStatus = (id: string) => {
    setCoupons(prev => prev.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
    addToast("Status updated", "info");
  };

  const isExpired = (date: string) => {
    const expiry = new Date(date);
    expiry.setHours(23, 59, 59, 999);
    return expiry < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#090b0d] flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight uppercase">Coupons & Rewards</h1>
            <p className="text-gray-500 text-sm font-medium">Control the incentives that drive your store's growth.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-3 bg-primary-600 text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary-500/20"
          >
            <Plus size={18} />
            <span>Create New Code</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {coupons.map((coupon) => {
              const expired = isExpired(coupon.expiryDate);
              return (
                <motion.div
                  layout
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative bg-white dark:bg-white/5 p-8 rounded-[3rem] border transition-all duration-500 ${
                    expired ? 'border-red-500/20 grayscale' : 'border-gray-100 dark:border-white/5 hover:border-primary-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className={`p-4 rounded-2xl ${expired ? 'bg-red-500/10 text-red-500' : 'bg-primary-500/10 text-primary-500'}`}>
                      <Ticket size={28} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${coupon.isActive && !expired ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {expired ? 'EXPIRED' : (coupon.isActive ? 'ACTIVE' : 'PAUSED')}
                      </span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-3xl font-black tracking-tighter mb-2 text-gray-900 dark:text-white uppercase">
                      {coupon.code}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-[10px] font-black tracking-widest uppercase">
                        {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
                      </span>
                      {coupon.minOrderAmount ? (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-400 rounded-full text-[10px] font-black tracking-widest uppercase">
                          Min Spend: ${coupon.minOrderAmount}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-400 rounded-full text-[10px] font-black tracking-widest uppercase">
                          No Minimum
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Redemptions</p>
                      <div className="flex items-center space-x-2">
                        <BarChart3 size={14} className="text-primary-500" />
                        <span className="font-black text-lg">{coupon.usageCount || 0}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Expires</p>
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-primary-500" />
                        <span className="font-black text-xs">{new Date(coupon.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleStatus(coupon.id)}
                        className={`p-3 rounded-xl transition-all ${
                          coupon.isActive 
                            ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' 
                            : 'bg-gray-100 dark:bg-white/10 text-gray-400 hover:bg-emerald-500 hover:text-white'
                        }`}
                      >
                        <Power size={18} />
                      </button>
                      <button 
                        onClick={() => deleteCoupon(coupon.id)}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    {expired && (
                      <div className="flex items-center text-red-500 text-[10px] font-black uppercase tracking-widest">
                        <AlertCircle size={14} className="mr-1" />
                        Campaign Over
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-[#0f1115] rounded-[3.5rem] p-12 shadow-2xl border border-white/5"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black tracking-tight uppercase">Campaign Setup</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddCoupon} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Promotional Code</label>
                  <input 
                    type="text" 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full px-8 py-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-none focus:ring-2 focus:ring-primary-500 font-black uppercase tracking-[0.3em] text-lg text-primary-500" 
                    placeholder="SUMMER2024" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Type</label>
                    <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-2xl">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, type: 'percentage'})}
                        className={`flex-1 py-4 rounded-xl flex items-center justify-center transition-all ${formData.type === 'percentage' ? 'bg-white dark:bg-primary-600 text-primary-600 dark:text-white shadow-xl' : 'text-gray-400 font-bold text-xs uppercase'}`}
                      >
                        <Percent size={18} className="mr-2" />
                        <span>%</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, type: 'fixed'})}
                        className={`flex-1 py-4 rounded-xl flex items-center justify-center transition-all ${formData.type === 'fixed' ? 'bg-white dark:bg-primary-600 text-primary-600 dark:text-white shadow-xl' : 'text-gray-400 font-bold text-xs uppercase'}`}
                      >
                        <DollarSign size={18} className="mr-2" />
                        <span>$</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Value</label>
                    <input 
                      type="number" 
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                      className="w-full px-8 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 font-black text-xl" 
                      placeholder="20" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Expiry Date</label>
                    <input 
                      type="date" 
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      className="w-full px-8 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Min. Spend</label>
                    <div className="relative">
                      <DollarSign size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-500" />
                      <input 
                        type="number" 
                        value={formData.minOrderAmount}
                        onChange={(e) => setFormData({...formData, minOrderAmount: Number(e.target.value)})}
                        className="w-full pl-12 pr-8 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-none focus:ring-2 focus:ring-primary-500 font-bold" 
                        placeholder="0" 
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full py-6 bg-primary-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary-500/30">
                  Deploy Campaign
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCoupons;