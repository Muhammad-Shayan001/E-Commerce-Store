import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../App.js';

const Login: React.FC = () => {
  const { setUser } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Login
    if (email === 'admin@luxe.com' && password === 'admin') {
      setUser({ id: 'admin-1', name: 'Super Admin', email: 'admin@luxe.com', role: 'admin' });
      navigate('/admin');
    } else {
      setUser({ id: 'user-1', name: 'John Doe', email, role: 'user' });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full -z-10 animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-white/5 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 glass"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-2 tracking-tighter">WELCOME BACK</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Log in to your account to continue.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium" 
                placeholder="name@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium" 
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="text-right">
            <a href="#" className="text-sm font-bold text-primary-500 hover:underline">Forgot password?</a>
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 flex items-center justify-center space-x-2"
          >
            <span>Log In</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-10">
          <div className="relative flex items-center justify-center mb-10">
            <div className="flex-grow border-t border-gray-100 dark:border-white/10" />
            <span className="flex-shrink mx-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Or continue with</span>
            <div className="flex-grow border-t border-gray-100 dark:border-white/10" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="py-3 flex items-center justify-center space-x-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all font-bold text-sm">
              <Chrome size={18} />
              <span>Google</span>
            </button>
            <button className="py-3 flex items-center justify-center space-x-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all font-bold text-sm">
              <Github size={18} />
              <span>Github</span>
            </button>
          </div>
        </div>

        <p className="text-center mt-10 text-sm text-gray-500">
          Don't have an account? <Link to="/login" className="text-primary-500 font-bold hover:underline">Sign up</Link>
        </p>
        
        <div className="mt-6 p-4 bg-primary-500/10 rounded-xl text-[10px] text-primary-600 dark:text-primary-400 font-bold uppercase text-center tracking-widest">
          Demo Admin: admin@luxe.com / admin
        </div>
      </motion.div>
    </div>
  );
};

export default Login;