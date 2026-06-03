'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ProductCard } from '@hyperfit/ui'
import type { Product } from '@/types'

interface BestSellersProps {
  products: Product[]
  title?: string
  eyebrow?: string
  href?: string
}

export default function BestSellers({ products, title = 'Best Sellers', eyebrow = 'Fan Favourites', href = '/shop' }: BestSellersProps) {
  const ref = useRef<HTMLDivElement>(null)
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return
    const startX = e.pageX - ref.current.offsetLeft
    const scrollLeft = ref.current.scrollLeft

    const onMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      const x = e.pageX - ref.current.offsetLeft
      ref.current.scrollLeft = scrollLeft - (x - startX)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', () => document.removeEventListener('mousemove', onMouseMove), { once: true })
  }

  return (
    <section className="py-16 flex justify-center" ref={sectionRef}>
     <div className="w-full max-w-7xl px-4 md:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[#c8102e] text-xs font-bold uppercase tracking-[0.3em] mb-2">{eyebrow}</p>
            <h2 className="font-display text-5xl sm:text-6xl text-[#0a0a0a]">{title.toUpperCase()}</h2>
          </div>
          <a href={href} className="text-[#6b6b6b] text-sm hover:text-[#c8102e] transition-colors uppercase tracking-wider font-medium hidden sm:block">
            View All →
          </a>
        </div>
      </div>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
        onMouseDown={handleMouseDown}
      >
        {products.map((product, i) => {
          const variant = product.variants[0]
          return (
            <motion.div
              key={product.id}
              className="shrink-0 w-64 sm:w-72"
              style={{ scrollSnapAlign: 'start' }}
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={variant?.price ?? 0}
                salePrice={variant?.salePrice ?? undefined}
                images={variant?.images ?? []}
                slug={product.slug}
              />
            </motion.div>
          )
        })}
      </div>
     </div>
    </section>
  )
}
