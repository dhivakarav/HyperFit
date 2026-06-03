'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { cn } from './cn'
import { Badge } from './Badge'

export interface ProductCardProps {
  id: string
  name: string
  price: number
  salePrice?: number
  images: string[]
  slug: string
  badge?: 'sale' | 'new' | 'limited' | 'soldout'
  className?: string
  onAddToCart?: (id: string) => void
  onWishlist?: (id: string) => void
  isWishlisted?: boolean
}

export const ProductCard = ({
  id,
  name,
  price,
  salePrice,
  images,
  slug,
  badge,
  className,
  onAddToCart,
  onWishlist,
  isWishlisted = false,
}: ProductCardProps) => {
  const [wishlisted, setWishlisted] = useState(isWishlisted)
  const [imageIdx, setImageIdx] = useState(0)

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlisted((prev) => !prev)
    onWishlist?.(id)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.(id)
  }

  return (
    <motion.a
      href={`/product/${slug}`}
      className={cn('group relative flex flex-col bg-[#f2f2f2] overflow-hidden cursor-pointer', className)}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden aspect-square bg-[#f4f4f4]"
        onMouseEnter={() => images[1] && setImageIdx(1)}
        onMouseLeave={() => setImageIdx(0)}
      >
        <motion.img
          key={imageIdx}
          src={images[imageIdx] || images[0] || '/placeholder.jpg'}
          alt={name}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Badges */}
        {badge && (
          <div className="absolute top-3 left-3">
            <Badge variant={badge}>{badge === 'sale' ? 'Sale' : badge === 'new' ? 'New' : badge === 'limited' ? 'Limited' : 'Sold Out'}</Badge>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:bg-[#c8102e] hover:text-white"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={16}
            className={cn('transition-all', wishlisted ? 'fill-[#ff3c3c] stroke-[#ff3c3c]' : 'stroke-white')}
          />
        </button>

        {/* Quick Add overlay */}
        <motion.div
          className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-4 pt-12 bg-gradient-to-t from-black/80 to-transparent"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-[#c8102e] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:brightness-110 transition-all"
          >
            <ShoppingBag size={14} />
            Quick Add
          </button>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1">
        <p className="text-[#0a0a0a] text-sm font-medium leading-tight line-clamp-2">{name}</p>
        <div className="flex items-center gap-2 mt-1">
          {salePrice ? (
            <>
              <span className="text-[#c8102e] font-bold text-sm">₹{salePrice.toLocaleString()}</span>
              <span className="text-[#6b6b6b] text-xs line-through">₹{price.toLocaleString()}</span>
            </>
          ) : (
            <span className="text-[#c8102e] font-bold text-sm">₹{price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </motion.a>
  )
}
