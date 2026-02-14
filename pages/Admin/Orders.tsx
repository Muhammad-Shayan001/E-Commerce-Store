
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAppContext } from '../../App.js';
import AdminSidebar from './AdminSidebar.js';
import EmailService from '../../services/EmailService.js';
import { Order } from '../../types.js';

const AdminOrders: React.FC = () => {
  const { orders, setOrders, addToast } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const updateStatus = (id: string, newStatus: Order['status']) => {
    const orderToUpdate = orders.find(o => o.id === id);
    
    if (orderToUpdate) {
      // 1. Update global state
      setOrders(prev => prev.map(order => 
        order.id === id ? { ...order, status: newStatus } : order
      ));

      // 2. Dispatch notification email
      EmailService.sendStatusUpdate(orderToUpdate.customerEmail, id, newStatus);
      
      // 3. User feedback
      addToast(`Order ${id} marked as ${newStatus}. Customer notified.`, "info");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-500/10 text-emerald-500';
      case 'shipped': return 'bg-blue-500/10 text-blue-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500';
      default: return 'bg-amber-500/10 text-amber-500';
    }
  };

  const filtered = orders.filter(o => o.id.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#090b0d] flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight">ORDER MANAGEMENT</h1>
          <p className="text-gray-500 text-sm">Review, track and update customer orders.</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Order ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 rounded-xl border-none focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </div>
          <button className="px-6 py-2.5 bg-gray-50 dark:bg-white/5 rounded-xl text-sm font-bold flex items-center space-x-2 hover:bg-gray-100 transition-colors">
            <Filter size={16} />
            <span>Sort by Date</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Order ID</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Customer</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Items</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Total</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 font-bold text-sm">{order.id}</td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold">{order.customerEmail}</p>
                      <p className="text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex -space-x-3">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 overflow-hidden shadow-sm">
                            <img src={item.images[0]} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-primary-500">${order.total.toFixed(2)}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center w-fit space-x-2 ${getStatusColor(order.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateStatus(order.id, 'shipped')}
                          className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                          title="Mark Shipped"
                        >
                          <Truck size={14} />
                        </button>
                        <button 
                          onClick={() => updateStatus(order.id, 'delivered')}
                          className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                          title="Mark Delivered"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button 
                          onClick={() => updateStatus(order.id, 'cancelled')}
                          className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                          title="Cancel Order"
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-24 text-center">
              <Clock className="mx-auto mb-4 text-gray-300" size={48} />
              <h3 className="text-lg font-bold">No orders found</h3>
              <p className="text-gray-500">Orders placed by customers will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;
