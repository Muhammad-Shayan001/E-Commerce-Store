
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ToastContainer: React.FC<{ toasts: Toast[] }> = ({ toasts }) => {
  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className={`
              flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl glass border
              ${toast.type === 'success' ? 'border-emerald-500/50' : ''}
              ${toast.type === 'error' ? 'border-red-500/50' : ''}
              ${toast.type === 'info' ? 'border-primary-500/50' : ''}
            `}
          >
            {toast.type === 'success' && <CheckCircle className="text-emerald-500" size={20} />}
            {toast.type === 'error' && <AlertCircle className="text-red-500" size={20} />}
            {toast.type === 'info' && <Info className="text-primary-500" size={20} />}
            <span className="font-bold text-sm tracking-tight">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
