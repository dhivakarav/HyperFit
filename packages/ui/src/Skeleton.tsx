import React from 'react'
import { cn } from './cn'

interface SkeletonProps {
  className?: string
  variant?: 'rect' | 'circle' | 'text'
}

export const Skeleton = ({ className, variant = 'rect' }: SkeletonProps) => (
  <div
    className={cn(
      'relative overflow-hidden bg-[#f2f2f2]',
      variant === 'circle' && 'rounded-full',
      variant === 'text' && 'h-4 rounded-sm',
      variant === 'rect' && 'rounded-sm',
      className
    )}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
  </div>
)
