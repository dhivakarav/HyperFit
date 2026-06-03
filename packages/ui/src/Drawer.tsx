'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from './cn'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  side?: 'left' | 'right'
  title?: string
  children: React.ReactNode
  className?: string
}

export const Drawer = ({ isOpen, onClose, side = 'right', title, children, className }: DrawerProps) => {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const variants = {
    hidden: { x: side === 'right' ? '100%' : '-100%', opacity: 0 },
    visible: { x: '0%', opacity: 1 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              'absolute top-0 bottom-0 w-full max-w-md bg-[#ffffff] border-[#f2f2f2] flex flex-col',
              side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
              className
            )}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-[#f2f2f2]">
              {title && <h2 className="text-[#0a0a0a] font-bold uppercase tracking-wider">{title}</h2>}
              <button
                onClick={onClose}
                className="ml-auto p-1 text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
