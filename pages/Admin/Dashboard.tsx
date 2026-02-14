
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, TrendingUp, AlertTriangle, Target, History, DollarSign, Activity, Sparkles, BrainCircuit, LineChart 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, ComposedChart, Line } from 'recharts';
import { useAppContext } from '../../App.js';
import AdminSidebar from './AdminSidebar.js';

const Dashboard: React.FC = () => {
  const { products, orders, userActivities, currency } = useAppContext();

  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
    const visits = userActivities.filter(a => a.type === 'view').length || 1;
    const checkouts = orders.length;
    const conversionRate = ((checkouts / visits) * 100).toFixed(1);

    const funnelData = [
      { name: 'Traffic', value: visits, fill: '#f43f5e' },
      { name: 'Intent', value: Math.floor(visits * 0.2), fill: '#fb7185' },
      { name: 'Success', value: checkouts, fill: '#fda4af' },
    ];

    // Predictive Mock Data (Real-world: based on velocity and lead times)
    const forecastData = [
      { name: 'Week 1', actual: 4000, projected: 4200 },
      { name: 'Week 2', actual: 3000, projected: 4500 },
      { name: 'Week 3', actual: 5000, projected: 4800 },
      { name: 'Week 4', actual: 2780, projected: 5100 },
      { name: 'Week 5', projected: 5400 },
      { name: 'Week 6', projected: 6000 },
    ];

    return { totalRevenue, conversionRate, funnelData, forecastData };
  }, [orders, userActivities]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#090b0d] flex">
      <AdminSidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Intelligence Hub</h1>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mt-4">Predictive Analytics & Core Operational Systems</p>
          </div>
          <div className="flex space-x-4">
             <button className="bg-white dark:bg-white/5 px-8 py-4 rounded-[2rem] font-black uppercase text-[10px] tracking-widest border border-gray-100 dark:border-white/10 shadow-sm flex items-center gap-3">
                <BrainCircuit size={16} className="text-primary-500" /> Run ML Refine
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
          {/* Predictive Area Chart */}
          <div className="lg:col-span-2 glass p-12 rounded-[4rem] border border-primary-500/10 shadow-2xl">
             <div className="flex items-center justify-between mb-12">
                <h3 className="text-xl font-black uppercase tracking-widest flex items-center"><LineChart className="mr-3 text-primary-500" /> Revenue Forecast</h3>
                <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-4 py-1 rounded-full uppercase">94% Confidence</span>
             </div>
             <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                   <ComposedChart data={analytics.forecastData}>
                      <defs>
                         <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888811" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 10, fontWeight: 'bold'}} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 10, fontWeight: 'bold'}} />
                      <Tooltip contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '24px', padding: '16px', color: '#fff' }} />
                      <Area type="monotone" dataKey="actual" fill="url(#colorAct)" stroke="#f43f5e" strokeWidth={4} />
                      <Line type="monotone" dataKey="projected" stroke="#888" strokeWidth={2} strokeDasharray="5 5" />
                   </ComposedChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* AI Decision Support */}
          <div className="space-y-10">
             <div className="glass p-10 rounded-[3.5rem] border border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center space-x-4 mb-6">
                   <AlertTriangle className="text-amber-500" size={24} />
                   <h4 className="font-black uppercase tracking-widest text-sm">Anomaly Detected</h4>
                </div>
                <p className="text-xs font-bold text-gray-500 leading-relaxed mb-6 italic">Chocolate callet velocity increased by 240% in last 12 hours. Potential trend breakout or inventory leakage risk.</p>
                <button className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Investigate Cluster</button>
             </div>

             <div className="glass p-10 rounded-[3.5rem] border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center space-x-4 mb-6">
                   <Sparkles className="text-emerald-500" size={24} />
                   <h4 className="font-black uppercase tracking-widest text-sm">Growth Protocol</h4>
                </div>
                <p className="text-xs font-bold text-gray-500 leading-relaxed mb-6 italic">A/B Test Variant 'B' shows 12% higher intent on high-ticket items. Recommendation: Switch all traffic to 'B'.</p>
                <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Deploy Override</button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
