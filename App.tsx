//! E-Commerce App
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Product, CartItem, User, Order, Coupon, Category, AuditLog, UserActivity } from './types.js';
import { MOCK_PRODUCTS, CATEGORIES } from './constants.js';
import AIService from './services/AIService.js';

// --- Contexts ---
interface AppContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  comparisonList: Product[];
  toggleComparison: (product: Product) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  auditLogs: AuditLog[];
  logAdminAction: (action: string, resource: string, details: string) => void;
  userActivities: UserActivity[];
  trackActivity: (activity: Omit<UserActivity, 'id' | 'timestamp'>) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  currency: { code: string; symbol: string; rate: number };
  setCurrency: (code: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  aiService: typeof AIService;
  // Principal Features
  abVariant: 'A' | 'B';
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

// --- Components ---
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';
import CartDrawer from './components/CartDrawer.js';
import ComparisonDrawer from './components/ComparisonDrawer.js';
import LiveChefChat from './components/LiveChefChat.js';
import ToastContainer from './components/ToastContainer.js';
import CommandPalette from './components/CommandPalette.js';

// --- Pages ---
import Home from './pages/Home.js';
import Shop from './pages/Shop.js';
import ProductDetail from './pages/ProductDetail.js';
import Checkout from './pages/Checkout.js';
import Login from './pages/Login.js';
import Dashboard from './pages/Admin/Dashboard.js';
import AdminProducts from './pages/Admin/Products.js';
import AdminOrders from './pages/Admin/Orders.js';
import AdminAuditLog from './pages/Admin/AuditLog.js';
import Profile from './pages/Profile.js';
import Wishlist from './pages/Wishlist.js';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const [wishlist, setWishlist] = useState<string[]>(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark' || !('theme' in localStorage));
  const [user, setUser] = useState<User | null>(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [products, setProducts] = useState<Product[]>(() => JSON.parse(localStorage.getItem('products') || JSON.stringify(MOCK_PRODUCTS)));
  const [categories, setCategories] = useState<Category[]>(() => JSON.parse(localStorage.getItem('categories') || JSON.stringify(CATEGORIES)));
  const [orders, setOrders] = useState<Order[]>(() => JSON.parse(localStorage.getItem('orders') || '[]'));
  const [coupons, setCoupons] = useState<Coupon[]>(() => JSON.parse(localStorage.getItem('coupons') || '[]'));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => JSON.parse(localStorage.getItem('auditLogs') || '[]'));
  const [userActivities, setUserActivities] = useState<UserActivity[]>(() => JSON.parse(localStorage.getItem('userActivities') || '[]'));
  const [currency, setCurrencyState] = useState(() => JSON.parse(localStorage.getItem('currency') || JSON.stringify({ code: 'USD', symbol: '$', rate: 1 })));
  const [language, setLanguageState] = useState(() => localStorage.getItem('language') || 'EN');
  
  // A/B Test logic (randomized once per session)
  const [abVariant] = useState<'A' | 'B'>(() => Math.random() > 0.5 ? 'A' : 'B');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleComparison = (product: Product) => {
    setComparisonList(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 3) {
        addToast("Maximum 3 items for comparison", "info");
        return prev;
      }
      return [...prev, product];
    });
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const logAdminAction = (action: string, resource: string, details: string) => {
    setAuditLogs(prev => [{ id: Date.now().toString(), adminId: user?.id || 'sys', action, resource, timestamp: new Date().toISOString(), details }, ...prev]);
  };

  const trackActivity = (activity: any) => {
    setUserActivities(prev => [{ ...activity, id: Date.now().toString(), timestamp: new Date().toISOString() }, ...prev]);
  };

  const setCurrency = (code: string) => setCurrencyState({ code, symbol: '$', rate: 1 });
  const setLanguage = (lang: string) => setLanguageState(lang);

  const contextValue: AppContextType = {
    cart, setCart, wishlist, toggleWishlist, comparisonList, toggleComparison,
    isDarkMode, toggleDarkMode, user, setUser, products, setProducts,
    categories, setCategories, orders, setOrders, coupons, setCoupons,
    auditLogs, logAdminAction, userActivities, trackActivity, addToast,
    currency, setCurrency, language, setLanguage, aiService: AIService,
    abVariant
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-white dark:bg-[#0f1115] transition-colors duration-500">
        {!isAdminRoute && <Navbar onOpenCart={() => setIsCartOpen(true)} />}
        
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/audit" element={<AdminAuditLog />} />
          </Routes>
        </AnimatePresence>

        {!isAdminRoute && <Footer />}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <ComparisonDrawer />
        <LiveChefChat />
        <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
        <ToastContainer toasts={toasts} />
      </div>
    </AppContext.Provider>
  );
};

export default App;
