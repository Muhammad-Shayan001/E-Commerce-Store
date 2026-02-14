import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Filter, X, Layout, DollarSign, Truck, Globe, Box } from 'lucide-react';
import { useAppContext } from '../../App.js';
import AdminSidebar from './AdminSidebar.js';
import { Product } from '../../types.js';

const AdminProducts: React.FC = () => {
  const { products, setProducts, logAdminAction } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Food Colors',
    brand: '',
    price: 0,
    stock: 0,
    status: 'active',
    logistics: { weight: 0, dimensions: { length: 0, width: 0, height: 0 }, sku: '' },
    seo: { title: '', description: '', keywords: [] }
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Permanently remove ${name} from inventory?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      logAdminAction('DELETE_PRODUCT', 'PRODUCT', `Removed product: ${name}`);
    }
  };

  const handleSave = () => {
    const newProduct = {
      ...formData,
      id: `P-${Date.now()}`,
      images: formData.images || ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop'],
      rating: 0,
      reviews: []
    } as Product;
    
    setProducts(prev => [newProduct, ...prev]);
    logAdminAction('CREATE_PRODUCT', 'PRODUCT', `Registered item: ${newProduct.name}`);
    setIsModalOpen(false);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#090b0d] flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight uppercase">Registry</h1>
            <p className="text-gray-500 text-sm font-medium">Enterprise inventory management and fulfillment logistics.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-3 bg-primary-600 text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20"
          >
            <Plus size={18} />
            <span>New Supply Segment</span>
          </button>
        </div>

        {/* Table View */}
        <div className="bg-white dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Asset</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Logistics SKU</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Pricing</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Allocation</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <img src={product.images[0]} className="w-14 h-14 rounded-2xl object-cover" />
                        <div>
                          <p className="font-black text-sm uppercase">{product.name}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{product.brand || 'No Brand'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-black text-gray-400">{product.logistics.sku || 'N/A'}</td>
                    <td className="px-8 py-6 font-black text-sm">${product.price}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${product.stock < 10 ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
                        <span className="text-xs font-bold">{product.stock} Units</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex space-x-2">
                        <button className="p-3 text-gray-400 hover:text-primary-500 bg-gray-50 dark:bg-white/5 rounded-xl transition-all"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(product.id, product.name)} className="p-3 text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-white/5 rounded-xl transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Advanced Registry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-[#0f1115] rounded-[4rem] p-0 shadow-2xl border border-white/5 overflow-hidden flex h-[80vh]"
            >
              {/* Sidebar Tabs */}
              <div className="w-64 bg-gray-50 dark:bg-white/[0.02] border-r border-gray-100 dark:border-white/5 p-8 flex flex-col space-y-2">
                 {[
                   { id: 'general', label: 'General', icon: <Layout size={18} /> },
                   { id: 'pricing', label: 'Pricing', icon: <DollarSign size={18} /> },
                   { id: 'logistics', label: 'Logistics', icon: <Truck size={18} /> },
                   { id: 'seo', label: 'Market Visibility', icon: <Globe size={18} /> }
                 ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center space-x-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                       {tab.icon}
                       <span>{tab.label}</span>
                    </button>
                 ))}
                 <div className="mt-auto pt-8">
                    <button onClick={handleSave} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20">
                       Deploy Segment
                    </button>
                 </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-12 overflow-y-auto">
                 <div className="flex justify-between mb-10">
                    <h2 className="text-3xl font-black tracking-tight uppercase">Segment Intelligence</h2>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl"><X size={24} /></button>
                 </div>

                 {activeTab === 'general' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Item Title</label>
                          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-8 py-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-none outline-none focus:ring-2 focus:ring-primary-500 font-bold" placeholder="E.G. Valrhona Dark" />
                       </div>
                       <div className="grid grid-cols-2 gap-8">
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Collection</label>
                             <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-8 py-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-none outline-none focus:ring-2 focus:ring-primary-500 font-bold">
                                <option>Food Colors</option>
                                <option>Premium Chocolate</option>
                                <option>Cake Decorating</option>
                                <option>Baking Tools</option>
                             </select>
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Brand</label>
                             <input type="text" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="w-full px-8 py-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-none outline-none focus:ring-2 focus:ring-primary-500 font-bold" placeholder="Callebaut" />
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'pricing' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                       <div className="grid grid-cols-2 gap-8">
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Unit Value ($)</label>
                             <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-8 py-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-none outline-none focus:ring-2 focus:ring-primary-500 font-black text-xl" />
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Allocation Stock</label>
                             <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} className="w-full px-8 py-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-none outline-none focus:ring-2 focus:ring-primary-500 font-black text-xl" />
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'logistics' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                       <div className="grid grid-cols-2 gap-8">
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Logistics Weight (g)</label>
                             <input type="number" value={formData.logistics?.weight} onChange={(e) => setFormData({...formData, logistics: { ...formData.logistics!, weight: Number(e.target.value) }})} className="w-full px-8 py-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-none outline-none focus:ring-2 focus:ring-primary-500 font-bold" />
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">System SKU</label>
                             <input type="text" value={formData.logistics?.sku} onChange={(e) => setFormData({...formData, logistics: { ...formData.logistics!, sku: e.target.value }})} className="w-full px-8 py-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-none outline-none focus:ring-2 focus:ring-primary-500 font-black text-xs uppercase tracking-widest" placeholder="AUTO_GEN" />
                          </div>
                       </div>
                    </div>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;