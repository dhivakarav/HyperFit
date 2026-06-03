'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ProductCard } from '@hyperfit/ui'
import type { Product } from '@/types'

interface TrendingNowProps {
  products: Product[]
}

export default function TrendingNow({ products }: TrendingNowProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto" ref={ref}>
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[#c8102e] text-xs font-bold uppercase tracking-[0.3em] mb-2">What's Hot</p>
          <h2 className="font-display text-5xl sm:text-6xl text-[#0a0a0a]">TRENDING NOW</h2>
        </div>
        <a href="/shop" className="text-[#6b6b6b] text-sm hover:text-[#c8102e] transition-colors uppercase tracking-wider font-medium hidden sm:block">
          View All →
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {products.slice(0, 4).map((product, i) => {
          const variant = product.variants[0]
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={variant?.price ?? 0}
                salePrice={variant?.salePrice ?? undefined}
                images={variant?.images ?? []}
                slug={product.slug}
                badge={variant?.salePrice ? 'sale' : product.isFeatured ? 'new' : undefined}
              />
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
