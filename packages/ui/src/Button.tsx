'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ffffff] disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary: 'bg-[#c8102e] text-[#ffffff] hover:brightness-110 shadow-[0_0_20px_rgba(200,16,46,0.3)]',
        ghost: 'border-2 border-[#c8102e] text-[#c8102e] hover:bg-[#c8102e] hover:text-[#ffffff]',
        outline: 'border border-[#d8d8d8] text-[#0a0a0a] hover:border-[#0a0a0a] hover:bg-white/5',
        danger: 'bg-[#ff3c3c] text-white hover:bg-red-500',
        dark: 'bg-[#f2f2f2] text-[#0a0a0a] hover:bg-[#e8e8e8] border border-[#d8d8d8]',
        black: 'bg-[#0a0a0a] text-[#ffffff] hover:bg-[#1c1c1c]',
      },
      size: {
        sm: 'h-9 px-4 text-xs rounded-sm',
        md: 'h-11 px-6 text-sm rounded-sm',
        lg: 'h-14 px-8 text-base rounded-sm',
        xl: 'h-16 px-10 text-lg rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
