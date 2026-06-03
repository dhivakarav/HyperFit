'use client'

import React from 'react'
import { cn } from './cn'

interface SizeOption {
  value: string
  available: boolean
}

interface SizeSelectorProps {
  sizes: SizeOption[]
  selected?: string
  onChange?: (size: string) => void
  className?: string
}

export const SizeSelector = ({ sizes, selected, onChange, className }: SizeSelectorProps) => (
  <div className={cn('flex flex-wrap gap-2', className)}>
    {sizes.map(({ value, available }) => (
      <button
        key={value}
        onClick={() => available && onChange?.(value)}
        disabled={!available}
        title={!available ? 'Out of stock' : undefined}
        className={cn(
          'relative min-w-[44px] h-11 px-3 text-sm font-medium border transition-all duration-150',
          selected === value
            ? 'border-[#c8102e] bg-[#c8102e] text-[#ffffff]'
            : available
            ? 'border-[#d8d8d8] text-[#0a0a0a] hover:border-[#c8102e] hover:text-[#c8102e]'
            : 'border-[#e8e8e8] text-[#d8d8d8] cursor-not-allowed'
        )}
      >
        {!available && (
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="absolute w-full h-px bg-[#d8d8d8] rotate-45 scale-x-150" />
          </span>
        )}
        {value}
      </button>
    ))}
  </div>
)
