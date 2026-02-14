
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Package, MapPin, LogOut, ChevronRight, Settings, 
  Award, Zap, Star, ShieldCheck, Target, Box, Truck 
} from 'lucide-react';
import { useAppContext } from '../App.js';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, setUser, orders } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('gamification');

  useEffect(() => { if (!user) navigate('/login'); }, [user]);

  if (!user) return null;

  const userOrders = orders.filter(o => o.userId === user.id);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Personal Identity System */}
          <div className="w-full lg:w-80 shrink-0 space-y-8">
            <div className="glass p-10 rounded-[4rem] border border-gray-100 dark:border-white/10 text-center shadow-2xl">
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary-500 to-amber-500 border-4 border-white dark:border-gray-800 mx-auto mb-8 flex items-center justify-center text-white shadow-xl overflow-hidden">
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User size={48} />}
              </div>
              <h2 className="text-2xl font-black tracking-tight uppercase leading-none mb-2">{user.name}</h2>
              <span className="px-4 py-1.5 bg-primary-600 text-white rounded-full text-[8px] font-black uppercase tracking-widest">{user.rank || 'Amateur Baker'}</span>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl">
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">XP Points</p>
                   <p className="font-black text-primary-500">{user.loyaltyPoints || 0}</p>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl">
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Badges</p>
                   <p className="font-black text-amber-500">{user.badges?.length || 0}</p>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'gamification', label: 'Chef Standing', icon: <Award size={20} /> },
                { id: 'orders', label: 'Acquisitions', icon: <Package size={20} /> },
                { id: 'settings', label: 'Preferences', icon: <Settings size={20} /> }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center space-x-4 px-8 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                   {tab.icon} <span>{tab.label}</span>
                </button>
              ))}
              <button onClick={() => setUser(null)} className="w-full flex items-center space-x-4 px-8 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest text-red-500 hover:bg-red-500/10 transition-all mt-8">
                <LogOut size={20} /> <span>Relinquish Auth</span>
              </button>
            </nav>
          </div>

          {/* Core Content Engine */}
          <div className="flex-1">
            {activeTab === 'gamification' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                 <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Artisanal Standing</h1>
                 
                 <div className="glass p-12 rounded-[4rem] border border-primary-500/20 bg-primary-500/5 relative overflow-hidden">
                    <Zap size={200} className="absolute -bottom-20 -right-20 text-primary-500/10 rotate-12" />
                    <div className="relative z-10">
                       <h3 className="text-xl font-black uppercase tracking-widest mb-2 flex items-center">Executive Tier Progress <Star size={18} className="ml-3 text-amber-500" /></h3>
                       <p className="text-gray-500 font-medium mb-8">You are 450 XP away from "Master Chocolatier" status.</p>
                       <div className="w-full h-4 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-gradient-to-r from-primary-500 to-amber-500" />
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {user.badges?.map(badge => (
                      <div key={badge.id} className="p-8 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/10 text-center hover:border-primary-500/30 transition-all group">
                         <div className="w-20 h-20 bg-white dark:bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                            <span className="text-4xl">{badge.icon}</span>
                         </div>
                         <h4 className="font-black uppercase tracking-widest text-[10px] mb-2">{badge.name}</h4>
                         <p className="text-[10px] text-gray-500 font-bold leading-relaxed">{badge.description}</p>
                      </div>
                    )) || (
                      <div className="col-span-3 py-20 text-center bg-gray-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-white/10">
                        <Target size={48} className="mx-auto mb-6 text-gray-300" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">No Achievement Protocols Triggered</p>
                      </div>
                    )}
                 </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Asset Flow</h1>
                {userOrders.length > 0 ? (
                  <div className="space-y-8">
                    {userOrders.map(order => (
                      <div key={order.id} className="glass p-12 rounded-[4rem] border border-gray-100 dark:border-white/10 hover:border-primary-500/30 transition-all">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
                          <div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Transaction ID</span>
                            <p className="text-2xl font-black">{order.id}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                             <div className="flex -space-x-4">
                                {order.items.map((item, i) => <img key={i} src={item.images[0]} className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 object-cover" />)}
                             </div>
                             <span className="px-6 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center"><Box size={14} className="mr-2" /> {order.status}</span>
                          </div>
                        </div>

                        {/* Order Tracking Logic Visualizer */}
                        <div className="relative pt-12">
                           <div className="absolute top-12 left-0 right-0 h-1 bg-gray-100 dark:bg-white/10 rounded-full" />
                           <div className="absolute top-12 left-0 w-2/3 h-1 bg-primary-500 rounded-full" />
                           <div className="relative z-10 flex justify-between">
                              {['Validated', 'Processed', 'Dispatched', 'Landed'].map((s, i) => (
                                <div key={i} className="flex flex-col items-center">
                                   <div className={`w-8 h-8 rounded-xl border-4 border-white dark:border-gray-900 flex items-center justify-center ${i <= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}>
                                      {i === 0 && <ShieldCheck size={14} />}
                                      {i === 1 && <Target size={14} />}
                                      {i === 2 && <Truck size={14} />}
                                      {i === 3 && <Box size={14} />}
                                   </div>
                                   <p className="mt-4 text-[8px] font-black uppercase tracking-widest text-gray-400">{s}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-32 bg-gray-50 dark:bg-white/5 rounded-[4rem]">
                    <Package size={64} className="mx-auto mb-8 text-gray-200" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">No Acquisition Logs Located</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
