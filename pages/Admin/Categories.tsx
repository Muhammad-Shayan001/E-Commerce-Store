import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Layers, Image as ImageIcon, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../App.js';
import AdminSidebar from './AdminSidebar.js';
import { Category } from '../../types.js';

const AdminCategories: React.FC = () => {
  const { categories, setCategories, addToast } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: '',
    image: '',
    visible: true
  });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.image.trim()) {
      addToast("Category name and image are required", "error");
      return;
    }

    const newCategory: Category = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
    };

    setCategories(prev => [...prev, newCategory]);
    setIsModalOpen(false);
    setFormData({ name: '', image: '', visible: true });
    addToast("New category established", "success");
  };

  const deleteCategory = (id: string) => {
    if (window.confirm("Permanently remove this category segment?")) {
      setCategories(prev => prev.filter(c => c.id !== id));
      addToast("Category purged", "info");
    }
  };

  const toggleVisibility = (id: string) => {
    setCategories(prev => prev.map(c => 
      c.id === id ? { ...c, visible: !c.visible } : c
    ));
    addToast("Visibility preference updated", "success");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#090b0d] flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight uppercase">Product Segments</h1>
            <p className="text-gray-500 text-sm font-medium">Structure your luxury inventory into intuitive categories.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-3 bg-primary-600 text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20"
          >
            <Plus size={18} />
            <span>Create Segment</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {categories.map((category) => (
              <motion.div
                layout
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-white/5 rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm group"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img src={category.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                    <h3 className="text-white text-xl font-black tracking-tight uppercase">{category.name}</h3>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${category.visible ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'}`}>
                      {category.visible ? 'Public' : 'Hidden'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex items-center justify-between">
                   <div className="flex items-center space-x-2">
                     <button 
                        onClick={() => toggleVisibility(category.id)}
                        className={`p-3 rounded-xl transition-all ${category.visible ? 'text-primary-500 bg-primary-500/10' : 'text-gray-400 bg-gray-100 dark:bg-white/5'}`}
                      >
                        {category.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                   </div>
                   <button 
                      onClick={() => deleteCategory(category.id)}
                      className="p-3 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

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
              className="relative w-full max-w-xl bg-white dark:bg-[#0f1115] rounded-[3rem] p-12 shadow-2xl border border-white/5"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black tracking-tight uppercase">New Segment</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-all">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddCategory} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Segment Title</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-8 py-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-none focus:ring-2 focus:ring-primary-500 font-black uppercase tracking-widest text-lg" 
                    placeholder="E.G. WEARABLES" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Representative Imagery (URL)</label>
                  <div className="relative">
                    <ImageIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-500" />
                    <input 
                      type="text" 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full pl-16 pr-8 py-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-none focus:ring-2 focus:ring-primary-500 font-bold" 
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full py-6 bg-primary-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary-500/30 flex items-center justify-center space-x-3">
                    <CheckCircle2 size={20} />
                    <span>Publish Segment</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;