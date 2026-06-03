import React from 'react'
import { cn } from './cn'

interface RatingStarsProps {
  rating: number
  count?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const RatingStars = ({ rating, count, size = 'md', className }: RatingStarsProps) => {
  const sizeMap = { sm: 12, md: 16, lg: 20 }
  const px = sizeMap[size]

  return (
    <div
      className={cn('flex items-center gap-1.5', className)}
      aria-label={`${rating} out of 5 stars${count ? `, ${count} reviews` : ''}`}
    >
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star
          const half = !filled && rating >= star - 0.5

          return (
            <svg key={star} width={px} height={px} viewBox="0 0 24 24" className="shrink-0">
              {half ? (
                <>
                  <defs>
                    <linearGradient id={`half-${star}`}>
                      <stop offset="50%" stopColor="#c8102e" />
                      <stop offset="50%" stopColor="#d8d8d8" />
                    </linearGradient>
                  </defs>
                  <path
                    fill={`url(#half-${star})`}
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </>
              ) : (
                <path
                  fill={filled ? '#c8102e' : '#d8d8d8'}
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              )}
            </svg>
          )
        })}
      </div>
      {count !== undefined && (
        <span className="text-[#6b6b6b] text-sm">({count.toLocaleString()})</span>
      )}
    </div>
  )
}
