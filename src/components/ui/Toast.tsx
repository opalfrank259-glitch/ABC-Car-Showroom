import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div
        className="fixed bottom-4 end-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-4"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="w-4 h-4 text-[#1F9D55] shrink-0" />,
            error: <AlertCircle className="w-4 h-4 text-[#C8102E] shrink-0" />,
            info: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
          };

          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-200 bg-white shadow-lg text-sm text-[#14161C] transition-all"
              role="status"
            >
              <div className="flex items-center gap-2.5">
                {icons[toast.type]}
                <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                type="button"
                className="text-gray-400 hover:text-gray-600 p-1 rounded cursor-pointer"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
