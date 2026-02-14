
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut, ArrowLeft, Ticket, Layers } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/admin' },
    { icon: <Package size={20} />, label: 'Products', path: '/admin/products' },
    { icon: <Layers size={20} />, label: 'Categories', path: '/admin/categories' },
    { icon: <ShoppingCart size={20} />, label: 'Orders', path: '/admin/orders' },
    { icon: <Ticket size={20} />, label: 'Coupons', path: '/admin/coupons' },
    { icon: <Users size={20} />, label: 'Customers', path: '/admin/customers' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="w-72 bg-white dark:bg-[#0f1115] border-r border-gray-100 dark:border-white/5 flex flex-col p-8 h-screen sticky top-0">
      <div className="mb-12">
        <Link to="/" className="text-2xl font-black text-primary-600 tracking-tighter mb-8 block">
          LUXE<span className="text-gray-900 dark:text-white">ADMIN</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">Menu</p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all duration-300 font-bold ${
                isActive 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-gray-100 dark:border-white/5 space-y-2">
        <Link 
          to="/"
          className="flex items-center space-x-4 px-4 py-3 text-gray-500 hover:text-primary-500 font-bold transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Exit Admin</span>
        </Link>
        <button className="w-full flex items-center space-x-4 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl font-bold transition-all">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
