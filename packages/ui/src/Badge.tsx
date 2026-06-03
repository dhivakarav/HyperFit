import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest',
  {
    variants: {
      variant: {
        sale: 'bg-[#ff3c3c] text-white',
        new: 'bg-[#c8102e] text-[#ffffff]',
        limited: 'bg-white text-[#ffffff]',
        soldout: 'bg-[#d8d8d8] text-[#6b6b6b]',
        default: 'bg-[#f2f2f2] text-[#0a0a0a] border border-[#d8d8d8]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant, className }))} {...props} />
)
