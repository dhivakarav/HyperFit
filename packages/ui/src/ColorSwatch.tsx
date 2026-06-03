'use client'

import React from 'react'
import { cn } from './cn'

interface ColorOption {
  value: string
  hex: string
  available: boolean
}

interface ColorSwatchProps {
  colors: ColorOption[]
  selected?: string
  onChange?: (color: string) => void
  className?: string
}

export const ColorSwatch = ({ colors, selected, onChange, className }: ColorSwatchProps) => (
  <div className={cn('flex flex-wrap gap-2', className)}>
    {colors.map(({ value, hex, available }) => (
      <button
        key={value}
        onClick={() => available && onChange?.(value)}
        disabled={!available}
        title={available ? value : `${value} (Out of stock)`}
        className={cn(
          'relative w-8 h-8 rounded-full transition-all duration-150',
          selected === value ? 'ring-2 ring-[#c8102e] ring-offset-2 ring-offset-[#ffffff]' : 'ring-1 ring-transparent hover:ring-[#6b6b6b] ring-offset-1 ring-offset-[#ffffff]',
          !available && 'opacity-40 cursor-not-allowed'
        )}
        style={{ backgroundColor: hex }}
        aria-label={`${value}${!available ? ' — out of stock' : ''}`}
        aria-pressed={selected === value}
      >
        {!available && (
          <span className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center">
            <span className="w-full h-px bg-white/60 rotate-45 scale-x-150 absolute" />
          </span>
        )}
      </button>
    ))}
  </div>
)
