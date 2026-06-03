'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from './cn'

type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export const useToast = () => useContext(ToastContext)

const icons = {
  success: <CheckCircle size={18} className="text-[#c8102e] shrink-0" />,
  error: <AlertCircle size={18} className="text-[#ff3c3c] shrink-0" />,
  info: <Info size={18} className="text-[#0a0a0a] shrink-0" />,
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(({ id, message, variant }) => (
            <motion.div
              key={id}
              className={cn(
                'pointer-events-auto flex items-center gap-3 px-4 py-3 min-w-[280px] max-w-sm border shadow-xl',
                'bg-[#f2f2f2] border-[#d8d8d8]'
              )}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            >
              {icons[variant]}
              <p className="flex-1 text-sm text-[#0a0a0a]">{message}</p>
              <button onClick={() => remove(id)} className="text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const Toast = () => null
