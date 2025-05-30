import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`fixed bottom-4 right-4 z-[100] flex items-center space-x-2 px-3 py-2 rounded-md shadow-lg border text-xs font-medium backdrop-blur-md ${
        type === 'success' 
          ? 'bg-black/80 border-black text-white' 
          : 'bg-white/80 border-gray-300 text-black'
      }`}
    >
      <div className={`p-0.5 rounded-full ${type === 'success' ? 'bg-white/20' : 'bg-black/10'}`}>
        {type === 'success' ? (
          <Check size={12} className="text-white" />
        ) : (
          <X size={12} className="text-black" />
        )}
      </div>
      <span>{message}</span>
    </motion.div>
  );
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' }>>([]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    // Remove any existing toasts before showing a new one to prevent overlap
    setToasts([{ id, message, type }]); 
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-[99]">
        <AnimatePresence>
          {toasts.map((toast) => (
            // No motion.div wrapper needed here if only one toast at a time
            <Toast
              key={toast.id} // Ensure key is on the Toast component itself
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
              duration={toast.type === 'error' ? 5000 : 3000} // Longer duration for errors
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
} 