'use client';

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastVariant = 'info' | 'success' | 'error' | 'warning';

interface Toast {
  id: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, 'id'> & { id?: string }) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
};

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'> & { id?: string }) => {
    const id = toast.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const next: Toast = { ...toast, id };
    setToasts((prev) => [...prev, next]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const contextValue = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast container */}
      <div className="fixed inset-x-0 top-4 z-[9999] flex justify-center pointer-events-none">
        <div className="w-full max-w-xl px-4 space-y-2">
          <AnimatePresence initial={false}>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`
                  pointer-events-auto rounded-xl border px-4 py-3 shadow-lg backdrop-blur
                  bg-white/90 dark:bg-slate-900/90
                  ${
                    toast.variant === 'error'
                      ? 'border-red-300/80 dark:border-red-500/70'
                      : toast.variant === 'success'
                      ? 'border-emerald-300/80 dark:border-emerald-500/70'
                      : toast.variant === 'warning'
                      ? 'border-amber-300/80 dark:border-amber-500/70'
                      : 'border-slate-200/80 dark:border-slate-700/70'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-gradient-to-br from-primary to-accent" />
                  <div className="flex-1">
                    {toast.title && (
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {toast.title}
                      </p>
                    )}
                    <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-200">
                      {toast.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
}

